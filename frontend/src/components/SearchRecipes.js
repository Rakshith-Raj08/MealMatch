import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './SearchRecipes.css';

const SearchRecipes = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e) => setSearchQuery(e.target.value);

  // Dummy search function
  const handleSearch = (e) => {
    e.preventDefault();
    // Mock search results
    const results = searchQuery
      ? ['Recipe 1', 'Recipe 2', 'Recipe 3'].filter((recipe) =>
          recipe.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
    setSearchResults(results);
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
                            {result}
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
