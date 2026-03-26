import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
    FaTruck, 
    FaBox, 
    FaShippingFast, 
    FaCheckCircle, 
    FaClock, 
    FaShoppingBag, 
    FaCalendarAlt,
    FaArrowLeft,
    FaHistory,
    FaMoneyBillWave
} from "react-icons/fa";
import Navbar from "../../components/Navbar";

const OrderTracker = ({ order }) => {
    const status = order.items[0]?.deliveryStatus || 'Pending';
    const stages = [
        { id: 'Assigned', label: 'Confirmed', icon: <FaCheckCircle />, color: 'emerald' },
        { id: 'Picked Up', label: 'Collected', icon: <FaBox />, color: 'blue' },
        { id: 'Out for Delivery', label: 'On Way', icon: <FaShippingFast />, color: 'indigo' },
        { id: 'Delivered', label: 'Reached', icon: <FaTruck />, color: 'emerald' }
    ];
    const currentStageIdx = stages.findIndex(s => s.id === status);
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 mb-10 overflow-hidden relative group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <FaTruck size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Active Rental Shipment</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Order Ref: #{order._id.slice(-8)}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                        Status: {status}
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">Updated: {new Date(order.updatedAt).toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-100 rounded-full mx-4 mb-14 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(Math.max(0, currentStageIdx) / (stages.length - 1)) * 100}%` }}
                    className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </div>

            {/* Stage Icons */}
            <div className="flex justify-between px-2 relative z-10">
                {stages.map((stage, idx) => (
                    <div key={stage.id} className="flex flex-col items-center gap-3">
                        <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 shadow-sm ${
                                idx <= currentStageIdx 
                                ? 'bg-white text-indigo-600 border-2 border-indigo-100 shadow-indigo-100' 
                                : 'bg-transparent text-gray-200 border-2 border-dashed border-gray-100'
                            }`}
                        >
                            {stage.icon}
                        </motion.div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-500 ${
                            idx <= currentStageIdx ? 'text-gray-900' : 'text-gray-200'
                        }`}>
                            {stage.label}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const userId = user?.id || user?._id;
                
                if (userId) {
                    const res = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
                    if (res.data.success) {
                        setOrders(res.data.data);
                    }
                } else {
                    navigate("/login");
                }
            } catch (err) {
                console.error("Fetch Orders Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-white rounded-full animate-spin"></div>
                <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Retrieving Your Collection...</p>
            </div>
        );
    }

    const activeOrders = orders.filter(o => o.items.some(i => i.deliveryStatus !== 'Delivered'));
    const pastOrders = orders.filter(o => o.items.every(i => i.deliveryStatus === 'Delivered'));

    return (
        <div className="min-h-screen bg-[#fafbfc] font-sans text-gray-800 pb-24">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">My Rentals</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">Track and manage your style collection</p>
                    </div>
                    <button 
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                    >
                        <FaArrowLeft /> Browse More
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border border-gray-100 shadow-sm text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8">
                            <FaShoppingBag size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase mb-3">No Rentals Yet</h3>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-10 max-w-xs mx-auto leading-relaxed">
                            You haven't rented any designer wear yet. Start your journey today!
                        </p>
                        <button 
                            onClick={() => navigate("/")}
                            className="px-12 py-5 bg-gray-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
                        >
                            Rent Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-16">
                        
                        {/* 1. ACTIVE SHIPMENTS */}
                        {activeOrders.length > 0 && (
                            <section>
                                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-10 border-b border-gray-100 pb-4">
                                    Live Tracking
                                </h2>
                                <div className="space-y-12">
                                    {activeOrders.map(order => (
                                        <div key={order._id} className="space-y-8">
                                            <OrderTracker order={order} />
                                            
                                            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm overflow-hidden relative">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                                    <div className="lg:col-span-2 space-y-8">
                                                        <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3">
                                                            <FaShoppingBag /> Item Details
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex gap-5 group">
                                                                    <div className="w-24 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 group-hover:border-indigo-200 transition-colors">
                                                                        <img 
                                                                            src={item.image ? `http://localhost:5000${item.image}` : "https://via.placeholder.com/200x300"} 
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                            alt={item.name}
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col justify-center">
                                                                        <h5 className="font-black text-gray-900 text-[11px] uppercase tracking-wider mb-1">{item.name}</h5>
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3 italic">{item.duration} Days Rental</p>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100">Paid Full</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 rounded-3xl p-8 space-y-6">
                                                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none border-b border-gray-200 pb-4 mb-4">Rental Summary</h5>
                                                        
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] items-center flex gap-2 font-bold text-gray-500 uppercase"><FaCalendarAlt className="text-indigo-400"/> Delivery</span>
                                                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">Expected Soon</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] items-center flex gap-2 font-bold text-gray-500 uppercase"><FaHistory className="text-rose-400"/> Return By</span>
                                                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">TBD</span>
                                                            </div>
                                                            <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                                                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Paid Amount</span>
                                                                <span className="text-lg font-black text-indigo-600 leading-none">₹{order.totalAmount}</span>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            disabled
                                                            className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 cursor-not-allowed"
                                                        >
                                                            Support Center
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 2. COMPLETED RENTALS */}
                        {pastOrders.length > 0 && (
                            <section>
                                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-10 border-b border-gray-100 pb-4">
                                    Order History
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {pastOrders.map(order => (
                                        <div key={order._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all duration-500">
                                            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                                                <FaCheckCircle size={30} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h5 className="font-black text-gray-900 text-xs uppercase tracking-widest">Order Success</h5>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">#{order._id.slice(-6)}</p>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900">₹{order.totalAmount}</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.items.length} Items</span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Delivered</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
