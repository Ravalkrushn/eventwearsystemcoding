import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaStore, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaToggleOn, 
  FaToggleOff, 
  FaSearch, 
  FaSpinner, 
  FaTimes,
  FaCheckCircle
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const VendorManager = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newVendorData, setNewVendorData] = useState({
    ownerName: "",
    shopName: "",
    email: "",
    phone: "",
    shopAddress: "",
    city: "",
    aadharNumber: "",
    panNumber: "",
    bankAccount: "",
    ifscCode: "",
    password: ""
  });
  const [shopImage, setShopImage] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/vendors");
      setVendors(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/admin/vendors/${id}/toggle-status`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchVendors();
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "shopImage") {
      setShopImage(files[0]);
      return;
    }
    setNewVendorData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(newVendorData).forEach(key => {
        data.append(key, newVendorData[key]);
      });
      if (shopImage) data.append("shopImage", shopImage);

      const res = await axios.post("http://localhost:5000/api/admin/vendors", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        toast.success("Vendor added successfully");
        setShowAddModal(false);
        setNewVendorData({
          ownerName: "",
          shopName: "",
          email: "",
          phone: "",
          shopAddress: "",
          city: "",
          aadharNumber: "",
          panNumber: "",
          bankAccount: "",
          ifscCode: "",
          password: ""
        });
        setShopImage(null);
        fetchVendors();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding vendor");
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.shopName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Vendor Management</h2>
          <p className="text-gray-500 font-medium">Manage and monitor all shop partners.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 whitespace-nowrap"
          >
            <FaPlus /> Add Vendor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredVendors.map((vendor) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={vendor._id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner overflow-hidden border border-gray-100">
                    {vendor.shopImage ? (
                      <img src={`http://localhost:5000${vendor.shopImage}`} alt={vendor.shopName} className="w-full h-full object-cover" />
                    ) : (
                      <FaStore />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{vendor.shopName}</h3>
                    <p className="text-indigo-600 font-bold text-sm tracking-wide uppercase">{vendor.ownerName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleStatus(vendor._id)}
                  className={`text-3xl transition-colors ${vendor.isApproved ? "text-green-500" : "text-gray-300"}`}
                >
                  {vendor.isApproved ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-sm font-medium truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl">
                  <FaPhone className="text-gray-400" />
                  <span className="text-sm font-medium">{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl md:col-span-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-sm font-medium">{vendor.shopAddress}, {vendor.city}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center pt-6 border-t border-gray-100">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${vendor.isApproved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {vendor.isApproved ? "Active" : "Deactivated"}
                </div>
                <button className="text-indigo-600 font-bold text-sm hover:underline">View Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Vendor Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Add New Vendor Account</h3>
                  <p className="text-sm font-medium text-gray-500">Enter shop and owner details to create an account.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white rounded-xl transition shadow-sm"
                >
                  <FaTimes className="text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <form onSubmit={handleAddVendor} className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shop Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Shop Details</h4>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Shop Name *</label>
                      <input type="text" name="shopName" required value={newVendorData.shopName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="e.g. Royal Fashion" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Shop Address *</label>
                      <input type="text" name="shopAddress" required value={newVendorData.shopAddress} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="123 Market St" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">City *</label>
                      <input type="text" name="city" required value={newVendorData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="Mumbai" />
                    </div>
                  </div>

                  {/* Owner Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Owner Details</h4>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Owner Full Name *</label>
                      <input type="text" name="ownerName" required value={newVendorData.ownerName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Email Address *</label>
                      <input type="email" name="email" required value={newVendorData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="owner@shop.com" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Phone Number *</label>
                      <input type="tel" name="phone" required value={newVendorData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  {/* KYC & Identity */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest my-4">Identity & Banking (KYC)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Aadhar Number *</label>
                        <input type="text" name="aadharNumber" required value={newVendorData.aadharNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="1234 5678 9012" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">PAN Number *</label>
                        <input type="text" name="panNumber" required value={newVendorData.panNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="ABCDE1234F" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Bank Account Number *</label>
                        <input type="text" name="bankAccount" required value={newVendorData.bankAccount} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="1234567890" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">IFSC Code *</label>
                        <input type="text" name="ifscCode" required value={newVendorData.ifscCode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="SBIN0001234" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Shop Photo *</label>
                      <input type="file" name="shopImage" required onChange={handleInputChange} className="w-full px-4 py-2 rounded-2xl bg-gray-50 border-none outline-none font-medium" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5 uppercase ml-1">Set Account Password *</label>
                      <input type="password" name="password" required value={newVendorData.password} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-1 active:translate-y-0"
                  >
                    Register Vendor Account
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorManager;
