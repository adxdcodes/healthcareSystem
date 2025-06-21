// controllers/chatController.js
const Chat = require("../models/chatHis");

async function getChatHistory(patientId, limit = 5) {
  const chat = await Chat.findOne({ patientId });

  if (!chat) return [];

  const messages = chat.messages.slice(-limit);
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

async function saveMessage(patientId, role, content) {
  let chat = await Chat.findOne({ patientId });

  const newMessage = { role, content };

  if (chat) {
    chat.messages.push(newMessage);
  } else {
    chat = new Chat({ patientId, messages: [newMessage] });
  }

  await chat.save();
}

module.exports = {
  getChatHistory,
  saveMessage,
};
