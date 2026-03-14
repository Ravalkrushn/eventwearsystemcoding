import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Customer-panel/Landing-page/LandingPage';
import ShopsByCategory from './Customer-panel/Landing-page/category/ShopsByCategory';
import Login from './loign-regis/Login';
import Registration from './loign-regis/Registration';
import VendorDashboard from './Vendor-panel/VendorDashboard';
import AdminDashboard from './Admin-panel/AdminDashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/category/:categoryName" element={<ShopsByCategory />} />
      </Routes>
    </Router>
  );
}

export default App;