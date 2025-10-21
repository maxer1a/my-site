const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Route to generate proposal
app.post('/generate', async (req, res) => {
  const { jobDescription, userSkills } = req.body;

  if (!jobDescription || !userSkills) {
    return res.status(400).json({ error: 'Missing job or skills input.' });
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
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const proposal = response.data.choices[0].message.content;
    res.json({ proposal });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate proposal.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

