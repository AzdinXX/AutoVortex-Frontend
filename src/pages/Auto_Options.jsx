import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Navbar, Container, Nav, Row, Col } from 'react-bootstrap';

function Auto_Options() {
  const [cars, setCars] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    axios.get('http://localhost:3000/options')
      .then(res => setCars(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleRent = async (carId) => {
    if (!user) {
      alert("You need to login to rent a car.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/rent', {
        user_id: user.id,
        car_id: carId
      });
      alert(res.data.message);
    } catch (error) {
      alert("Failed to rent the car: " + error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/car/${id}`);
      alert("Car deleted!");
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      alert("Failed to delete car");
    }
  };

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(120deg, #0a192f 0%, #1e293b 100%);
        }
        .cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2.5rem;
          padding: 3rem 2rem;
        }
        .car-card {
          background: rgba(30, 41, 59, 0.85);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(30,64,175,0.18);
          transition: transform 0.3s, box-shadow 0.3s;
          color: #fff;
          position: relative;
          backdrop-filter: blur(6px);
        }
        .car-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 16px 40px rgba(30,64,175,0.28);
        }
        .car-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: linear-gradient(45deg, #1e3a8a 60%, #0c4a6e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .car-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.5s;
        }
        .car-card:hover .car-image {
          transform: scale(1.07);
        }
        .car-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(90deg, #2563eb 60%, #1e293b 100%);
          color: #fff;
          padding: 0.35rem 1rem;
          border-radius: 16px;
          font-size: 0.9rem;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(59,130,246,0.12);
        }
        .car-details {
          padding: 1.7rem 1.5rem 1.2rem 1.5rem;
        }
        .car-title {
          font-size: 1.4rem;
          margin: 0 0 0.5rem 0;
          color: #fff;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .car-title span {
          color: #a5b4fc;
          font-weight: 400;
        }
        .car-description {
          color: #cbd5e1;
          font-size: 1rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .car-features {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          margin-bottom: 1.3rem;
          font-size: 0.95rem;
          color: #a5b4fc;
        }
        .car-features i {
          margin-right: 0.3rem;
          color: #60a5fa;
        }
        .car-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }
        .car-price {
          display: flex;
          align-items: baseline;
        }
        .price {
          font-size: 1.6rem;
          font-weight: bold;
          color: #60a5fa;
        }
        .per-day {
          font-size: 1rem;
          color: #a5b4fc;
          margin-left: 0.3rem;
        }
        .rent-button {
          background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
          color: white;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 30px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1.05rem;
          box-shadow: 0 2px 8px rgba(59,130,246,0.12);
          transition: background 0.3s, transform 0.2s;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
        }
        .rent-button:hover {
          background: linear-gradient(90deg, #1e40af 60%, #2563eb 100%);
          transform: translateY(-2px) scale(1.04);
        }
        .login-prompt {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #f87171;
          font-size: 1rem;
          font-weight: 500;
        }
        .login-prompt i {
          font-size: 1.1rem;
        }
        .admin-actions {
          display: flex;
          gap: 0.7rem;
          margin-top: 1.2rem;
        }
        .btn-danger, .btn-success, .btn-warning {
          border-radius: 18px !important;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.45rem 1.2rem;
        }
        .btn-success {
          background: linear-gradient(90deg, #22c55e 60%, #16a34a 100%);
          border: none;
        }
        .btn-warning {
          background: linear-gradient(90deg, #facc15 60%, #eab308 100%);
          border: none;
          color: #1e293b;
        }
        .custom-navbar {
          transition: background-color 0.3s ease;
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background-color: rgba(10, 25, 47, 0.95) !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .custom-navbar .nav-link {
          color: #fff !important;
          margin: 0 0.7rem;
          font-weight: 500;
          font-size: 1.08rem;
        }
        .custom-navbar .nav-link.active, .custom-navbar .nav-link:hover {
          color: #2563eb !important;
          text-decoration: underline;
        }
        .custom-navbar .navbar-brand {
          color: #fff !important;
          font-weight: bold;
          font-size: 2rem;
          letter-spacing: 1px;
        }
        .custom-navbar .btn-outline-light {
          border-radius: 30px;
          font-size: 1.1rem;
          margin-left: 1rem;
        }
        .custom-footer {
          background: rgba(10, 25, 47, 0.92);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 -2px 16px rgba(30,64,175,0.08);
          color: #fff;
        }
        .custom-footer h5 {
          letter-spacing: 1px;
          font-weight: 600;
        }
        .custom-footer ul li a:hover {
          color: #2563eb !important;
          text-decoration: underline;
        }
        .custom-footer ul li i {
          color: #2563eb;
        }
        .custom-footer p {
          font-size: 1rem;
          letter-spacing: 0.5px;
        }
        .custom-footer hr {
          background: #fff;
        }
      `}</style>
      <Navbar expand="lg" fixed="top" className="py-3 custom-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">AutoVortex</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/auto_options">Cars</Nav.Link>
              <Nav.Link as={NavLink} to="/offers">Offers</Nav.Link>
              <Nav.Link as={NavLink} to="/about">About</Nav.Link>
              <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
              <Button as={Link} to="/login" variant="outline-light" className="ms-3 px-4">Login</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ paddingTop: '90px', minHeight: '80vh' }}>
        <div className="cars-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-image-container">
                <img
                  src={car.image ? `http://localhost:3000/uploads/${car.image}` : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop'}
                  alt={`${car.brand} ${car.model}`}
                  className="car-image"
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop'}
                />
                <div className="car-badge">{car.type}</div>
              </div>

              <div className="car-details">
                <h3 className="car-title">
                  {car.brand} <span>{car.model}</span>
                </h3>

                <p className="car-description">
                  {car.description.length > 100
                    ? `${car.description.substring(0, 100)}...`
                    : car.description}
                </p>

                <div className="car-features">
                  <span><i className="fas fa-gas-pump"></i> {car.fuel_type}</span>
                  <span><i className="fas fa-cogs"></i> {car.transmission}</span>
                  <span><i className="fas fa-users"></i> {car.seats} seats</span>
                </div>

                <div className="car-footer">
                  <div className="car-price">
                    <span className="price">${car.price_per_day}</span>
                    <span className="per-day">/day</span>
                  </div>

                  {user ? (
                    <Link to={`/rent/${car.id}`} className="rent-button">
                      <i className="fas fa-key"></i> Rent Now
                    </Link>
                  ) : (
                    <div className="login-prompt">
                      <i className="fas fa-info-circle"></i>
                      <span>Login to rent this car</span>
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="admin-actions">
                    <button className='btn btn-danger' onClick={() => handleDelete(car.id)}>Delete</button>
                    <NavLink className="btn btn-success" to="/add-car">
                      Add New
                    </NavLink>
                    <Link to={`/edit-car/${car.id}`}>
                      <Button variant="warning">Edit</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="py-4 custom-footer">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h5>AutoVortex Rentals</h5>
              <p className="mb-0">Premium car rental service offering luxury vehicles at competitive prices.</p>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
                <li><Link to="/auto_options" className="text-light text-decoration-none">Our Cars</Link></li>
                <li><Link to="/offers" className="text-light text-decoration-none">Special Offers</Link></li>
                <li><Link to="/contact" className="text-light text-decoration-none">Contact Us</Link></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Contact Us</h5>
              <ul className="list-unstyled text-light">
                <li><i className="bi bi-geo-alt me-2"></i> 123 Car Street, Auto City</li>
                <li><i className="bi bi-telephone me-2"></i> +1 234 567 890</li>
                <li><i className="bi bi-envelope me-2"></i> info@luxdrive.com</li>
              </ul>
            </Col>
          </Row>
          <hr className="my-4 bg-light" />
          <p className="text-center mb-0">&copy; {new Date().getFullYear()} AutoVortex Rentals. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
}

export default Auto_Options;