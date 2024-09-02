// src/components/HomePage.js
import React from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios' ;

const HomePage = () => {
  const recommendedRecipes = [
    { id: 1, title: 'Spaghetti Carbonara', description: 'A classic Italian pasta dish.', image: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Chicken Tikka Masala', description: 'A flavorful chicken curry.', image: 'https://via.placeholder.com/150' },
    { id: 3, title: 'Caesar Salad', description: 'A fresh and crunchy salad.', image: 'https://via.placeholder.com/150' }
  ];

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mb-4">
        <Col md={4} className="text-center">
          <h5>Discover recipes for any meal. Find new dishes based on your preferences.</h5>
          <Button variant="primary" as={Link} to="/search-recipes" className="my-3">Search Recipes</Button>
        </Col>
        <Col md={4} className="text-center">
          <h5>Find recipes with what you have. Enter your ingredients to get meal ideas.</h5>
          <Button variant="secondary" as={Link} to="/search-by-ingredients" className="my-3">Search by Ingredients</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Carousel>
            {recommendedRecipes.map(recipe => (
              <Carousel.Item key={recipe.id}>
                <img
                  className="d-block w-100"
                  src={recipe.image}
                  alt={recipe.title}
                />
                <Carousel.Caption>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <Button variant="primary" as={Link} to={`/recipe/${recipe.id}`}>View Recipe</Button>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
