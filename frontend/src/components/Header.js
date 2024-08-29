import React from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AiFillInfoCircle } from 'react-icons/ai'; // Import the filled InfoCircle icon from react-icons
import './Header.css'; 
import logo from '../assets/logo2.png'; 

const Header = () => {
  return (
    <Navbar className="navbar" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="MealMatch Logo"
            width="auto"
            height="auto"
            className="logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Dropdown align="end"> {/* Align dropdown to the right */}
              <Dropdown.Toggle as="span" id="dropdown-info" className="info-icon">
                <AiFillInfoCircle size={30} /> {/* Set the size of the icon */}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/about-website">About the Website</Dropdown.Item>
                <Dropdown.Item as={Link} to="/about-developer">About the Developer</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
