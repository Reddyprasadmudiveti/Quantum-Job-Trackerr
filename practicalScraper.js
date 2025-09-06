import { Builder, By, until, Key } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapeJobDetails(driver, jobUrl) {
  console.log(`   → Opening job detail page: ${jobUrl}`);
  let details = {
    description: "Not available",
    requirements: "Not available",
    category: "Not specified",
    department: "Not specified",
    deadline: "Not specified",
    job_id: "Not available",
    application_url: jobUrl,
    date_scraped: new Date().toISOString(),
  };
  
  // Track if we successfully loaded the page
  let pageLoaded = false;

  try {
    await driver.get(jobUrl);
    
    // Try multiple selectors to wait for page load
    const pageLoadSelectors = ["main", ".job-detail", "#job-details", ".job-description", "body"];
    let loadedSelector = null;
    
    for (const selector of pageLoadSelectors) {
      try {
        await driver.wait(until.elementLocated(By.css(selector)), 10000);
        console.log(`   Page loaded with selector: ${selector}`);
        loadedSelector = selector;
        pageLoaded = true;
        break;
      } catch (e) {
        console.log(`   Selector ${selector} not found for page load`);
      }
    }
    
    if (!pageLoaded) {
      console.log("   Could not detect page load with known selectors");
      // Wait for any content to load
      await driver.wait(until.elementLocated(By.tagName("body")), 30000);
      console.log("   Waited for body element as fallback");
    }
    
    await sleep(3000); // Give more time for dynamic content to load

    // Description
    try {
      let desc = await driver.findElement(By.css(".bx--content-block__copy")).getText();
      details.description = desc.trim();
    } catch {
      try {
        let desc = await driver.findElement(By.css(".bx--content-section")).getText();
        details.description = desc.trim();
      } catch {
        try {
          // Try a more generic approach if specific selectors fail
          let mainContent = await driver.findElement(By.css("main"));
          let desc = await mainContent.getText();
          // Extract description from the main content
          let descSection = desc.split("\n\n").filter(section => 
            !section.toLowerCase().includes("requirement") && 
            !section.toLowerCase().includes("qualification") && 
            section.length > 100
          )[0];
          if (descSection) details.description = descSection.trim();
        } catch {}
      }
    }

    // Requirements
    try {
      let sections = await driver.findElements(By.css(".bx--content-block"));
      let reqText = "";
      for (let sec of sections) {
        let text = (await sec.getText()).toLowerCase();
        if (text.includes("requirement") || text.includes("qualification") || text.includes("skill")) {
          reqText += (await sec.getText()) + "\n";
        }
      }
      if (reqText.trim()) details.requirements = reqText.trim();
    } catch {
      try {
        // Try a more generic approach
        let pageText = await driver.findElement(By.tagName("body")).getText();
        let pageLines = pageText.split("\n");
        
        // Find requirements section
        let reqStartIndex = -1;
        let reqEndIndex = -1;
        
        for (let i = 0; i < pageLines.length; i++) {
          let line = pageLines[i].toLowerCase();
          if (line.includes("requirement") || line.includes("qualification") || 
              line.includes("what you need") || line.includes("skills")) {
            reqStartIndex = i;
          } else if (reqStartIndex !== -1 && 
                    (line.includes("about ibm") || line.includes("about us") || 
                     line.includes("apply now") || line.includes("application"))) {
            reqEndIndex = i;
            break;
          }
        }
        
        if (reqStartIndex !== -1) {
          reqEndIndex = reqEndIndex === -1 ? pageLines.length : reqEndIndex;
          let reqSection = pageLines.slice(reqStartIndex, reqEndIndex).join("\n");
          if (reqSection.trim()) details.requirements = reqSection.trim();
        }
      } catch {}
    }

    // Category and Department
    try {
      let cats = await driver.findElements(By.css(".bx--tag"));
      let catList = [];
      for (let c of cats) {
        let t = (await c.getText()).trim();
        if (t) catList.push(t);
      }
      if (catList.length) details.category = catList.join(", ");
      
      // Try to extract department
      let pageText = await driver.findElement(By.tagName("body")).getText();
      let deptMatch = pageText.match(/(?:department|division|business unit|team)[:\s]*(\w[\w\s&-]+)/i);
      if (deptMatch) details.department = deptMatch[1].trim();
    } catch {}

    // Deadline
    try {
      let pageText = await driver.findElement(By.tagName("body")).getText();
      let deadlineMatch = pageText.match(/(?:deadline|apply by|closing date|application closes)[:\s]*(\w+\s+\d+,?\s+\d{4}|\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i);
      if (deadlineMatch) details.deadline = deadlineMatch[1];
    } catch {}

    // Job ID
    try {
      // Try to get from URL
      let idMatch = jobUrl.match(/[?&]id=([\w-]+)/);
      if (idMatch) {
        details.job_id = idMatch[1];
      } else {
        // Try to extract from page text
        let pageText = await driver.findElement(By.tagName("body")).getText();
        let jobIdMatch = pageText.match(/(?:job id|job code|requisition|req id|position id)[:\s]*([\w\d-]+)/i);
        if (jobIdMatch) details.job_id = jobIdMatch[1].trim();
      }
    } catch {}

  } catch (e) {
    console.error("   ✖ Error loading job detail:", e);
    
    // Try to capture screenshot and page source for debugging
    try {
      const pageSource = await driver.getPageSource();
      fs.writeFileSync(`debug_job_page_${details.job_id}.html`, pageSource);
      
      await driver.takeScreenshot().then(data => {
        fs.writeFileSync(`debug_job_page_${details.job_id}.png`, data, 'base64');
      });
      
      console.log(`   Saved debug files for job ${details.job_id}`);
    } catch (debugErr) {
      console.error("   Failed to save debug information:", debugErr.message);
    }
  }
  return details;
}

async function scrapeIBMQuantumJobsIndia(maxPages = 40) {
  console.log("Setting up Selenium WebDriver...");

  let options = new chrome.Options().addArguments(
    "--headless=new",
    "--disable-gpu",
    "--window-size=1920,1080",
    "--disable-extensions",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  const baseUrl = "https://www.ibm.com/careers/search";
  const searchQuery = "quantum";

  let allJobs = [];

  try {
    for (let page = 1; page <= maxPages; page++) {
      console.log(`\n📄 Scraping page ${page}...`);
      const url = `${baseUrl}?q=${searchQuery}&p=${page}`;
      await driver.get(url);

      try {
        // Wait for job listings with more flexible selectors
        await driver.wait(
          until.elementLocated(By.css(".bx--card, .search-result, .job-card, [data-testid='job-card']"))
        , 30000);
        console.log("✓ Job listings page loaded successfully");
      } catch (e) {
        console.log("✖ No job listings found or page structure changed:", e.message);
        
        // Try to get page source to debug
        try {
          const pageSource = await driver.getPageSource();
          console.log("Page source length:", pageSource.length);
          console.log("Page URL:", await driver.getCurrentUrl());
          
          // Save page source for debugging
          fs.writeFileSync("debug_page_source.html", pageSource);
          console.log("Saved page source to debug_page_source.html");
        } catch (err) {
          console.error("Failed to get page source:", err);
        }
        
        break;
      }

      await sleep(3000);
      
      // Try multiple selectors to find job cards
      let jobCards = [];
      const possibleSelectors = [
        ".bx--card", 
        ".search-result", 
        ".job-card", 
        "[data-testid='job-card']",
        ".job-listing"
      ];
      
      for (const selector of possibleSelectors) {
        try {
          const cards = await driver.findElements(By.css(selector));
          if (cards.length > 0) {
            console.log(`   Found ${cards.length} jobs using selector: ${selector}`);
            jobCards = cards;
            break;
          }
        } catch (e) {
          console.log(`   Selector ${selector} not found`);
        }
      }
      
      if (jobCards.length === 0) {
        console.log("   No job cards found with any known selector. Taking screenshot for debugging...");
        try {
          await driver.takeScreenshot().then(data => {
            fs.writeFileSync(`debug_page_${page}.png`, data, 'base64');
            console.log(`   Screenshot saved as debug_page_${page}.png`);
          });
        } catch (e) {
          console.error("   Failed to take screenshot:", e.message);
        }
      } else {
        console.log(`   Found ${jobCards.length} jobs`);
      }

      if (jobCards.length === 0) break;

      for (let i = 0; i < jobCards.length; i++) {
        try {
          let card = jobCards[i];
          // Try to get text content with error handling
          let text = "";
          try {
            text = await card.getText();
          } catch (e) {
            console.log("   Could not get text from card, trying innerHTML");
            text = await driver.executeScript("return arguments[0].innerHTML", card);
          }
          
          let lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
          console.log(`   Card text lines: ${lines.length}`);
          
          if (lines.length < 2) {
            console.log("   Not enough text content in card, skipping");
            continue;
          }

          // Try different approaches to extract title and location
          let title = "";
          let location = "Unknown Location";
          
          // First approach: direct from lines
          if (lines.length >= 2) {
            title = lines[0] || lines[1]; // Try first or second line for title
            
            // Look for location indicators in the text
            for (const line of lines) {
              if (line.includes(",") || line.includes("Remote") || 
                  line.match(/[A-Z][a-z]+,\s*[A-Z]{2}/) || // City, STATE pattern
                  line.match(/[A-Z][a-z]+\s*[A-Z]{2}/)) {  // City STATE pattern
                location = line;
                break;
              }
            }
          }
          
          // Second approach: try to find elements by role or class
          if (!title) {
            try {
              const titleEl = await card.findElement(By.css("h3, .job-title, [data-testid='job-title']"));
              title = await titleEl.getText();
            } catch (e) {
              console.log("   Could not find title element");
            }
          }
          
          if (location === "Unknown Location") {
            try {
              const locationEl = await card.findElement(By.css(".location, [data-testid='job-location']"));
              location = await locationEl.getText();
            } catch (e) {
              console.log("   Could not find location element");
            }
          }
          
          // If still no title, skip this card
          if (!title) {
            console.log("   Could not extract job title, skipping");
            continue;
          }
          
          // Find job link
          let jobUrl = "";
          try {
            let jobLinkEl = await card.findElement(By.css("a"));
            jobUrl = await jobLinkEl.getAttribute("href");
          } catch (e) {
            console.log("   Could not find job link, trying to get parent link");
            try {
              // Try to get the card's parent if it's a link
              jobUrl = await driver.executeScript(
                "return arguments[0].closest('a') ? arguments[0].closest('a').href : ''", 
                card
              );
            } catch (e2) {
              console.log("   Could not find any job link");
              continue; // Skip if no link found
            }
          }

          let jobData = {
            title,
            location,
            id: title.replace(/\s+/g, "-").toLowerCase(),
            url: jobUrl,
          };

          // Fetch details immediately
          let details = await scrapeJobDetails(driver, jobUrl);
          Object.assign(jobData, details);

          allJobs.push(jobData);
          console.log(`   ✔ Scraped job: ${title}`);
        } catch (err) {
          console.error(`   ✖ Error scraping job ${i + 1} on page ${page}:`, err);
        }
      }

      console.log(`   ✅ Completed page ${page}, total jobs so far: ${allJobs.length}`);
    }
  } finally {
    await driver.quit();
  }

  return allJobs;
}

function saveJobs(jobs, prefix = "ibm_quantum_jobs") {
  if (!jobs.length) return console.log("No jobs to save.");

  // Create timestamp for unique filenames
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonFilename = `${prefix}_${timestamp}.json`;
  const csvFilename = `${prefix}_${timestamp}.csv`;
  
  // Ensure data directory exists
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Save JSON
  const jsonPath = path.join(dataDir, jsonFilename);
  fs.writeFileSync(jsonPath, JSON.stringify(jobs, null, 2), "utf8");
  console.log(`💾 Saved ${jobs.length} jobs to ${jsonPath}`);

  // Save CSV
  const headers = Object.keys(jobs[0]).join(",");
  const rows = jobs.map((job) =>
    Object.values(job).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
  );
  const csvPath = path.join(dataDir, csvFilename);
  fs.writeFileSync(csvPath, [headers, ...rows].join("\n"), "utf8");
  console.log(`💾 Saved ${jobs.length} jobs to ${csvPath}`);
  
  // Also save to standard filenames for compatibility
  fs.writeFileSync(path.join(__dirname, `${prefix}.json`), JSON.stringify(jobs, null, 2), "utf8");
  fs.writeFileSync(path.join(__dirname, `${prefix}.csv`), [headers, ...rows].join("\n"), "utf8");
  
  return { jsonPath, csvPath };
}

async function main() {
  console.log("🚀 IBM Quantum Job Scraper (Enhanced Version)");
  const start = Date.now();

  try {
    // You can change the number of pages to scrape here
    const maxPages = process.argv[2] ? parseInt(process.argv[2]) : 5;
    const jobs = await scrapeIBMQuantumJobsIndia(maxPages);

    const elapsed = Math.floor((Date.now() - start) / 1000);
    console.log(`\n✅ Done in ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
    console.log(`Total jobs scraped: ${jobs.length}`);

    if (jobs.length > 0) {
      const savedFiles = saveJobs(jobs, "ibm_quantum_jobs_india");
      console.log("\n📊 Job Statistics:");
      console.log(`  - Unique locations: ${new Set(jobs.map(j => j.location)).size}`);
      console.log(`  - Unique categories: ${new Set(jobs.map(j => j.category)).size}`);
      console.log(`\n📁 Files saved to:`);
      console.log(`  - ${savedFiles.jsonPath}`);
      console.log(`  - ${savedFiles.csvPath}`);
    } else {
      console.log("\n⚠️ No jobs were found. Please check the search URL or try again later.");
    }
  } catch (error) {
    console.error("\n❌ An error occurred during scraping:", error);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
});