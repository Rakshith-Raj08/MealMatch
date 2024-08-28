import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const SearchRecipes = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4 text-center">Search Recipes</h2>
          <Form>
            <Form.Group controlId="searchQuery">
              <Form.Label>Enter recipe name or keywords:</Form.Label>
              <Form.Control type="text" placeholder="E.g., Chicken Curry" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Search</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchRecipes;
