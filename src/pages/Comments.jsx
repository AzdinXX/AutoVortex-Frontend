import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StarRating({ value, onChange, readOnly = false }) {
  return (
    <span>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= value ? '#facc15' : '#64748b',
            fontSize: '1.3rem',
            marginRight: 2
          }}
          onClick={() => !readOnly && onChange(star)}
          data-testid={`star-${star}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function Comments() {
  const [comments, setComments]   = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating]       = useState(5);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const res = await axios.get('http://localhost:3000/api/comments');
    setComments(res.data);
  };

  const handleAddComment = async () => {
    if (!user) return;
    await axios.post('http://localhost:3000/api/comments', {
      user_id: user.id,
      comment: newComment,
      rating
    });
    setNewComment('');
    fetchComments();
  };

  const handleDeleteComment = async (id) => {
    await axios.delete(`http://localhost:3000/api/comments/${id}`);
    fetchComments();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #0a192f 0%, #1e293b 100%)', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', paddingTop: 40 }}>
      <style>{`
        .comments-glass-card {
          background: rgba(30, 41, 59, 0.85);
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(30,64,175,0.12);
          border: 1px solid rgba(59,130,246,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
          margin-bottom: 2rem;
        }
        .comments-glass-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 32px rgba(30,64,175,0.18);
        }
        .comments-form-card {
          background: rgba(30, 41, 59, 0.92);
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(59,130,246,0.10);
          border: 1px solid rgba(59,130,246,0.10);
          padding: 2rem 2.5rem;
          margin-bottom: 2.5rem;
        }
        .comments-form-card textarea, .comments-form-card input {
          border-radius: 12px;
          background: rgba(59,130,246,0.10);
          color: #fff;
          border: 1.5px solid #2563eb;
          margin-bottom: 0.7rem;
        }
        .comments-form-card textarea:focus, .comments-form-card input:focus {
          border-color: #60a5fa;
          background: rgba(59,130,246,0.16);
          color: #fff;
        }
        .comments-form-card button {
          background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-weight: bold;
          font-size: 1.08rem;
          padding: 8px 28px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .comments-form-card button:hover {
          background: linear-gradient(90deg, #1e40af 60%, #2563eb 100%);
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 18px rgba(59,130,246,0.18);
        }
        .comments-title {
          color: #fff;
          font-size: 2.2rem;
          font-weight: bold;
          margin-bottom: 2.2rem;
          letter-spacing: 1.5px;
          text-align: center;
        }
        .comments-card-title {
          color: #60a5fa;
          font-size: 1.3rem;
          font-weight: bold;
        }
        .comments-card-rating {
          color: #facc15;
          font-size: 1.1rem;
          font-weight: 500;
        }
        .comments-card-text {
          color: #fff;
          font-size: 1.08rem;
        }
        .comments-delete-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.98rem;
          padding: 6px 18px;
          margin-top: 8px;
          transition: background 0.2s, transform 0.2s;
        }
        .comments-delete-btn:hover {
          background: #991b1b;
          transform: translateY(-1px) scale(1.04);
        }
        .comments-login-prompt {
          color: #cbd5e1;
          text-align: center;
          margin-bottom: 2.5rem;
          font-size: 1.15rem;
        }
        .comments-login-btn {
          background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-weight: bold;
          font-size: 1.08rem;
          padding: 8px 28px;
          margin: 0 8px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .comments-login-btn:hover {
          background: linear-gradient(90deg, #1e40af 60%, #2563eb 100%);
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 18px rgba(59,130,246,0.18);
        }
      `}</style>
      <div className="container py-5">
        <div className="comments-title">User Comments</div>

        {!user && (
          <div className="comments-login-prompt">
            You must be logged in to add or delete comments.<br />
            <a href="/login"><button className="comments-login-btn">Login</button></a>
            <a href="/Signup"><button className="comments-login-btn">Sign Up</button></a>
          </div>
        )}

        {user && (
          <div className="comments-form-card mb-4">
            <textarea
              className="form-control mb-2"
              placeholder="Write your comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={3}
              maxLength={300}
              required
            />
            <div className="mb-2">
              <label style={{ color: '#a5b4fc', fontWeight: 500, marginRight: 8 }}>Your Rating:</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <button className="btn btn-primary" onClick={handleAddComment} disabled={!newComment.trim()}>
              Add Comment
            </button>
          </div>
        )}

        {comments.map(c => (
          <div key={c.id} className="comments-glass-card card mb-3">
            <div className="card-body">
              <h5 className="comments-card-title">{c.username}</h5>
              <div className="comments-card-rating mb-2">
                <StarRating value={c.rating} readOnly />
              </div>
              <p className="comments-card-text">{c.comment}</p>
              {user && (user.id === c.user_id || user.role === 'admin') && (
                <button
                  className="comments-delete-btn btn btn-danger btn-sm"
                  onClick={() => handleDeleteComment(c.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;