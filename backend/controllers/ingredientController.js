const pool = require('../config/db');

// Controller to get ingredient suggestions based on search query
const getIngredients = async (req, res) => {
  const { query } = req.query; // The search query from the user input

  // Ensure query is present
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    // Fetch matching ingredients from the database using case-insensitive search
    const result = await pool.query(
      `SELECT ingredient_name 
       FROM ingredients 
       WHERE ingredient_name ILIKE $1
       LIMIT 10`,
      [`%${query}%`]
    );

    // Return the matching ingredients as an array of objects
    const ingredients = result.rows.map((row) => ({
      ingredient_name: row.ingredient_name,
    }));

    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getIngredients,
};