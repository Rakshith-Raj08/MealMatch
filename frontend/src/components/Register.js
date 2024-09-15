import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
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
      const response = await axios.post('http://localhost:5000/register', formData, { withCredentials: true });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error registering user');
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Register</Card.Header>
        <Card.Body>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
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
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
