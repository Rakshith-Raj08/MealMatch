import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './SearchRecipes.css';

const SearchRecipes = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e) => setSearchQuery(e.target.value);

  // Search function that queries the backend
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/api/recipes', {
        params: { query: searchQuery },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className={`search-recipes-container ${isFocused ? 'focused' : ''}`}>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="mb-4 text-center">Search Recipes</h2>
            <Form onSubmit={handleSearch}>
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
                  {isFocused && (
                    <div className="search-results">
                      {searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                          <div key={index} className="result-item">
                            <h5>{result.recipe_name}</h5> {/* Display the recipe name */}
                            <p>{result.description}</p> {/* Display the description */}
                            <p>Prep Time: {result.prep_time} mins</p> {/* Display prep time */}
                            <p>Cook Time: {result.cook_time} mins</p> {/* Display cook time */}
                            <p>Servings: {result.servings}</p> {/* Display servings */}
                          </div>
                        ))
                      ) : (
                        <div className="no-match">No match found</div>
                      )}
                    </div>
                  )}
                </div>
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Search
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchRecipes;
