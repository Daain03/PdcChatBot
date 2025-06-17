// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { handleChat } = require("./utils/llm");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allow both local and deployed frontend for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://pdcchatbot-1.onrender.com", // <-- Your deployed frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Iqra RAG Chatbot backend is running");
});

// ✅ Main chat route
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

// ✅ Start the server (for local dev only)
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

module.exports = app; // Needed for Vercel or serverless use
