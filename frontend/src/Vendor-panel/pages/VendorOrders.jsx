import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShoppingBag, 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaExclamationCircle,
  FaRupeeSign,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTruck,
  FaUserTie,
  FaTimes,
  FaCheckCircle,
  FaChevronRight
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [staffLoading, setStaffLoading] = useState(false);

  const vendor = JSON.parse(localStorage.getItem("user")) || {};
  const vendorId = vendor.id;

  const fetchOrders = async () => {
    if (!vendorId) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/vendors/orders/${vendorId}`
      );
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    if (!vendorId) return;
    try {
      setStaffLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/delivery-boys/vendor/${vendorId}`
      );
      if (res.data.success) {
        // Only get active staff
        setStaff(res.data.data.filter(s => s.status === 'active'));
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStaff();
  }, [vendorId]);

  const handleAssignStaff = async (staffId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${selectedOrder._id}/assign-delivery`, {
        vendorId,
        deliveryBoyId: staffId
      });

      if (res.data.success) {
        toast.success("Delivery staff assigned successfully!");
        setSelectedOrder(null);
        fetchOrders(); // Refresh list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error assigning staff");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching Orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Customer Orders</h1>
          <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Manage your incoming rental requests</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Received</p>
            <p className="text-xl font-black text-indigo-600">{orders.length}</p>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <FaShoppingBag className="text-indigo-600 text-xl" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
          <FaShoppingBag size={40} className="mx-auto mb-6 text-gray-300" />
          <h3 className="text-xl font-black text-gray-400 uppercase tracking-tight">No orders yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-gray-50">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Order</span>
                      <span className="text-xl font-black leading-none mt-1">#{order._id.slice(-4)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                        {order.shippingAddress.name} 
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="bg-indigo-50 px-5 py-3 rounded-xl border border-indigo-100">
                      <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Pay</p>
                      <p className="text-lg font-black text-indigo-600 flex items-center leading-none">
                        <FaRupeeSign className="text-sm" /> {order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Delivery Status / Assignment */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FaTruck className="text-indigo-600" /> Delivery Assignment
                      </h4>
                      
                      {/* Check if ALL items for this vendor are assigned */}
                      {order.items.every(item => item.deliveryBoy) ? (
                        <div className="p-5 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-4">
                          <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
                            <FaCheckCircle />
                          </div>
                          <div>
                            <p className="text-xs font-black text-green-700 uppercase tracking-tight">Staff Assigned</p>
                            <p className="text-sm font-bold text-green-600 mt-1">
                              {/* Show name of first assigned staff as example */}
                              {typeof order.items[0].deliveryBoy === 'object' ? order.items[0].deliveryBoy.name : 'In Progress'}
                            </p>
                            <button 
                                onClick={() => setSelectedOrder(order)}
                                className="mt-3 text-[10px] font-black text-green-800 uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-green-900"
                            >
                                Change Staff
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center p-8">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 text-xl mb-4 border border-gray-100 shadow-sm">
                            <FaUserTie />
                          </div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">No staff assigned</p>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                          >
                            Assign Staff Now <FaChevronRight />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-indigo-600" /> Shipping To
                        </h4>
                        <div className="text-sm font-bold text-gray-700 leading-relaxed">
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                        </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FaShoppingBag className="text-indigo-600" /> Items from your store
                    </h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={`http://localhost:5000${item.image}`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-black text-gray-900 uppercase tracking-tight text-sm">{item.name}</h5>
                          <div className="flex gap-4 mt-1">
                            <span className="text-[10px] font-black text-indigo-500 uppercase">{item.duration} Days</span>
                            <span className={`text-[10px] font-black uppercase ${item.deliveryBoy ? 'text-green-500' : 'text-orange-500'}`}>
                                {item.deliveryStatus || 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setSelectedOrder(null)}
               className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                <div>
                   <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                     <FaUserTie /> Assign Staff
                   </h2>
                   <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mt-1">Order #{selectedOrder._id.slice(-6)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="hover:bg-white/20 p-2 rounded-full transition-all">
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="p-8">
                {staffLoading ? (
                    <div className="py-10 text-center"><FaClock className="animate-spin mx-auto text-indigo-600 text-2xl" /></div>
                ) : staff.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active staff found.</p>
                        <p className="text-gray-400 text-[10px] mt-2 italic">Please add staff in 'Staff Management' first.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Select Available Staff Member</p>
                        {staff.map((s) => (
                            <button 
                                key={s._id}
                                onClick={() => handleAssignStaff(s._id)}
                                className="w-full p-5 bg-gray-50 border-2 border-transparent hover:border-indigo-500 hover:bg-white rounded-2xl flex items-center justify-between group transition-all"
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <FaUserTie />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 uppercase tracking-tight">{s.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400">{s.phone}</p>
                                    </div>
                                </div>
                                <div className="p-2 rounded-full bg-white border border-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    <FaChevronRight size={12} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorOrders;
