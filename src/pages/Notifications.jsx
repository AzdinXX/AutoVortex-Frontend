import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [notifCount, setNotifCount] = useState(0);
    const navigate = useNavigate();

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

    const handleAccept = (id) => {
        axios.put(`http://localhost:3000/api/notifications/accept/${id}`)
            .then(res => { fetchNotifications(); fetchNotifCount(); })
            .catch(err => { console.error(err) });
    };

    const handleReject = (id) => {
        axios.put(`http://localhost:3000/api/notifications/reject/${id}`)
            .then(res => { fetchNotifications(); fetchNotifCount(); })
            .catch(err => { console.error(err) });
    };

    return (
        <div>
            <style>{`
                .nav-bell {
                    position: relative;
                    font-size: 1.7rem;
                    color: #2563eb;
                    margin-right: 18px;
                    cursor: pointer;
                }
                .nav-bell .notif-count {
                    position: absolute;
                    top: -6px;
                    right: -10px;
                    background: #dc2626;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 0.85rem;
                    padding: 2px 7px;
                    font-weight: bold;
                    box-shadow: 0 2px 8px rgba(220,38,38,0.18);
                }
            `}</style>
            <nav className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom mb-4 bg-white shadow-sm">
                <span className="fw-bold fs-4 text-primary">Admin Notifications</span>
                <NavLink to="/notifications" className="nav-bell" title="Notifications">
                    <i className="bi bi-bell"></i>
                    {notifCount > 0 && (
                        <span className="notif-count">{notifCount}</span>
                    )}
                </NavLink>
            </nav>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Rental Requests</h2>
                {notifications.map((n) => (
                    <div key={n.id} className="border p-4 mb-4 rounded-md shadow">
                        {n.user_image && (
                            <img
                                src={`http://localhost:3000/uploads/${n.user_image}`}
                                alt="User"
                                className="w-16 h-16 rounded-full mb-2 object-cover"
                            />
                        )}

                        <p><strong>User:</strong> {n.user_name}</p>
                        <p><strong>Phone:</strong> {n.user_phone || "Not provided"}</p>
                        <p><strong>Car:</strong> {n.car_name}</p>
                        <p><strong>Message:</strong> {n.message}</p>
                        <p><strong>Start Date:</strong> {new Date(n.start_date).toLocaleDateString('en-GB')}</p>
                        <p><strong>End Date:</strong> {new Date(n.end_date).toLocaleDateString('en-GB')}</p>
                        <p><strong>Status:</strong> {n.status}</p>

                        {n.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                                <button className="btn btn-dark" onClick={() => handleAccept(n.id)}>Accept</button>
                                <button className="btn btn-danger" onClick={() => handleReject(n.id)}>Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notifications;