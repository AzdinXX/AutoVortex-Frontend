// src/components/Saidbar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { Button } from "react-bootstrap";
import { Menu, X, Car, Users, Settings, Plus, Edit, LogOut } from "lucide-react";

export default function Saidbar() {
  const { isAdmin, adminUser, loading, logoutAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Only render if user is admin and properly authenticated
  if (!isAdmin || !adminUser) {
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <style>{`
        .admin-sidebar-toggle {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        .admin-sidebar-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .admin-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .admin-sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: -300px;
          height: 100vh;
          width: 300px;
          background: linear-gradient(135deg, #232526 0%, #414345 100%);
          color: #fff;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 12px rgba(0,0,0,0.08);
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
          z-index: 1000;
          transition: left 0.3s ease;
          overflow-y: auto;
        }
        .admin-sidebar.open {
          left: 0;
        }
        .sidebar-header {
          padding: 2rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }
        .sidebar-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }
        .sidebar-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.3s ease;
        }
        .sidebar-close:hover {
          background: rgba(255,255,255,0.1);
        }
        .sidebar-section {
          font-size: 0.9rem;
          font-weight: 600;
          color: #b0b8c1;
          margin: 1.5rem 0 0.5rem 1.5rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          color: #e9ecef;
          text-decoration: none;
          font-size: 1rem;
          border-left: 4px solid transparent;
          transition: all 0.3s ease;
          margin: 0.25rem 0;
        }
        .sidebar-link:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-left-color: #667eea;
        }
        .sidebar-link.active {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-left-color: #fff;
        }
        .sidebar-link svg {
          margin-right: 0.75rem;
          width: 20px;
          height: 20px;
        }
        .sidebar-logout {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .logout-button {
          width: 100%;
          background: linear-gradient(45deg, #dc3545, #c82333);
          color: #fff;
          border: none;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .logout-button:hover {
          background: linear-gradient(45deg, #c82333, #bd2130);
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 280px;
          }
        }
      `}</style>

      {/* Toggle Button */}
      <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <div 
        className={`admin-sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={closeSidebar}>
            <X size={20} />
          </button>
          <h3>Admin Panel</h3>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section">Car Management</div>
          
          <NavLink 
            to="/add-car" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Plus size={20} />
            Add New Car
          </NavLink>

          <NavLink 
            to="/admin/cars" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Car size={20} />
            View Cars
          </NavLink>

          <NavLink 
            to="/admin" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Edit size={20} />
            Edit Car Information
          </NavLink>

          <div className="sidebar-section">User Management</div>
          
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Users size={20} />
            User Accounts
          </NavLink>

          <div className="sidebar-section">Admin Settings</div>
          
          <NavLink 
            to="/useraccount" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Settings size={20} />
            Edit Admin Account
          </NavLink>
        </div>

        <div className="sidebar-logout">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}