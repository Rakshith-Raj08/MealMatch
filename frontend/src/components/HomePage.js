import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Example data for recommended recipes
  const recommendedRecipes = [
    { id: 1, title: 'Spaghetti Carbonara', description: 'A classic Italian pasta dish.', image: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Chicken Tikka Masala', description: 'A flavorful chicken curry.', image: 'https://via.placeholder.com/150' },
    { id: 3, title: 'Caesar Salad', description: 'A fresh and crunchy salad.', image: 'https://via.placeholder.com/150' }
  ];

  return (
    <Container className="mt-1"> 
      <h1 className="text-center mb-2">Welcome to MealMatch!</h1>
      <Row className="justify-content-center mb-2">
        <Col xs="auto">
          <Button variant="primary" as={Link} to="/search-recipes" className="me-2">Search Recipes</Button>
          <Button variant="secondary" as={Link} to="/search-by-ingredients">Search by Ingredients</Button>
        </Col>
      </Row>
      <h2 className="text-center mb-3">Recommended Recipes</h2>
      <Row>
        {recommendedRecipes.map(recipe => (
          <Col md={4} key={recipe.id} className="mb-2">
            <Card>
              <Card.Img variant="top" src={recipe.image} />
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text>{recipe.description}</Card.Text>
                <Button variant="primary" as={Link} to={`/recipe/${recipe.id}`}>View Recipe</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
