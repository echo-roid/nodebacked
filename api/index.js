const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Use memoryStorage for serverless environments

const upload = multer({ storage });

app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  res.status(200).json({ message: "Photo uploaded successfully", file: req.file.filename });
});

module.exports = app;
