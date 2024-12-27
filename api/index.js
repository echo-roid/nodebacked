const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Create Express app
const app = express();

// Enable CORS for your frontend URL
app.use(cors({
  origin: ["https://nodebacked.vercel.app"], // Update with your frontend URL
  methods: ["GET", "POST"]
}));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp"); // Temporary storage in Vercel
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    cb(null, `photo-${timestamp}.jpg`);
  }
});

const upload = multer({ storage });

// API endpoint to handle file uploads
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  res.status(200).json({ message: "Photo uploaded successfully", file: req.file.filename });
});

// Export the app to Vercel
module.exports = app;
