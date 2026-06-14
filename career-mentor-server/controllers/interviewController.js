const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

const getQuestions = async (req, res) => {
  try {
    const targetRole = req.user.targetRole || 'Frontend Engineer';

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{
        role: 'user',
        content: `Generate 5 technical interview questions for a ${targetRole} position.
Return ONLY a JSON array of strings, nothing else, no markdown.
Example: ["What is the virtual DOM?","Explain closures in JavaScript"]`
      }],
      max_tokens: 500
    });

    const raw = response.choices[0].message.content.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(raw);
    res.json({ targetRole, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ message: 'Question and answer required' });

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{
        role: 'user',
        content: `You are a technical interviewer. Evaluate this answer.
Question: ${question}
Answer: ${answer}

Return ONLY a JSON object, nothing else, no markdown:
{"score": <1-5>, "feedback": "<2 sentence feedback>", "improvement": "<one specific thing to improve>"}`
      }],
      max_tokens: 300
    });

    const raw = response.choices[0].message.content.replace(/```json|```/g, '').trim();
    const evaluation = JSON.parse(raw);
    res.json({ question, answer, ...evaluation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuestions, submitAnswer };