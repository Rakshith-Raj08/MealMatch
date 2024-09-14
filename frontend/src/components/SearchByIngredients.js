import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './SearchByIngredients.css'; // Make sure your CSS is loaded

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

const SearchIngredients = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

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

  const handleSearch = () => {
    // Replace with real search logic based on selected ingredients
    console.log('Searching for recipes with ingredients:', selectedIngredients);
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchIngredients;
