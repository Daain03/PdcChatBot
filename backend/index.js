// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { handleChat } = require("./utils/llm");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL for local testing
    credentials: true,
  })
);
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Iqra RAG Chatbot backend is running");
});

// Main chat endpoint
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const answer = await handleChat(prompt);
    res.json({ response: answer });
  } catch (err) {
    console.error("Backend Error:", err.message);
    res.status(500).json({ error: "Failed to get a response from chatbot" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
