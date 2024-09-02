const pool = require('../config/db');

const getAllRecipes = async (req, res) => {
  try {
    const { query } = req.query; // Get the query parameter from the request
    let result;

    if (query) {
      // If a query parameter is provided, filter recipes based on it
      result = await pool.query(
        'SELECT * FROM public.recipes WHERE LOWER(recipe_name) LIKE LOWER($1) ORDER BY recipe_id ASC',
        [`%${query}%`]
      );
    } else {
      // If no query parameter is provided, return all recipes
      result = await pool.query('SELECT * FROM public.recipes ORDER BY recipe_id ASC');
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

module.exports = { getAllRecipes };
