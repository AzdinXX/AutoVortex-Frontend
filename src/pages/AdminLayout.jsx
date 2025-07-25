// src/components/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function AdminLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className="bg-dark vh-100 p-3" style={{ width: '240px' }}>
        <h4 className="text-white">Admin Panel</h4>
        <ul className="list-unstyled mt-4">
          <li><NavLink to="/admin/cars"    className="text-white d-block py-2">Cars</NavLink></li>
          <li><NavLink to="/admin/comments" className="text-white d-block py-2">Comments</NavLink></li>
          <li><NavLink to="/admin/notifications" className="text-white d-block py-2">Requests</NavLink></li>
        </ul>
        <Button variant="outline-light" size="sm" onClick={handleLogout} className="mt-auto">
          Logout
        </Button>
      </nav>

      {/* Main content */}
      <div className="flex-fill p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
}