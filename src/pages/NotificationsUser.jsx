import React, { useEffect, useState } from "react";
import axios from "axios";

function UserNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (user && user.id) {
        const res = await axios.get(`http://localhost:3000/api/notifications/user/${user.id}`);
        
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
    
    <div className="notifications-container">
      <style>{`
        .notifications-container {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.notifications-header {
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.notifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-item {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-status {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-unknown {
  background-color: #e2e3e5;
  color: #383d41;
}

.notification-dates {
  color: #666;
  font-size: 0.9em;
}

.date-label {
  font-weight: bold;
}

.date-value {
  margin-right: 10px;
}

.no-notifications {
  color: #666;
  text-align: center;
  padding: 20px;
}
      `}</style>
  <h2 className="notifications-header">User Notifications</h2>
  {Array.isArray(notifications) && notifications.length > 0 ? (
    <ul className="notifications-list">
      {notifications.map((notif) => {
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
          <li key={notif._id || Math.random()} className="notification-item">
            <div className="notification-content">
              <div className={`notification-status ${statusClass}`}>
                {statusText}
              </div>
              <div className="notification-dates">
                <span className="date-label">From: </span>
                <span className="date-value">{startDate}</span>
                <span className="date-label"> To: </span>
                <span className="date-value">{endDate}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="no-notifications">No notifications yet.</p>
  )}
</div>
  );
}

export default UserNotifications;