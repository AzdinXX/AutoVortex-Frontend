import { Route, Routes } from "react-router-dom"
import Auto_Options from "./pages/Auto_Options"
import Home from "./pages/Home"
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AppNavbar from "./components/AppNavbar";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/UpdateCar";
import RentForm from "./pages/RentForn";
import Notifications from "./pages/Notifications";
import NotificationsUser from "./pages/NotificationsUser";
import Comments from "./pages/Comments";
import About from "./pages/About";
import UserAccount from "./pages/UserAccount";
import AdminLayout from "./pages/AdminLayout";
import AdminCars from "./pages/AdminCars";
import AdminUsers from "./pages/AdminUsers";
import Dashboard from "./pages/Dashboard";
import Saidbar from "./components/Saidbar";
import { AdminProvider } from "./context/AdminContext";
import Offers from "./pages/Offers";

import { useState, useEffect } from 'react';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <AdminProvider>
      <div>
        {user && user.role === 'admin' && <Saidbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/auto_options" element={<Auto_Options />} />
          <Route path="/add-car" element={<AddCar />} />
          <Route path="/edit-car/:id" element={<EditCar />} />
          <Route path="/rent/:carId" element={<RentForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications-user" element={<NotificationsUser />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/about" element={<About />} />
          <Route path="/useraccount" element={<UserAccount />} />
        </Routes>
      </div>
    </AdminProvider>
  );
}

export default App
