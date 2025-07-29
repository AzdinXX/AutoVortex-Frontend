import { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Navbar, Nav, Card, Carousel, Dropdown, Image, Badge } from 'react-bootstrap';
import { Star, Tag, Calendar } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell } from 'lucide-react';


export default function Home() {
  const [activeKey, setActiveKey] = useState('home');
  const [user, setUser] = useState(null);
const [notificationCount, setNotificationCount] = useState(0);
const [testimonials, setTestimonials] = useState([]);

const [offers, setOffers] = useState([]);

useEffect(() => {
  fetchLatestOffers();
}, []);

const fetchLatestOffers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/offers');
    const sortedOffers = response.data.sort((a, b) => b.id - a.id); 
    const latestThree = sortedOffers.slice(0, 3);
    setOffers(latestThree);
  } catch (err) {
    console.error('Failed to fetch latest offers', err);
  }
};

const parseFeatures = (features) => {
  try {
    return typeof features === 'string' ? JSON.parse(features) : features;
  } catch {
    return [];
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop';
  }
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `http://localhost:3000/uploads/${imageUrl}`;
};

useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/comments');
      setTestimonials(res.data);
    } catch (error) {
      console.error('Failed to fetch testimonials', error);
    }
  };

  fetchTestimonials();
}, []);
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    if (storedUser) {
      const url = storedUser.role === "admin"
        ? "http://localhost:3000/api/notifications/unread"
        : `http://localhost:3000/api/notifications/user/${storedUser.id}/unread`;
      fetch(url)
        .then(res => res.json())
       .then(data => setNotifCount(Array.isArray(data) ? data.length : 0))
        .catch(() => setNotifCount(0));
    }
  }, []);
