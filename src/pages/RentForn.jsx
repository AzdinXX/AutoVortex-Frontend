import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap';

function RentForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [carDetails, setCarDetails] = useState(null);
  const [error, setError] = useState('');
  const { carId } = useParams();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/car/${carId}`);
      setCarDetails(response.data);
    } catch (err) {
      setError('Failed to load car details');
      console.error('Error fetching car details:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!userId) {
      alert("Please log in to rent a car.");
      setLoading(false);
      return;
    }

    if (!carId) {
      alert("Missing car information.");
      setLoading(false);
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      setLoading(false);
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      alert("Start date cannot be in the past.");
      setLoading(false);
      return;
    }

    if (end <= start) {
      alert("End date must be after start date.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/rentals', {
        user_id: userId,
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
        message: message || '',
      });
      
      alert('Rental request sent successfully!');
      setStartDate('');
      setEndDate('');
      setMessage('');
    } catch (err) {
      console.error('Rental request error:', err);
      if (err.response?.status === 401) {
        alert('Please log in to rent a car.');
      } else {
        alert('Error sending the request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    if (!carDetails || !startDate || !endDate) return 0;
    const days = calculateTotalDays();
    return days * carDetails.price_per_day;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #2563eb 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      padding: '20px 0'
    }}>
      <style>{`
        .rent-card {
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          box-shadow: 0 12px 40px rgba(30,64,175,0.22);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(8px);
        }
        .rent-card .form-control {
          border-radius: 14px;
          background: rgba(30,64,175,0.12);
          color: #fff;
          border: 1px solid #2563eb;
        }
        .rent-card .form-control:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.25);
          background: rgba(30,64,175,0.18);
          color: #fff;
        }
        .rent-card .form-label {
          color: #94a3b8;
          font-weight: 500;
        }
        .rent-btn {
          border-radius: 30px;
          font-size: 1.1rem;
          padding: 0.75rem 2.5rem;
          box-shadow: 0 4px 12px rgba(59,130,246,0.28);
          transition: transform 0.2s, box-shadow 0.2s;
          font-weight: bold;
          letter-spacing: 1px;
          background: linear-gradient(90deg, #60a5fa 0%, #2563eb 70%);
          border: none;
        }
        .rent-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 24px rgba(59,130,246,0.38);
          background: linear-gradient(90deg, #3b82f6 0%, #1e40af 70%);
        }
        .car-info-card {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 20px;
          margin-bottom: 20px;
        }
        .car-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 15px;
        }
        .price-highlight {
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 10px 20px;
          border-radius: 12px;
          text-align: center;
          margin-top: 15px;
        }
        .total-price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #10b981;
        }
      `}</style>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="rent-card p-4" style={{ width: '800px', maxWidth: '100%' }}>
          <Card.Body>
            <h2 className="text-center fw-bold mb-4" style={{ color: '#60a5fa' }}>Request a Car Rental</h2>
            
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            {carDetails && (
              <div className="car-info-card">
                <Row>
                  <Col md={4}>
                    <img
                      src={carDetails.image ? `http://localhost:3000/uploads/${carDetails.image}` : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop'}
                      alt={`${carDetails.brand} ${carDetails.model}`}
                      className="car-image"
                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop'}
                    />
                  </Col>
                  <Col md={8}>
                    <h4 style={{ color: '#60a5fa', marginBottom: '10px' }}>
                      {carDetails.brand} {carDetails.model}
                    </h4>
                    <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                      {carDetails.description}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                      <span style={{ color: '#94a3b8' }}>
                        <i className="fas fa-gas-pump me-2"></i>
                        {carDetails.fuel_type}
                      </span>
                      <span style={{ color: '#94a3b8' }}>
                        <i className="fas fa-cogs me-2"></i>
                        {carDetails.transmission}
                      </span>
                      <span style={{ color: '#94a3b8' }}>
                        <i className="fas fa-users me-2"></i>
                        {carDetails.seats} seats
                      </span>
                    </div>
                    <div className="price-highlight">
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Price per day</div>
                      <div className="total-price">${carDetails.price_per_day}</div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {startDate && endDate && carDetails && (
                <div className="price-highlight mb-3">
                  <Row>
                    <Col md={4}>
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Days</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#60a5fa' }}>
                        {calculateTotalDays()}
                      </div>
                    </Col>
                    <Col md={4}>
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Price per Day</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#60a5fa' }}>
                        ${carDetails.price_per_day}
                      </div>
                    </Col>
                    <Col md={4}>
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Price</div>
                      <div className="total-price">
                        ${calculateTotalPrice()}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Additional Message (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any special requests or additional information..."
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="rent-btn w-100" disabled={loading}>
                {loading ? 'Sending Request...' : 'Send Rental Request'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default RentForm;