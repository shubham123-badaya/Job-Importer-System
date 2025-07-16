// routes/jobs.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET /api/jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 }).limit(100);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

module.exports = router;

