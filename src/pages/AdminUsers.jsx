import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Badge } from 'react-bootstrap';
import { useAdmin } from '../context/AdminContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
          }
        });
        
        if (response.ok) {
          fetchUsers();
        } else {
          setError('Failed to delete user');
        }
      } catch (err) {
        setError('Network error');
      }
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
        },
        body: JSON.stringify({ 
          isActive: !currentStatus 
        })
      });
      
      if (response.ok) {
        fetchUsers();
      } else {
        setError('Failed to update user status');
      }
    } catch (err) {
      setError('Network error');
    }
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
          <h2>Manage Users</h2>
          <p className="text-muted">View and manage all registered users on the platform</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name}
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%',
                          objectFit: 'cover' 
                        }}
                      />
                    ) : (
                      <div 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%',
                          backgroundColor: '#6c757d',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px'
                        }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge 
                      bg={user.role === 'admin' ? 'danger' : 'primary'}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge 
                      bg={user.isActive ? 'success' : 'secondary'}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Button 
                      variant={user.isActive ? "outline-warning" : "outline-success"}
                      size="sm" 
                      className="me-2"
                      onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.role === 'admin'}
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

      <Row className="mt-4">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h5>Statistics</h5>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-primary">{users.length}</h4>
                    <small>Total Users</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-success">
                      {users.filter(u => u.isActive).length}
                    </h4>
                    <small>Active Users</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-danger">
                      {users.filter(u => u.role === 'admin').length}
                    </h4>
                    <small>Admins</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-info">
                      {users.filter(u => u.role === 'user').length}
                    </h4>
                    <small>Regular Users</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 