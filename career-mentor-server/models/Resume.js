const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  extractedSkills: [{
    type: String
  }],
  fileName: {
    type: String
  }
}, {timestamps: true});

module.exports = mongoose.model('Resume', resumeSchema)