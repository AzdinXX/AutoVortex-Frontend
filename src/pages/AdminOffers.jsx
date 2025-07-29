import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import { Tag, Plus, Edit, Trash2, Calendar, DollarSign, Star } from 'lucide-react';

function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for offers since we removed the backend offers functionality
  const mockOffers = [
    {
      id: 1,
      title: "Summer Special",
      description: "Get 20% off on all luxury cars this summer",
      discount_percentage: 20,
      original_price: 100,
      discounted_price: 80,
      valid_until: "2024-08-31",
      car_type: "Luxury",
      image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
      features: ["Free GPS", "Unlimited Mileage", "24/7 Support"],
      rating: 4.8,
      review_count: 156,
      is_active: true
    },
    {
      id: 2,
      title: "Weekend Warrior",
      description: "Special weekend rates for economy cars",
      discount_percentage: 15,
      original_price: 60,
      discounted_price: 51,
      valid_until: "2024-07-31",
      car_type: "Economy",
      image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
      features: ["Fuel Efficient", "Easy Parking", "Low Cost"],
      rating: 4.5,
      review_count: 89,
      is_active: true
    },
    {
      id: 3,
      title: "Business Traveler",
      description: "Premium service for business travelers",
      discount_percentage: 25,
      original_price: 120,
      discounted_price: 90,
      valid_until: "2024-09-30",
      car_type: "Premium",
      image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop",
      features: ["Business Class", "Priority Booking", "Concierge Service"],
      rating: 4.9,
      review_count: 234,
      is_active: true
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setOffers(mockOffers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== offerId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .admin-offers-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        .offers-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: none;
        }
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        .page-subtitle {
          color: #64748b;
          font-size: 1.1rem;
        }
        .add-offer-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          border-radius: 12px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .add-offer-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        .offer-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: none;
        }
        .offer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        .offer-image {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .discount-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(45deg, #dc3545, #c82333);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
        }
        .car-type-badge {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .price-section {
          background: linear-gradient(45deg, #f8f9fa, #e9ecef);
          padding: 1rem;
          border-radius: 10px;
          margin: 1rem 0;
        }
        .original-price {
          text-decoration: line-through;
          color: #6c757d;
          font-size: 0.9rem;
        }
        .discounted-price {
          color: #dc3545;
          font-size: 1.2rem;
          font-weight: bold;
          margin-left: 0.5rem;
        }
        .rating-badge {
          background: #ffc107;
          color: #212529;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .valid-until {
          color: #6c757d;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .offer-features {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }
        .offer-features li {
          padding: 0.25rem 0;
          color: #495057;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .action-btn {
          margin: 0 0.25rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          transform: scale(1.05);
        }
      `}</style>

      <div className="admin-offers-page">
        <Container>
          <div className="page-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="page-title">Manage Offers</h1>
                <p className="page-subtitle">Create and manage promotional offers</p>
              </div>
              <Button className="add-offer-btn">
                <Plus size={20} className="me-2" />
                Add New Offer
              </Button>
            </div>
          </div>

          <Card className="offers-card">
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                  {error}
                </Alert>
              )}

              <Row className="g-4">
                {offers.map((offer) => (
                  <Col key={offer.id} lg={4} md={6}>
                    <Card className="offer-card">
                      <div 
                        className="offer-image"
                        style={{ backgroundImage: `url(${offer.image_url})` }}
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

                        <div className="price-section">
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
                          {offer.features.map((feature, index) => (
                            <li key={index}>
                              <Tag size={14} className="me-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            {offer.is_active ? (
                              <Badge bg="success">Active</Badge>
                            ) : (
                              <Badge bg="secondary">Inactive</Badge>
                            )}
                          </div>
                          <div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="action-btn"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="action-btn"
                              onClick={() => handleDelete(offer.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {offers.length === 0 && (
                <div className="text-center py-5">
                  <Tag size={64} color="#cbd5e1" className="mb-3" />
                  <h4 className="text-muted">No offers found</h4>
                  <p className="text-muted">Create your first offer to get started</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default AdminOffers; 