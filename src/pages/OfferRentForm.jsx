import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

function OfferRentForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState('');
  const { offerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setUserId(user.id);
    } else {
      navigate('/login');
      return;
    }

    if (offerId) {
      fetchOfferDetails();
    }
  }, [offerId, navigate]);

  const fetchOfferDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/offers/${offerId}`);
      setOffer(response.data);
    } catch (err) {
      setError('Failed to fetch offer details');
      console.error('Error fetching offer:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!userId) {
      setError("Please log in to rent an offer.");
      setLoading(false);
      return;
    }

    if (!offerId) {
      setError("Missing offer information.");
      setLoading(false);
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select start and end dates.");
      setLoading(false);
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date must be after start date.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/offer-requests', {
        user_id: userId,
        offer_id: offerId,
        start_date: startDate,
        end_date: endDate,
        message: message || '',
      });
      
      alert('Offer rent request sent successfully! Admin will review your request.');
      navigate('/offers');
    } catch (err) {
      console.error('Offer rent request error:', err);
      if (err.response?.status === 401) {
        setError('Please log in to rent an offer.');
      } else {
        setError(err.response?.data?.error || 'Error sending the request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    const days = calculateDays();
    return offer ? (days * offer.discounted_price) : 0;
  };

  if (!offer) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #2563eb 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-white text-center">
          <div className="spinner-border" role="status"></div>
          <p className="mt-3">Loading offer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #2563eb 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      padding: '2rem 0'
    }}>
      <style>{`
        .offer-rent-card {
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          box-shadow: 0 12px 40px rgba(30,64,175,0.22);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(8px);
        }
        .offer-rent-card .form-control {
          border-radius: 14px;
          background: rgba(30,64,175,0.12);
          color: #fff;
          border: 1px solid #2563eb;
        }
        .offer-rent-card .form-control:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.25);
          background: rgba(30,64,175,0.18);
          color: #fff;
        }
        .offer-rent-card .form-label {
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
        .offer-details {
          background: rgba(30,64,175,0.15);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .price-calculation {
          background: rgba(34, 197, 94, 0.15);
          border-radius: 15px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
      `}</style>
      
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="offer-rent-card p-4" style={{ width: '700px' }}>
          <Card.Body>
            <h2 className="text-center fw-bold mb-4" style={{ color: '#60a5fa' }}>
              Rent Offer: {offer.title}
            </h2>

            <div className="offer-details">
              <h5 className="mb-3" style={{ color: '#60a5fa' }}>Offer Details</h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Car Type:</strong> {offer.car_type}</p>
                  <p><strong>Original Price:</strong> ${offer.original_price}/day</p>
                  <p><strong>Discounted Price:</strong> ${offer.discounted_price}/day</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Discount:</strong> {offer.discount_percentage}% OFF</p>
                  <p><strong>Rating:</strong> {offer.rating}/5</p>
                  <p><strong>Valid Until:</strong> {new Date(offer.valid_until).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="mt-2"><strong>Description:</strong> {offer.description}</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

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

              {startDate && endDate && (
                <div className="price-calculation">
                  <h6 className="mb-2" style={{ color: '#22c55e' }}>Price Calculation</h6>
                  <p className="mb-1"><strong>Duration:</strong> {calculateDays()} days</p>
                  <p className="mb-1"><strong>Price per day:</strong> ${offer.discounted_price}</p>
                  <p className="mb-0"><strong>Total Price:</strong> ${calculateTotalPrice()}</p>
                </div>
              )}

              <div className="d-flex gap-3">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="rent-btn flex-grow-1" 
                  disabled={loading}
                >
                  {loading ? 'Sending Request...' : 'Send Rent Request'}
                </Button>
                <Button 
                  variant="outline-light" 
                  onClick={() => navigate('/offers')}
                  style={{ borderRadius: '30px', padding: '0.75rem 2rem' }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default OfferRentForm; 