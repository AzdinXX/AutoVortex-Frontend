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



function App() {

  return (

    <div>
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
        <Route path="/admin" element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }></Route>

      </Routes>
    </div>
  );
}

export default App
