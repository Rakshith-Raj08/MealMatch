const { spawn } = require('child_process');
const path = require('path');

// Function to get meal recommendations based on user input
const getMealRecommendations = async (req, res) => {
  const { caloriesPerDay, proteinRequired, numMeals, caloriesPerMeal, vegOnly } = req.body;

  try {
    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, '../../python/mlModel.py');

    // Call Python script for prediction
    const pythonProcess = spawn('python3', [pythonScriptPath, caloriesPerDay, proteinRequired, numMeals, caloriesPerMeal, vegOnly]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code !== 0) {
        console.error('Python script error:', error);
        return res.status(500).json({ message: 'Error running ML model', error: error });
      }

      // Extract valid JSON portion
      const jsonStart = result.indexOf('[');
      const jsonEnd = result.lastIndexOf(']') + 1;
      const jsonString = result.substring(jsonStart, jsonEnd);

      // Log the extracted JSON to verify correctness
      console.log('Extracted JSON:', jsonString);

      try {
        const recommendations = JSON.parse(jsonString);
        console.log('Recommendations:', recommendations);

        if (recommendations.length === 0) {
          return res.status(404).json({ message: 'No recommendations found' });
        }

        // Directly send the recommendations to the frontend
        res.json(recommendations);
      } catch (error) {
        console.error('Error parsing recommendations:', error);
        res.status(500).json({ message: 'Error parsing recommendations' });
      }
    });

  } catch (error) {
    console.error('Error getting meal recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMealRecommendations };
