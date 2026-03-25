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
  FaClock,
  FaCalendarAlt,
  FaInfoCircle
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
    const [rentalDuration, setRentalDuration] = useState("3");
    const [eventDate, setEventDate] = useState("");
    const [isCustomDuration, setIsCustomDuration] = useState(false);
    const [tempCustomValue, setTempCustomValue] = useState("");
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

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
                            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all"
                        >
                            Understood
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

    const CustomDurationModal = ({ isOpen, onClose, onDone }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10"
                >
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                        <FaClock />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Custom Duration</h3>
                    <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest">How many days do you need?</p>
                    
                    <div className="space-y-6">
                        <input 
                            type="number"
                            autoFocus
                            placeholder="Enter days"
                            value={tempCustomValue}
                            onChange={(e) => setTempCustomValue(e.target.value)}
                            className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-center text-3xl font-black text-indigo-600 outline-none transition-all placeholder:text-gray-200"
                        />
                        <div className="flex gap-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all font-bold"
                            > Close </button>
                            <button 
                                onClick={() => {
                                    if (tempCustomValue && parseInt(tempCustomValue) > 0) {
                                        onDone(tempCustomValue);
                                    }
                                }}
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                            > Done </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    // Auto-slide effect
    useEffect(() => {
        if (product && product.images && product.images.length > 1 && !isModalOpen && !selectedPolicy && !isCustomModalOpen) {
            const interval = setInterval(() => {
                setSelectedImage((prev) => (prev + 1) % product.images.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [product, isModalOpen, selectedPolicy, isCustomModalOpen]);

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

    const standardDurations = ["3", "5", "7", "10"];
    const isStandard = standardDurations.includes(rentalDuration);

    // Get minimum allowed date (Today + 5 days) in YYYY-MM-DD format for local timezone
    const getMinDate = () => {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 5); // Add 5 days for preparation gap
        const yyyy = minDate.getFullYear();
        const mm = String(minDate.getMonth() + 1).padStart(2, '0');
        const dd = String(minDate.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const getCalculatedDates = () => {
        if (!eventDate) return null;
        const eDate = new Date(eventDate);
        if (isNaN(eDate.getTime())) return null;
        
        // Delivery is 2 days before the event
        const dDate = new Date(eDate);
        dDate.setDate(dDate.getDate() - 2);
        
        // Return is Delivery Date + rental duration
        const rDate = new Date(dDate);
        rDate.setDate(rDate.getDate() + parseInt(rentalDuration || 0));
        
        const formatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return {
            delivery: dDate.toLocaleDateString('en-IN', formatOptions),
            return: rDate.toLocaleDateString('en-IN', formatOptions)
        };
    };

    const calculatedDates = getCalculatedDates();

    const handleProceedToRent = () => {
        if (!eventDate) {
            import("react-hot-toast").then((module) => {
                module.toast.error("Please select an Event Date to proceed.");
            });
            return;
        }

        const cartItem = {
            id: product._id || Date.now().toString(),
            name: product.productName,
            vendorName: product.vendor?.shopName,
            image: product.images[0],
            description: product.description,
            code: product.category,
            price: product.pricePerDay * parseInt(rentalDuration || 3),
            deposit: product.deposit,
            duration: `${rentalDuration} Days`,
            deliveryDate: calculatedDates?.delivery || eventDate,
            returnDate: calculatedDates?.return || eventDate,
            policies: policies
        };

        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = existingCart.findIndex(item => item.id === cartItem.id);
        if (existingIndex > -1) {
            existingCart[existingIndex] = cartItem;
        } else {
            existingCart.push(cartItem);
        }
        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));

        navigate("/cart");
    };

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

            <AnimatePresence>
                {isCustomModalOpen && (
                    <CustomDurationModal 
                        isOpen={isCustomModalOpen} 
                        onClose={() => setIsCustomModalOpen(false)}
                        onDone={(val) => {
                            setRentalDuration(val);
                            setIsCustomDuration(true);
                            setIsCustomModalOpen(false);
                        }}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left Column: Side Thumbnails + Main Image */}
                    <div className="flex flex-col gap-8 sticky top-24">
                        <div className="flex gap-6">
                            {/* Vertical Thumbnails */}
                            <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
                                {product.images.map((img, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ x: 5 }}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === idx ? "border-indigo-600 shadow-md shadow-indigo-100" : "border-gray-100 hover:border-indigo-200"}`}
                                    >
                                        <img src={`http://localhost:5000${img}`} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div 
                                className="flex-1 aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm cursor-zoom-in relative"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img 
                                        key={selectedImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        src={`http://localhost:5000${product.images[selectedImage]}`} 
                                        alt={product.productName} 
                                        className="w-full h-full object-cover absolute inset-0"
                                    />
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Store Policies below images */}
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 font-bold">Store Policies</h3>
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
                                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-[1.2rem] shadow-sm hover:shadow-md transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {p.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{p.label}</p>
                                            <p className="text-xs font-bold text-indigo-600 mt-0.5 underline">View Details</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Info & Actions */}
                    <div className="space-y-10">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight uppercase">
                                {product.productName}
                            </h1>
                            <div className="flex items-end gap-3 pt-6 border-t border-gray-50">
                                <span className="text-5xl font-black text-indigo-600 flex items-center leading-none">
                                    <FaRupeeSign className="text-3xl" /> {product.pricePerDay}
                                </span>
                                <div className="flex flex-col text-gray-400">
                                    <span className="text-xs font-black uppercase tracking-widest leading-none mb-1">Per Day Rent</span>
                                    <span className="text-[11px] font-bold italic">Inclusive of all taxes</span>
                                </div>
                            </div>
                        </section>

                        {/* Rental Options: Duration & Date */}
                        <section className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8 shadow-sm">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <FaClock className="text-indigo-400" /> Select Duration
                                </label>
                                <div className="grid grid-cols-5 gap-3">
                                    {standardDurations.map((days) => (
                                        <button
                                            key={days}
                                            onClick={() => {
                                                setRentalDuration(days);
                                                setIsCustomDuration(false);
                                            }}
                                            className={`py-3 rounded-2xl font-black text-sm transition-all ${
                                                rentalDuration === days 
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                                                : "bg-white text-gray-600 border border-gray-100 hover:border-indigo-200"
                                            }`}
                                        >
                                            {days} Days
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => {
                                            setTempCustomValue(isStandard ? "" : rentalDuration);
                                            setIsCustomModalOpen(true);
                                        }}
                                        className={`py-3 rounded-2xl font-black text-sm transition-all ${
                                            !isStandard 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                                            : "bg-white text-gray-600 border border-gray-100 hover:border-indigo-200"
                                        }`}
                                    >
                                        {!isStandard ? `${rentalDuration} Days` : "More"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <FaCalendarAlt className="text-indigo-400" /> Event Date
                                </label>
                                <div className={`grid gap-4 ${eventDate ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
                                    <input 
                                        type="date" 
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                                        min={getMinDate()}
                                    />
                                    
                                    {eventDate && calculatedDates && (
                                        <>
                                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-center items-start pl-6 text-left">
                                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Delivery Date</span>
                                                <span className="text-sm font-black text-indigo-600">{calculatedDates.delivery}</span>
                                            </div>
                                            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex flex-col justify-center items-start pl-6 text-left">
                                                <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Return Date</span>
                                                <span className="text-sm font-black text-rose-600">{calculatedDates.return}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 italic flex items-center gap-2 font-bold leading-relaxed">
                                    <FaInfoCircle size={14} className="shrink-0" /> We recommend booking 2-3 days before your event.
                                </p>
                            </div>
                        </section>

                        {/* Description & Metadata */}
                        <section className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Description</h3>
                                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                                    {product.description}
                                </p>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" /> Color
                                    </div>
                                    <p className="text-lg font-black text-gray-900 uppercase">{product.color || "As shown"}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> Material
                                    </div>
                                    <p className="text-lg font-black text-gray-900 uppercase">{product.material || "Premium"}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" /> Size
                                    </div>
                                    <div>
                                        <span className="inline-flex px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-black shadow-lg shadow-indigo-100 uppercase">
                                            {product.size}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="flex items-center justify-end gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                        Security <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    </div>
                                    <p className="text-lg font-black text-indigo-600">
                                        ₹{product.deposit} <span className="text-[12px] text-gray-300 font-bold italic tracking-tighter">(Refundable)</span>
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Vendor Section */}
                        <section className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-2xl shadow-sm"><FaStore /></div>
                                <div>
                                    <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Store Location</p>
                                    <h4 className="text-lg font-black text-gray-900">{product.vendor?.shopName}</h4>
                                    <p className="text-xs font-bold text-gray-500">{product.vendor?.shopAddress}, {product.vendor?.city}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <a href={`tel:${product.vendor?.phone}`} className="flex items-center gap-2 px-5 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase shadow-sm hover:shadow-md transition-all">
                                    <FaPhone /> {product.vendor?.phone}
                                </a>
                            </div>
                        </section>

                        {/* Checkout CTA */}
                        <section className="pt-4">
                            <button 
                                onClick={handleProceedToRent}
                                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition-all transform hover:-translate-y-1"
                            >
                                Proceed to Rent
                            </button>
                            <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">
                                * Final price will depend on selected duration and shipping.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
