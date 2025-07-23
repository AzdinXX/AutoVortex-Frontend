import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

function EditCar() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price_per_day: '',
    image: '',
    description: '',
    available: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/car/${id}`)
      .then(res => {
        setFormData(res.data);
      })
      .catch(err => {
        setError('Failed to load car data');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.put(`http://localhost:3000/car/${id}`, formData);
      setSuccess('Car updated successfully ');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update car');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Access Denied: Admins only </Alert>
      </Container>
    );
  }

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
        .editcar-card {
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06); /* Glassmorphism background */
          color: #fff;
          box-shadow: 0 12px 40px rgba(30,64,175,0.22);
          border: 1px solid rgba(59, 130, 246, 0.3); /* Subtle border */
          backdrop-filter: blur(8px); /* Glassmorphism blur */
        }
        .editcar-card .form-control {
          border-radius: 14px;
          background: rgba(30,64,175,0.12);
          color: #fff;
          border: 1px solid #2563eb;
        }
        .editcar-card .form-control:focus {
          border-color: #60a5fa; /* Lighter blue on focus */
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.25);
          background: rgba(30,64,175,0.18);
          color: #fff;
        }
        .editcar-card .form-label {
          color: #94a3b8; /* Light gray for labels */
          font-weight: 500;
        }
        .editcar-btn {
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
        .editcar-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 24px rgba(59,130,246,0.38); /* Stronger shadow on hover */
          background: linear-gradient(90deg, #3b82f6 0%, #1e40af 70%); /* Darker gradient on hover */
        }
        .editcar-icon-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 60%, #1e293b 100%); /* Lighter blue gradient */
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px auto;
          box-shadow: 0 4px 12px rgba(59,130,246,0.28); /* More pronounced shadow */
        }
      `}</style>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="editcar-card p-4" style={{ width: '600px' }}>
          <Card.Body>
            <div className="text-center mb-4">
              <div className="editcar-icon-circle">
                <i className="bi bi-pencil" style={{ fontSize: 38, color: '#fff' }}></i>
              </div>
              <h3 className="fw-bold mb-2" style={{ color: '#60a5fa', letterSpacing: '1px' }}>Edit Car</h3>
              <p className="text-light" style={{ fontSize: '1.1rem', opacity: 0.8 }}>Modify the car details below.</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control name="brand" value={formData.brand} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Model</Form.Label>
                <Form.Control name="model" value={formData.model} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Control type="number" name="year" value={formData.year} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price per Day</Form.Label>
                <Form.Control type="number" name="price_per_day" value={formData.price_per_day} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="url" name="image" value={formData.image} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
              </Form.Group>

              <Button type="submit" variant="primary" className="editcar-btn w-100">
                Update Car
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default EditCar;