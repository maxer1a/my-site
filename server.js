// server.js (OpenAI SDK v4 compatible)
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup (v4 syntax)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST endpoint to generate proposal
app.post("/generate", async (req, res) => {
  const { jobDescription, userSkills } = req.body;

  if (!jobDescription || !userSkills) {
    return res.status(400).json({ error: "Missing job or skills input." });
  }

  const prompt = `
Write a convincing freelance proposal for the following job:

Job Description:
${jobDescription}

Freelancer's Skills:
${userSkills}

Include a greeting, experience, how you'll help, and a closing.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const proposal = response.choices[0].message.content;
    res.json({ proposal });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to generate proposal." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
