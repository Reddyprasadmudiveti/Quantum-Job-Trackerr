import Parser from 'rss-parser';

// Define available news sources
const NEWS_SOURCES = {
    'quantum': {
        url: 'https://www.reddit.com/r/QuantumComputing/.rss',
        name: 'Quantum Computing',
        icon: 'atom'
    },
    'tech': {
        url: 'https://news.ycombinator.com/rss',
        name: 'Hacker News',
        icon: 'code'
    },
    'science': {
        url: 'https://www.reddit.com/r/science/.rss',
        name: 'Science',
        icon: 'flask'
    },
    'ai': {
        url: 'https://www.reddit.com/r/artificial/.rss',
        name: 'Artificial Intelligence',
        icon: 'brain'
    },
    'programming': {
        url: 'https://www.reddit.com/r/programming/.rss',
        name: 'Programming',
        icon: 'terminal'
    }
};

// Cache to store RSS feed data
const feedCache = {};
const lastFetchTimes = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to get formatted items from RSS feed
const getFormattedItems = async (source = 'quantum', searchQuery = '') => {
    const sourceKey = source in NEWS_SOURCES ? source : 'quantum';
    const sourceUrl = NEWS_SOURCES[sourceKey].url;
    const sourceName = NEWS_SOURCES[sourceKey].name;
    
    // Check if we have a valid cache for this source
    const now = new Date();
    if (
        !searchQuery && 
        feedCache[sourceKey] && 
        feedCache[sourceKey].length > 0 && 
        lastFetchTimes[sourceKey] && 
        (now - lastFetchTimes[sourceKey]) < CACHE_DURATION
    ) {
        // If there's a search query, filter the cached results
        return feedCache[sourceKey];
    }
    
    // Fetch new data if cache is invalid
    try {
        const parser = new Parser();
        const feed = await parser.parseURL(sourceUrl);
        
        // Map all items to a formatted array with more details
        const formattedItems = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            image: item.image?.url,
            content: item.content || item.contentSnippet || '',
            author: item.author || item.creator || 'Unknown',
            pubDate: item.pubDate || item.isoDate || '',
            categories: item.categories || [],
            id: item.id || item.guid || item.link,
            source: sourceKey,
            sourceName: sourceName
        }));
        
        // Update cache
        feedCache[sourceKey] = formattedItems;
        lastFetchTimes[sourceKey] = now;
        
        return formattedItems;
    } catch (error) {
        console.error(`Error fetching RSS feed from ${sourceUrl}:`, error);
        // Return empty array or cached data if available
        return feedCache[sourceKey] || [];
    }
};

export const rssParser = async (req, res) => {
    try {
        const { source, search } = req.query;
        
        // Get items from the specified source or default
        let formattedItems = await getFormattedItems(source);
        
        // If search query is provided, filter the results
        if (search && search.trim() !== '') {
            const searchLower = search.toLowerCase();
            formattedItems = formattedItems.filter(item => {
                return (
                    (item.title && item.title.toLowerCase().includes(searchLower)) ||
                    (item.content && item.content.toLowerCase().includes(searchLower)) ||
                    (item.categories && item.categories.some(cat => cat.toLowerCase().includes(searchLower)))
                );
            });
        }

        // Send response with items and available sources
        res.status(200).json({
            message: "success",
            data: formattedItems,
            sources: Object.keys(NEWS_SOURCES).map(key => ({
                id: key,
                name: NEWS_SOURCES[key].name,
                icon: NEWS_SOURCES[key].icon
            }))
        });

    } catch (error) {
        console.error('Error parsing RSS feed:', error);
        res.status(500).json({
            message: "error",
            error: "Failed to parse RSS feed"
        });
    }
};

export const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const { source } = req.query;
        
        if (!id) {
            return res.status(400).json({
                message: "error",
                error: "News ID is required"
            });
        }
        
        // If source is specified, only search in that source
        if (source && source in NEWS_SOURCES) {
            const formattedItems = await getFormattedItems(source);
            const newsItem = formattedItems.find(item => item.id === id);
            
            if (newsItem) {
                return res.status(200).json({
                    message: "success",
                    data: newsItem
                });
            }
        } else {
            // Search in all sources if source is not specified or not found
            for (const sourceKey of Object.keys(NEWS_SOURCES)) {
                const formattedItems = await getFormattedItems(sourceKey);
                const newsItem = formattedItems.find(item => item.id === id);
                
                if (newsItem) {
                    return res.status(200).json({
                        message: "success",
                        data: newsItem
                    });
                }
            }
        }
        
        // If we get here, the news item was not found
        return res.status(404).json({
            message: "error",
            error: "News item not found"
        });
        
    } catch (error) {
        console.error('Error fetching news item:', error);
        res.status(500).json({
            message: "error",
            error: "Failed to fetch news item"
        });
    }
};
