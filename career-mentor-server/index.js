const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Career Mentor API running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));

// ✅ Export for Vercel (replaces app.listen)
module.exports = app;