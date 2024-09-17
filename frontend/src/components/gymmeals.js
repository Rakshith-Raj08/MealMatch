import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import './gymmeals.css';

const GymMeals = () => {
  const [caloriesPerDay, setCaloriesPerDay] = useState(4000);
  const [proteinRequired, setProteinRequired] = useState(50);
  const [numMeals, setNumMeals] = useState(3);
  const [vegOnly, setVegOnly] = useState(false);
  const [message, setMessage] = useState('');
  const [mealRecommendations, setMealRecommendations] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setVegOnly(checked);
    } else if (name === 'proteinRequired') {
      setProteinRequired(parseInt(value, 10));
    } else if (name === 'caloriesPerDay') {
      setCaloriesPerDay(parseInt(value, 10));
    } else if (name === 'numMeals') {
      setNumMeals(Number(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const caloriesPerMeal = caloriesPerDay / numMeals;

    const requestData = {
      caloriesPerDay,
      proteinRequired,
      numMeals,
      caloriesPerMeal,
      vegOnly,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/gym-meals/gymmeals', requestData);
      console.log('Meal recommendations:', response.data);

      setMealRecommendations(response.data);
      setMessage('Meal recommendations retrieved successfully!');
    } catch (error) {
      console.error('Error fetching meal recommendations:', error);
      setMessage('Error fetching meal recommendations');
    }
  };

  const groupMealsByDay = (meals) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayMeals = meals.find(day => day.day === i + 1)?.meals || [];
      days.push(dayMeals);
    }
    return days;
  };

  const daysWithMeals = groupMealsByDay(mealRecommendations);

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
                          <Badge bg="warning" pill>
                            <strong>{meal.healthiness_index.toFixed(2)}</strong> Healthy Index
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
