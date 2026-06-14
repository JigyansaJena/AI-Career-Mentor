const Groq = require('groq-sdk');
const Resume = require('../models/Resume');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

const extractSkillsFromText = async (text) => {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{
      role: 'user',
      content: `Extract all technical skills from this resume text. Return ONLY a JSON array of strings, nothing else. Example: ["React","Node.js","MongoDB"]\n\nResume:\n${text.slice(0, 3000)}`
    }],
    max_tokens: 500
  });

  const raw = response.choices[0].message.content.trim();
  try {
    return JSON.parse(raw);
  } catch {
    return raw.match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
  }
};

const roleRequirements = {
  'Frontend Engineer': ['React','TypeScript','JavaScript','CSS','HTML','Git','REST APIs','Testing','CI/CD','Node.js'],
  'Backend Engineer': ['Node.js','Python','MongoDB','PostgreSQL','REST APIs','Docker','Git','AWS','Testing','CI/CD'],
  'Full Stack Engineer': ['React','Node.js','MongoDB','TypeScript','REST APIs','Git','Docker','Testing','CSS','AWS'],
  'Data Scientist': ['Python','Machine Learning','SQL','TensorFlow','Pandas','NumPy','Git','Statistics','Data Visualization','Deep Learning'],
};

const getSkillGap = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Upload a resume first' });

    const targetRole = req.user.targetRole || 'Frontend Engineer';
    const required = roleRequirements[targetRole] || roleRequirements['Frontend Engineer'];
    const userSkills = resume.extractedSkills.map(s => s.toLowerCase());

    const matched = required.filter(s => userSkills.includes(s.toLowerCase()));
    const missing = required.filter(s => !userSkills.includes(s.toLowerCase()));

    res.json({
      targetRole,
      required,
      userSkills: resume.extractedSkills,
      matched,
      missing,
      readinessPercent: Math.round((matched.length / required.length) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoadmap = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Upload a resume first' });

    const targetRole = req.user.targetRole || 'Frontend Engineer';
    const required = roleRequirements[targetRole] || roleRequirements['Frontend Engineer'];
    const userSkills = resume.extractedSkills.map(s => s.toLowerCase());
    const missing = required.filter(s => !userSkills.includes(s.toLowerCase()));

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{
        role: 'user',
        content: `Generate a learning roadmap for someone who wants to become a ${targetRole} and is missing these skills: ${missing.join(', ')}.
Return ONLY a JSON array with this exact structure, nothing else, no markdown:
[{"skill":"TypeScript","resource":"Total TypeScript by Matt Pocock","url":"https://totaltypescript.com","hours":10,"priority":"high"}]`
      }],
      max_tokens: 1000
    });

    const raw = response.choices[0].message.content.replace(/```json|```/g, '').trim();
    const roadmap = JSON.parse(raw);
    res.json({ targetRole, missing, roadmap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSkillGap, getRoadmap, extractSkillsFromText };