import React from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaList } from 'react-icons/fa'; // Import icons

const HomePage = () => {
  const recommendedRecipes = [
    { id: 1, title: 'Tacos', description: 'A classic mexican snack.', image: 'https://images.pexels.com/photos/27590338/pexels-photo-27590338/free-photo-of-beet-carne-asada-tacos.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 2, title: 'Chicken Tikka Masala', description: 'A flavorful chicken curry.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUcNTu6mSvUxTmg0k8qX70DsuxwrG-FqC29g&s' },
    { id: 3, title: 'Chicken Biryani', description: 'A flavorful rice and meat god-gifted recipe!.', image: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg' }
  ];

  return (
    <Container className="mt-4">
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
      <Row className="mt-5"> {/* Added margin-top to create space */}
        <Col>
          <div className="button-container text-center">
            <Row className="justify-content-center">
              <Col md={4} className="mb-4">
                <div className="icon-container">
                  <FaSearch size={50} />
                  <h5 className="mt-2">Discover recipes for any meal.</h5>
                </div>
                <Button variant="primary" as={Link} to="/search-recipes" className="mt-3 bordered-button w-100">Search Recipes</Button>
              </Col>
              <Col md={4} className="mb-4">
                <div className="icon-container">
                  <FaList size={50} />
                  <h5 className="mt-2">Find recipes with what you have.</h5>
                </div>
                <Button variant="secondary" as={Link} to="/search-by-ingredients" className="mt-3 bordered-button w-100">Search by Ingredients</Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
