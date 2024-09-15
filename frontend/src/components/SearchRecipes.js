import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import './SearchRecipes.css';

// Utility function for debouncing
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

const SearchRecipes = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [message, setMessage] = useState('');

  // Debounce the search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      if (!searchQuery) {
        setSearchResults([]); // Clear results if search query is empty
      }
    }, 100);
  };

  const handleChange = (e) => setSearchQuery(e.target.value);

  // Fetch recipes based on the search query
  const fetchRecipes = useCallback(async () => {
    if (debouncedSearchQuery.trim() === '') {
      setSearchResults([]); // Clear results if the input is empty
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/recipes', {
        params: { query: debouncedSearchQuery },
      });

      setSearchResults(response.data);
      setSelectedRecipe(null); // Reset selected recipe when a new search is performed
      setMessage(''); // Clear any previous message
    } catch (error) {
      console.error('Error fetching search results:', error);
      setMessage('Error fetching search results.');
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSelectRecipe = async (recipeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
      if (response.status === 200) {
        setSelectedRecipe(response.data);
        setSearchResults([]);
        setMessage('');
      } else {
        setMessage('Recipe not found.');
      }
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
            <Card.Header as="h5">Search Recipes</Card.Header>
            <Card.Body>
              {message && <Alert variant="danger">{message}</Alert>}
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group controlId="searchQuery">
                  <Form.Label>Enter recipe name or keywords:</Form.Label>
                  <div className={`popup-container ${isFocused ? 'active' : ''}`}>
                    <Form.Control
                      type="text"
                      placeholder="E.g., Chicken Curry"
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={searchQuery}
                      className="search-bar"
                    />
                    {isFocused && searchQuery && (
                      <div className="search-results">
                        {searchResults.length > 0 ? (
                          searchResults.map((result) => (
                            <div
                              key={result.recipe_id}
                              className="result-item"
                              onClick={() => handleSelectRecipe(result.recipe_id)}
                            >
                              <h5>{result.recipe_name}</h5>
                            </div>
                          ))
                        ) : (
                          <div className="no-match">No match found</div>
                        )}
                      </div>
                    )}
                  </div>
                </Form.Group>
                <Button variant="primary" onClick={fetchRecipes} className="mt-3">
                  Search
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Display full recipe details when a recipe is selected */}
          {selectedRecipe && (
            <Card className="mt-5">
              <Card.Body>
                {selectedRecipe.image_url && (
                  <img
                    src={selectedRecipe.image_url}
                    alt={selectedRecipe.recipe_name}
                    className="img-fluid mt-3"
                  />
                )}
                <h3 className="mt-4">{selectedRecipe.recipe_name}</h3>
                <p><strong>Description:</strong> {selectedRecipe.description}</p>
                <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
                <p><strong>Category:</strong> {selectedRecipe.category_name}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchRecipes;
