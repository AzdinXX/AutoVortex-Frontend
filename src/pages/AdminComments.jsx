import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { MessageSquare, Eye, Trash2, User, Calendar, Star } from 'lucide-react';
import axios from 'axios';

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  // Mock data for comments since we don't have a comments backend
  const mockComments = [
    {
      id: 1,
      user_name: "John Doe",
      user_email: "john@example.com",
      car_brand: "Toyota",
      car_model: "Camry",
      rating: 5,
      comment: "Excellent service! The car was in perfect condition and the rental process was smooth. Highly recommend!",
      created_at: "2024-01-15T10:30:00Z",
      status: "approved"
    },
    {
      id: 2,
      user_name: "Sarah Smith",
      user_email: "sarah@example.com",
      car_brand: "BMW",
      car_model: "X5",
      rating: 4,
      comment: "Great experience overall. The car was clean and well-maintained. Only minor issue was the GPS navigation.",
      created_at: "2024-01-14T15:45:00Z",
      status: "pending"
    },
    {
      id: 3,
      user_name: "Mike Johnson",
      user_email: "mike@example.com",
      car_brand: "Mercedes",
      car_model: "C-Class",
      rating: 5,
      comment: "Outstanding service! The staff was very professional and the car exceeded my expectations. Will definitely use again.",
      created_at: "2024-01-13T09:20:00Z",
      status: "approved"
    },
    {
      id: 4,
      user_name: "Emily Brown",
      user_email: "emily@example.com",
      car_brand: "Honda",
      car_model: "Civic",
      rating: 3,
      comment: "The car was okay but there were some scratches that weren't mentioned. Service was average.",
      created_at: "2024-01-12T14:15:00Z",
      status: "rejected"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleView = (comment) => {
    setSelectedComment(comment);
    setShowViewModal(true);
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
      setSuccess('Comment deleted successfully!');
    }
  };

  const handleStatusChange = (commentId, newStatus) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, status: newStatus } : comment
    ));
    setSuccess(`Comment ${newStatus} successfully!`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        color={i < rating ? "#ffd700" : "#e2e8f0"}
        fill={i < rating ? "#ffd700" : "none"}
      />
    ));
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
        .admin-comments-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        .comments-card {
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
        .comments-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .comments-table th {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          font-weight: 600;
          padding: 1rem;
        }
        .comments-table td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #e2e8f0;
        }
        .action-btn {
          margin: 0 0.25rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          transform: scale(1.05);
        }
        .comment-preview {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        .comment-detail {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 1.5rem;
          margin: 1rem 0;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .rating-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="admin-comments-page">
        <Container>
          <div className="page-header">
            <h1 className="page-title">Manage Comments</h1>
            <p className="page-subtitle">Review and manage customer feedback</p>
          </div>

          <Card className="comments-card">
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

              <div className="comments-table">
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Car</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment) => (
                      <tr key={comment.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <User size={20} className="me-2" />
                            <div>
                              <div className="fw-bold">{comment.user_name}</div>
                              <small className="text-muted">{comment.user_email}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{comment.car_brand} {comment.car_model}</strong>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {getRatingStars(comment.rating)}
                            <span className="ms-2 fw-bold">{comment.rating}/5</span>
                          </div>
                        </td>
                        <td>
                          <div className="comment-preview" title={comment.comment}>
                            {comment.comment}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Calendar size={16} className="me-2" />
                            {formatDate(comment.created_at)}
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(comment.status)}
                        </td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="action-btn"
                            onClick={() => handleView(comment)}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="action-btn"
                            onClick={() => handleDelete(comment.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {comments.length === 0 && (
                <div className="text-center py-5">
                  <MessageSquare size={64} color="#cbd5e1" className="mb-3" />
                  <h4 className="text-muted">No comments found</h4>
                  <p className="text-muted">Customer comments will appear here</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>

        {/* View Comment Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Comment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedComment && (
              <div className="comment-detail">
                <div className="user-info">
                  <User size={24} />
                  <div>
                    <h6 className="mb-0">{selectedComment.user_name}</h6>
                    <small className="text-muted">{selectedComment.user_email}</small>
                  </div>
                </div>

                <div className="rating-display">
                  <span className="fw-bold me-2">Rating:</span>
                  {getRatingStars(selectedComment.rating)}
                  <span className="ms-2 fw-bold">{selectedComment.rating}/5</span>
                </div>

                <div className="mb-3">
                  <strong>Car:</strong> {selectedComment.car_brand} {selectedComment.car_model}
                </div>

                <div className="mb-3">
                  <strong>Date:</strong> {formatDate(selectedComment.created_at)}
                </div>

                <div className="mb-3">
                  <strong>Status:</strong> {getStatusBadge(selectedComment.status)}
                </div>

                <div>
                  <strong>Comment:</strong>
                  <p className="mt-2 mb-0">{selectedComment.comment}</p>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedComment && selectedComment.status === 'pending' && (
              <>
                <Button 
                  variant="success" 
                  onClick={() => {
                    handleStatusChange(selectedComment.id, 'approved');
                    setShowViewModal(false);
                  }}
                >
                  Approve
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {
                    handleStatusChange(selectedComment.id, 'rejected');
                    setShowViewModal(false);
                  }}
                >
                  Reject
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default AdminComments; 