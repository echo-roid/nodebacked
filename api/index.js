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

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "../public")));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp"); // Use /tmp directory (temporary storage in Vercel)
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    cb(null, `photo-${timestamp}.jpg`); // Use unique filename
  }
});

const upload = multer({ storage });

// Serve the main HTML file (optional if you want to serve the index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Route to handle photo uploads
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

// Export the app (necessary for serverless function in Vercel)
module.exports = app;
