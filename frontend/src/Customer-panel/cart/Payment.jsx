import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaArrowLeft, FaCreditCard, FaLock, FaCheckCircle, FaMobileAlt, FaWallet } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe with placeholder test key
const stripePromise = loadStripe("pk_test_51TE98fAzgWGYlU7s23yc2q2JZ48kHRfgFkiDRLzE8pwygcaqV8PSYwmSdhbevWu55LDXB6AsxkoZdxwFRoEUhCCp00jWHrumy3");
//hiiiii
const StripePaymentForm = ({ order, onPaymentSuccess }) => {
    const stripe = useStripe();
    const [clientSecret, setClientSecret] = useState("");
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL for Stripe to redirect after payment (could be a success page)
                return_url: window.location.origin + "/payment-success",
            },
            redirect: 'if_required' 
        });

        if (error) {
            setErrorMessage(error.message);
            Swal.fire({
                title: "Payment Error",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#4F46E5"
            });
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Payment success!
            onPaymentSuccess(paymentIntent);
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
                <PaymentElement />
            </div>
            
            {errorMessage && (
                <div className="text-red-500 text-xs font-bold uppercase tracking-tight">
                    {errorMessage}
                </div>
            )}

            <motion.button
                whileHover={!isProcessing ? { scale: 1.02 } : {}}
                whileTap={!isProcessing ? { scale: 0.98 } : {}}
                disabled={isProcessing || !stripe}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all relative overflow-hidden ${
                    isProcessing 
                    ? "bg-indigo-600/50 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
            >
                {isProcessing ? "Processing..." : `Pay Rs. ${order.totalAmount}`}
            </motion.button>
        </form>
    );
};

