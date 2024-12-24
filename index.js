const express = require("express");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!"); // Simple test endpoint
});

app.get("/upload", (req, res) => {
  res.send("Hello, World!"); // Simple test endpoint
});


module.exports = app; // Required for Vercel
