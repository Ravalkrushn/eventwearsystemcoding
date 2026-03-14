import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Landing-page/LandingPage';
import Login from './loign-regis/Login';
import Registration from './loign-regis/Registration';
import VendorDashboard from './Vendor-panel/VendorDashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;