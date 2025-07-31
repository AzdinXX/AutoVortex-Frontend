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
import OfferRentForm from "./pages/OfferRentForm";
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
import AdminAddCar from "./pages/AdminAddCar";
import AdminManageCars from "./pages/AdminManageCars";
import AdminOffers from "./pages/AdminOffers";
import AdminAddOffer from "./pages/AdminAddOffer";
import AdminEditOffer from "./pages/AdminEditOffer";
import AdminComments from "./pages/AdminComments";
import AdminOfferRequests from "./pages/AdminOfferRequests";

import { useState, useEffect } from 'react';
import AdminRoute from "./components/AdminRoute";


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
          <Route path="/add-car" element={
        <AdminRoute user={user}>
          <AddCar />
        </AdminRoute> 
        } />
          <Route path="/edit-car/:id" element={<AdminRoute user={user}>
          < EditCar/>
        </AdminRoute>} />
          <Route path="/rent/:carId" element={<RentForm />} />
          <Route path="/offer-rent/:offerId" element={<OfferRentForm />} />
          <Route path="/notifications" element={<AdminRoute user={user}>
          <Notifications />
        </AdminRoute> } />
          <Route path="/notifications-user" element={<NotificationsUser />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/about" element={<About />} />
          <Route path="/useraccount" element={<UserAccount />} />
          <Route path="/offers" element={<Offers />} />
          
          {/* Admin Sidebar Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute />} />
          <Route path="/admin/add-car" element={<AdminRoute user={user}>
          <AdminAddCar />
        </AdminRoute> } />
          <Route path="/admin/manage-cars" element={<AdminRoute user={user}>
          <AdminManageCars />
        </AdminRoute> } />
          <Route path="/admin/offers" element={<AdminRoute user={user}>
          <AdminOffers />
        </AdminRoute> } />
          <Route path="/admin/add-offer" element={<AdminRoute user={user}>
          <AdminAddOffer />
        </AdminRoute> } />
          <Route path="/admin/edit-offer/:id" element={<AdminRoute user={user}>
          <AdminEditOffer />
        </AdminRoute> } />
          <Route path="/admin/comments" element={<AdminRoute user={user}>
          <AdminComments />
        </AdminRoute> } />
          <Route path="/admin/offer-requests" element={<AdminRoute user={user}>
          <AdminOfferRequests />
        </AdminRoute> } />
          
          
        </Routes>
      </div>
    </AdminProvider>
  );
}

export default App
