import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Edit, Upload, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminEditOffer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    original_price: '',
    discounted_price: '',
    valid_until: '',
    car_type: '',
    features: [''],
    rating: '0.00',
    review_count: '0'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carTypes = [
    'Economy', 'Compact', 'Sedan', 'SUV', 'Luxury', 'Sports', 
    'Van', 'Truck', 'Electric', 'Hybrid', 'Business', 'Family'
  ];

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const fetchOffer = async () => {
    try {
      setFetching(true);
      const response = await axios.get(`http://localhost:3000/api/offers/${id}`);
      const offer = response.data;
      
      setFormData({
        title: offer.title || '',
        description: offer.description || '',
        discount_percentage: offer.discount_percentage || '',
        original_price: offer.original_price || '',
        discounted_price: offer.discounted_price || '',
        valid_until: offer.valid_until ? offer.valid_until.split('T')[0] : '',
        car_type: offer.car_type || '',
        features: offer.features ? (typeof offer.features === 'string' ? JSON.parse(offer.features) : offer.features) : [''],
        rating: offer.rating || '0.00',
        review_count: offer.review_count || '0'
      });

      if (offer.image_url) {
        setCurrentImageUrl(offer.image_url);
        setImagePreview(getImageUrl(offer.image_url));
      }
    } catch (err) {
      setError('Failed to fetch offer details');
      console.error('Error fetching offer:', err);
    } finally {
      setFetching(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3000/uploads/${imageUrl}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateDiscountedPrice = () => {
    const original = parseFloat(formData.original_price);
    const discount = parseFloat(formData.discount_percentage);
    if (original && discount) {
      const discounted = original * (1 - discount / 100);
      setFormData(prev => ({
        ...prev,
        discounted_price: discounted.toFixed(2)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          formDataToSend.append(key, JSON.stringify(formData[key].filter(f => f.trim() !== '')));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add current image URL if no new image is selected
      if (!image && currentImageUrl) {
        formDataToSend.append('image_url', currentImageUrl);
      }

      // Add new image if selected
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await axios.put(`http://localhost:3000/api/offers/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Offer updated successfully!');
      setTimeout(() => {
        navigate('/admin/offers');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update offer');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
        .admin-edit-offer-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        .edit-offer-card {
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
        .form-control, .form-select {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }
        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .image-preview {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px dashed #cbd5e1;
        }
        .feature-input-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .btn-primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          border-radius: 12px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        .btn-secondary {
          background: #64748b;
          border: none;
          border-radius: 12px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: #475569;
          transform: translateY(-2px);
        }
        .price-calculator {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="admin-edit-offer-page">
        <Container>
          <div className="page-header">
            <h1 className="page-title">Edit Offer</h1>
            <p className="page-subtitle">Update offer information and details</p>
          </div>

          <Card className="edit-offer-card">
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
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Offer Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Weekend Special, Student Discount"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the offer details..."
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Car Type *</Form.Label>
                          <Form.Select
                            name="car_type"
                            value={formData.car_type}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select car type</option>
                            {carTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Valid Until *</Form.Label>
                          <Form.Control
                            type="date"
                            name="valid_until"
                            value={formData.valid_until}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="price-calculator">
                      <h6 className="mb-3">Pricing Information</h6>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Original Price ($/day) *</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="original_price"
                              value={formData.original_price}
                              onChange={handleInputChange}
                              onBlur={calculateDiscountedPrice}
                              placeholder="0.00"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Discount Percentage (%) *</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="discount_percentage"
                              value={formData.discount_percentage}
                              onChange={handleInputChange}
                              onBlur={calculateDiscountedPrice}
                              placeholder="0.00"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Discounted Price ($/day) *</Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name="discounted_price"
                              value={formData.discounted_price}
                              onChange={handleInputChange}
                              placeholder="0.00"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>Features</Form.Label>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="feature-input-group">
                          <Form.Control
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder={`Feature ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            disabled={formData.features.length === 1}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline-primary"
                        size="sm"
                        onClick={addFeature}
                        className="mt-2"
                      >
                        Add Feature
                      </Button>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            name="rating"
                            value={formData.rating}
                            onChange={handleInputChange}
                            placeholder="0.00"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Review Count</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            name="review_count"
                            value={formData.review_count}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Offer Image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mb-2"
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="image-preview"
                        />
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-3 justify-content-end mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/admin/offers')}
                  >
                    <ArrowLeft size={16} className="me-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit size={16} className="me-2" />
                        Update Offer
                      </>
                    )}
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

export default AdminEditOffer; 