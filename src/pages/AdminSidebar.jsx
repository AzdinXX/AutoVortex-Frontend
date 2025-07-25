import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: "/admin", label: "لوحة التحكم", icon: "📊" },
    { path: "/admin/cars", label: "إدارة السيارات", icon: "🚗" },
    { path: "/admin/add-car", label: "إضافة سيارة", icon: "➕" },
    { path: "/admin/notifications", label: "الطلبات", icon: "🔔" },
  ];

  return (
    <div className="bg-dark text-white vh-100" style={{ width: "250px" }}>
      <h3 className="p-3 border-bottom">لوحة التحكم</h3>
      
      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center ${
                location.pathname === item.path ? "bg-primary" : ""
              }`}
            >
              <span className="fs-5 me-2">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}