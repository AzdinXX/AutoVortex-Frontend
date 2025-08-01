import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Card, Alert, Image } from 'react-bootstrap';
import { Upload, X } from 'lucide-react';

function EditCar() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price_per_day: '',
    description: '',
    available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/car/${id}`)
      .then(res => {
        setFormData({
          brand: res.data.brand || '',
          model: res.data.model || '',
          year: res.data.year || '',
          price_per_day: res.data.price_per_day || '',
          description: res.data.description || '',
          available: res.data.available !== false,
        });
        if (res.data.image) {
          setCurrentImage(`http://localhost:3000/uploads/${res.data.image}`);
          setImagePreview(`http://localhost:3000/uploads/${res.data.image}`);
        }
      })
      .catch(err => {
        setError('Failed to load car data');
      });
  }, [id]);

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
    setImagePreview(currentImage || '');
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

      const res = await axios.put(`http://localhost:3000/car/${id}`, data);
      setSuccess(res.data.message || 'Car updated successfully!');
      
      // Update current image if a new one was uploaded
      if (imageFile) {
        setCurrentImage(imagePreview);
      }
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
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          box-shadow: 0 12px 40px rgba(30,64,175,0.22);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(8px);
        }
        .editcar-card .form-control {
          border-radius: 14px;
          background: rgba(30,64,175,0.12);
          color: #fff;
          border: 1px solid #2563eb;
        }
        .editcar-card .form-control:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.25);
          background: rgba(30,64,175,0.18);
          color: #fff;
        }
        .editcar-card .form-label {
          color: #94a3b8;
          font-weight: 500;
        }
        .editcar-btn {
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
        .editcar-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 24px rgba(59,130,246,0.38);
          background: linear-gradient(90deg, #3b82f6 0%, #1e40af 70%);
        }
        .editcar-icon-circle {
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
                <Form.Control 
                  name="brand" 
                  value={formData.brand} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Model</Form.Label>
                <Form.Control 
                  name="model" 
                  value={formData.model} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
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

              <Form.Group className="mb-3">
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

              <Form.Group className="mb-3">
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
                      Click to upload new car image
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
                      title="Remove new image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={3}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  label="Available for rent"
                  className="form-check-lg"
                />
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