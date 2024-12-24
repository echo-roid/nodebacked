const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const os = require("os");

const app = express();

// Enable CORS for your frontend
app.use(
  cors({
    origin: ["https://nodebacked.vercel.app/upload"], // Replace with your actual frontend URL
  })
);

// Use a temporary directory for file uploads
const tempDir = os.tmpdir();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir); // Save uploaded files to the temporary directory
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    cb(null, `photo-${timestamp}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Test endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Photo Upload Service!");
});

// Photo upload endpoint
app.post("/upload", upload.single("photo"), (req, res) => {
  res.send("Welcome2 to the Photo Upload Service!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Export the app for Vercel
module.exports = app;
