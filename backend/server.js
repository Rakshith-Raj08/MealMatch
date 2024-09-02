const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipeRoutes'); // Import the recipe routes
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Register routes
app.use('/api', recipeRoutes); // Prefix all recipe routes with /api

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
