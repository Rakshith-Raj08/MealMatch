const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Route to get all recipes based on a search query
router.get('/recipes', recipeController.getAllRecipes);

// Route to get a specific recipe by ID
router.get('/recipes/:id', recipeController.getRecipeById);

module.exports = router;
