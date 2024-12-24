const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// Create Express app
const app = express();
app.use(cors({
  origin: ["https://nodebacked.vercel.app/upload"], // Update with your frontend URL
  methods: ["GET", "POST"]
}));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Directory to save photos (only for development)
const photosDir = path.join(__dirname, "photos");
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photosDir); // Save to local folder (not suitable for production)
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    cb(null, `photo-${timestamp}.jpg`); // Corrected: use backticks for string interpolation
  },
});


const upload = multer({ storage });

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
  res.send("Hello, World!"); 
 });

// Route to handle photo uploads
app.post("/upload", upload.single("photo"), (req, res) => {
  res.send("Hello, file!"); 
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

// Start the server
const PORT =  3000;
app.listen(PORT, () => {
  console.log("Server is running on port ${PORT}");
});  