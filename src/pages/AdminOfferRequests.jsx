import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

function AdminOfferRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOfferRequests();
  }, []);

  const fetchOfferRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'admin') {
        setError('Admin access required');
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/offer-requests', {
        params: { admin_id: user.id }
      });
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch offer requests');
      console.error('Error fetching offer requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setUpdating(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'admin') {
        alert('Admin access required');
        return;
      }
      
      await axios.put(`http://localhost:3000/api/offer-requests/${requestId}/status`, 
        { status: newStatus, admin_id: user.id }
      );
      
      // Update the local state
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus }
          : request
      ));
      
      alert(`Request ${newStatus} successfully!`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update request status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" className="d-flex align-items-center gap-1">
          <Clock size={14} />
          Pending
        </Badge>;
      case 'approved':
        return <Badge bg="success" className="d-flex align-items-center gap-1">
          <CheckCircle size={14} />
          Approved
        </Badge>;
      case 'rejected':
        return <Badge bg="danger" className="d-flex align-items-center gap-1">
          <XCircle size={14} />
          Rejected
        </Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-white text-center">
          <div className="spinner-border" role="status"></div>
          <p className="mt-3">Loading offer requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .admin-offer-requests {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        .requests-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          text-align: center;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .requests-table {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        .action-btn {
          border-radius: 20px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          margin: 0 0.25rem;
        }
        .details-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          color: white;
        }
        .details-btn:hover {
          background: linear-gradient(45deg, #5a67d8, #6b46c1);
          transform: translateY(-2px);
        }
        .approve-btn {
          background: linear-gradient(45deg, #48bb78, #38a169);
          border: none;
          color: white;
        }
        .approve-btn:hover {
          background: linear-gradient(45deg, #38a169, #2f855a);
          transform: translateY(-2px);
        }
        .reject-btn {
          background: linear-gradient(45deg, #f56565, #e53e3e);
          border: none;
          color: white;
        }
        .reject-btn:hover {
          background: linear-gradient(45deg, #e53e3e, #c53030);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="admin-offer-requests">
        <Container>
          <div className="requests-header">
            <h1 className="display-5 fw-bold mb-3">Offer Rent Requests</h1>
            <p className="lead mb-0">
              Manage and review customer requests for special offers
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="requests-table">
            <Table responsive hover className="mb-0">
              <thead style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white' }}>
                <tr>
                  <th>User</th>
                  <th>Offer</th>
                  <th>Car Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div>
                        <strong>{request.user_name}</strong>
                        <br />
                        <small className="text-muted">{request.user_email}</small>
                      </div>
                    </td>
                    <td>
                      <strong>{request.offer_title}</strong>
                    </td>
                    <td>
                      <Badge bg="info">{request.car_type}</Badge>
                    </td>
                    <td>
                      <div>
                        <small><strong>From:</strong> {formatDate(request.start_date)}</small>
                        <br />
                        <small><strong>To:</strong> {formatDate(request.end_date)}</small>
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(request.status)}
                    </td>
                    <td>
                      <small>{formatDate(request.created_at)}</small>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          className="details-btn action-btn"
                          onClick={() => showRequestDetails(request)}
                          disabled={updating}
                        >
                          <Eye size={14} />
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="approve-btn action-btn"
                              onClick={() => handleStatusUpdate(request.id, 'approved')}
                              disabled={updating}
                            >
                              <CheckCircle size={14} />
                            </Button>
                            <Button
                              size="sm"
                              className="reject-btn action-btn"
                              onClick={() => handleStatusUpdate(request.id, 'rejected')}
                              disabled={updating}
                            >
                              <XCircle size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {requests.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No offer requests found</p>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Request Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white' }}>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6>User Information</h6>
                  <p><strong>Name:</strong> {selectedRequest.user_name}</p>
                  <p><strong>Email:</strong> {selectedRequest.user_email}</p>
                </div>
                <div className="col-md-6">
                  <h6>Offer Information</h6>
                  <p><strong>Title:</strong> {selectedRequest.offer_title}</p>
                  <p><strong>Car Type:</strong> {selectedRequest.car_type}</p>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6>Rental Period</h6>
                  <p><strong>Start Date:</strong> {formatDate(selectedRequest.start_date)}</p>
                  <p><strong>End Date:</strong> {formatDate(selectedRequest.end_date)}</p>
                </div>
                <div className="col-md-6">
                  <h6>Request Information</h6>
                  <p><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
                  <p><strong>Created:</strong> {formatDate(selectedRequest.created_at)}</p>
                </div>
              </div>
              
              {selectedRequest.message && (
                <div className="mb-3">
                  <h6>Additional Message</h6>
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '1rem', 
                    borderRadius: '10px',
                    border: '1px solid #dee2e6'
                  }}>
                    {selectedRequest.message}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminOfferRequests; 