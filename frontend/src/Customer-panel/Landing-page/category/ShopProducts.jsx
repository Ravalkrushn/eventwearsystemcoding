import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaStore, 
  FaRupeeSign, 
  FaTag, 
  FaArrowLeft, 
  FaSpinner,
  FaFilter,
  FaShoppingBag
} from "react-icons/fa";
import Navbar from "../../../components/Navbar";

const ShopProducts = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState("All");

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                setLoading(true);
                const [prodRes, vendorRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/products/vendor/${vendorId}`),
                    axios.get(`http://localhost:5000/api/vendors/profile/${vendorId}`)
                ]);
                setProducts(prodRes.data.data.filter(p => p.status === 'approved'));
                setShop(vendorRes.data.data);
            } catch (err) {
                console.error("Error fetching shop data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShopData();
    }, [vendorId]);

    const categories = ["All", ...new Set(products.map(p => p.category))];
    const filteredProducts = filterCategory === "All" 
        ? products 
        : products.filter(p => p.category === filterCategory);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
                <p className="text-gray-500 font-bold tracking-widest uppercase">Fetching Collection...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Shop Banner */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                    
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-5xl shadow-2xl shadow-indigo-200 shrink-0 relative z-10">
                        {shop?.shopImage ? (
                            <img 
                                src={`http://localhost:5000${shop.shopImage}`} 
                                alt={shop.shopName} 
                                className="w-full h-full object-cover rounded-[2rem]"
                            />
                        ) : <FaStore />}
                    </div>

                    <div className="flex-1 text-center md:text-left relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                {shop?.shopName}
                            </h1>
                            <span className="w-fit mx-auto md:mx-0 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
                                Verified Store
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium text-lg max-w-2xl">
                            {shop?.shopAddress}, {shop?.city}
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Contact</p>
                                <p className="text-xl font-black text-gray-900">{shop?.phone || "Not available"}</p>
                            </div>
                            <div className="px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Owner</p>
                                <p className="text-xl font-black text-indigo-600">{shop?.ownerName}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Results */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400">
                            <FaFilter />
                        </div>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-6 py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap shadow-sm ${
                                    filterCategory === cat 
                                    ? "bg-indigo-600 text-white shadow-indigo-200" 
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">
                        Showing {filteredProducts.length} items
                    </p>
                </div>

                {/* Products Grid */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product._id}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all border border-gray-100 group cursor-pointer"
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <div className="h-64 relative overflow-hidden bg-gray-50">
                                    <img 
                                        src={`http://localhost:5000${product.images[0]}`} 
                                        alt={product.productName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg border border-white">
                                        <FaTag className="text-indigo-600 text-[10px]" />
                                        <span className="text-[10px] font-black text-gray-900 uppercase">{product.category}</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                                        <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl">
                                            <FaShoppingBag /> Rent Now
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                        {product.productName}
                                    </h3>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Rental Price</p>
                                            <p className="text-2xl font-black text-gray-900 flex items-center">
                                                <FaRupeeSign size={16} className="text-indigo-600" /> {product.pricePerDay}
                                                <span className="text-xs text-gray-400 font-bold ml-1">/day</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Security</p>
                                            <p className="text-sm font-bold text-gray-600 flex items-center justify-end">
                                                <FaRupeeSign size={10} /> {product.deposit}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                                        <span className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                            Size: {product.size}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                            {product.material}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <p className="text-xl font-black text-gray-300 uppercase tracking-widest">No products found in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopProducts;
