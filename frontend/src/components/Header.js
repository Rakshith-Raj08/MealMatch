import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AiFillInfoCircle } from 'react-icons/ai'; 
import './Header.css'; 
import logo from '../assets/logo2.png'; 

const Header = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const storedUsername = localStorage.getItem('username'); // Retrieve username from localStorage

    console.log('Token:', token); // Debug: Check if token is retrieved
    console.log('Stored Username:', storedUsername); // Debug: Check if username is retrieved

    if (token && storedUsername) {
      setUsername(storedUsername); // Set the username in state if available
    } else {
      setUsername(null); // Ensure state is cleared if no token or username
    }
  }, []); // Empty dependency array ensures this runs only on mount

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    setUsername(null); // Update the state to reflect logout
  };

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
            {username ? (
              <Dropdown align="end">
                <Dropdown.Toggle as="span" id="dropdown-info" className="info-icon">
                  <AiFillInfoCircle size={30} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="span">{`Welcome, ${username}`}</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/" onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle as="span" id="dropdown-info" className="info-icon">
                  <AiFillInfoCircle size={30} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
