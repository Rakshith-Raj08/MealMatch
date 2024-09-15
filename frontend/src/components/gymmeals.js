import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import './gymmeals.css';

const GymMeals = () => {
  const [caloriesPerDay, setCaloriesPerDay] = useState('100');
  const [proteinRequired, setProteinRequired] = useState('100'); // Single protein field
  const [numMeals, setNumMeals] = useState(3); // Default to 3 meals per day
  const [filters, setFilters] = useState({
    vegOnly: false,
    noMilk: false,
    noSyntheticProtein: false,
    glutenFree: false,
    dairyFree: false,
    soyFree: false,
    nutFree: false,
    eggFree: false,
    paleo: false,
    ketoFriendly: false,
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      setFilters({
        ...filters,
        [name]: checked,
      });
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
      filters,
    };

    try {
      // Send request to the backend to get meal recommendations
      const response = await axios.post('http://localhost:5000/api/gymmeals', requestData);
      console.log('Meal recommendations:', response.data);
      // Handle the response and display meal recommendations
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

            {/* Existing Filters */}
            <Form.Group controlId="vegOnly">
              <Form.Check
                type="checkbox"
                label="Vegetarian Only"
                name="vegOnly"
                checked={filters.vegOnly}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="noMilk">
              <Form.Check
                type="checkbox"
                label="No Milk"
                name="noMilk"
                checked={filters.noMilk}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="noSyntheticProtein">
              <Form.Check
                type="checkbox"
                label="No Synthetic Protein"
                name="noSyntheticProtein"
                checked={filters.noSyntheticProtein}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* New Filters */}
            <Form.Group controlId="glutenFree">
              <Form.Check
                type="checkbox"
                label="Gluten-Free"
                name="glutenFree"
                checked={filters.glutenFree}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="dairyFree">
              <Form.Check
                type="checkbox"
                label="Dairy-Free"
                name="dairyFree"
                checked={filters.dairyFree}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="soyFree">
              <Form.Check
                type="checkbox"
                label="Soy-Free"
                name="soyFree"
                checked={filters.soyFree}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="nutFree">
              <Form.Check
                type="checkbox"
                label="Nut-Free"
                name="nutFree"
                checked={filters.nutFree}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="eggFree">
              <Form.Check
                type="checkbox"
                label="Egg-Free"
                name="eggFree"
                checked={filters.eggFree}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="paleo">
              <Form.Check
                type="checkbox"
                label="Paleo"
                name="paleo"
                checked={filters.paleo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="ketoFriendly">
              <Form.Check
                type="checkbox"
                label="Keto-Friendly"
                name="ketoFriendly"
                checked={filters.ketoFriendly}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Get Meal Plan
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GymMeals;
