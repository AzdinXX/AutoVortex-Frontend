import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Plus, Upload, X } from 'lucide-react';
import axios from 'axios';

function AdminAddCar() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price_per_day: '',
    description: '',
    available: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
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
      
      // Reset form
      setFormData({
        brand: '',
        model: '',
        year: '',
        price_per_day: '',
        description: '',
        available: true
      });
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      console.error('Error adding car:', err);
      setError(err.response?.data?.message || 'Error adding car');
    }
  };

  return (
    <>
      <style>{`
        .admin-add-car-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        .add-car-card {
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
        .image-upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .image-upload-area:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        .image-upload-area input[type="file"] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .image-preview {
          position: relative;
          display: inline-block;
          margin-top: 1rem;
        }
        .image-preview img {
          max-width: 200px;
          max-height: 150px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .remove-image-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .remove-image-btn:hover {
          background: #c82333;
          transform: scale(1.1);
        }
        .submit-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          border-radius: 12px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
      `}</style>

      <div className="admin-add-car-page">
        <Container>
          <div className="page-header">
            <h1 className="page-title">Add New Car</h1>
            <p className="page-subtitle">Add a new vehicle to your fleet</p>
          </div>

          <Card className="add-car-card">
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Brand</Form.Label>
                      <Form.Control
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Toyota, BMW, Mercedes"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Model</Form.Label>
                      <Form.Control
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Camry, X5, C-Class"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        placeholder="e.g., 2023"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price per Day ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price_per_day"
                        value={formData.price_per_day}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="e.g., 50.00"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the car features, condition, etc."
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
                      <p className="mb-2">Click to upload car image</p>
                      <p className="mb-0">PNG, JPG, JPEG up to 5MB</p>
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

                <div className="text-center">
                  <Button type="submit" className="submit-btn" size="lg">
                    <Plus size={20} className="me-2" />
                    Add Car
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default AdminAddCar; 