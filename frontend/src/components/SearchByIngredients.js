import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import './SearchByIngredients.css';

// Debounce hook to minimize API calls when typing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

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
  const [message, setMessage] = useState('');

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      if (!searchQuery) setIngredientSuggestions([]); // Clear suggestions on blur if input is empty
    }, 100);
  };

  const handleChange = (e) => setSearchQuery(e.target.value);

  // Fetch ingredient suggestions based on the debounced query
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
      setMessage(''); // Clear previous message
    } catch (error) {
      console.error('Error fetching ingredient suggestions:', error);
      setMessage('Error fetching ingredient suggestions.');
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredients((prevState) =>
      prevState.includes(ingredient)
        ? prevState.filter((i) => i !== ingredient) // Deselect if already selected
        : [...prevState, ingredient]
    );

    setTimeout(() => {
      setSearchQuery(''); // Clear search after selection
      setIngredientSuggestions([]); // Clear suggestions
    }, 100);
  };

  const handleCheckboxChange = (ingredient) => {
    setSelectedIngredients((prevState) =>
      prevState.includes(ingredient)
        ? prevState.filter((i) => i !== ingredient)
        : [...prevState, ingredient]
    );
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/recipes/search', {
        ingredients: selectedIngredients,
      });
      setRecipes(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setMessage('Error fetching recipes.');
    }
  };

  const handleRecipeClick = async (recipe) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${recipe.recipe_id}`);
      setSelectedRecipe(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      setMessage('Error fetching recipe details.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h5">Search Ingredients</Card.Header>
            <Card.Body>
              {message && <Alert variant="danger">{message}</Alert>}
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
                <Button variant="primary" onClick={handleSearch} className="mt-3">
                  Search
                </Button>
              </Form>

              {/* Render selected ingredients as checkboxes */}
              {selectedIngredients.length > 0 && (
                <div className="selected-ingredients mt-4">
                  <h5>Selected Ingredients:</h5>
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
                <div className="recipes mt-4">
                  <h5>Recipe Results:</h5>
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
                  <h3 className="mt-3">{selectedRecipe.recipe_name}</h3>

                  {/* Matching ingredients percentage */}
                  {(() => {
                    const totalIngredients = selectedRecipe.ingredients.length;
                    const matchedIngredients = selectedRecipe.ingredients.filter((ingredient) =>
                      selectedIngredients.includes(ingredient)
                    ).length;
                    const matchPercentage = ((matchedIngredients / totalIngredients) * 100).toFixed(2);

                    return (
                      <div className="ingredient-match-percentage">
                        <div
                          className="percentage-bar"
                          style={{
                            width: '100%',
                            height: '30px',
                            background: `linear-gradient(to right, green ${matchPercentage}%, red)`,
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: '30px',
                            borderRadius: '5px',
                          }}
                        >
                          {matchPercentage}% Matching Ingredients
                        </div>
                      </div>
                    );
                  })()}

                  <p><strong>Description:</strong> {selectedRecipe.description}</p>
                  <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
                  <p><strong>Category:</strong> {selectedRecipe.category_name}</p>

                  {/* List ingredients, highlighting selected ones */}
                  <ul>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        style={{
                          color: selectedIngredients.includes(ingredient) ? 'green' : 'inherit',
                          fontWeight: selectedIngredients.includes(ingredient) ? 'bold' : 'normal',
                        }}
                      >
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchIngredients;
