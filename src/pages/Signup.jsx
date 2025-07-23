import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'client',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('phone', formData.phone);
      data.append('role', formData.role);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await axios.post('http://localhost:3000/register', data);
      setSuccess(res.data.message);
      const user = {
        name: formData.username,
        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(formData.username) + "&background=2563eb&color=fff&size=64"
      };
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #0a192f 0%, #1e293b 100%)' }}>
      <style>{`
        .signup-card {
          border-radius: 18px;
          background: linear-gradient(120deg, #1e293b 80%, #2563eb 100%);
          color: #fff;
          box-shadow: 0 8px 32px rgba(30,64,175,0.18);
          border: none;
        }
        .signup-card .form-control {
          border-radius: 12px;
          background: rgba(30,64,175,0.08);
          color: #fff;
          border: 1px solid #2563eb;
        }
        .signup-card .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.25);
          background: rgba(30,64,175,0.18);
          color: #fff;
        }
        .signup-btn {
          border-radius: 30px;
          font-size: 1.1rem;
          padding: 0.75rem 2.5rem;
          box-shadow: 0 2px 8px rgba(59,130,246,0.12);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .signup-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 24px rgba(59,130,246,0.18);
        }
        .signup-link {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={5}>
            <Card className="signup-card p-4">
              <Card.Body>
                <h2 className="text-center fw-bold mb-4">Create Your Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="text-light">Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="text-light">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="text-light">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label className="text-light">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter phone number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formImage">
                    <Form.Label className="text-light">Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {preview && (
                    <div className="text-center mb-3">
                      <img src={preview} alt="Preview"  style={{ maxHeight: '150px' }} />
                    </div>
                  )}

                  <div className="d-grid mb-3">
                    <Button type="submit" variant="primary" className="signup-btn" disabled={loading}>
                      {loading ? 'Registering...' : 'Sign Up'}
                    </Button>
                  </div>
                </Form>
                <div className="text-center mt-3">
                  <span className="text-light">Already have an account? </span>
                  <Link to="/login" className="signup-link">Login</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}