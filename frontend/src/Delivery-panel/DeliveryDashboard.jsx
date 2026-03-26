import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaRupeeSign, FaShieldAlt, FaTruck, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";

// Sub-components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import JobCard from "./components/JobCard";
import Earnings from "./components/Earnings";

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState("dashboard");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active"); // active, completed
    
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Sign Out?',
            text: "Are you sure you want to log out from Rider Hub?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout'
        });

        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    const fetchTasks = async () => {
        if (!user.id) return;
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/delivery-boys/tasks/${user.id}`);
            if (res.data.success) {
                setTasks(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
            toast.error("Cloud sync failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user.id]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/delivery-boys/tasks/${orderId}/status`, {
                deliveryBoyId: user.id,
                status: newStatus
            });
            if (res.data.success) {
                toast.success(`Status: ${newStatus}`);
                fetchTasks();
            }
        } catch (err) {
            console.error("Status update error:", err);
            toast.error("Failed to update status");
        }
    };

    const filteredTasks = tasks.filter(task => {
        const status = task.items[0]?.deliveryStatus;
        if (activeTab === "active") return status !== 'Delivered' && status !== 'Returned';
        return status === 'Delivered' || status === 'Returned';
    });

    const activeCount = tasks.filter(t => t.items[0]?.deliveryStatus !== 'Delivered' && t.items[0]?.deliveryStatus !== 'Returned').length;
    const totalPayout = tasks.filter(t => t.items[0]?.deliveryStatus === 'Delivered').length * 45;

    return (
        <div className="flex h-screen bg-[#FDFDFD] text-[#334155] overflow-hidden font-sans">
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                handleLogout={handleLogout} 
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    isSidebarOpen={isSidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    user={user} 
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 scrollbar-hide">
                    {currentView === "dashboard" ? (
                        <div className="max-w-7xl mx-auto space-y-8">
                            <div className="border-b border-gray-100 pb-4">
                                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Performance Overview</h1>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Your real-time delivery metrics</p>
                            </div>

                            {/* Dashboard Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Live Tasks</p>
                                        <p className="text-3xl font-black text-gray-900 leading-none">{activeCount}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                        <FaTruck />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-emerald-100 transition-all">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Earnings</p>
                                        <p className="text-3xl font-black text-emerald-600 leading-none">₹{totalPayout}.00</p>
                                    </div>
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                        <FaRupeeSign />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Security</p>
                                        <p className="text-xl font-black text-blue-600 leading-none uppercase">Verified</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                        <FaShieldAlt />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-orange-100 transition-all">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Log Status</p>
                                        <p className="text-xl font-black text-orange-600 leading-none uppercase">Online</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                        <FaClock />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : currentView === "tasks" ? (
                        <div className="max-w-7xl mx-auto space-y-8">
                            {/* View Header with Tabs */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Shipment Queue</h1>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your active delivery workflow</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-xl border border-gray-100">
                                    <button 
                                        onClick={() => setActiveTab("active")}
                                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Active Jobs ({activeCount})
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab("completed")}
                                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${activeTab === 'completed' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-gray-100' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Completed ({tasks.length - activeCount})
                                    </button>
                                </div>
                            </div>

                            {/* Main Task List */}
                            <div className="grid grid-cols-1 gap-5">
                                {loading ? (
                                    <div className="py-20 flex flex-col items-center">
                                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                                        <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Syncing cloud database...</p>
                                    </div>
                                ) : filteredTasks.length === 0 ? (
                                    <div className="bg-white py-16 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center text-center px-6">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                            <FaBoxOpen size={30} />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Queue is empty</h3>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Assignments will appear here automatically.</p>
                                    </div>
                                ) : (
                                    filteredTasks.map((task) => (
                                        <JobCard key={task._id} task={task} updateStatus={updateStatus} />
                                    ))
                                )}
                            </div>
                        </div>
                    ) : currentView === "earnings" ? (
                        <Earnings tasks={tasks} />
                    ) : (
                        <div className="h-full flex items-center justify-center p-8">
                            <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 max-w-md shadow-sm">
                                <p className="text-indigo-600 font-black text-xl uppercase tracking-tighter mb-2">{currentView.toUpperCase()}</p>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">This section is coming soon. Dashboard sync is active.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
