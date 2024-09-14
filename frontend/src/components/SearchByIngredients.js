import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import './SearchByIngredients.css'; // Ensure your CSS is loaded

// Utility function for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    window.scrollTo(0, 0);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchIngredients = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Debounce the search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  const handleChange = (e) => setSearchQuery(e.target.value);

  // Fetch ingredient suggestions
  const fetchIngredients = useCallback(async () => {
    if (debouncedSearchQuery.trim() === '') {
      setIngredientSuggestions([]);
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/api/ingredients', {
        params: { query: debouncedSearchQuery },
      });
      setIngredientSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching ingredient suggestions:', error);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredients((prevState) => {
      // Check if the ingredient is already in the selected list
      if (prevState.includes(ingredient)) {
        return prevState.filter((i) => i !== ingredient);
      }
      return [...prevState, ingredient];
    });

    // Delay the clearing of search query and suggestions to allow the click to register
    setTimeout(() => {
      setSearchQuery('');
      setIngredientSuggestions([]);
    }, 100); // Small delay to ensure the click is processed
  };

  const handleCheckboxChange = (ingredient) => {
    setSelectedIngredients(prevState =>
      prevState.includes(ingredient)
        ? prevState.filter(item => item !== ingredient)
        : [...prevState, ingredient]
    );
  };

  const handleSearch = async () => {
    console.log('Selected Ingredients:', selectedIngredients); // Log selected ingredients
    try {
      const response = await axios.post('http://localhost:5000/api/recipes/search', {
        ingredients: selectedIngredients
      });
      console.log('Recipes fetched:', response.data); // Log fetched recipes
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleRecipeClick = async (recipe) => {
    console.log('Recipe clicked:', recipe); // Log the entire recipe object
    console.log('Recipe ID:', recipe.recipe_id); // Ensure recipe_id is defined and valid

    if (!recipe.recipe_id) {
      console.error('Recipe ID is missing or undefined');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${recipe.recipe_id}`);
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  return (
    <div className={`search-ingredients-container ${isFocused ? 'focused' : ''}`}>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="mb-4 text-center">Search Ingredients</h2>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group controlId="searchQuery">
                <Form.Label>Enter ingredient:</Form.Label>
                <div className={`popup-container ${isFocused ? 'active' : ''}`}>
                  <Form.Control
                    type="text"
                    placeholder="E.g., Chicken"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={searchQuery}
                    className="search-bar"
                  />
                  {isFocused && searchQuery && (
                    <div className="search-results">
                      {ingredientSuggestions.length > 0 ? (
                        ingredientSuggestions.map((ingredient, index) => (
                          <div
                            key={index}
                            className="result-item"
                            onClick={() => handleSelectIngredient(ingredient.ingredient_name)}
                          >
                            {ingredient.ingredient_name}
                          </div>
                        ))
                      ) : (
                        <div className="no-match">No match found</div>
                      )}
                    </div>
                  )}
                </div>
              </Form.Group>
              <Button 
                variant="primary" 
                onClick={handleSearch} 
                className="mt-3"
              >
                Search
              </Button>
            </Form>

            {/* Render selected ingredients as checkboxes */}
            {selectedIngredients.length > 0 && (
              <div className="selected-ingredients mt-5">
                <h4>Selected Ingredients:</h4>
                <ul>
                  {selectedIngredients.map((ingredient, index) => (
                    <li key={index}>
                      <Form.Check 
                        type="checkbox" 
                        label={ingredient} 
                        checked={selectedIngredients.includes(ingredient)}
                        onChange={() => handleCheckboxChange(ingredient)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Render fetched recipes */}
            {recipes.length > 0 && (
              <div className="recipes mt-5">
                <h4>Recipe Results:</h4>
                <Row>
                  {recipes.map((recipe, index) => (
                    <Col md={4} key={index} className="mb-4">
                      <Card onClick={() => handleRecipeClick(recipe)} style={{ cursor: 'pointer' }}>
                        <Card.Img variant="top" src={recipe.image_url || 'default-image.jpg'} />
                        <Card.Body>
                          <Card.Title>{recipe.recipe_name || 'No Name'}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Display full recipe details when a recipe is selected */}
          {selectedRecipe && (
            <div className="selected-recipe mt-5">
              {selectedRecipe.image_url && (
                <img
                  src={selectedRecipe.image_url}
                  alt={selectedRecipe.recipe_name}
                  className="img-fluid mt-3"
                />
              )}

              {/* Calculate the percentage of matching ingredients */}
              {(() => {
                const totalRecipeIngredients = selectedRecipe.ingredients.length; // Total ingredients in the recipe
                const matchedIngredients = selectedRecipe.ingredients.filter(ingredient =>
                  selectedIngredients.includes(ingredient)
                ).length; // How many recipe ingredients match the selected ingredients

                const matchPercentage = ((matchedIngredients / totalRecipeIngredients) * 100).toFixed(2); // Percentage of recipe ingredients that match

                return (
                  <div className="ingredient-match-percentage">
                    <h3 className="mt-4">{selectedRecipe.recipe_name}</h3>

                    {/* Display percentage with gradient background */}
                    <div 
                      className="percentage-bar"
                      style={{
                        width: '100%',
                        height: '30px',
                        borderRadius: '5px',
                        background: `linear-gradient(to right, green, red ${matchPercentage}%)`,
                        textAlign: 'center',
                        color: 'white',
                        lineHeight: '30px'
                      }}
                    >
                      {matchPercentage}%
                    </div>
                  </div>
                );
              })()}

              <p><strong>Description:</strong> {selectedRecipe.description}</p>
              <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
              <p><strong>Category:</strong> {selectedRecipe.category_name}</p>

              {/* Highlight matching ingredients in green */}
              <ul>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li 
                    key={index} 
                    style={{
                      color: selectedIngredients.includes(ingredient) ? 'green' : 'inherit',
                      fontWeight: selectedIngredients.includes(ingredient) ? 'bold' : 'normal'
                    }}
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}



          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchIngredients;
