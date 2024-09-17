import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import './gymmeals.css';

const GymMeals = () => {
  const [caloriesPerDay, setCaloriesPerDay] = useState(4000);
  const [proteinRequired, setProteinRequired] = useState(50); // Single protein field
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
      const response = await axios.post('http://localhost:5000/api/gym-meals/gymmeals', requestData);
      console.log('Meal recommendations:', response.data);

      setMealRecommendations(response.data); // Update state with meal recommendations
      setMessage('Meal recommendations retrieved successfully!');
    } catch (error) {
      console.error('Error fetching meal recommendations:', error);
      setMessage('Error fetching meal recommendations');
    }
  };

  const groupMealsByDay = (meals, numMealsPerDay) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayMeals = meals.find(day => day.day === i + 1)?.meals || [];
      days.push(dayMeals); // Ensure each day has an array, even if empty
    }
    return days;
  };

  const daysWithMeals = groupMealsByDay(mealRecommendations, numMeals); // Group meals by day

  console.log('Days with meals:', daysWithMeals); // Debugging output

  return (
    <Container className="mt-5">
      <Card className="shadow-lg">
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
              <Form.Label>Protein Required (g) Per Meal</Form.Label>
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
        </Card.Body>
      </Card>

      {/* Meal Recommendations Section Outside the Card */}
      {daysWithMeals.flat().length > 0 && (
        <div className="mt-5">
          <h3 className="text-center mb-4">Recommended Meals for 7 Days</h3>
          {daysWithMeals.map((dayMeals, dayIndex) => (
            <div key={dayIndex} className="mb-5">
              <h4>Day {dayIndex + 1}</h4>
              <Row>
                {dayMeals.map((meal, mealIndex) => (
                  <Col key={mealIndex} md={4}>
                    <Card className="meal-card mb-4 shadow-sm">
                      <Card.Img variant="top" src={meal.image} alt={meal.title} className="meal-image" />
                      <Card.Body>
                        <Card.Title className="text-center">{meal.title}</Card.Title>
                        <div className="d-flex justify-content-around mt-3">
                          <Badge bg="info" pill>
                            <strong>{meal.calories}</strong> kcal
                          </Badge>
                          <Badge bg="success" pill>
                            <strong>{meal.protein}</strong> g Protein
                          </Badge>
                        </div>
                        <Card.Text className="mt-3 text-muted">
                          This meal provides a balanced amount of calories and protein to help you meet your daily goals.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default GymMeals;
