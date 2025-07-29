import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function UserAccount() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #0a192f 0%, #1e293b 100%)' }}>
        <div style={{ color: '#fff', fontSize: '1.3rem' }}>You are not logged in.</div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('phone', phone);
    if (password) formData.append('password', password);
    if (image) formData.append('image', image);

    try {
      const res = await axios.put(`http://localhost:3000/api/users/${user.id}`, formData);
      const updatedUser = {
        ...user,
        username: res.data.user.username,
        phone: res.data.user.phone,
        avatar: res.data.user.avatar || user.avatar,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPreview(updatedUser.avatar || "");
      setShowModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #0a192f 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <style>{`
        .user-account-card {
          background: rgba(30, 41, 59, 0.85);
          border-radius: 28px;
          box-shadow: 0 8px 40px 0 rgba(30,64,175,0.22), 0 1.5px 8px 0 rgba(59,130,246,0.10);
          border: 1.5px solid rgba(59,130,246,0.13);
          padding: 2.7rem 2.7rem 2.2rem 2.7rem;
          max-width: 440px;
          width: 100%;
          color: #fff;
          text-align: center;
          backdrop-filter: blur(12px);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .user-account-card:hover {
          box-shadow: 0 16px 48px 0 rgba(30,64,175,0.32), 0 2.5px 12px 0 rgba(59,130,246,0.18);
          transform: translateY(-2px) scale(1.01);
        }
        .user-account-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #2563eb;
          margin-bottom: 1.3rem;
          background: #fff;
          box-shadow: 0 2px 12px rgba(59,130,246,0.18);
          transition: box-shadow 0.2s;
        }
        .user-account-username {
          font-size: 2.1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          letter-spacing: 1.5px;
          text-shadow: 0 1px 8px rgba(59,130,246,0.10);
        }
        .user-account-role {
          font-size: 1.15rem;
          color: #60a5fa;
          margin-bottom: 1.3rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .user-account-info {
          text-align: left;
          margin: 1.7rem 0 2.2rem 0;
          font-size: 1.08rem;
        }
        .user-account-info label {
          color: #a5b4fc;
          font-weight: 600;
          margin-right: 0.5rem;
          min-width: 70px;
          display: inline-block;
        }
        .user-account-edit-btn {
          background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 12px 38px;
          font-weight: bold;
          font-size: 1.13rem;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(59,130,246,0.13);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .user-account-edit-btn:hover {
          background: linear-gradient(90deg, #1e40af 60%, #2563eb 100%);
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 18px rgba(59,130,246,0.18);
        }
        /* Modal custom styles */
        .modal-content {
          background: rgba(30, 41, 59, 0.97) !important;
          border-radius: 22px !important;
          border: 1.5px solid rgba(59,130,246,0.13) !important;
          color: #fff !important;
          box-shadow: 0 8px 40px 0 rgba(30,64,175,0.22), 0 1.5px 8px 0 rgba(59,130,246,0.10);
        }
        .modal-header, .modal-footer {
          border: none !important;
        }
        .modal-title {
          color: #60a5fa !important;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .form-label {
          color: #a5b4fc !important;
          font-weight: 500;
        }
        .form-control {
          border-radius: 12px !important;
          background: rgba(59,130,246,0.10) !important;
          color: #fff !important;
          border: 1.5px solid #2563eb !important;
          box-shadow: none !important;
          margin-bottom: 0.7rem;
        }
        .form-control:focus {
          border-color: #60a5fa !important;
          box-shadow: 0 0 0 0.2rem rgba(59,130,246,0.18) !important;
          background: rgba(59,130,246,0.16) !important;
          color: #fff !important;
        }
        .btn-primary {
          background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%) !important;
          border: none !important;
          border-radius: 14px !important;
          font-weight: bold !important;
          font-size: 1.08rem !important;
          padding: 8px 28px !important;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          background: linear-gradient(90deg, #1e40af 60%, #2563eb 100%) !important;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 18px rgba(59,130,246,0.18);
        }
        .btn-secondary {
          background: #64748b !important;
          border: none !important;
          border-radius: 14px !important;
          font-weight: 500 !important;
          font-size: 1.08rem !important;
          padding: 8px 28px !important;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-secondary:hover {
          background: #334155 !important;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 18px rgba(100,116,139,0.18);
        }
      `}</style>
      <div className="user-account-card">
        <img
          className="user-account-avatar"
          src={"http://localhost:3000/uploads/"+user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=2563eb&color=fff&size=128`}
          alt="User Avatar"
        />
        <div className="user-account-username">{username}</div>
        <div className="user-account-role">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}</div>
        <div className="user-account-info">
          <div><label>Email:</label> {user.email}</div>
          <div><label>Phone:</label> {user.phone || <span style={{ color: '#64748b' }}>Not set</span>}</div>
        </div>
        <button className="user-account-edit-btn" onClick={() => setShowModal(true)}>Edit Profile</button>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default UserAccount;