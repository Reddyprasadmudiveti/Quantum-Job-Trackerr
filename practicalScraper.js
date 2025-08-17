import puppeteer from "puppeteer";
import fs from "fs";

// Mock job data for demonstration (in real scenario, you'd scrape from APIs or simpler sites)
const generateMockJobs = () => {
    const companies = ['IBM', 'Google', 'Microsoft', 'Amazon', 'Intel', 'Rigetti', 'IonQ', 'Xanadu'];
    const positions = [
        'Quantum Software Engineer',
        'Quantum Research Scientist',
        'Quantum Algorithm Developer',
        'Quantum Hardware Engineer',
        'Quantum Computing Researcher',
        'Senior Quantum Developer',
        'Quantum Machine Learning Engineer',
        'Quantum Systems Engineer'
    ];
    const locations = ['Bangalore', 'Mumbai', 'Hyderabad', 'Chennai', 'Pune', 'Delhi', 'Remote'];

    const jobs = [];
    for (let i = 0; i < 25; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];

        jobs.push({
            title: position,
            company: company,
            location: location,
            link: `https://careers.${company.toLowerCase()}.com/jobs/${i + 1}`,
            portal: `${company} Careers`,
            salary: `₹${(8 + Math.random() * 40).toFixed(0)} LPA`,
            experience: `${Math.floor(Math.random() * 8) + 1}-${Math.floor(Math.random() * 3) + 8} years`,
            scrapedAt: new Date().toISOString()
        });
    }

    return jobs;
};

// Real scraper for sites that allow it
async function scrapeRealJobs() {
    console.log('Attempting to scrape real job data...');

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled"
        ]
    });

    const page = await browser.newPage();

    // Set realistic headers
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    const realJobs = [];

    try {
        // Try scraping from a job board that's more scraper-friendly
        console.log('Checking RemoteOK for quantum jobs...');

        await page.goto('https://remoteok.io/remote-quantum-jobs', {
            waitUntil: 'domcontentloaded',
            timeout: 20000
        });

        await new Promise(resolve => setTimeout(resolve, 3000));

        const remoteJobs = await page.evaluate(() => {
            const jobs = [];
            const jobRows = document.querySelectorAll('tr.job');

            jobRows.forEach(row => {
                const titleElement = row.querySelector('.company h2');
                const companyElement = row.querySelector('.company h3');
                const locationElement = row.querySelector('.location');
                const linkElement = row.querySelector('a');

                if (titleElement) {
                    jobs.push({
                        title: titleElement.textContent?.trim() || 'Remote Job',
                        company: companyElement?.textContent?.trim() || 'Remote Company',
                        location: locationElement?.textContent?.trim() || 'Remote',
                        link: linkElement?.href || '#',
                        portal: 'RemoteOK',
                        type: 'Remote',
                        scrapedAt: new Date().toISOString()
                    });
                }
            });

            return jobs;
        });

        realJobs.push(...remoteJobs);
        console.log(`Found ${remoteJobs.length} remote jobs`);

    } catch (error) {
        console.log('Real scraping failed, using mock data for demonstration');
    }

    await browser.close();
    return realJobs;
}

// Main function
async function scrapeAllJobs() {
    console.log('=== QUANTUM COMPUTING JOB SCRAPER ===\n');

    // Try to get real jobs first
    const realJobs = await scrapeRealJobs();

    // Generate mock data for demonstration
    console.log('Generating sample job data for demonstration...');
    const mockJobs = generateMockJobs();

    // Combine real and mock data
    const allJobs = [...realJobs, ...mockJobs];

    // Create comprehensive results
    const results = {
        searchTerm: 'quantum computing',
        totalJobs: allJobs.length,
        realJobs: realJobs.length,
        mockJobs: mockJobs.length,
        scrapedAt: new Date().toISOString(),
        portals: ['IBM Careers', 'Google Careers', 'Microsoft Careers', 'Amazon Jobs', 'RemoteOK'],
        jobs: allJobs
    };

    // Save to file
    fs.writeFileSync("quantum_jobs_complete.json", JSON.stringify(results, null, 2));

    // Display results
    console.log(`\n=== SCRAPING RESULTS ===`);
    console.log(`Total jobs found: ${results.totalJobs}`);
    console.log(`Real scraped jobs: ${results.realJobs}`);
    console.log(`Sample/Mock jobs: ${results.mockJobs}`);
    console.log("Results saved to quantum_jobs_complete.json\n");

    // Show sample jobs
    console.log('=== SAMPLE QUANTUM COMPUTING JOBS ===');
    allJobs.slice(0, 10).forEach((job, index) => {
        console.log(`${index + 1}. ${job.title}`);
        console.log(`   Company: ${job.company}`);
        console.log(`   Location: ${job.location}`);
        if (job.salary) console.log(`   Salary: ${job.salary}`);
        if (job.experience) console.log(`   Experience: ${job.experience}`);
        console.log(`   Portal: ${job.portal}`);
        console.log('');
    });

    console.log('=== IMPORTANT NOTES ===');
    console.log('• Many job sites use anti-bot protection');
    console.log('• Consider using official APIs when available');
    console.log('• Mock data included for demonstration purposes');
    console.log('• For production, implement proxy rotation and delays');
    console.log('• Always respect robots.txt and terms of service\n');

    return results;
}

// Run the scraper
scrapeAllJobs()
    .then(() => {
        console.log('Job scraping completed successfully!');
        process.exit(0);
    })
    .catch(error => {
        console.error('Scraping failed:', error);
        process.exit(1);
    });