useEffect(() => {
  const fetchNotifications = async () => {
    if (user && user.id) {
      try {
        const res = await axios.get(`http://localhost:3000/api/notifications/user/${user.id}/unread`);
        setNotificationCount(res.data.unreadCount);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    }
  };

  fetchNotifications();
  const interval = setInterval(fetchNotifications, 10000);
  return () => clearInterval(interval);
}, [user]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return; 

    if (user.role === "admin") {
      fetchNotifCountAdmin();
    } else if (user.id) {
      fetchNotifCountUser(user.id);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const fetchNotifCountAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/notifications/unread");
      setNotifCount(res.data.count || 0);
    } catch (err) {
      setNotifCount(0);
    }
  };

  const fetchNotifCountUser = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/notifications/user/${userId}/unread`);
      setNotifCount(res.data.count || 0);
    } catch (err) {
      setNotifCount(0);
    }
  };
  

  const discountedCars = [
    {
      id: 1,
      model: "BMW X5",
      price: "$99/day",
      discount: "30% OFF",
      description: "Luxury SUV with premium features",
      image: "bmw-x5"
    },
    {
      id: 2,
      model: "Mercedes C-Class",
      price: "$89/day",
      discount: "25% OFF",
      description: "Elegant sedan for business trips",
      image: "mercedes-c-class"
    },
    {
      id: 3,
      model: "Audi Q7",
      price: "$109/day",
      discount: "20% OFF",
      description: "Spacious family SUV",
      image: "audi-q7"
    },
    {
      id: 4,
      model: "Toyota Camry",
      price: "$69/day",
      discount: "15% OFF",
      description: "Reliable and fuel-efficient",
      image: "toyota-camry"
    }
  ];


  return (
    <div className="home-page" style={{ position: 'relative' }}>
      <style>{`
  .home-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(120deg, #0a192f 0%, #1e293b 100%);
    min-height: 100vh;
  }

  .navbar {
    transition: background-color 0.3s ease;
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .navbar.scrolled {
    background-color: rgba(10, 25, 47, 0.95) !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .hero-section {
    position: relative;
    overflow: hidden;
  }
  .hero-section::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 70% 30%, rgba(59,130,246,0.15) 0%, transparent 70%);
    z-index: 0;
  }
  .hero-section .container {
    position: relative;
    z-index: 1;
  }
  .hero-section h1, .hero-section p {
    text-shadow: 0 2px 16px rgba(0,0,0,0.3);
  }
  .btn-primary, .btn-outline-light {
    font-size: 1.1rem;
    border-radius: 30px;
    box-shadow: 0 2px 8px rgba(59,130,246,0.12);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-primary:hover, .btn-outline-light:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 6px 24px rgba(59,130,246,0.18);
  }

  .discount-card {
    transition: transform 0.3s ease, box-shadow 0.3s;
    background: linear-gradient(135deg, #1e293b 60%, #2563eb 100%);
    border-radius: 18px;
    overflow: hidden;
    color: white;
    box-shadow: 0 4px 24px rgba(30,64,175,0.08);
  }
  .discount-card:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 12px 32px rgba(30,64,175,0.18);
  }
  .discount-badge {
    z-index: 1;
    border-bottom-right-radius: 12px;
    font-size: 1rem;
    letter-spacing: 1px;
    box-shadow: 0 2px 8px rgba(220,38,38,0.12);
  }
  .car-image-placeholder {
    height: 180px;
    background: linear-gradient(45deg, #1e3a8a 60%, #0c4a6e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    font-size: 1.3rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .testimonial-carousel .carousel-control-prev,
  .testimonial-carousel .carousel-control-next {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(30, 64, 175, 0.7);
    top: 50%;
    transform: translateY(-50%);
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(30,64,175,0.12);
  }
  .testimonial-carousel .carousel-control-prev {
    left: -50px;
  }
  .testimonial-carousel .carousel-control-next {
    right: -50px;
  }
  .testimonial-carousel .card {
    border-radius: 18px;
    background: linear-gradient(120deg, #1e293b 80%, #2563eb 100%);
    color: #fff;
    box-shadow: 0 4px 24px rgba(30,64,175,0.08);
  }

  .icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(30, 64, 175, 0.18);
    border: 2px solid rgba(59, 130, 246, 0.5);
    box-shadow: 0 2px 8px rgba(59,130,246,0.12);
    transition: background 0.3s;
  }
  .icon-circle:hover {
    background: rgba(59,130,246,0.28);
  }

  footer {
    background: rgba(10, 25, 47, 0.92);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.05);
    box-shadow: 0 -2px 16px rgba(30,64,175,0.08);
  }
  footer h5 {
    letter-spacing: 1px;
    font-weight: 600;
  }
  footer ul li a:hover {
    color: #2563eb !important;
    text-decoration: underline;
  }
  footer ul li i {
    color: #2563eb;
  }
  footer p {
    font-size: 1rem;
    letter-spacing: 0.5px;
  }
  .nav-bell {
    position: relative;
    font-size: 1.7rem;
    color: #fff;
    margin-right: 18px;
    cursor: pointer;
  }
  .nav-bell .notif-count {
    position: absolute;
    top: -6px;
    right: -10px;
    background: #dc2626;
    color: #fff;
    border-radius: 50%;
    font-size: 0.85rem;
    padding: 2px 7px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(220,38,38,0.18);
  }
`}</style>
      <Navbar bg="transparent" expand="lg" fixed="top" className="py-3">
        <Container>
          <Navbar.Brand href="#home" className="text-white fw-bold fs-3">AutoVortex</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" activeKey={activeKey} onSelect={setActiveKey}>
              <NavLink to="/" className="nav-link text-white mx-2">Home</NavLink>
              <Nav.Link to="/auto_options" eventKey="cars" className="text-white mx-2">Cars</Nav.Link>
              <Nav.Link to="/offers" className="text-white mx-2">Offers</Nav.Link>
              <NavLink to="/about" className="nav-link text-white mx-2">About</NavLink>
              <NavLink to="/comments" className="nav-link text-white mx-2">Comments</NavLink>
              {!user && (
                <Button as={Link} to="/login" variant="outline-light" className="ms-3 px-4 d-lg-none">Login</Button>
              )}
            </Nav>
            {user && (
              <Nav className="ms-2 align-items-center">
                <NavLink
                  to={user.role === "admin" ? "/notifications" : "/notifications-user"}
                  className="nav-bell nav-link d-flex align-items-center position-relative"
                  title="Notifications"
                  style={{ padding: 0, marginRight: '18px' }}
                >
                  <Bell size={28} color="#fff" />
                  {(notifCount > 0 || notificationCount > 0) && (
                    <span className="notif-count" style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-10px',
                      background: '#dc2626',
                      color: '#fff',
                      borderRadius: '50%',
                      fontSize: '0.85rem',
                      padding: '2px 7px',
                      fontWeight: 'bold',
                      zIndex: 2
                    }}>
                      {notificationCount > 0 ? notificationCount : notifCount}
                    </span>
                  )}
                </NavLink>
              </Nav>
            )}
            <Dropdown align="end" className="ms-3">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                className="p-0 border-0 bg-transparent"
                style={{ boxShadow: 'none' }}
              >
                <Image
                  src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff&size=64"}
                  roundedCircle
                  width={40}
                  height={40}
                  alt="User Avatar"
                  style={{ border: '2px solid #2563eb', background: '#fff' }}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {user ? (
                  <>
                    <Dropdown.Header>{user.username}</Dropdown.Header>
                    <Dropdown.Item as={Link} to="/useraccount">Edit Account of </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/Signup">Create Account</Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <section className="hero-section" style={{
        backgroundImage: `linear-gradient(rgba(0, 15, 40, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
        <Container className="text-center">
          <h1 className="display-2 fw-bold mb-4">Rent the Best Cars</h1>
          <p className="lead fs-4 mb-5">Premium vehicles at affordable prices with exclusive discounts</p>
          <div className="mt-4">
            <Button as={Link} to="/auto_options" variant="primary" size="lg" className="me-3 px-5 py-3">
              Browse Cars
            </Button>
            <Button as={Link} to="/offers" variant="outline-light" size="lg" className="px-5 py-3">
              View Offers
            </Button>
          </div>
        </Container>
      </section>
      <section className="py-5" style={{ background: 'linear-gradient(120deg, #1e293b 60%, #2563eb 100%)' }}>
        <Container className="my-5">
          <h2 className="mb-4 text-center fw-bold" style={{ color: '#fff', letterSpacing: '2px', textShadow: '0 2px 12px rgba(30,64,175,0.25)' }}>
            Latest Special Offers
          </h2>
          <Row className="g-4">
            {offers.map((offer) => (
              <Col key={offer.id} lg={4} md={6}>
                <Card
                  className="offer-card border-0 shadow-lg"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #fff 70%, #e0e7ff 100%)',
                    boxShadow: '0 8px 32px rgba(30,64,175,0.13)'
                  }}
                >
                  <div
                    className="offer-image"
                    style={{
                      backgroundImage: `url(${getImageUrl(offer.image_url)})`,
                      height: '220px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                    <div
                      className="discount-badge"
                      style={{
                        position: 'absolute',
                        top: 18,
                        left: 0,
                        background: 'linear-gradient(90deg, #2563eb 60%, #1e293b 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        padding: '8px 22px 8px 18px',
                        borderTopRightRadius: '18px',
                        borderBottomRightRadius: '18px',
                        fontSize: '1.1rem',
                        boxShadow: '0 2px 12px rgba(37,99,235,0.13)',
                        letterSpacing: '1px'
                      }}
                    >
                      -{offer.discount_percentage}% OFF
                    </div>
                  </div>

                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title fw-bold mb-0" style={{ color: '#1e293b' }}>
                        {offer.title}
                      </h5>
                      <Badge
                        className="car-type-badge"
                        style={{
                          background: 'linear-gradient(90deg, #2563eb 60%, #1e293b 100%)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          borderRadius: '8px',
                          padding: '6px 16px'
                        }}
                      >
                        {offer.car_type}
                      </Badge>
                    </div>

                    <p className="card-text text-muted mb-3" style={{ minHeight: 48 }}>
                      {offer.description}
                    </p>

                    <div className="price-section rounded mb-3 d-flex align-items-center" style={{ background: '#f1f5f9', padding: '10px 18px' }}>
                      <span className="original-price text-decoration-line-through me-3" style={{ color: '#64748b', fontWeight: 500 }}>
                        ${offer.original_price}/day
                      </span>
                      <span className="discounted-price fw-bold" style={{ color: '#2563eb', fontSize: '1.2rem' }}>
                        ${offer.discounted_price}/day
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <Star size={16} color="#ffd700" fill="#ffd700" />
                        <span className="rating-badge" style={{ color: '#1e293b', fontWeight: 600 }}>
                          {offer.rating} ({offer.review_count})
                        </span>
                      </div>
                      <div className="valid-until" style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        <Calendar size={14} style={{ marginRight: 4 }} />
                        Valid until {formatDate(offer.valid_until)}
                      </div>
                    </div>

                    <ul className="offer-features mb-3" style={{ paddingLeft: 0, listStyle: 'none' }}>
                      {parseFeatures(offer.features).map((feature, index) => (
                        <li key={index} style={{ color: '#334155', fontSize: '0.97rem', marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                          <Tag size={14} className="me-2" style={{ color: '#2563eb' }} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="rent-btn w-100 mt-2"
                      style={{
                        background: 'linear-gradient(90deg, #2563eb 60%, #1e293b 100%)',
                        border: 'none',
                        borderRadius: '30px',
                        fontWeight: 600,
                        fontSize: '1.08rem',
                        padding: '12px 0',
                        boxShadow: '0 2px 12px rgba(37,99,235,0.13)'
                      }}
                      onClick={() => alert(`Redirecting to rent ${offer.car_type} car with ${offer.discount_percentage}% discount!`)}
                    >
                      Rent Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="py-5" style={{ backgroundColor: '#0f172a' }}>
        <Container className="py-5">
          <h2 className="text-center text-white mb-5">Customer Reviews</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <Carousel indicators={false} className="testimonial-carousel">
                {testimonials.map(testimonial => (
                  <Carousel.Item key={testimonial.id}>
                    <Card className="border-0 shadow p-4" style={{ backgroundColor: '#1e293b' }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-3">
                          <Card.Title className="text-white">{testimonial.name}</Card.Title>
                          <div className="text-warning">
                            {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                          </div>
                        </div>
                        <Card.Text className="text-light mb-4">
                          "{testimonial.comment}"
                        </Card.Text>
                        <div className="text-end text-muted">{testimonial.date}</div>
                      </Card.Body>
                    </Card>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5" style={{ backgroundColor: '#0a192f' }}>
        <Container className="py-5">
          <h2 className="text-center text-white mb-5" style={{
            letterSpacing: '2px',
            fontWeight: 700,
            textShadow: '0 2px 12px rgba(37,99,235,0.18)'
          }}>
            Why Choose Us?
          </h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div
                className="icon-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 60%, #1e293b 100%)',
                  boxShadow: '0 4px 24px rgba(37,99,235,0.13)',
                  width: 90,
                  height: 90
                }}
              >
                <i className="bi bi-car-front fs-1 text-white"></i>
              </div>
              <h3 className="text-white fw-bold" style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>Wide Selection</h3>
              <p className="text-light" style={{
                background: 'rgba(37,99,235,0.08)',
                borderRadius: '12px',
                padding: '12px 18px',
                marginTop: '10px'
              }}>
                Choose from our diverse fleet of vehicles to suit your needs.
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div
                className="icon-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #1e293b 60%, #2563eb 100%)',
                  boxShadow: '0 4px 24px rgba(37,99,235,0.13)',
                  width: 90,
                  height: 90
                }}
              >
                <i className="bi bi-currency-dollar fs-1 text-white"></i>
              </div>
              <h3 className="text-white fw-bold" style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>Affordable Prices</h3>
              <p className="text-light" style={{
                background: 'rgba(37,99,235,0.08)',
                borderRadius: '12px',
                padding: '12px 18px',
                marginTop: '10px'
              }}>
                Competitive rates with no hidden fees.
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div
                className="icon-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 60%, #1e293b 100%)',
                  boxShadow: '0 4px 24px rgba(37,99,235,0.13)',
                  width: 90,
                  height: 90
                }}
              >
                <i className="bi bi-calendar-check fs-1 text-white"></i>
              </div>
              <h3 className="text-white fw-bold" style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>Easy Booking</h3>
              <p className="text-light" style={{
                background: 'rgba(37,99,235,0.08)',
                borderRadius: '12px',
                padding: '12px 18px',
                marginTop: '10px'
              }}>
                Simple online reservation system.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <footer className="py-4" style={{
        backgroundColor: 'rgba(10, 25, 47, 0.85)',
        backdropFilter: 'blur(10px)'
      }}>
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="text-white">AutoVortex Rentals</h5>
              <p className="text-light mb-0">Premium car rental service offering luxury vehicles at competitive prices.</p>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="text-white">Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="#home" className="text-light text-decoration-none">Home</a></li>
                <li><a href="#cars" className="text-light text-decoration-none">Our Cars</a></li>
                <li><a href="#offers" className="text-light text-decoration-none">Special Offers</a></li>
                <li><a href="#contact" className="text-light text-decoration-none">Contact Us</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5 className="text-white">Contact Us</h5>
              <ul className="list-unstyled text-light">
                <li><i className="bi bi-geo-alt me-2"></i> 123 Car Street, Auto City</li>
                <li><i className="bi bi-telephone me-2"></i> +1 234 567 890</li>
                <li><i className="bi bi-envelope me-2"></i> info@luxdrive.com</li>
              </ul>
            </Col>
          </Row>
          <hr className="my-4 bg-light" />
          <p className="text-center text-light mb-0">&copy; {new Date().getFullYear()} AutoVortex Rentals. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}