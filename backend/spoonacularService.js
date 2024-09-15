require('dotenv').config();
const axios = require('axios');

// Log the API key to confirm it's being read correctly
const API_KEY = process.env.SPOONACULAR_API_KEY;

const BASE_URL = 'https://api.spoonacular.com';

const searchRecipes = async (query, diet) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        query,
        diet,
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in searchRecipes:', error.message);
    throw new Error('Error searching recipes');
  }
};

const getRecipeInformation = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getRecipeInformation:', error.message);
    throw new Error('Error getting recipe details');
  }
};

module.exports = { searchRecipes, getRecipeInformation };
