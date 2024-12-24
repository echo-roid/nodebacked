const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Enable CORS for your frontend URL
app.use(cors({
  origin: ["https://nodebacked.vercel.app"], // Update with your actual frontend URL
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public"))); // <-- Notice the path change

// Middleware for parsing JSON
app.use(express.json());

// Configure multer for temporary file storage
const storage = multer.memoryStorage(); // In-memory storage for serverless compatibility
const upload = multer({ storage });

// Route for health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running on Vercel!" });
});

// Route to handle photo uploads
app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Example response with uploaded file metadata
  res.status(200).json({
    message: "Photo uploaded successfully",
    file: {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
