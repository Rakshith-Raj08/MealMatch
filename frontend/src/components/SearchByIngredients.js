import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const SearchByIngredients = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4 text-center">Search by Ingredients</h2>
          <Form>
            <Form.Group controlId="ingredients">
              <Form.Label>Enter ingredients (comma separated):</Form.Label>
              <Form.Control type="text" placeholder="E.g., chicken, curry powder, tomatoes" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Search</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchByIngredients;
