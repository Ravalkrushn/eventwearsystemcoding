import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaStore, FaMapMarkerAlt, FaStar, FaArrowLeft, FaSpinner } from "react-icons/fa";

import Navbar from "../../../components/Navbar";

const ShopsByCategory = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/vendors/category/${categoryName}`);
                setShops(res.data.data);
            } catch (err) {
                console.error("Error fetching shops:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, [categoryName]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col mb-12">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                        {categoryName} <span className="text-indigo-600">EventWear</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">Explore the best rental stores for your occasion.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-bold">Finding the best collection for you...</p>
                    </div>
                ) : shops.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {shops.map((shop, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={shop._id}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all border border-gray-100 group flex flex-col h-full"
                            >
                                {/* Shop Image Placeholder/Banner */}
                                <div className="h-48 bg-indigo-600 relative overflow-hidden">
                                    {shop.shopImage ? (
                                        <img 
                                            src={`http://localhost:5000${shop.shopImage}`} 
                                            alt={shop.shopName} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaStore className="text-white/20 text-7xl" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <FaStar className="text-yellow-400 text-sm" />
                                        <span className="text-xs font-black text-gray-900">4.8</span>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                                            <FaStore />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                                {shop.shopName}
                                            </h2>
                                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{shop.ownerName}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <FaMapMarkerAlt className="text-indigo-400 shrink-0" />
                                            <span className="text-sm font-medium">{shop.shopAddress}, {shop.city}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <div className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            Trusted Vendor
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/shop/${shop._id}`)}
                                            className="text-indigo-600 font-black text-sm hover:underline flex items-center gap-2"
                                        >
                                            View Collection <FaArrowLeft className="rotate-180" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaStore className="text-gray-300 text-4xl" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">No stores found here yet!</h2>
                        <p className="text-gray-500 font-medium mb-8">We currently don't have any vendors listed in this category.</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition"
                        >
                            Return to Categories
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopsByCategory;
