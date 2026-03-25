import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Customer-panel/Landing-page/LandingPage';
import ShopsByCategory from './Customer-panel/Landing-page/category/ShopsByCategory';
import ShopProducts from './Customer-panel/Landing-page/category/ShopProducts';
import ProductDetails from './Customer-panel/Landing-page/category/ProductDetails';
import Login from './loign-regis/Login';
import Registration from './loign-regis/Registration';
import VendorDashboard from './Vendor-panel/VendorDashboard';
import AdminDashboard from './Admin-panel/AdminDashboard';
import CustomerProfile from './Customer-panel/profile/CustomerProfile';
import Cart from './Customer-panel/cart/Cart';
import Delivery from './Customer-panel/cart/Delivery';
import Payment from './Customer-panel/cart/Payment';


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
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/category/:categoryName" element={<ShopsByCategory />} />
        <Route path="/shop/:vendorId" element={<ShopProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;