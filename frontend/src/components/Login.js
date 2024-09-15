import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  // Scroll to top when component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/login', formData, { withCredentials: true });
      console.log('Response data:', response.data); // Log the full response
  
      const { token, username } = response.data;
  
      if (token) {
        localStorage.setItem('jwtToken', token); // Store the token
        localStorage.setItem('username', username); // Store the username
        setMessage('Logged in successfully!');
      } else {
        setMessage('Token or username not returned from server');
      }
    } catch (error) {
      console.error('Error during login', error);
      setMessage('Error logging in');
    }
  };
  
  

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Login</Card.Header>
        <Card.Body>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
