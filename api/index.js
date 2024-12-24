const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Create Express app
const app = express();

// Set up multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to handle photo uploads on Vercel
app.post("/upload", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    // Send the file to your local server (on your desktop)
    const localServerUrl = "http://localhost:3001/upload"; // Your local server's URL

    // Create a FormData object to forward the file to the local server
    const formData = new FormData();
    formData.append("photo", req.file.buffer, "image.jpg");

    // Make an HTTP POST request to your local server
    await axios.post(localServerUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    res.status(200).json({ message: "Photo uploaded successfully and forwarded to your desktop." });
  } catch (error) {
    console.error("Error forwarding the file to the local server:", error);
    res.status(500).json({ message: "Failed to forward the photo to your desktop." });
  }
});

// Start the Vercel server (Vercel handles starting the server)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vercel server is running on port ${PORT}`);
});
