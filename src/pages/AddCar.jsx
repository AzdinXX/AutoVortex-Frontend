import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Alert, Image } from 'react-bootstrap';
import { Upload, Eye, X } from 'lucide-react';

function AddCar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price_per_day: '',
    description: '',
    available: true,
    created_at: new Date().toISOString().slice(0, 10)
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await axios.post('http://localhost:3000/new-cars', data);
      setSuccess(res.data.message || 'Car added successfully!');
      
      // Reset form after successful submission
      setFormData({
        brand: '',
        model: '',
        year: '',
        price_per_day: '',
        description: '',
        available: true,
        created_at: new Date().toISOString().slice(0, 10)
      });
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add car');
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
        .addcar-card {
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          box-shadow: 0 12px 40px rgba(30,64,175,0.22);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(8px);
        }
        .addcar-card .form-control {
          border-radius: 14px;
          background: rgba(30,64,175,0.12);
          color: #fff;
          border: 1px solid #2563eb;
        }
        .addcar-card .form-control:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.25);
          background: rgba(30,64,175,0.18);
          color: #fff;
        }
        .addcar-card .form-label {
          color: #94a3b8;
          font-weight: 500;
        }
        .addcar-btn {
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
        .addcar-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 24px rgba(59,130,246,0.38);
          background: linear-gradient(90deg, #3b82f6 0%, #1e40af 70%);
        }
        .addcar-icon-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 60%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px auto;
          box-shadow: 0 4px 12px rgba(59,130,246,0.28);
        }
        .image-upload-area {
          border: 2px dashed #60a5fa;
          border-radius: 14px;
          padding: 2rem;
          text-align: center;
          background: rgba(30,64,175,0.08);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        .image-upload-area:hover {
          border-color: #3b82f6;
          background: rgba(30,64,175,0.12);
        }
        .image-upload-area input[type="file"] {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .image-preview {
          position: relative;
          margin-top: 1rem;
        }
        .image-preview img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
          border: 2px solid #60a5fa;
        }
        .remove-image-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(220, 38, 38, 0.9);
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .remove-image-btn:hover {
          background: rgba(220, 38, 38, 1);
          transform: scale(1.1);
        }
        .form-check-input:checked {
          background-color: #60a5fa;
          border-color: #60a5fa;
        }
        .form-check-label {
          color: #94a3b8;
        }
      `}</style>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="addcar-card p-4" style={{ width: '600px' }}>
          <Card.Body>
            <div className="text-center mb-4">
              <div className="addcar-icon-circle">
                <i className="bi bi-car-front" style={{ fontSize: 38, color: '#fff' }}></i>
              </div>
              <h3 className="fw-bold mb-2" style={{ color: '#60a5fa', letterSpacing: '1px' }}>Add a New Car</h3>
              <p className="text-light" style={{ fontSize: '1.1rem', opacity: 0.8 }}>Fill in the details below to add a car to the fleet.</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="brand">
                <Form.Label>Brand</Form.Label>
                <Form.Control 
                  type="text" 
                  name="brand" 
                  value={formData.brand}
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="model">
                <Form.Label>Model</Form.Label>
                <Form.Control 
                  type="text" 
                  name="model" 
                  value={formData.model}
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="year">
                <Form.Label>Year</Form.Label>
                <Form.Control 
                  type="number" 
                  name="year" 
                  value={formData.year}
                  onChange={handleChange} 
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="price_per_day">
                <Form.Label>Price per Day ($)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="price_per_day" 
                  value={formData.price_per_day}
                  onChange={handleChange} 
                  min="0"
                  step="0.01"
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Car Image</Form.Label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                  />
                  <div>
                    <Upload size={48} color="#60a5fa" className="mb-3" />
                    <p className="mb-2" style={{ color: '#60a5fa', fontWeight: '600' }}>
                      Click to upload car image
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                </div>
                
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Car preview" />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={removeImage}
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="available">
                <Form.Check
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  label="Available for rent"
                  className="form-check-lg"
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="addcar-btn w-100">
                Add Car
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AddCar;