const Payment = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("stripe"); // Default to Stripe
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        const fetchOrderAndSecret = async () => {
            const orderId = localStorage.getItem("currentOrderId");
            if (!orderId) {
                navigate("/cart");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
                if (response.data.success) {
                    setOrder(response.data.order);
                    
                    // Fetch clientSecret from Stripe
                    const secretRes = await axios.post("http://localhost:5000/api/payment/create-intent", {
                        amount: response.data.order.totalAmount,
                        orderId: orderId
                    });
                    setClientSecret(secretRes.data.clientSecret);
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Could not fetch order details",
                        icon: "error",
                        confirmButtonColor: "#4F46E5"
                    });
                    navigate("/cart");
                }
            } catch (error) {
                console.error("Payment Init Error:", error);
                // Placeholder if Stripe real key is missing
                // Swal.fire("Warning", "Stripe keys are missing, using mock data for demo", "warning");
                // For "test mode" requested by user, I'll ensure we have a fallback or clear error.
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndSecret();
    }, [navigate]);

    const handleMockPayment = async (method) => {
        // Simulation for non-stripe methods if needed
        Swal.fire({
            title: "Simulating " + method.toUpperCase(),
            text: "Processing payment...",
            timer: 2000,
            didOpen: () => Swal.showLoading()
        }).then(() => {
            onSuccess({ id: "MOCK-" + Math.random().toString(36).substr(2, 9).toUpperCase() });
        });
    };

    const onSuccess = async (paymentResult) => {
        try {
            const orderId = order._id;
            const paymentData = {
                id: paymentResult.id,
                status: "COMPLETED",
                update_time: new Date().toISOString(),
                email_address: order.shippingAddress.email
            };

            const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/payment`, paymentData);

            if (response.data.success) {
                localStorage.removeItem("cart");
                localStorage.removeItem("shippingAddress");
                window.dispatchEvent(new Event("cartUpdated"));
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful!',
                    text: 'Your order has been placed successfully.',
                    confirmButtonColor: '#10B981',
                    timer: 3000
                });
                
                navigate("/");
            }
        } catch (error) {
            console.error("Success Processing Error:", error);
            Swal.fire({
                title: "Success update failed",
                text: "Payment was done but order status update failed",
                icon: "error",
                confirmButtonColor: "#E20000"
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-black uppercase tracking-widest text-gray-500 animate-pulse">Initializing Checkout...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <p className="font-black uppercase tracking-widest text-red-500">Order not found. Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 pb-20">
            <Navbar />

            {/* Stepper */}
            <div className="w-full flex justify-center pt-28 pb-4">
                <div className="flex items-center text-xl font-black gap-2 md:gap-4 tracking-wide">
                    <span className="text-gray-400">Cart</span>
                    <span className="w-12 md:w-24 h-[1px] bg-gray-200"></span>
                    <span className="text-gray-400">Delivery</span>
                    <span className="w-12 md:w-24 h-[1px] bg-gray-800"></span>
                    <span className="text-[#e20000]">Payment</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <button 
                    onClick={() => navigate("/delivery")}
                    className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold transition-all mb-8 uppercase text-xs tracking-widest"
                >
                    <FaArrowLeft /> Back to Delivery
                </button>

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* LEFT COLUMN: Payment Options */}
                    <div className="flex-1">
                        <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12 h-full">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-wide border-b border-gray-200 pb-4">
                                Choose Payment Method
                            </h2>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'stripe', label: 'Credit Card / Stip', icon: <FaCreditCard size={20}/>, desc: 'Powered by Stripe (Secure & Fast)' },
                                    { id: 'upi', label: 'UPI (Internal Simulation)', icon: <FaMobileAlt size={20}/>, desc: 'Pay instantly via UPI' }
                                ].map((method) => (
                                    <div 
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                                            paymentMethod === method.id 
                                            ? "border-indigo-600 bg-indigo-50/30" 
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                        <div className={`mt-1 p-3 rounded-xl ${paymentMethod === method.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                            {method.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-black uppercase text-xs tracking-widest ${paymentMethod === method.id ? "text-indigo-600" : "text-gray-900"}`}>
                                                {method.label}
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight opacity-70">
                                                {method.desc}
                                            </p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                            paymentMethod === method.id 
                                            ? "border-indigo-600 bg-indigo-600 text-white" 
                                            : "border-gray-300"
                                        }`}>
                                            {paymentMethod === method.id && <FaCheckCircle size={12} />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stripe Element Container */}
                            <AnimatePresence mode="wait">
                                {paymentMethod === 'stripe' ? (
                                    <motion.div
                                        key="stripe-container"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-8"
                                    >
                                        {clientSecret ? (
                                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                                <StripePaymentForm order={order} onPaymentSuccess={onSuccess}/>
                                            </Elements>
                                        ) : (
                                            <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                                    Stripe Secret Key is missing in .env <br/>
                                                    Please fill .env with STRIPE_SECRET_KEY
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="mock-container"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-8"
                                    >
                                        <button 
                                            onClick={() => handleMockPayment('upi')}
                                            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl"
                                        >
                                            Simulate UPI Payment
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
                                <div className="text-green-500 text-3xl">
                                    <FaLock />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-800">100% Secure Payment</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Powered by bank-grade security</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="w-full lg:w-[450px]">
                        <div className="bg-gray-900 rounded-[2.5rem] text-white p-8 md:p-10 shadow-2xl sticky top-24">
                            <h3 className="text-xs font-black text-indigo-400 tracking-[0.2em] mb-8 uppercase">
                                Payment details
                            </h3>

                            <div className="space-y-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold opacity-90 uppercase tracking-tight">{item.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.duration} Days Rent</span>
                                        </div>
                                        <span className="font-black">Rs. {item.price}/-</span>
                                    </div>
                                ))}

                                <div className="pt-6 border-t border-white/10 mt-6">
                                    <div className="flex justify-between items-center text-xl font-black uppercase">
                                        <span className="tracking-widest">Total Pay</span>
                                        <span className="text-indigo-400">Rs. {order.totalAmount}/-</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-[10px] text-center text-gray-500 mt-10 font-bold uppercase tracking-widest opacity-60">
                                Transaction processed by Stripe <br/> (Test Mode Enabled)
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Payment;
