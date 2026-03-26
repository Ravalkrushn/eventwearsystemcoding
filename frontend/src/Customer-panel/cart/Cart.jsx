import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTimes, 
    FaWhatsapp, 
    FaCheckCircle, 
    FaShieldAlt, 
    FaTruck, 
    FaClock, 
    FaExclamationTriangle 
} from "react-icons/fa";
import Navbar from "../../components/Navbar";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const PolicyModal = ({ policy, onClose }) => {
        if (!policy) return null;
        return (
            <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-indigo-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-2xl"><FaShieldAlt /></div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">{policy.title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><FaTimes size={24} /></button>
                    </div>
                    <div className="p-10 max-h-[60vh] overflow-y-auto space-y-6">
                        <div className="text-gray-600 leading-neutral space-y-4 font-medium whitespace-pre-line">
                            {policy.content}
                        </div>
                        {policy.disclaimer && (
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <FaExclamationTriangle /> Disclaimer
                                </p>
                                <p className="text-xs text-red-600 font-bold italic leading-relaxed">
                                    {policy.disclaimer}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="p-8 bg-gray-50 flex justify-end">
                        <button 
                            onClick={onClose}
                            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all"
                        >
                            Understood
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const handlePlaceOrder = () => {
        navigate("/delivery");
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center pt-24">
                    <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Your Cart is Empty</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">No items in your cart yet.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition"
                    >
                        Go Shopping
                    </button>
                </div>
            </div>
        );
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 pb-20">
            <Navbar />

            <AnimatePresence>
                {selectedPolicy && (
                    <PolicyModal 
                        policy={selectedPolicy} 
                        onClose={() => setSelectedPolicy(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Stepper */}
            <div className="w-full flex justify-center pt-28 pb-4">
                <div className="flex items-center text-xl font-black gap-2 md:gap-4 tracking-wide">
                    <span className="text-[#e20000]">Cart</span>
                    <span className="w-12 md:w-24 h-[1px] bg-gray-800"></span>
                    <span className="text-gray-800 uppercase text-sm tracking-widest opacity-30">Delivery</span>
                    <span className="w-12 md:w-24 h-[1px] bg-gray-200"></span>
                    <span className="text-gray-800 uppercase text-sm tracking-widest opacity-30">Payment</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* LEFT COLUMN: Cart Items & Info */}
                    <div className="flex-1 flex flex-col">
                        
                        {/* Header */}
                        <div className="text-center font-black text-xs uppercase tracking-widest py-4 bg-gray-50 border-b border-gray-100 text-gray-400">
                            {cartItems.length} Items In Your Cart
                        </div>

                        {/* Cart Items */}
                        <div className="flex flex-col border-b border-gray-100">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-100/50 last:border-0 relative">
                                    <div className="w-40 h-[220px] shrink-0 bg-gray-100 overflow-hidden shadow-sm rounded-2xl">
                                        <img
                                            src={item.image ? `http://localhost:5000${item.image}` : "https://via.placeholder.com/300x400"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-3 relative">
                                            <h3 className="text-base font-medium text-gray-800 uppercase tracking-wide">
                                                {item.vendorName || "VENDOR / BRAND"}
                                            </h3>
                                            
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="absolute -top-1 -right-2 w-7 h-7 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                                            >
                                                <FaTimes size={12} />
                                            </button>

                                            <p className="text-gray-500 text-sm leading-relaxed pr-8">
                                                {item.description || "Rent this stunning piece of fashion."}
                                            </p>
                                            <p className="font-bold text-gray-700 uppercase tracking-widest text-sm">
                                                {item.code || "ITEM-CODE"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-4 gap-6 pt-6">
                                            <div>
                                                <p className="text-xs text-gray-400 capitalize mb-1">Delivery date</p>
                                                <p className="font-semibold text-gray-800 text-sm">{item.deliveryDate || "-"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 capitalize mb-1">Pickup date</p>
                                                <p className="font-semibold text-gray-800 text-sm">{item.returnDate || "-"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 capitalize mb-1">Duration</p>
                                                <p className="font-semibold text-gray-800 text-sm">{parseInt(item.duration) || "3"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 capitalize mb-1">Total Rental</p>
                                                <p className="font-semibold text-gray-800 text-sm">Rs. {item.price || 0} /-</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Store Policies */}
                        <div className="p-6 bg-white pt-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Store Policies</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { type: 'Custom Fitting', icon: <FaCheckCircle />, label: 'Custom Fitting' },
                                    { type: 'Security Deposit', icon: <FaShieldAlt />, label: 'Security Deposit' },
                                    { type: 'Return', icon: <FaTruck />, label: 'Return Policy' },
                                    { type: 'Cancellation', icon: <FaClock />, label: 'Cancellation' }
                                ].map((p) => (
                                    <motion.button
                                        key={p.type}
                                        whileHover={{ scale: 1.02, backgroundColor: '#ffffff' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            const policy = cartItems[0]?.policies?.find(pol => pol.type === p.type);
                                            if (policy) setSelectedPolicy(policy);
                                        }}
                                        className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-gray-100 rounded-[1.2rem] shadow-sm hover:shadow-md transition-all text-center group"
                                    >
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {p.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">{p.label}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Cost Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col p-8 sticky top-24">
                            
                            <h3 className="text-xs font-black text-gray-400 tracking-[0.2em] mb-8 uppercase">
                                Cost Summary
                            </h3>

                            <div className="space-y-6 flex-1 text-sm text-gray-800">
                                {cartItems.map((cartItem, idx) => {
                                    const itemDuration = parseInt(cartItem.duration) || 3;
                                    const itemTotal = cartItem.price || 0;
                                    const itemPerDay = itemTotal / itemDuration;
                                    
                                    return (
                                        <div key={idx} className="flex justify-between items-start font-medium border-b border-gray-100 pb-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{cartItem.name || "Item"}</span>
                                                <span className="text-xs text-gray-400 font-bold italic tracking-tighter mt-1">{itemDuration} Days × Rs. {itemPerDay.toFixed(0)} / day</span>
                                            </div>
                                            <span className="font-black text-indigo-600">Rs. {itemTotal}/-</span>
                                        </div>
                                    );
                                })}

                                <div className="flex justify-between items-start pt-2 font-black text-gray-900 text-lg uppercase">
                                    <span>To Pay</span>
                                    <span>Rs. {totalAmount} /-</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <button className="w-full h-14 bg-white border border-gray-200 text-[#e20000] text-[10px] font-black tracking-widest uppercase rounded-2xl hover:bg-gray-50 transition overflow-hidden relative flex items-center">
                                    <motion.div
                                        animate={{ x: ["0%", "-50%"] }}
                                        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                                        className="whitespace-nowrap flex shrink-0"
                                    >
                                        <span className="flex-none w-[400px] text-center px-4">READ Store Policies</span>
                                        <span className="flex-none w-[400px] text-center px-4">READ Store Policies</span>
                                    </motion.div>
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full py-5 bg-gray-900 text-white text-sm font-black tracking-widest uppercase rounded-2xl shadow-xl hover:bg-gray-800 transition transform hover:-translate-y-1"
                                >
                                    PLACE ORDER
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <a 
                href="https://wa.me/1234567890" 
                target="_blank" 
                rel="noreferrer" 
                className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl shadow-2xl hover:bg-green-600 transition-colors z-50"
            >
                <FaWhatsapp />
            </a>
        </div>
    );
};

export default Cart;
