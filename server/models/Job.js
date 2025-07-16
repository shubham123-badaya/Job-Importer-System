const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  url: { type: String, unique: true }, 
  publishedDate: Date,
  category: String,
  type: String,
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
