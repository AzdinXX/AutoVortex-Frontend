import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Star, Tag, Calendar, MapPin, Plus } from 'lucide-react';
import axios from 'axios';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:3000/api/offers');
      setOffers(response.data);
    } catch (err) {
      setError('Failed to fetch offers');
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRentNow = (offer) => {
    if (!user) {
      alert("Please log in to rent an offer.");
      navigate('/login');
      return;
    }
    
    // Navigate to the offer rent form
    navigate(`/offer-rent/${offer.id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const parseFeatures = (features) => {
    try {
      return typeof features === 'string' ? JSON.parse(features) : features;
    } catch {
      return [];
    }
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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-white text-center">
          <div className="spinner-border" role="status"></div>
          <p className="mt-3">Loading amazing offers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .offers-page {
          font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #0a192f 0%, #1e293b 50%, #0f172a 100%);
          padding: 2rem 0;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated background particles */
        .offers-page::before {
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

        .offers-header {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 4rem 2rem;
          margin-bottom: 3rem;
          text-align: center;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }

        .offers-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1));
          z-index: -1;
        }

        .offers-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 30px rgba(255,255,255,0.3);
          margin-bottom: 1rem;
        }

        .offers-header p {
          font-size: 1.3rem;
          color: #cbd5e1;
          font-weight: 400;
        }

        .offer-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
        }

        .offer-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 25px 60px rgba(37,99,235,0.2);
        }

        .offer-image {
          height: 220px;
          background-size: cover;
          background-position: center;
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
          right: 20px;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(220,38,38,0.3);
          z-index: 2;
          animation: slideInRight 0.6s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .price-section {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          padding: 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .price-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }

        .price-section:hover::before {
          left: 100%;
        }

        .original-price {
          text-decoration: line-through;
          opacity: 0.7;
          font-size: 1rem;
          font-weight: 500;
        }

        .discounted-price {
          font-size: 1.8rem;
          font-weight: 700;
          margin-left: 15px;
        }

        .offer-features {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }

        .offer-features li {
          padding: 0.75rem 0;
          border-bottom: 1px solid #f1f5f9;
          color: #475569;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .offer-features li:last-child {
          border-bottom: none;
        }

        .offer-features li::before {
          content: '✓';
          color: #2563eb;
          font-weight: bold;
          margin-right: 10px;
          font-size: 1.1rem;
        }

        .rent-btn {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none;
          border-radius: 25px;
          padding: 1rem 2rem;
          font-weight: 600;
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
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(37,99,235,0.3);
        }

        .rating-badge {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1f2937;
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(251,191,36,0.3);
        }

        .car-type-badge {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(37,99,235,0.2);
        }

        .valid-until {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .add-offer-btn {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none;
          border-radius: 25px;
          padding: 1rem 2rem;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .add-offer-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .add-offer-btn:hover::before {
          left: 100%;
        }

        .add-offer-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(37,99,235,0.3);
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

      <div className="offers-page">
        <Container>
          <div className="offers-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-3">Special Offers & Deals</h1>
                <p className="mb-0">
                  Discover amazing discounts and exclusive deals on car rentals
                </p>
              </div>
              {user?.role === 'admin' && (
                <Button 
                  as={Link} 
                  to="/admin/offers" 
                  className="add-offer-btn"
                >
                  <Plus size={20} className="me-2" />
                  Manage Offers
                </Button>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Row className="g-4">
            {offers.map((offer) => (
              <Col key={offer.id} lg={4} md={6}>
                <Card className="offer-card">
                  <div 
                    className="offer-image"
                    style={{ backgroundImage: `url(${getImageUrl(offer.image_url)})` }}
                  >
                    <div className="discount-badge">
                      -{offer.discount_percentage}% OFF
                    </div>
                  </div>

                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title fw-bold text-dark mb-0">
                        {offer.title}
                      </h5>
                      <Badge className="car-type-badge">
                        {offer.car_type}
                      </Badge>
                    </div>

                    <p className="card-text text-muted mb-3">
                      {offer.description}
                    </p>

                    <div className="price-section rounded mb-3">
                      <span className="original-price">
                        ${offer.original_price}/day
                      </span>
                      <span className="discounted-price">
                        ${offer.discounted_price}/day
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <Star size={16} color="#ffd700" fill="#ffd700" />
                        <span className="rating-badge">
                          {offer.rating} ({offer.review_count})
                        </span>
                      </div>
                      <div className="valid-until">
                        <Calendar size={14} />
                        Valid until {formatDate(offer.valid_until)}
                      </div>
                    </div>

                    <ul className="offer-features">
                      {parseFeatures(offer.features).map((feature, index) => (
                        <li key={index}>
                          <Tag size={14} className="me-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className="rent-btn w-100 glow"
                      onClick={() => handleRentNow(offer)}
                    >
                      <i className="bi bi-car-front me-2"></i>
                      Rent Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <div className="bg-white rounded-3 p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h4 className="text-dark mb-3">Don't see what you're looking for?</h4>
              <p className="text-muted mb-4">
                Contact our customer service team for personalized offers and special arrangements.
              </p>
              <Button 
                variant="outline-primary" 
                size="lg"
                className="rounded-pill"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Offers;