import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css'; 
import logo from '../assets/logo2.png'; 
import llogo from '../assets/llogo.png'; 
import glogo from '../assets/glogo.png'; 
import gmlogo from '../assets/gmlogo.png'; 

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo} // This will be handled by file-loader
            alt="MealMatch Logo"
            width="auto"
            height="auto"
            className="logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="https://www.linkedin.com/in/rakshith-raj-b38936220/" target="_blank" rel="noopener noreferrer">
              <img
                src={llogo} // Update with correct path
                alt="LinkedIn"
                width="40"
                height="40"
                className="icon"
              />
            </Nav.Link>
            <Nav.Link href="https://github.com/Rakshith-Raj08" target="_blank" rel="noopener noreferrer">
              <img
                src={glogo} // Update with correct path
                alt="GitHub"
                width="40"
                height="40"
                className="icon"
              />
            </Nav.Link>
            <Nav.Link href="mailto:rakshith2002raj@gmail.com">
              <img
                src={gmlogo} // Update with correct path
                alt="Email"
                width="40"
                height="40"
                className="icon"
              />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
