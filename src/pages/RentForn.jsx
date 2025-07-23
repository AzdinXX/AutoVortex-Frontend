import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';

function RentForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const { carId } = useParams();

  useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserId(user.id);
        }
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !carId) {
      alert("Missing user or car ID.");
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/rentals', {
        user_id: userId,
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
        message,
      });
      alert('You sent the request successfully!');
    } catch (err) {
      console.error(err);
      alert('Error sending the request');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #2563eb 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <style>{`
        .rent-card {
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06); /* Glassmorphism background */
          color: #fff;
          box-shadow: 0 12px 40px rgba(30,64,175,0.22);
          border: 1px solid rgba(59, 130, 246, 0.3); /* Subtle border */
          backdrop-filter: blur(8px); /* Glassmorphism blur */
        }
        .rent-card .form-control {
          border-radius: 14px;
          background: rgba(30,64,175,0.12);
          color: #fff;
          border: 1px solid #2563eb;
        }
        .rent-card .form-control:focus {
          border-color: #60a5fa; /* Lighter blue on focus */
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.25);
          background: rgba(30,64,175,0.18);
          color: #fff;
        }
        .rent-card .form-label {
          color: #94a3b8; /* Light gray for labels */
          font-weight: 500;
        }
        .rent-btn {
          border-radius: 30px;
          font-size: 1.1rem;
          padding: 0.75rem 2.5rem;
          box-shadow: 0 4px 12px rgba(59,130,246,0.28); /* More pronounced shadow */
          transition: transform 0.2s, box-shadow 0.2s;
          font-weight: bold;
          letter-spacing: 1px;
          background: linear-gradient(90deg, #60a5fa 0%, #2563eb 70%); /* Gradient button */
          border: none;
        }
        .rent-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 24px rgba(59,130,246,0.38); /* Stronger shadow on hover */
          background: linear-gradient(90deg, #3b82f6 0%, #1e40af 70%); /* Darker gradient on hover */
        }
      `}</style>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="rent-card p-4" style={{ width: '600px' }}>
          <Card.Body>
            <h2 className="text-center fw-bold mb-4" style={{ color: '#60a5fa' }}>Request a Car</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Date To Start</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date To End</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Message:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="rent-btn w-100">
                Send Request
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default RentForm;