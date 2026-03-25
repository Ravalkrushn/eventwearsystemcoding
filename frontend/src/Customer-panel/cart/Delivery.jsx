import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const Delivery = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        altPhone: "",
        postCode: "",
        address: "",
        locality: "",
        city: "",
        termsAccepted: false
    });
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
        
        setCartItems(storedCart);
        setFormData({
            name: savedAddress.name || storedUser.fullName || storedUser.name || "",
            email: savedAddress.email || storedUser.email || "",
            phone: savedAddress.phone || storedUser.phone || "",
            altPhone: savedAddress.altPhone || "",
            address: savedAddress.address || storedUser.address || "",
            city: savedAddress.city || storedUser.city || "",
            postCode: savedAddress.postCode || "",
            locality: savedAddress.locality || "",
            termsAccepted: savedAddress.termsAccepted || false
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        setFormData(prev => {
            const newFormData = { ...prev, [name]: updatedValue };
            localStorage.setItem('shippingAddress', JSON.stringify(newFormData));
            return newFormData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.termsAccepted) {
            Swal.fire({
                icon: "warning",
                title: "Terms & Conditions",
                text: "Please accept the terms and conditions to proceed.",
                confirmButtonColor: "#e20000"
            });
            return;
        }

        setLoading(true);

        try {
            const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
            const totalAmount = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

            const orderData = {
                user: userId || null, // Guest checkout support if no user ID
                items: cartItems.map(item => ({
                    product: item.id || item._id, // Ensure we have the product ID
                    name: item.name,
                    price: item.price,
                    duration: parseInt(item.duration),
                    deliveryDate: item.deliveryDate,
                    returnDate: item.returnDate,
                    image: item.image
                })),
                totalAmount: totalAmount,
                shippingAddress: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    altPhone: formData.altPhone,
                    address: formData.address,
                    locality: formData.locality,
                    city: formData.city,
                    postCode: formData.postCode
                }
            };

            const response = await axios.post("http://localhost:5000/api/orders", orderData);

            if (response.data.success) {
                // Store order ID in local storage for payment step
                localStorage.setItem("currentOrderId", response.data.order._id);
                
                await Swal.fire({
                    icon: "success",
                    title: "Address Saved!",
                    text: "Your delivery details have been recorded successfully. Redirecting to payment...",
                    confirmButtonText: "Proceed to Payment",
                    confirmButtonColor: "#4F46E5",
                    showConfirmButton: true,
                    timer: 3000,
                    timerProgressBar: true
                });
                
                navigate("/payment");
            }
        } catch (error) {
            console.error("Order Saving Error:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Failed to save details. Please try again.",
                confirmButtonColor: "#d33"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 pb-20">
            <Navbar />

            {/* Stepper */}
            <div className="w-full flex justify-center pt-28 pb-4">
                <div className="flex items-center text-xl font-black gap-2 md:gap-4 tracking-wide">
                    <span className="text-gray-400">Cart</span>
                    <span className="w-12 md:w-24 h-[1px] bg-gray-800"></span>
                    <span className="text-[#e20000]">Delivery</span>
                    <span className="w-12 md:w-24 h-[1px] bg-gray-800"></span>
                    <span className="text-gray-800">Payment</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <button 
                    onClick={() => navigate("/cart")}
                    className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold transition-all mb-8 uppercase text-xs tracking-widest"
                >
                    <FaArrowLeft /> Back to Cart
                </button>

                <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12">
                    <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-wide border-b border-gray-200 pb-4">
                        Address Details
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Name *</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email *</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Phone No */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Phone No *</label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* Alternate Phone No */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Alternate Phone No</label>
                                <input 
                                    type="tel" 
                                    name="altPhone"
                                    value={formData.altPhone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                    placeholder="Enter alternate phone number"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Address *</label>
                            <textarea 
                                name="address"
                                required
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm resize-none"
                                placeholder="House/Flat No, Building Name, Street"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Locality/Area */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Locality/Area *</label>
                                <input 
                                    type="text" 
                                    name="locality"
                                    required
                                    value={formData.locality}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                    placeholder="Enter locality"
                                />
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">City *</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                    placeholder="Enter city"
                                />
                            </div>

                            {/* Post Code */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Post Code *</label>
                                <input 
                                    type="text" 
                                    name="postCode"
                                    required
                                    value={formData.postCode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                    placeholder="Enter zip code"
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-200 space-y-4">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Terms & Conditions *</h3>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        name="termsAccepted"
                                        required
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                                <span className="text-sm font-bold text-gray-700">I agree to terms and conditions</span>
                            </label>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit"
                                disabled={!formData.termsAccepted || loading}
                                className={`w-full md:w-auto px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl transition-all transform ${
                                    (!formData.termsAccepted || loading)
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                                    : "bg-gray-900 text-white hover:bg-gray-800 hover:-translate-y-1"
                                }`}
                            >
                                {loading ? "Processing..." : "Proceed to Payment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Delivery;
