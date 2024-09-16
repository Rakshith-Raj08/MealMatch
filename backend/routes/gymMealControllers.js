// gymMealControllers.js
const { spawn } = require('child_process');
const path = require('path');

// Function to get meal recommendations based on user input
const getMealRecommendations = async (req, res) => {
  const { caloriesPerDay, proteinRequired, numMeals, caloriesPerMeal, vegOnly } = req.body;

  try {
    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, '../python/mlModel.py');

    // Call Python script for prediction
    const pythonProcess = spawn('python3', [pythonScriptPath, caloriesPerDay, proteinRequired, numMeals, caloriesPerMeal, vegOnly]);
    let result = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ message: 'Error running ML model' });
      }

      const recommendations = JSON.parse(result);
      const mealIds = recommendations.map(meal => meal.id);

      // Fetch meal details from PostgreSQL or Spoonacular API
      const mealDetailsQuery = `
        SELECT id, name FROM meals
        WHERE id = ANY($1::int[])
      `;
      const mealDetails = await pool.query(mealDetailsQuery, [mealIds]);

      res.json(mealDetails.rows);
    });

  } catch (error) {
    console.error('Error getting meal recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getMealRecommendations };
