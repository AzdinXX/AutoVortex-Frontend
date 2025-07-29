import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Crown, Menu, X, Car, Users, Settings, Plus, Edit, LogOut, Database, Shield, Tag, MessageSquare } from 'lucide-react';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
          top: 90px;
          left: 20px;
          z-index: 1001;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }
        .admin-sidebar-toggle:hover {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        .admin-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.6);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(5px);
        }
        .admin-sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: -320px;
          height: 100vh;
          width: 320px;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          color: #fff;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 25px rgba(0,0,0,0.3);
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
          z-index: 1000;
          transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .admin-sidebar.open {
          left: 0;
        }
        .sidebar-header {
          padding: 2.5rem 1.5rem 1.5rem;
          border-bottom: 2px solid rgba(255,255,255,0.1);
          text-align: center;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          position: relative;
          overflow: hidden;
        }
        .sidebar-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .sidebar-header h3 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
          z-index: 1;
        }
        .sidebar-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255,255,255,0.1);
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .sidebar-close:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
        }
        .sidebar-section {
          font-size: 0.85rem;
          font-weight: 700;
          color: #94a3b8;
          margin: 2rem 0 0.75rem 1.5rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          position: relative;
          padding-left: 1rem;
          display: flex;
          align-items: center;
        }
        .sidebar-section::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          transform: translateY(-50%);
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          color: #cbd5e1;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          border-left: 4px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0.25rem 1rem;
          border-radius: 0 12px 12px 0;
          position: relative;
          overflow: hidden;
        }
        .sidebar-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .sidebar-link:hover::before {
          transform: translateX(100%);
        }
        .sidebar-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #fff;
          border-left-color: #667eea;
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }
        .sidebar-link.active {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
          color: #fff;
          border-left-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        .sidebar-link svg {
          margin-right: 1rem;
          width: 22px;
          height: 22px;
          transition: all 0.3s ease;
        }
        .sidebar-link:hover svg {
          transform: scale(1.1);
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 300px;
          }
          .admin-sidebar-toggle {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>

      {/* Toggle Button */}
      <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
        <Crown size={24} />
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
          <h3>🚀 Admin Panel</h3>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section">
            <Database size={16} style={{ marginRight: '0.5rem' }} />
            Car Management
          </div>
          
          <Link 
            to="/admin/add-car" 
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <Plus size={22} />
            Add Car
          </Link>

          <Link 
            to="/admin/manage-cars" 
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <Car size={22} />
            Manage Cars
          </Link>

          <div className="sidebar-section">
            <Tag size={16} style={{ marginRight: '0.5rem' }} />
            Offers Management
          </div>
          
          <Link 
            to="/admin/offers" 
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <Tag size={22} />
            Manage Offers
          </Link>

          <div className="sidebar-section">
            <MessageSquare size={16} style={{ marginRight: '0.5rem' }} />
            Communication
          </div>
          
          <Link 
            to="/admin/comments" 
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <MessageSquare size={22} />
            Manage Comments
          </Link>
        </div>
      </div>
    </>
  );
}