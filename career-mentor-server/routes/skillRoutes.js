const express = require('express');
const router = express.Router();
const { getSkillGap, getRoadmap } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/gap', protect, getSkillGap);
router.get('/roadmap', protect, getRoadmap);
module.exports = router;