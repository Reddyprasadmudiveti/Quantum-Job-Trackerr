import puppeteer from "puppeteer";
import fs from "fs";

// Job portal configurations
const JOB_PORTALS = {
  ibm: {
    name: "IBM",
    url: "https://www.ibm.com/in-en/careers/search?field_keyword_05%5B0%5D=India&q=quantum+computing",
    selectors: {
      jobCards: ['div[data-testid="feature-card"]', '.job-card', '.career-card'],
      title: ['h3', 'h2', '.job-title', '[data-testid*="title"]'],
      location: ['p', '.location', '[data-testid*="location"]'],
      link: ['a']
    }
  },
  linkedin: {
    name: "LinkedIn",
    url: "https://www.linkedin.com/jobs/search/?keywords=quantum%20computing&location=India",
    selectors: {
      jobCards: ['.job-search-card', '.jobs-search__results-list li'],
      title: ['.base-search-card__title', 'h3 a'],
      location: ['.job-search-card__location', '.base-search-card__metadata'],
      link: ['.base-card__full-link', 'h3 a']
    }
  },
  naukri: {
    name: "Naukri",
    url: "https://www.naukri.com/quantum-computing-jobs",
    selectors: {
      jobCards: ['.jobTuple', '.srp-jobtuple-wrapper'],
      title: ['.title', '.jobTupleHeader a'],
      location: ['.location', '.locationsContainer'],
      link: ['.title a', '.jobTupleHeader a']
    }
  },
  indeed: {
    name: "Indeed",
    url: "https://in.indeed.com/jobs?q=quantum+computing&l=India",
    selectors: {
      jobCards: ['.job_seen_beacon', '.slider_container .slider_item'],
      title: ['h2 a span', '.jobTitle a'],
      location: ['.companyLocation', '[data-testid="job-location"]'],
      link: ['h2 a', '.jobTitle a']
    }
  },
  glassdoor: {
    name: "Glassdoor",
    url: "https://www.glassdoor.co.in/Job/india-quantum-computing-jobs-SRCH_IL.0,5_IN115_KO6,23.htm",
    selectors: {
      jobCards: ['.react-job-listing', '.jobContainer'],
      title: ['.jobTitle', 'a[data-test="job-title"]'],
      location: ['.jobLocation', '[data-test="job-location"]'],
      link: ['.jobTitle a', 'a[data-test="job-title"]']
    }
  }
};

// Generic scraper function for any job portal
const scrapeJobPortal = async (page, portal) => {
  console.log(`Scraping ${portal.name}...`);

  try {
    await page.goto(portal.url, {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scroll to load more jobs
    await autoScroll(page);

    const jobs = await page.evaluate((portalConfig) => {
      const jobData = [];
      let jobCards = [];

      // Try different selectors to find job cards
      for (const selector of portalConfig.selectors.jobCards) {
        jobCards = document.querySelectorAll(selector);
        if (jobCards.length > 0) break;
      }

      jobCards.forEach(card => {
        let title = "N/A";
        let location = "N/A";
        let link = "N/A";
        let company = "N/A";

        // Extract title
        for (const selector of portalConfig.selectors.title) {
          const titleElement = card.querySelector(selector);
          if (titleElement) {
            title = titleElement.textContent.trim();
            break;
          }
        }

        // Extract location
        for (const selector of portalConfig.selectors.location) {
          const locationElement = card.querySelector(selector);
          if (locationElement) {
            location = locationElement.textContent.trim();
            break;
          }
        }

        // Extract link
        for (const selector of portalConfig.selectors.link) {
          const linkElement = card.querySelector(selector);
          if (linkElement && linkElement.href) {
            link = linkElement.href;
            break;
          }
        }

        // Extract company (if available)
        const companyElement = card.querySelector('.companyName, .company, [data-testid="company-name"]');
        if (companyElement) {
          company = companyElement.textContent.trim();
        }

        // Only add if we have meaningful data
        if (title !== "N/A" && title.length > 0) {
          jobData.push({
            title,
            location,
            company,
            link,
            portal: portalConfig.name,
            scrapedAt: new Date().toISOString()
          });
        }
      });

      return jobData;
    }, portal);

    console.log(`Found ${jobs.length} jobs from ${portal.name}`);
    return jobs;

  } catch (error) {
    console.error(`Error scraping ${portal.name}:`, error.message);
    return [];
  }
};

// Auto-scroll function to load more content
const autoScroll = async (page) => {
  let previousHeight;
  let scrollAttempts = 0;
  const maxScrollAttempts = 5;

  while (scrollAttempts < maxScrollAttempts) {
    previousHeight = await page.evaluate("document.body.scrollHeight");
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newHeight = await page.evaluate("document.body.scrollHeight");
    if (newHeight === previousHeight) {
      break;
    }
    scrollAttempts++;
  }
};

// Main function to scrape all job portals
export const jobs = async (searchKeywords = "quantum computing", location = "India") => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    ]
  });

  const page = await browser.newPage();

  // Set viewport and user agent to avoid detection
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  let allJobs = [];

  try {
    // Scrape each job portal
    for (const [key, portal] of Object.entries(JOB_PORTALS)) {
      try {
        const jobs = await scrapeJobPortal(page, portal);
        allJobs = [...allJobs, ...jobs];

        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to scrape ${portal.name}:`, error.message);
      }
    }

    // Remove duplicates based on title and company
    const uniqueJobs = allJobs.filter((job, index, self) =>
      index === self.findIndex(j =>
        j.title.toLowerCase() === job.title.toLowerCase() &&
        j.company.toLowerCase() === job.company.toLowerCase()
      )
    );

    console.log(`\nTotal jobs found: ${allJobs.length}`);
    console.log(`Unique jobs after deduplication: ${uniqueJobs.length}`);

    // Save results
    const results = {
      searchKeywords,
      location,
      totalJobs: allJobs.length,
      uniqueJobs: uniqueJobs.length,
      scrapedAt: new Date().toISOString(),
      portals: Object.keys(JOB_PORTALS),
      jobs: uniqueJobs
    };

    fs.writeFileSync("all_job_portals_scraped.json", JSON.stringify(results, null, 2));
    console.log("All jobs saved to all_job_portals_scraped.json");

    return results;

  } catch (error) {
    console.error("Error during multi-portal scraping:", error);
    return { jobs: [], error: error.message };
  } finally {
    await browser.close();
  }
};

// Function to scrape specific portals only
export const scrapeSpecificPortals = async (portalNames, searchKeywords = "quantum computing") => {
  const selectedPortals = {};

  portalNames.forEach(name => {
    if (JOB_PORTALS[name.toLowerCase()]) {
      selectedPortals[name.toLowerCase()] = JOB_PORTALS[name.toLowerCase()];
    }
  });

  if (Object.keys(selectedPortals).length === 0) {
    console.log("No valid portals selected");
    return { jobs: [], error: "No valid portals selected" };
  }

  // Temporarily replace JOB_PORTALS with selected ones
  const originalPortals = { ...JOB_PORTALS };
  Object.keys(JOB_PORTALS).forEach(key => delete JOB_PORTALS[key]);
  Object.assign(JOB_PORTALS, selectedPortals);

  const result = await jobs(searchKeywords);

  // Restore original portals
  Object.keys(JOB_PORTALS).forEach(key => delete JOB_PORTALS[key]);
  Object.assign(JOB_PORTALS, originalPortals);

  return result;
};

