import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import './gymmeals.css';

const GymMeals = () => {
  const [caloriesPerDay, setCaloriesPerDay] = useState(100);
  const [proteinRequired, setProteinRequired] = useState(100); // Single protein field
  const [numMeals, setNumMeals] = useState(3); // Default to 3 meals per day
  const [vegOnly, setVegOnly] = useState(false); // Vegetarian Only filter
  const [message, setMessage] = useState('');
  const [mealRecommendations, setMealRecommendations] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setVegOnly(checked);
    } else if (name === 'proteinRequired') {
      setProteinRequired(parseInt(value, 10)); // Convert protein to integer
    } else if (name === 'caloriesPerDay') {
      setCaloriesPerDay(parseInt(value, 10)); // Convert calories to integer
    } else if (name === 'numMeals') {
      setNumMeals(Number(value)); // Convert number of meals to integer
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate calories per meal
    const caloriesPerMeal = caloriesPerDay / numMeals;

    // Prepare the data to send to the backend for filtering meals
    const requestData = {
      caloriesPerDay,
      proteinRequired,
      numMeals,
      caloriesPerMeal,
      vegOnly, // Vegetarian filter
    };

    try {
      // Send request to the backend to get meal recommendations
      const response = await axios.post('http://localhost:5000/api/gymmeals', requestData);
      console.log('Meal recommendations:', response.data);
      setMealRecommendations(response.data); // Update state with meal recommendations
      setMessage('Meal recommendations retrieved successfully!');
    } catch (error) {
      console.error('Error fetching meal recommendations:', error);
      setMessage('Error fetching meal recommendations');
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Customize Your Gym Meals</Card.Header>
        <Card.Body>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="caloriesPerDay">
              <Form.Label>Calories Per Day</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your daily calorie target"
                name="caloriesPerDay"
                value={caloriesPerDay}
                onChange={handleInputChange}
                min={100}
              />
            </Form.Group>
            <Form.Group controlId="numMeals">
              <Form.Label>Meals Per Day</Form.Label>
              <Form.Control
                type="number"
                placeholder="Number of meals per day"
                name="numMeals"
                value={numMeals}
                onChange={handleInputChange}
                min={1}
              />
            </Form.Group>
            <Form.Group controlId="proteinRequired">
              <Form.Label>Protein Required (g)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Protein required per meal (g)"
                name="proteinRequired"
                value={proteinRequired}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="vegOnly">
              <Form.Check
                type="checkbox"
                label="Vegetarian Only"
                name="vegOnly"
                checked={vegOnly}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Get Meal Plan
            </Button>
          </Form>

          {mealRecommendations.length > 0 && (
            <Card className="mt-4">
              <Card.Header as="h5">Recommended Meals</Card.Header>
              <Card.Body>
                <ListGroup>
                  {mealRecommendations.map(meal => (
                    <ListGroup.Item key={meal.id}>{meal.name}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GymMeals;
