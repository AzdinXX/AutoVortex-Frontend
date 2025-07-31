import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAsAdmin } = useAdmin();

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
      if (response.ok ) {
        if (data.user && data.user.role === 'admin') {
          loginAsAdmin(data);
          window.location.href = '/';
        } else {
          localStorage.setItem('user', JSON.stringify(data));
          window.location.href = '/';
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a192f 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background particles */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(147,51,234,0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(236,72,153,0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 20s ease-in-out infinite'
      }}></div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .login-page {
          font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-card {
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          color: #1e293b;
          box-shadow: 0 25px 60px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(37,99,235,0.05), rgba(124,58,237,0.05));
          z-index: -1;
        }

        .login-card h2 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 30px rgba(37,99,235,0.3);
        }

        .login-card .form-control {
          border-radius: 15px;
          background: rgba(248,250,252,0.8);
          color: #1e293b;
          border: 2px solid rgba(37,99,235,0.1);
          padding: 1rem 1.2rem;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .login-card .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 0.2rem rgba(37,99,235,0.15);
          background: rgba(255,255,255,0.95);
          color: #1e293b;
          transform: translateY(-2px);
        }

        .login-card .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .login-btn {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 1rem 2.5rem;
          box-shadow: 0 8px 25px rgba(37,99,235,0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .login-btn:hover::before {
          left: 100%;
        }

        .login-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px rgba(37,99,235,0.4);
        }

        .login-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .login-link:hover {
          color: #7c3aed;
          text-decoration: underline;
        }

        .signup-section {
          background: rgba(37,99,235,0.05);
          border-radius: 15px;
          padding: 1.5rem;
          margin-top: 2rem;
          border: 1px solid rgba(37,99,235,0.1);
        }

        .signup-section p {
          color: #64748b;
          font-weight: 500;
        }

        /* Floating animation for decorative elements */
        .floating {
          animation: floating 3s ease-in-out infinite;
        }

        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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