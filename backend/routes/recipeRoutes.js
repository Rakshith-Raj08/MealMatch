// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const { getAllRecipes } = require('../controllers/recipeController');

router.get('/recipes', getAllRecipes);

module.exports = router;
