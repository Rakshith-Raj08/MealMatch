const express = require('express');
const axios = require('axios');
const router = express.Router();

// Spoonacular API key from environment variables
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

// Route to fetch recipes from Spoonacular API
router.get('/recipes', async (req, res) => {
  const { ingredients, dietaryFilters, calorieRange } = req.query;

  // Construct the query string based on user inputs
  let query = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}`;

  if (ingredients) {
    query += `&includeIngredients=${ingredients}`;
  }
  if (dietaryFilters) {
    query += `&diet=${dietaryFilters}`;
  }
  if (calorieRange) {
    query += `&minCalories=${calorieRange.min}&maxCalories=${calorieRange.max}`;
  }

  try {
    const response = await axios.get(query);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recipes from Spoonacular:', error);
    res.status(500).json({ message: 'Error fetching recipes from Spoonacular' });
  }
});

module.exports = router;
