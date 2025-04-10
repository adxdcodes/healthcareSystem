const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();

const oprAPI = process.env.OPR_API;
const oprBase = process.env.OPR_BASE;

// Initialize OpenRouter (DeepSeek)
const openRouter = new OpenAI({
  baseURL: oprBase, // e.g. "https://openrouter.ai/api/v1"
  apiKey: oprAPI,
  dangerouslyAllowBrowser: false,
});

// POST /api/chat — receive user message and send response
router.post("/", async (req, res) => {
  console.log("Chat route hit:", req.method, req.originalUrl);
  const userMessage = req.body.message;
  console.log("User message:", userMessage);

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const completion = await openRouter.chat.completions.create({
      model: "deepseek/deepseek-r1:free", // ✅ Correct DeepSeek model name on OpenRouter
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
    });

    const botReply = completion.choices[0].message.content;
    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("Error in DeepSeek API call:", error);
    res.status(500).json({
      error:
        "Failed to generate response from DeepSeek. Check your API key, model access, and OpenRouter settings.",
    });
  }
});

module.exports = router;
