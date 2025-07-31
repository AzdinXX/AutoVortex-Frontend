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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0a192f 0%, #1e293b 50%, #0f172a 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated background particles */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147,51,234,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(236,72,153,0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .navbar {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: rgba(10, 25, 47, 0.8);
          z-index: 1000;
        }

        .navbar-brand {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          font-size: 2rem !important;
          text-shadow: 0 2px 20px rgba(37,99,235,0.3);
        }

        .nav-link {
          position: relative;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #fff !important;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .page-header {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 4rem 2rem;
          margin: 3rem 2rem;
          text-align: center;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1));
          z-index: -1;
        }

        .page-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 30px rgba(255,255,255,0.3);
          margin-bottom: 1rem;
        }

        .page-header p {
          font-size: 1.3rem;
          color: #cbd5e1;
          font-weight: 400;
        }

        .cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 3rem;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .car-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          color: #1e293b;
          position: relative;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .car-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 25px 60px rgba(37,99,235,0.2);
        }

        .car-image-container {
          position: relative;
          height: 250px;
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
          top: 1.5rem;
          left: 1.5rem;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #fff;
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(37,99,235,0.3);
          z-index: 2;
        }
        .car-details {
          padding: 2rem 1.5rem 1.5rem 1.5rem;
        }
        .car-title {
          font-size: 1.6rem;
          margin: 0 0 0.8rem 0;
          color: #1e293b;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .car-title span {
          color: #2563eb;
          font-weight: 500;
        }
        .car-description {
          color: #475569;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-weight: 400;
        }
        .car-features {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          color: #64748b;
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
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 8px 25px rgba(37,99,235,0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .rent-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .rent-button:hover::before {
          left: 100%;
        }

        .rent-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px rgba(37,99,235,0.4);
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
          border-radius: 20px !important;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.6rem 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-danger::before, .btn-success::before, .btn-warning::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn-danger:hover::before, .btn-success:hover::before, .btn-warning:hover::before {
          left: 100%;
        }

        .btn-success {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          box-shadow: 0 4px 15px rgba(34,197,94,0.3);
        }

        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(34,197,94,0.4);
        }

        .btn-warning {
          background: linear-gradient(135deg, #facc15, #eab308);
          border: none;
          color: #1e293b;
          box-shadow: 0 4px 15px rgba(250,204,21,0.3);
        }

        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(250,204,21,0.4);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          box-shadow: 0 4px 15px rgba(239,68,68,0.3);
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239,68,68,0.4);
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
              <Nav.Link as={NavLink} to="/comments">Comments</Nav.Link>
              <Button as={Link} to="/login" variant="outline-light" className="ms-3 px-4">Login</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ paddingTop: '90px', minHeight: '80vh' }}>
        {/* Page Header */}
        <div className="page-header">
          <h1>Our Car Collection</h1>
          <p>Explore our premium selection of vehicles for your perfect ride</p>
          {isAdmin && (
            <div className="mt-4">
              <Button 
                as={Link} 
                to="/addcar" 
                className="btn-success me-3"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Car
              </Button>
              <Button 
                as={Link} 
                to="/admin/manage-cars" 
                className="btn-warning"
              >
                <i className="bi bi-gear me-2"></i>
                Manage Cars
              </Button>
            </div>
          )}
        </div>
        
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