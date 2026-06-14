const express = require('express');
const router = express.Router();
const { getQuestions, submitAnswer } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.get('/questions', protect, getQuestions);
router.post('/answer', protect, submitAnswer);
module.exports = router;