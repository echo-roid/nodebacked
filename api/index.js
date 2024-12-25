
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

// Create Express app
const app = express();

// Enable CORS for your frontend URL
app.use(cors({
  origin: ["https://nodebacked.vercel.app"], // Update with your frontend URL
  methods: ["GET", "POST"]
}));



// Initialize Firebase Admin SDK
const serviceAccount = require('../upload.json'); // Update with your service account key path

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'upload-52b46' // Replace PROJECT_ID with your actual project ID
});

// Get a reference to the storage bucket
const bucket = getStorage().bucket();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage to handle files in memory
const upload = multer({ storage });

// API endpoint to handle file uploads
app.post("/api/upload", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Create a unique filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `photo-${timestamp}.jpg`;

  // Create a file object for Firebase Storage
  const file = bucket.file(filename);

  // Create a write stream to upload the file
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  // Handle stream events
  stream.on('error', (err) => {
    console.error(err);
    return res.status(500).json({ message: "Error uploading file." });
  });

  stream.on('finish', () => {
    // File uploaded successfully
    res.status(200).json({ message: "Photo uploaded successfully", file: filename });
  });

  // Pipe the file buffer to the stream
  stream.end(req.file.buffer);
});

// Export the app to Vercel
module.exports = app;
