import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { Car, Edit, Trash2, Plus, Eye, CheckCircle, XCircle, Upload, X } from 'lucide-react';
import axios from 'axios';

function AdminManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/options');
      setCars(response.data);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setEditFormData({
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || '',
      price_per_day: car.price_per_day || '',
      description: car.description || '',
      available: car.available !== false
    });
    
    // Set current image
    if (car.image) {
      setCurrentImage(`http://localhost:3000/uploads/${car.image}`);
      setImagePreview(`http://localhost:3000/uploads/${car.image}`);
    } else {
      setCurrentImage('');
      setImagePreview('');
    }
    setImageFile(null);
    setShowEditModal(true);
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`http://localhost:3000/car/${carId}`);
        setSuccess('Car deleted successfully!');
        fetchCars();
      } catch (err) {
        console.error('Error deleting car:', err);
        setError('Failed to delete car');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(editFormData).forEach(key => {
        data.append(key, editFormData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      await axios.put(`http://localhost:3000/car/${editingCar.id}`, data);
      setSuccess('Car updated successfully!');
      setShowEditModal(false);
      setImageFile(null);
      setImagePreview('');
      setCurrentImage('');
      fetchCars();
    } catch (err) {
      console.error('Error updating car:', err);
      setError('Failed to update car');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    });
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
    setImagePreview(currentImage || '');
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
        .admin-manage-cars-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        .manage-cars-card {
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
        .car-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .car-table th {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          font-weight: 600;
          padding: 1rem;
        }
        .car-table td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #e2e8f0;
        }
        .car-image {
          width: 60px;
          height: 40px;
          object-fit: cover;
          border-radius: 6px;
        }
        .action-btn {
          margin: 0 0.25rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          transform: scale(1.05);
        }
        .status-badge {
          font-size: 0.8rem;
          padding: 0.5rem 0.75rem;
        }
        .modal-content {
          border-radius: 15px;
          border: none;
        }
        .modal-header {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border-radius: 15px 15px 0 0;
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
          margin-bottom: 1rem;
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
      `}</style>

      <div className="admin-manage-cars-page">
        <Container>
          <div className="page-header">
            <h1 className="page-title">Manage Cars</h1>
            <p className="page-subtitle">View and manage your fleet of vehicles</p>
          </div>

          <Card className="manage-cars-card">
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

              <div className="car-table">
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Brand</th>
                      <th>Model</th>
                      <th>Year</th>
                      <th>Price/Day</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.id}>
                        <td>
                          {car.image ? (
                            <img
                              src={`http://localhost:3000/uploads/${car.image}`}
                              alt={`${car.brand} ${car.model}`}
                              className="car-image"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=60&h=40&fit=crop';
                              }}
                            />
                          ) : (
                            <div className="car-image bg-secondary d-flex align-items-center justify-content-center">
                              <Car size={20} color="white" />
                            </div>
                          )}
                        </td>
                        <td>
                          <strong>{car.brand}</strong>
                        </td>
                        <td>{car.model}</td>
                        <td>{car.year}</td>
                        <td>
                          <strong className="text-success">${car.price_per_day}</strong>
                        </td>
                        <td>
                          {car.available ? (
                            <Badge bg="success" className="status-badge">
                              <CheckCircle size={12} className="me-1" />
                              Available
                            </Badge>
                          ) : (
                            <Badge bg="danger" className="status-badge">
                              <XCircle size={12} className="me-1" />
                              Unavailable
                            </Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="action-btn"
                            onClick={() => handleEdit(car)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="action-btn"
                            onClick={() => handleDelete(car.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {cars.length === 0 && (
                <div className="text-center py-5">
                  <Car size={64} color="#cbd5e1" className="mb-3" />
                  <h4 className="text-muted">No cars found</h4>
                  <p className="text-muted">Add your first car to get started</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Car</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      value={editFormData.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      type="text"
                      name="model"
                      value={editFormData.model}
                      onChange={handleInputChange}
                      required
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
                      value={editFormData.year}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price per Day ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="price_per_day"
                      value={editFormData.price_per_day}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
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
                  value={editFormData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Car Image</Form.Label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload-edit"
                  />
                  <div>
                    <Upload size={48} color="#60a5fa" className="mb-3" />
                    <p className="mb-2">Click to upload new car image</p>
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
                      title="Remove new image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="available"
                  checked={editFormData.available}
                  onChange={handleInputChange}
                  label="Available for rent"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default AdminManageCars; 