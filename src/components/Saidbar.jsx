import { Link } from 'react-router-dom';
import { useState } from 'react';


export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <style>{`
        .admin-sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  width: 220px;
  height: 100%;
  background-color: #0f172a;
  color: white;
  transition: transform 0.3s ease;
  z-index: 1000;
  padding-top: 20px;
}

.admin-sidebar.closed {
  transform: translateX(-100%);
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin: 20px 0;
  padding-left: 20px;
}

.sidebar-menu li a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
}

.toggle-btn {
  position: absolute;
  top: 10px;
  right: -35px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
      `}</style>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '<<' : '>>'}
      </button>
      <ul className="sidebar-menu">
        <li><Link to="/admin/add-car">➕ Add Car</Link></li>
        <li><Link to="/admin/manage-cars">🚗 Manage Cars</Link></li>
        <li><Link to="/admin/offers">🎉 Manage Offers</Link></li>
        <li><Link to="/admin/comments">💬 Manage Comments</Link></li>
      </ul>
    </div>
  );
}