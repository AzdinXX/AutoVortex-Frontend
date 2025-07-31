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
          const response = await axios.get('http://localhost:3000/api/offers');
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
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  
  .home-page {
    font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #0a192f 0%, #1e293b 50%, #0f172a 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Animated background particles */
  .home-page::before {
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

  .navbar.scrolled {
    background: rgba(10, 25, 47, 0.95) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(59,130,246,0.2);
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

  .hero-section {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(135deg, rgba(10, 25, 47, 0.9), rgba(30, 41, 59, 0.8)),
      url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    z-index: -1;
  }

  .hero-section::after {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 30% 20%, rgba(59,130,246,0.2) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(147,51,234,0.15) 0%, transparent 50%);
    z-index: 0;
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }

  .hero-section .container {
    position: relative;
    z-index: 1;
  }

  .hero-section h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff, #e0e7ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 30px rgba(255,255,255,0.3);
    animation: slideInUp 1s ease-out;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    word-wrap: break-word;
    hyphens: auto;
  }

  .hero-section p {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: 400;
    color: #cbd5e1;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    animation: slideInUp 1s ease-out 0.2s both;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto 2rem;
    padding: 0 1rem;
    word-wrap: break-word;
    hyphens: auto;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .btn-primary, .btn-outline-light {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    font-weight: 600;
    border-radius: 50px;
    padding: clamp(12px, 2.5vw, 15px) clamp(25px, 4vw, 40px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-decoration: none;
    cursor: pointer;
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    border: none;
    box-shadow: 0 8px 25px rgba(37,99,235,0.3);
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .btn-primary:hover::before {
    left: 100%;
  }

  .btn-primary:hover, .btn-outline-light:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 35px rgba(37,99,235,0.4);
  }

  .btn-outline-light {
    border: 2px solid rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
  }

  .btn-outline-light:hover {
    background: rgba(255,255,255,0.2);
    border-color: #ffffff;
  }

  .hero-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .hero-buttons {
      flex-direction: column;
      gap: 1rem;
    }
    
    .hero-buttons .btn {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 480px) {
    .hero-section h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .hero-section p {
      font-size: 1rem;
      margin-bottom: 1.5rem;
      padding: 0 0.5rem;
    }
    
    .hero-buttons {
      margin-top: 1.5rem;
    }
    
    .btn-primary, .btn-outline-light {
      font-size: 0.9rem;
      padding: 12px 20px;
      min-height: 44px;
    }
  }

  .offer-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .offer-card:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 25px 60px rgba(37,99,235,0.2);
  }

  .offer-image {
    position: relative;
    overflow: hidden;
  }

  .offer-image::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(37,99,235,0.3), rgba(124,58,237,0.3));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .offer-card:hover .offer-image::before {
    opacity: 1;
  }

  .discount-badge {
    position: absolute;
    top: 20px;
    left: 0;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white;
    font-weight: 700;
    padding: 10px 25px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(220,38,38,0.3);
    z-index: 2;
    animation: slideInLeft 0.6s ease-out;
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .car-type-badge {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    font-weight: 600;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(37,99,235,0.2);
  }

  .price-section {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 15px;
    padding: 15px 20px;
    border: 1px solid rgba(37,99,235,0.1);
  }

  .original-price {
    color: #64748b;
    font-weight: 500;
    text-decoration: line-through;
  }

  .discounted-price {
    color: #2563eb;
    font-weight: 700;
    font-size: 1.3rem;
  }

  .rent-btn {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    border: none;
    border-radius: 25px;
    font-weight: 600;
    padding: 15px 0;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .rent-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .rent-btn:hover::before {
    left: 100%;
  }

  .rent-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(37,99,235,0.3);
  }

  .testimonial-carousel .carousel-control-prev,
  .testimonial-carousel .carousel-control-next {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 4px 15px rgba(37,99,235,0.3);
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.3s ease;
  }

  .testimonial-carousel .carousel-control-prev:hover,
  .testimonial-carousel .carousel-control-next:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 25px rgba(37,99,235,0.4);
  }

  .testimonial-carousel .carousel-control-prev {
    left: -60px;
  }

  .testimonial-carousel .carousel-control-next {
    right: -60px;
  }

  .testimonial-card {
    background: linear-gradient(135deg, #1e293b, #334155);
    border-radius: 25px;
    color: white;
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(20px);
  }

  .feature-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 10px 30px rgba(37,99,235,0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .feature-icon::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s;
  }

  .feature-icon:hover::before {
    transform: translateX(100%);
  }

  .feature-icon:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 40px rgba(37,99,235,0.4);
  }

  .feature-icon i {
    font-size: 2.5rem;
    color: white;
  }

  .feature-text {
    background: rgba(37,99,235,0.1);
    border-radius: 20px;
    padding: 20px;
    border: 1px solid rgba(37,99,235,0.2);
    backdrop-filter: blur(10px);
  }

  footer {
    background: linear-gradient(135deg, rgba(10, 25, 47, 0.95), rgba(30, 41, 59, 0.9));
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(59,130,246,0.2);
    box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
  }

  footer h5 {
    color: #2563eb;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 20px;
  }

  footer ul li {
    margin-bottom: 10px;
  }

  footer ul li a {
    color: #cbd5e1;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
  }

  footer ul li a::before {
    content: '→';
    position: absolute;
    left: -20px;
    opacity: 0;
    transition: all 0.3s ease;
    color: #2563eb;
  }

  footer ul li a:hover {
    color: #2563eb;
    padding-left: 20px;
  }

  footer ul li a:hover::before {
    opacity: 1;
  }

  footer ul li i {
    color: #2563eb;
    margin-right: 10px;
  }

  .nav-bell {
    position: relative;
    font-size: 1.7rem;
    color: #fff;
    margin-right: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .nav-bell:hover {
    transform: scale(1.1);
    color: #2563eb;
  }

  .nav-bell .notif-count {
    position: absolute;
    top: -8px;
    right: -12px;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: #fff;
    border-radius: 50%;
    font-size: 0.8rem;
    padding: 4px 8px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(220,38,38,0.4);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  /* Scroll animations */
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Floating animation for cards */
  .floating {
    animation: floating 3s ease-in-out infinite;
  }

  @keyframes floating {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  /* Glow effect for important elements */
  .glow {
    box-shadow: 0 0 20px rgba(37,99,235,0.3);
  }

  .glow:hover {
    box-shadow: 0 0 30px rgba(37,99,235,0.5);
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
      <section className="hero-section">
        <Container className="text-center">
          <div className="hero-content">
            <h1 className="hero-title mb-4">Rent the Best Cars</h1>
            <p className="hero-subtitle mb-5">Premium vehicles at affordable prices with exclusive discounts</p>
            <div className="hero-buttons">
              <Button as={Link} to="/auto_options" variant="primary" size="lg" className="glow">
                <i className="bi bi-car-front" aria-hidden="true"></i>
                <span>Browse Cars</span>
              </Button>
              <Button as={Link} to="/offers" variant="outline-light" size="lg">
                <i className="bi bi-tag" aria-hidden="true"></i>
                <span>View Offers</span>
              </Button>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="floating-elements">
            <div className="floating-card" style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))',
              borderRadius: '50%',
              animation: 'floating 4s ease-in-out infinite',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}></div>
            <div className="floating-card" style={{
              position: 'absolute',
              top: '60%',
              right: '15%',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(147,51,234,0.2))',
              borderRadius: '50%',
              animation: 'floating 3s ease-in-out infinite reverse',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}></div>
            <div className="floating-card" style={{
              position: 'absolute',
              bottom: '30%',
              left: '20%',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))',
              borderRadius: '20px',
              animation: 'floating 5s ease-in-out infinite',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}></div>
          </div>
        </Container>
      </section>
      <section className="py-5 offers-section" style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #2563eb 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <div className="section-bg-elements">
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 3s ease-in-out infinite reverse'
          }}></div>
        </div>
        
        <Container className="my-5">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bold" style={{ 
              color: '#fff', 
              letterSpacing: '3px', 
              textShadow: '0 4px 20px rgba(37,99,235,0.3)',
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              Latest Special Offers
            </h2>
            <div className="title-underline" style={{
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
              margin: '0 auto',
              borderRadius: '2px',
              boxShadow: '0 2px 10px rgba(37,99,235,0.3)'
            }}></div>
          </div>
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
      <section className="py-5 testimonials-section" style={{ 
        backgroundColor: '#0f172a',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(37,99,235,0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(124,58,237,0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}></div>
        
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bold" style={{ 
              color: '#fff', 
              letterSpacing: '3px', 
              textShadow: '0 4px 20px rgba(37,99,235,0.3)',
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              Customer Reviews
            </h2>
            <div className="title-underline" style={{
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
              margin: '0 auto',
              borderRadius: '2px',
              boxShadow: '0 2px 10px rgba(37,99,235,0.3)'
            }}></div>
          </div>
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
      <section className="py-5 features-section" style={{ 
        backgroundColor: '#0a192f',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div className="features-bg">
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>
        </div>
        
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="section-title fw-bold" style={{
              color: '#fff',
              letterSpacing: '3px',
              textShadow: '0 4px 20px rgba(37,99,235,0.3)',
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              Why Choose Us?
            </h2>
            <div className="title-underline" style={{
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
              margin: '0 auto',
              borderRadius: '2px',
              boxShadow: '0 2px 10px rgba(37,99,235,0.3)'
            }}></div>
          </div>
          <Row>
                        <Col md={4} className="text-center mb-4">
              <div className="feature-icon">
                <i className="bi bi-car-front"></i>
              </div>
              <h3 className="text-white fw-bold" style={{ fontSize: '1.8rem', letterSpacing: '1px', marginBottom: '1rem' }}>
                Wide Selection
              </h3>
              <div className="feature-text">
                <p className="text-light mb-0">
                  Choose from our diverse fleet of vehicles to suit your needs.
                </p>
              </div>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="feature-icon">
                <i className="bi bi-currency-dollar"></i>
              </div>
              <h3 className="text-white fw-bold" style={{ fontSize: '1.8rem', letterSpacing: '1px', marginBottom: '1rem' }}>
                Affordable Prices
              </h3>
              <div className="feature-text">
                <p className="text-light mb-0">
                  Competitive rates with no hidden fees.
                </p>
              </div>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="feature-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <h3 className="text-white fw-bold" style={{ fontSize: '1.8rem', letterSpacing: '1px', marginBottom: '1rem' }}>
                Easy Booking
              </h3>
              <div className="feature-text">
                <p className="text-light mb-0">
                  Simple online reservation system.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <footer className="py-5" style={{
        background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.95), rgba(30, 41, 59, 0.9))',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(59,130,246,0.2)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Footer background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(37,99,235,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(124,58,237,0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}></div>
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