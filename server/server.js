const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cron = require("node-cron");
const importJobsFromAPIs = require("./services/jobImporter");
const jobRoutes = require("./routes/jobs");


// Load env vars
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/logs", require("./routes/logs"));
app.use("/api/jobs", jobRoutes);


// Cron job - Run every hour
cron.schedule("0 * * * *", () => {
  console.log("⏰ Running job fetch...");
  importJobsFromAPIs();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Manually trigger once at start
importJobsFromAPIs();
