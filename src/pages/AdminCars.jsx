import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useAdmin } from '../context/AdminContext';

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAdmin();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (isAdmin) {
      fetchCars();
    }
  }, [isAdmin]);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cars');
      const data = await response.json();
      if (response.ok) {
        setCars(data);
      } else {
        setError('Failed to fetch cars');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCar 
        ? `http://localhost:3000/api/cars/${editingCar._id}`
        : 'http://localhost:3000/api/cars';
      
      const method = editingCar ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingCar(null);
        resetForm();
        fetchCars();
      } else {
        setError('Failed to save car');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      description: car.description,
      image: car.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/cars/${carId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchCars();
        } else {
          setError('Failed to delete car');
        }
      } catch (err) {
        setError('Network error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: '',
      price: '',
      description: '',
      image: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isAdmin) {
    return <div className="text-center mt-5">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Manage Cars</h2>
          <Button 
            variant="primary" 
            onClick={() => {
              setEditingCar(null);
              resetForm();
              setShowModal(true);
            }}
          >
            Add New Car
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Image</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Year</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td>
                    {car.image && (
                      <img 
                        src={car.image} 
                        alt={`${car.brand} ${car.model}`}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    )}
                  </td>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>${car.price}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEdit(car)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(car._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
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
                    value={formData.model}
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
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price per Day</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
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
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingCar ? 'Update' : 'Add'} Car
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
} 