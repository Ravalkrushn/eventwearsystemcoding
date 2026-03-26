import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaClock, 
  FaUser, 
  FaBox, 
  FaCalendarAlt, 
  FaHistory, 
  FaExclamationTriangle,
  FaPhone
} from "react-icons/fa";
import axios from "axios";

const ActiveRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const vendor = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/vendors/orders/${vendor.id}`);
                if (res.data.success) {
                    // Filter orders that are "Paid" but not yet returned
                    // Since the current schema might not have an explicit 'Returned' status for the whole order, 
                    // we'll focus on items with 'Delivered' deliveryStatus but not yet finished.
                    // For now, let's treat all 'Delivered' items as 'Active Rentals'
                    const active = res.data.data.filter(order => 
                        order.items.some(item => item.deliveryStatus === 'Delivered')
                    );
                    setRentals(active);
                }
            } catch (err) {
                console.error("Error fetching rentals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, [vendor.id]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Active Rentals</h1>
                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Track items currently with customers</p>
                </div>
                <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-3">
                    <FaClock className="animate-pulse" />
                    <span className="text-sm font-black">{rentals.length} LIVE RENTALS</span>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : rentals.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
                    <FaBox size={40} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active rentals found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentals.map((order) => (
                        <motion.div 
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                        <FaUser size={12} />
                                    </div>
                                    <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">{order.shippingAddress.name}</span>
                                </div>
                                <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase tracking-widest">In Use</span>
                            </div>
                            
                            <div className="p-5 space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 italic text-[10px]">IMG</div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">{item.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                                                    <FaCalendarAlt className="text-indigo-400" /> {item.duration} Days
                                                </p>
                                                <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1 uppercase">
                                                    <FaHistory /> Returns: {new Date(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + item.duration)).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                                        <FaPhone size={10} /> Contact Buyer
                                    </button>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Order Amount</p>
                                        <p className="text-sm font-black text-gray-900 leading-none">₹{order.totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveRentals;
