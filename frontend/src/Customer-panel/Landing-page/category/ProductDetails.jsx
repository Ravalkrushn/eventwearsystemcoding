import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaRupeeSign, 
  FaTag, 
  FaArrowLeft, 
  FaSpinner, 
  FaShieldAlt, 
  FaTruck, 
  FaCheckCircle,
  FaStore,
  FaPhone,
  FaTimes,
  FaExclamationTriangle,
  FaClock
} from "react-icons/fa";
import Navbar from "../../../components/Navbar";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    useEffect(() => {
        const fetchProductAndPolicies = async () => {
            try {
                setLoading(true);
                const prodRes = await axios.get(`http://localhost:5000/api/products/${id}`);
                const productData = prodRes.data.data;
                setProduct(productData);

                if (productData.vendor?._id) {
                    const policyRes = await axios.get(`http://localhost:5000/api/vendors/policies/${productData.vendor._id}`);
                    setPolicies(policyRes.data.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndPolicies();
    }, [id]);

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
                            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl"
                        >
                            Understood
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };
    
    // ... rest of the loading/error checks ...

    // Auto-slide effect
    useEffect(() => {
        // Pause if either modal or policy is open
        if (product && product.images && product.images.length > 1 && !isModalOpen && !selectedPolicy) {
            const interval = setInterval(() => {
                setSelectedImage((prev) => (prev + 1) % product.images.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [product, isModalOpen, selectedPolicy]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <FaSpinner className="animate-spin text-5xl text-indigo-600 mb-4" />
                <p className="text-gray-500 font-black uppercase tracking-widest">Loading Details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">Product Not Found</h2>
                <button onClick={() => navigate(-1)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
            <Navbar />
            
            <AnimatePresence>
                {selectedPolicy && (
                    <PolicyModal 
                        policy={selectedPolicy} 
                        onClose={() => setSelectedPolicy(null)} 
                    />
                )}
            </AnimatePresence>
            
            {/* Full Screen Image Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                    onClick={() => setIsModalOpen(false)}
                >
                    <button 
                        className="absolute top-10 right-10 text-white text-4xl hover:text-indigo-400 transition-colors"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <FaTimes />
                    </button>
                    <motion.img 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={`http://localhost:5000${product.images[selectedImage]}`} 
                        alt="Full View" 
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs / Back */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold transition-all mb-8 uppercase text-xs tracking-widest"
                >
                    <FaArrowLeft /> Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Images */}
                    <div className="space-y-6">
                        <div 
                            className="aspect-square max-h-[550px] mx-auto rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm cursor-zoom-in relative"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <AnimatePresence>
                                <motion.img 
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    src={`http://localhost:5000${product.images[selectedImage]}`} 
                                    alt={product.productName} 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 absolute inset-0"
                                />
                            </AnimatePresence>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === idx ? "border-indigo-600 shadow-md shadow-indigo-100" : "border-gray-100 hover:border-indigo-200"}`}
                                >
                                    <img src={`http://localhost:5000${img}`} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </div>

                        {/* 4-Policy Button Grid */}
                        <div className="pt-8 mt-8 border-t border-gray-100">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Our Store Policies</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { type: 'Custom Fitting', icon: <FaCheckCircle />, label: 'Custom Fitting' },
                                    { type: 'Security Deposit', icon: <FaShieldAlt />, label: 'Security Deposit' },
                                    { type: 'Return', icon: <FaTruck />, label: 'Return Policy' },
                                    { type: 'Cancellation', icon: <FaClock />, label: 'Cancellation' }
                                ].map((p) => (
                                    <motion.button
                                        key={p.type}
                                        whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            const policy = policies.find(item => item.type === p.type);
                                            if (policy) setSelectedPolicy(policy);
                                        }}
                                        className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all text-left"
                                    >
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg">
                                            {p.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.label}</p>
                                            <p className="text-xs font-bold text-indigo-600 mt-0.5">View Details</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Title & Price Header */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        {product.category}
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                        {product.productName}
                                    </h1>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-3xl md:text-4xl font-black text-indigo-600 flex items-center justify-end">
                                        <FaRupeeSign size={24} /> {product.pricePerDay.toLocaleString()}
                                    </p>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Per Day Rent</p>
                                    <p className="text-[10px] text-gray-300 font-bold mt-1">Inclusive of all taxes</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                {product.description}
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div 
                                    onClick={() => setSelectedPolicy(policies.find(p => p.type === 'Security Deposit'))}
                                    className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                                        <FaShieldAlt />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Security</p>
                                    <p className="text-sm font-black text-gray-900 flex items-center gap-1 justify-center">
                                        <FaRupeeSign size={10} /> {product.deposit} <span className="text-[8px] text-gray-400">(Refundable)</span>
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center group hover:bg-white hover:border-indigo-100 transition-all">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                                        <FaTruck />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pick Up</p>
                                    <p className="text-sm font-black text-gray-900">Free Store Pick</p>
                                </div>
                                <div 
                                    onClick={() => setSelectedPolicy(policies.find(p => p.type === 'Custom Fitting'))}
                                    className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                                        <FaCheckCircle />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Services</p>
                                    <p className="text-sm font-black text-gray-900 underline underline-offset-4 decoration-indigo-200 decoration-2">Custom Fitting</p>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-100 mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</p>
                                    <p className="font-black text-gray-900">{product.category}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Color</p>
                                    <p className="font-black text-gray-900">{product.color || "As shown"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Material</p>
                                    <p className="font-black text-gray-900">{product.material || "Premium Fabric"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Available Size</p>
                                    <div className="flex gap-2">
                                        <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100">
                                            {product.size}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Vendor Information */}
                            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-2xl shadow-sm">
                                        <FaStore />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Pick up Store</p>
                                        <h4 className="text-xl font-black text-gray-900">{product.vendor?.shopName}</h4>
                                        <p className="text-xs font-bold text-gray-500">{product.vendor?.shopAddress}, {product.vendor?.city}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <a href={`tel:${product.vendor?.phone}`} className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow">
                                        <FaPhone /> {product.vendor?.phone}
                                    </a>
                                </div>
                            </div>

                            {/* CTA Action */}
                            <div className="pt-8">
                                <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-gray-800 transition-all transform hover:-translate-y-1 active:translate-y-0">
                                    Rent this Item Now
                                </button>
                                <p className="text-center text-[10px] text-gray-400 font-bold mt-4 tracking-widest uppercase">
                                    * Security deposit is fully refundable after item return.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Similar Products? Maybe later */}
            </div>
        </div>
    );
};

export default ProductDetails;
