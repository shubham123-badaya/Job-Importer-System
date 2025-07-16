const axios = require("axios");
const xml2js = require("xml2js");
const jobQueue = require("../queues/jobQueue");
const ImportLog = require("../models/ImportLog");

const jobAPIs = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];

const parseXML = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false });
  return parser.parseStringPromise(xml);
};

const importJobsFromAPIs = async () => {
  console.log("importJobsFromAPIs() called...");

  for (const url of jobAPIs) {
    let totalFetched = 0;
    let newJobs = 0;
    let updatedJobs = 0;
    const failedJobs = [];

    console.log(`Fetching jobs from: ${url}`);

    try {
      const response = await axios.get(url);
      const json = await parseXML(response.data);

      const jobs = json.rss?.channel?.item || [];

      for (const raw of jobs) {
        totalFetched++;

        const jobData = {
          title: raw.title,
          description: raw.description,
          company: raw["job_listing:company"] || "Unknown",
          location: raw["job_listing:location"] || "Remote",
          url: raw.link,
          publishedDate: raw.pubDate ? new Date(raw.pubDate) : null,
          category: raw["job_listing:category"] || "",
          type: raw["job_listing:job_type"] || "",
          source: url,
        };

        try {
          await jobQueue.add("job", jobData);
          newJobs++;
        } catch (err) {
          failedJobs.push({ job: jobData, reason: err.message });
        }
      }

      await ImportLog.create({
        fileName: url,
        timestamp: new Date(),
        totalFetched,
        newJobs,
        updatedJobs,
        failedJobs,
      });

      console.log(`Done: ${url} → Total: ${totalFetched}, New: ${newJobs}, Failed: ${failedJobs.length}`);
    } catch (err) {
      console.error(`Failed to fetch from ${url}:`, err.message);
    }
  }

  console.log("importJobsFromAPIs completed.\n");
};

module.exports = importJobsFromAPIs;
