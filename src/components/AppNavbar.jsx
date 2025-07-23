import React, { useState } from 'react';
import { Navbar, Nav, Dropdown, Image, Form } from 'react-bootstrap';
import { FaSun, FaMoon, FaUserCircle, FaCar, FaHome, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa'

const AppNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.email === "admin@gmail.com"; 
  const [notifications, setNotifications] = useState(1); 
  const [darkMode, setDarkMode] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    setExpanded(false);
  };

  return (
    <Navbar
      bg={darkMode ? "dark" : "primary"}
      variant={darkMode ? "dark" : "dark"}
      expand="lg"
      className="px-3"
      style={{ backgroundColor: darkMode ? '#1a1a2e' : '#16213e' }}
      expanded={expanded}
    >
      <Navbar.Brand href="/" className="fw-bold">
        <FaCar className="me-2" />
        Rent-A-Car
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        onClick={() => setExpanded(expanded ? false : "expanded")}
      />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/" onClick={() => setExpanded(false)}>
            <FaHome className="me-1" />
            Home
          </Nav.Link>

          <Dropdown as={Nav.Item}>
            <Dropdown.Toggle as={Nav.Link}>
              <FaCar className="me-1" />
              Car Types
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/cars/sedan">Sedan</Dropdown.Item>
              <Dropdown.Item href="/cars/suv">SUV</Dropdown.Item>
              <Dropdown.Item href="/cars/luxury">Luxury</Dropdown.Item>
              <Dropdown.Item href="/cars/sports">Sports</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Nav.Link href="/about" onClick={() => setExpanded(false)}>
            <FaInfoCircle className="me-1" />
            About
          </Nav.Link>
        </Nav>


        <div className="d-flex align-items-center">
          <Form.Check
            type="switch"
            id="dark-mode-switch"
            label={darkMode ? <FaMoon /> : <FaSun />}
            checked={darkMode}
            onChange={toggleDarkMode}
            className="me-3"
          />

          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="text-white text-decoration-none">
              <Image
                src="https://via.placeholder.com/30"
                roundedCircle
                className="me-1"
                alt="Profile"
              />
              Profile
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/profile">My Account</Dropdown.Item>
              <Dropdown.Item href="/bookings">My Bookings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;

















