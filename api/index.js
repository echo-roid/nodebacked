const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Create Express app
const app = express();
app.use(cors());

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Using memory storage for serverless environments
const upload = multer({ storage });

// Route to handle photo uploads
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  res.status(200).json({ message: "Photo uploaded successfully", file: req.file });
});

// Export handler for Vercel
module.exports = app;
