// gymMealRoutes.js
const express = require('express');
const router = express.Router();
const { getMealRecommendations } = require('./gymMealControllers');

router.post('/gymmeals', getMealRecommendations);

module.exports = router;
