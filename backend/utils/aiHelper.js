const OpenAI = require("openai");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Load system prompt from external file
const systemPrompt = fs.readFileSync(
  path.join(__dirname, "..", "files", "medPrompt.txt"),
  "utf-8"
);

// Set up OpenAI client
const openai = new OpenAI({
  baseURL: process.env.OPR_BASE,
  apiKey: process.env.OPR_API,
  dangerouslyAllowBrowser: false,
});

async function getAIResponse(userMessages) {
  // Prepend the system prompt as a "system" role message
  const messages = [{ role: "system", content: systemPrompt }, ...userMessages];

  const response = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1:free",
    messages,
  });

  return response.choices[0].message.content;
}

module.exports = { getAIResponse };
