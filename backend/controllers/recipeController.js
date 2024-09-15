const pool = require('../config/db'); // Assuming you're using pg-pool for database connections

// Controller to get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const result = await pool.query('SELECT recipe_id, recipe_name FROM recipes');
    res.json(result.rows); // Return the list of recipes with their IDs and names
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get recipe details by ID
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  console.log('Received recipe ID:', id); // Log the ID for debugging

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid or missing Recipe ID' });
  }

  try {
    const query = `
      SELECT r.recipe_name, r.description, r.instructions, r.image_url, c.category_name, 
             array_agg(i.ingredient_name) AS ingredients
      FROM recipes r
      JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      JOIN categories c ON r.category_id = c.category_id
      WHERE r.recipe_id = $1
      GROUP BY r.recipe_id, c.category_name;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const searchRecipes = async (req, res) => {
  try {
    const { ingredients } = req.body;

    // Check if ingredients are provided
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: 'No ingredients provided' });
    }

    const query = `
      SELECT r.recipe_id, r.recipe_name, r.image_url
      FROM recipes r
      JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE i.ingredient_name = ANY($1::text[])
      GROUP BY r.recipe_id;  -- Ensure to group by recipe_id
    `;

    const result = await pool.query(query, [ingredients]);

    // Send the result to the frontend
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  getAllRecipes,
  getRecipeById,
  searchRecipes
};