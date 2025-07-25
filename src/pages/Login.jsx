import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #0a192f 0%, #1e293b 100%)' }}>
      <style>{`
        .login-card {
          border-radius: 18px;
          background: linear-gradient(120deg, #1e293b 80%, #2563eb 100%);
          color: #fff;
          box-shadow: 0 8px 32px rgba(30,64,175,0.18);
          border: none;
        }
        .login-card .form-control {
          border-radius: 12px;
          background: rgba(30,64,175,0.08);
          color: #fff;
          border: 1px solid #2563eb;
        }
        .login-card .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.25);
          background: rgba(30,64,175,0.18);
          color: #fff;
        }
        .login-btn {
          border-radius: 30px;
          font-size: 1.1rem;
          padding: 0.75rem 2.5rem;
          box-shadow: 0 2px 8px rgba(59,130,246,0.12);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .login-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 24px rgba(59,130,246,0.18);
        }
        .login-link {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={5}>
            <Card className="login-card p-4">
              <Card.Body>
                <h2 className="text-center fw-bold mb-4">Login to LuxDrive</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="text-light">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label className="text-light">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-grid mb-3">
                    <Button type="submit" variant="primary" className="login-btn">
                      Login
                    </Button>
                  </div>
                </Form>
                <div className="text-center mt-3">
                  <span className="text-light">Don't have an account? </span>
                  <Link to="/Signup" className="login-link">Register</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}