// gymrecipes.js
const express = require('express');
const { searchRecipes, getRecipeInformation } = require('../spoonacularService');

const router = express.Router();

// Route to search for recipes
router.get('/search', async (req, res) => {
  const { query, diet } = req.query;
  try {
    const results = await searchRecipes(query, diet);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes', error: error.message });
  }
});

// Route to get recipe details
router.get('/details/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received recipe ID: ${id}`); // Log ID for debugging
  try {
    if (!id) {
      return res.status(400).json({ message: 'Recipe ID is required' });
    }
    const recipeInfo = await getRecipeInformation(id);
    res.json(recipeInfo);
  } catch (error) {
    console.error('Error getting recipe details:', error);
    res.status(500).json({ message: 'Error getting recipe details', error: error.message });
  }
});

module.exports = router;
