const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

// Route to get ingredient suggestions based on search query
router.get('/ingredients', ingredientController.getIngredients);

module.exports = router;
