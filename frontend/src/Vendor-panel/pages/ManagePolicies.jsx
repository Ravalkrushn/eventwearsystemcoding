import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShieldAlt, 
  FaSave, 
  FaSpinner, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaMagic,
  FaCheck
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const ManagePolicies = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const vendorId = user?.id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [policies, setPolicies] = useState([]);
    const [activeTab, setActiveTab] = useState("Custom Fitting");

    const policyTypes = [
        { id: "Custom Fitting", icon: <FaMagic />, description: "Fitting and alteration details" },
        { id: "Cancellation", icon: <FaExclamationTriangle />, description: "Booking cancellation rules" },
        { id: "Return", icon: <FaCheck />, description: "Return timeline and process" },
        { id: "Security Deposit", icon: <FaShieldAlt />, description: "Refund and deduction terms" }
    ];

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        disclaimer: ""
    });

    useEffect(() => {
        fetchPolicies();
    }, [vendorId]);

    useEffect(() => {
        const existing = policies.find(p => p.type === activeTab);
        if (existing) {
            setFormData({
                title: existing.title,
                content: existing.content,
                disclaimer: existing.disclaimer
            });
        } else {
            setFormData({ title: activeTab, content: "", disclaimer: "" });
        }
    }, [activeTab, policies]);

    const fetchPolicies = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`http://localhost:5000/api/vendors/policies/${vendorId}`);
            setPolicies(res.data.data);
        } catch (err) {
            console.error("Error fetching policies:", err);
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(`http://localhost:5000/api/vendors/policies`, {
                vendorId,
                type: activeTab,
                ...formData
            });
            toast.success(`${activeTab} policy saved successfully`);
            fetchPolicies();
        } catch (err) {
            toast.error("Failed to save policy");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
                <p className="text-gray-500 font-medium">Loading your policies...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12 font-sans">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Store Policies</h1>
                    <p className="text-gray-500 mt-1">Manage what customers see about your services and terms.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left: Policy Selector */}
                <div className="space-y-3">
                    {policyTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActiveTab(type.id)}
                            className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all border ${
                                activeTab === type.id 
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                                : "bg-white text-gray-600 border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50"
                            }`}
                        >
                            <span className="text-xl mt-1">{type.icon}</span>
                            <div className="text-left">
                                <p className={`font-black text-sm uppercase tracking-wide ${activeTab === type.id ? "text-white" : "text-gray-900"}`}>
                                    {type.id}
                                </p>
                                {activeTab !== type.id && <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{type.description}</p>}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Right: Policy Editor */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    {policyTypes.find(t => t.id === activeTab)?.icon}
                                </div>
                                <h2 className="text-xl font-black text-gray-900 uppercase">{activeTab} Policy</h2>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold"
                                        placeholder="Enter policy title..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Policy Details</label>
                                    <textarea 
                                        rows="10"
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm leading-relaxed"
                                        placeholder="Explain the policy in detail..."
                                        required
                                    />
                                    <p className="mt-2 text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                        <FaInfoCircle /> Use new lines to separate paragraphs.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Disclaimer (Optional)</label>
                                    <textarea 
                                        rows="3"
                                        value={formData.disclaimer}
                                        onChange={(e) => setFormData({...formData, disclaimer: e.target.value})}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-xs italic text-gray-500"
                                        placeholder="Add a disclaimer at the bottom..."
                                    />
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                                    >
                                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                        {loading ? "Saving..." : `Save ${activeTab} Policy`}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ManagePolicies;
