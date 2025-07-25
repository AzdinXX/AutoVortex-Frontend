import React, { useEffect, useState } from "react";
import axios from "axios";

function UserNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (user && user.id) {
        const res = await axios.get(`http://localhost:3000/api/notifications/user/${user.id}/unread`);
        
        console.log(res.data);
        
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          console.log("Response is not an array:");
          setNotifications([]);
        }
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="user-notifications-page" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #0a192f 0%, #1e293b 100%)', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <style>{`
        .user-notif-glass-card {
          background: rgba(30, 41, 59, 0.85);
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(30,64,175,0.12);
          border: 1px solid rgba(59,130,246,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .user-notif-glass-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 32px rgba(30,64,175,0.18);
        }
        .user-notif-header {
          background: linear-gradient(90deg, #2563eb 0%, #1e293b 100%);
          color: #fff;
          border-bottom-left-radius: 18px;
          border-bottom-right-radius: 18px;
          box-shadow: 0 2px 10px rgba(30,64,175,0.10);
        }
        .user-notif-status {
          font-weight: bold;
          text-transform: capitalize;
          padding: 2px 12px;
          border-radius: 12px;
          font-size: 0.95rem;
          display: inline-block;
        }
        .user-notif-status.status-pending {
          background: #facc15;
          color: #1e293b;
        }
        .user-notif-status.status-confirmed {
          background: #22c55e;
          color: #fff;
        }
        .user-notif-status.status-cancelled {
          background: #dc2626;
          color: #fff;
        }
        .user-notif-status.status-unknown {
          background: #64748b;
          color: #fff;
        }
        .user-notif-dates {
          color: #cbd5e1;
          font-size: 1.05em;
        }
        .user-no-notifications {
          color: #cbd5e1;
          text-align: center;
          padding: 40px 0;
          font-size: 1.2rem;
        }
      `}</style>
      <div className="user-notif-header px-4 py-4 mb-5 shadow-lg text-center" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 className="fw-bold mb-0" style={{ letterSpacing: '1px' }}>User Notifications</h2>
      </div>
      <div className="container py-4">
        <div className="row justify-content-center">
          {Array.isArray(notifications) && notifications.length > 0 ? (
            notifications.map((notif) => {
              let statusText = "";
              let statusClass = "";
              if (notif.status === "pending") {
                statusText = "Waiting for approval";
                statusClass = "status-pending";
              } else if (notif.status === "confirmed") {
                statusText = "Request approved";
                statusClass = "status-confirmed";
              } else if (notif.status === "cancelled") {
                statusText = "Request rejected";
                statusClass = "status-cancelled";
              } else {
                statusText = "Unknown status";
                statusClass = "status-unknown";
              }

              const startDate = new Date(notif.created_at).toLocaleDateString();
              const endDate = notif.end_date
                ? new Date(notif.end_date).toLocaleDateString()
                : "No end date";

              return (
                <div key={notif._id || Math.random()} className="col-md-7 mb-4">
                  <div className="user-notif-glass-card p-4 shadow-lg">
                    <div className={`user-notif-status ${statusClass} mb-3`}>{statusText}</div>
                    <div className="user-notif-dates mb-2">
                      <span className="fw-bold">From: </span>
                      <span className="me-3">{startDate}</span>
                      <span className="fw-bold">To: </span>
                      <span>{endDate}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 user-no-notifications">No notifications yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserNotifications;