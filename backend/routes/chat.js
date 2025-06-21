const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();
const Chat = require("../models/chatHis");
// save chats into db and get from it
const {
  saveMessage,
  getChatHistory,
} = require("../controllers/chatController");

// for api for ai (input output)
const { getAIResponse } = require("../utils/aiHelper");

// POST /api/chat — receive user message and send response
router.post("/", async (req, res) => {
  console.log("Chat route hit:", req.method, req.originalUrl);
  const userMessage = req.body.message;
  const patientId = req.body.patientId;
  console.log("User message:", userMessage);
  console.log("patient Id:", patientId);

  // Save user input
  await saveMessage(patientId, "user", userMessage);

  // Get context
  const previousMessages = await getChatHistory(patientId);
  // console.log(previousMessages);

  try {
    const reply = await getAIResponse(
      previousMessages.concat({
        role: "user",
        content: userMessage,
      })
    );
    res.status(200).json({ reply });
    await saveMessage(patientId, "ai", reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// to get previous messages from the db

router.get("/:patientId/last4", async (req, res) => {
  try {
    const { patientId } = req.params;
    const chat = await Chat.findOne({ patientId: patientId });
    if (!chat) return res.status(200).json({ message: [] });

    const lastFour = chat.messages.slice(-4);
    res.status(200).json({ message: lastFour });
  } catch (err) {
    console.error("Error fetching the previous chats: ", err);
    res.status(500).json({ error: "Failed to fetch chat History!" });
  }
});

module.exports = router;
