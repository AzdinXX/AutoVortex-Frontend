import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Clock, Star, Tag, Calendar, MapPin, Plus } from 'lucide-react';
import axios from 'axios';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:3000/offers');
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
      alert("Please log in to rent a car.");
      return;
    }
    alert(`Redirecting to rent ${offer.car_type} car with ${offer.discount_percentage}% discount!`);
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
        .offers-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        .offers-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 3rem 2rem;
          margin-bottom: 3rem;
          text-align: center;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .offer-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
          border: none;
        }
        .offer-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        .offer-image {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .discount-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        .price-section {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 1rem;
          text-align: center;
        }
        .original-price {
          text-decoration: line-through;
          opacity: 0.7;
          font-size: 0.9rem;
        }
        .discounted-price {
          font-size: 1.5rem;
          font-weight: bold;
          margin-left: 10px;
        }
        .offer-features {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }
        .offer-features li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
          color: #666;
        }
        .offer-features li:last-child {
          border-bottom: none;
        }
        .rent-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          border-radius: 25px;
          padding: 0.75rem 2rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .rent-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        .rating-badge {
          background: #ffd700;
          color: #333;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .valid-until {
          color: #666;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .car-type-badge {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
        }
      `}</style>

      <div className="offers-page">
        <Container>
          <div className="offers-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-4 fw-bold mb-3">Special Offers & Deals</h1>
                <p className="lead mb-0">
                  Discover amazing discounts and exclusive deals on car rentals
                </p>
              </div>
              {user?.role === 'admin' && (
                <Button 
                  as={Link} 
                  to="/admin/offers" 
                  className="add-offer-btn"
                  style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '0.75rem 2rem',
                    color: 'white',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
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
                      className="rent-btn w-100"
                      onClick={() => handleRentNow(offer)}
                    >
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