import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
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

  // Debounce the search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    // Delay hiding search results to allow for clicks
    setTimeout(() => {
      setIsFocused(false);
      if (!searchQuery) {
        setSearchResults([]); // Clear results if search query is empty
      }
    }, 100);
  };

  const handleChange = (e) => setSearchQuery(e.target.value);

  // Search function that queries the backend
  const fetchRecipes = useCallback(async () => {
    if (debouncedSearchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/api/recipes', {
        params: { query: debouncedSearchQuery },
      });
      setSearchResults(response.data);
      setSelectedRecipe(null); // Reset selected recipe when a new search is performed
    } catch (error) {
      console.error('Error fetching search results:', error);
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
        setSelectedRecipe(response.data); // Store the full recipe details
        setSearchResults([]); // Hide search results after selection
      } else {
        console.error('Recipe not found');
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  return (
    <div className={`search-recipes-container ${isFocused ? 'focused' : ''}`}>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="mb-4 text-center">Search Recipes</h2>
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
                            key={result.recipe_id} // Use `recipe_id` instead of `id`
                            className="result-item"
                            onClick={() => handleSelectRecipe(result.recipe_id)}
                          >
                            <h5>{result.recipe_name}</h5> {/* Display the recipe name */}
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
                onClick={fetchRecipes} 
                className="mt-3"
              >
                Search
              </Button>
            </Form>
            
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
                  </div>
                )}

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchRecipes;
