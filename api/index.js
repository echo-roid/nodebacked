const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const app = express();



app.use(cors({
  origin: ["https://nodebacked.vercel.app"], // Update with your frontend URL
  methods: ["GET", "POST"]
}));

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    // Ngrok URL pointing to your local system
    const localServerUrl = "https://baa0-150-129-181-172.ngrok-free.app/upload";

    // Forward the file using FormData
    const formData = new FormData();
    formData.append("photo", req.file.buffer, req.file.originalname);

    // POST request to the local server
    const response = await axios.post(localServerUrl, formData, {
      headers: formData.getHeaders(),
    });

    res.status(200).json({
      message: "Photo uploaded and forwarded to local system.",
      localResponse: response.data,
    });
  } catch (error) {
    console.error("Error forwarding to local system:", error.message);
    res.status(500).json({ message: "Failed to forward the photo to local system." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vercel server running on port ${PORT}`);
});
