import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const navigate = useNavigate();
    
    const handleDelete = async (id, type) => {
     try {
       await axios.delete(`http://localhost:3000/api/notifications/${type}/${id}`);
       fetchNotifications();
       fetchNotifCount();
     } catch (err) {
       console.error("Failed to delete notification", err);
     }
   };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || userData.role !== "admin") {
            navigate("/");
        } else {
            fetchNotifications();
            fetchNotifCount();
        }
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/notifications");
            setNotifications(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    const fetchNotifCount = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/notifications/unread");
            setNotifCount(res.data.count || 0);
        } catch (err) {
            setNotifCount(0);
        }
    };

    const handleAccept = (id, type) => {
        axios.put(`http://localhost:3000/api/notifications/accept/${type}/${id}`)
            .then(res => { fetchNotifications(); fetchNotifCount(); })
            .catch(err => { console.error(err) });
    };

    const handleReject = (id, type) => {
        axios.put(`http://localhost:3000/api/notifications/reject/${type}/${id}`)
            .then(res => { fetchNotifications(); fetchNotifCount(); })
            .catch(err => { console.error(err) });
    };

    const handleReply = async (id, type) => {
        if (!replyText.trim()) {
            alert('Please enter a reply message');
            return;
        }
        
        try {
            await axios.post(`http://localhost:3000/api/notifications/reply/${type}/${id}`, {
                admin_reply: replyText
            });
            setReplyText('');
            setReplyingTo(null);
            fetchNotifications();
            fetchNotifCount();
        } catch (err) {
            console.error('Failed to send reply:', err);
            alert('Failed to send reply');
        }
    };

    const startReply = (id) => {
        setReplyingTo(id);
        setReplyText('');
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    return (
        <div className="notifications-page" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #0a192f 0%, #1e293b 100%)', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
            <style>{`
                .notif-glass-card {
                    background: rgba(30, 41, 59, 0.85);
                    border-radius: 18px;
                    box-shadow: 0 4px 24px rgba(30,64,175,0.12);
                    border: 1px solid rgba(59,130,246,0.08);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .notif-glass-card:hover {
                    transform: translateY(-4px) scale(1.01);
                    box-shadow: 0 12px 32px rgba(30,64,175,0.18);
                }
                .notif-header {
                    background: linear-gradient(90deg, #2563eb 0%, #1e293b 100%);
                    color: #fff;
                    border-bottom-left-radius: 18px;
                    border-bottom-right-radius: 18px;
                    box-shadow: 0 2px 10px rgba(30,64,175,0.10);
                }
                .notif-avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #2563eb;
                    background: #fff;
                    margin-bottom: 10px;
                }
                .notif-status {
                    font-weight: bold;
                    text-transform: capitalize;
                    padding: 2px 12px;
                    border-radius: 12px;
                    font-size: 0.95rem;
                }
                .notif-status.pending {
                    background: #facc15;
                    color: #1e293b;
                }
                .notif-status.accepted, .notif-status.approved {
                    background: #22c55e;
                    color: #fff;
                }
                .notif-status.rejected, .notif-status.cancelled {
                    background: #dc2626;
                    color: #fff;
                }
                .notif-action-btn {
                    border-radius: 30px;
                    font-weight: 500;
                    min-width: 110px;
                    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
                }
                .notif-action-btn.btn-dark:hover {
                    background: #2563eb;
                    color: #fff;
                }
                .notif-action-btn.btn-danger:hover {
                    background: #991b1b;
                }
                .badge.bg-warning {
                    color: #1e293b !important;
                }
                .badge.bg-info {
                    color: #fff !important;
                }
            `}</style>
            <nav className="notif-header d-flex align-items-center justify-content-between px-4 py-3 mb-5 shadow-lg" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <span className="fw-bold fs-3">Admin Notifications</span>
                <NavLink to="/notifications" className="nav-bell" title="Notifications">
                    <i className="bi bi-bell"></i>
                    {notifCount > 0 && (
                        <span className="notif-count">{notifCount}</span>
                    )}
                </NavLink>
            </nav>
            <div className="container py-4">
                <h2 className="text-white fw-bold mb-4 text-center" style={{ letterSpacing: '1px' }}>All Requests</h2>
                <div className="row justify-content-center">
                {notifications.length === 0 && (
                    <div className="col-12 text-center text-light fs-5 py-5">No notifications to display.</div>
                )}
                {notifications.map((n) => (
                    <div key={n.id} className="col-md-7 mb-4">
                        <div className="notif-glass-card p-4 shadow-lg">
                            <div className="d-flex align-items-center mb-3">
                                {n.user_image && (
                                    <img
                                        src={`http://localhost:3000/uploads/${n.user_image}`}
                                        alt="User"
                                        className="notif-avatar me-3"
                                    />
                                )}
                                <div>
                                    <span className={`notif-status ${n.status}`}>{n.status}</span>
                                </div>
                            </div>
                            <div className="text-light mb-2"><strong>User:</strong> {n.user_name}</div>
                            <div className="text-light mb-2"><strong>Phone:</strong> {n.user_phone || "Not provided"}</div>
                            <div className="text-light mb-2">
                                <strong>Type:</strong> 
                                <span className={`badge ${n.request_type === 'offer_request' ? 'bg-warning' : 'bg-info'} ms-2`}>
                                    {n.request_type === 'offer_request' ? 'Offer Request' : 'Car Rental'}
                                </span>
                            </div>
                            <div className="text-light mb-2"><strong>Car/Offer:</strong> {n.car_name}</div>
                            <div className="text-light mb-2"><strong>Message:</strong> {n.message || 'No message'}</div>
                            <div className="text-light mb-2"><strong>Start Date:</strong> {new Date(n.start_date).toLocaleDateString('en-GB')}</div>
                            <div className="text-light mb-2"><strong>End Date:</strong> {new Date(n.end_date).toLocaleDateString('en-GB')}</div>
                            {n.status === "pending" && (
                                <div className="d-flex gap-3 mt-4">
                                    <button className="btn btn-dark notif-action-btn" onClick={() => handleAccept(n.id, n.request_type === 'offer_request' ? 'offer' : 'car')}>Accept</button>
                                    <button className="btn btn-danger notif-action-btn" onClick={() => handleReject(n.id, n.request_type === 'offer_request' ? 'offer' : 'car')}>Reject</button>
                                    <button className="btn btn-outline-primary notif-action-btn" onClick={() => startReply(n.id)}>Reply</button>
                                    <button className="btn btn-outline-danger notif-action-btn" onClick={() => handleDelete(n.id, n.request_type === 'offer_request' ? 'offer' : 'car')}>Delete</button>
                                </div>
                            )}
                            {n.status !== "pending" && (
                                <div className="d-flex gap-3 mt-4">
                                    <button className="btn btn-outline-primary notif-action-btn" onClick={() => startReply(n.id)}>Reply</button>
                                    <button className="btn btn-outline-danger notif-action-btn" onClick={() => handleDelete(n.id, n.request_type === 'offer_request' ? 'offer' : 'car')}>Delete</button>
                                </div>
                            )}
                            
                            {/* Reply Section */}
                            {replyingTo === n.id && (
                                <div className="mt-3 p-3 bg-light rounded">
                                    <textarea 
                                        className="form-control mb-2" 
                                        rows="3" 
                                        placeholder="Enter your reply to the user..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-primary btn-sm" 
                                            onClick={() => handleReply(n.id, n.request_type === 'offer_request' ? 'offer' : 'car')}
                                        >
                                            Send Reply
                                        </button>
                                        <button 
                                            className="btn btn-secondary btn-sm" 
                                            onClick={cancelReply}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Show existing admin reply */}
                            {n.admin_reply && (
                                <div className="mt-3 p-3 bg-info bg-opacity-10 rounded border-start border-info border-4">
                                    <div className="fw-bold text-info mb-1">Admin Reply:</div>
                                    <div className="text-light">{n.admin_reply}</div>
                                    {n.admin_reply_date && (
                                        <small className="text-light">
                                            {new Date(n.admin_reply_date).toLocaleString()}
                                        </small>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}

export default Notifications;