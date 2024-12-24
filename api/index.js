const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// Create Express app
const app = express();
app.use(cors({
  origin: ["https://nodebacked.vercel.app"], // Update with your frontend URL
  methods: ["GET", "POST"]
}));

// Serve static files (this will serve the files in the public directory)
app.use(express.static(path.join(__dirname, "public")));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the /tmp directory on Vercel for file storage
    cb(null, "/tmp");
  },
  filename: (req, file, cb) => {
    // Use a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    cb(null, `photo-${timestamp}.jpg`);
  }
});

const upload = multer({ storage });

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Route to handle photo uploads (POST request)
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  res.status(200).json({ message: "Photo uploaded successfully", file: req.file.filename });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Export the handler for Vercel
module.exports = app;
    