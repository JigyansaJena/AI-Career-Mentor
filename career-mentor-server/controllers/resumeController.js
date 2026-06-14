const Resume = require('../models/Resume');
const { extractSkillsFromText } = require('./skillController');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a PDF file' });

    // Dynamically import to avoid export issues
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(req.file.buffer);
    const rawText = data.text;

    console.log('TEXT LENGTH:', rawText.length);
    console.log('PREVIEW:', rawText.slice(0, 200));

    if (!rawText || rawText.length < 50) {
      return res.status(400).json({ message: 'Could not extract text from PDF. Try a different PDF.' });
    }

    const extractedSkills = await extractSkillsFromText(rawText);

    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id },
      { rawText, fileName: req.file.originalname, extractedSkills },
      { upsert: true, returnDocument: 'after' }
    );

    res.status(201).json({ message: 'Resume uploaded', resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'No resume found' });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, getResume };