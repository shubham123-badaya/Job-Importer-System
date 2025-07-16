// workers/jobWorker.js
const { Worker } = require("bullmq");
const dotenv = require("dotenv");
const connectDB = require("../config/db"); 
const Job = require("../models/Job");

dotenv.config();
connectDB();

const worker = new Worker(
  "jobQueue",
  async (job) => {
    try {
      const jobUrl = job.data.link || job.data.url;

      const jobData = {
        title: job.data.title || "No Title",
        description: job.data.description || "",
        company: job.data.company || "Unknown",
        location: job.data.location || "Remote",
        url: jobUrl,
        publishedDate: job.data.pubDate ? new Date(job.data.pubDate) : null,
        category: job.data.category || "",
        type: job.data.type || "",
        source: job.data.source || "N/A",
      };

      const existing = await Job.findOne({ url: jobUrl });

      if (existing) {
        await Job.updateOne({ url: jobUrl }, { $set: jobData });
        console.log("🔄 Job updated:", jobData.title);
      } else {
        await Job.create(jobData);
        console.log("New job inserted:", jobData.title);
      }
    } catch (err) {
      console.error("Failed to process job:", err.message);
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
      maxRetriesPerRequest: null,
    },
  }
);
