import React from "react";
import { motion } from "framer-motion";
import { 
  FaWallet, 
  FaArrowUp, 
  FaClock, 
  FaCheckCircle, 
  FaRupeeSign,
  FaCalendarAlt,
  FaFileInvoiceDollar
} from "react-icons/fa";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const Earnings = ({ tasks }) => {
    // Generate some analytics from tasks
    const deliveredTasks = tasks.filter(t => t.items[0]?.deliveryStatus === 'Delivered');
    const totalEarnings = deliveredTasks.length * 45;
    const pendingEarnings = tasks.filter(t => ['Assigned', 'Picked Up', 'Out for Delivery'].includes(t.items[0]?.deliveryStatus)).length * 45;

    // Mock Chart Data - Grouping by day of week (example)
    const chartData = [
        { day: 'Mon', amount: 315 },
        { day: 'Tue', amount: 450 },
        { day: 'Wed', amount: 225 },
        { day: 'Thu', amount: 495 },
        { day: 'Fri', amount: 360 },
        { day: 'Sat', amount: 180 },
        { day: 'Sun', amount: 0 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Financial Wallet</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your payouts and earnings history</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-[3rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
                            <FaWallet size={18} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Total Balance</p>
                        <h3 className="text-3xl font-black text-gray-900">₹{totalEarnings}.00</h3>
                        <p className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-2">
                            <FaArrowUp /> 12% increase this week
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-[3rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-100">
                            <FaClock size={18} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Pending Payouts</p>
                        <h3 className="text-3xl font-black text-gray-900">₹{pendingEarnings}.00</h3>
                        <p className="text-[9px] font-bold text-gray-400 flex items-center gap-1 mt-2 uppercase tracking-widest">
                           Estimated clearing: 2 days
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-[3rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
                            <FaCheckCircle size={18} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Success Rate</p>
                        <h3 className="text-3xl font-black text-gray-900">98.5%</h3>
                        <p className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 mt-2 uppercase tracking-widest">
                           Rank: Grade A Rider
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart & Logs Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                
                {/* Weekly Analytics - Dynamic Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Earnings Flow</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payout distribution for the last 7 days</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-500 flex items-center gap-2">
                                 <FaCalendarAlt size={10} className="text-indigo-500" /> THIS WEEK
                             </div>
                        </div>
                    </div>
                    
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={35}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.amount > 300 ? '#4f46e5' : '#818cf8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Payout Log */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                         <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                             <FaFileInvoiceDollar size={14} />
                         </div>
                         <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest text-[#1e293b]">Recent Logs</h2>
                    </div>
                    
                    <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 scrollbar-hide">
                        {deliveredTasks.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
                                <FaFileInvoiceDollar size={32} className="mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No logs generated</p>
                            </div>
                        ) : (
                            deliveredTasks.map((t, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 transition-hover hover:border-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">
                                            #{t._id.slice(-4)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-800 uppercase leading-none">Job Success</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Delivered to {t.shippingAddress.name.split(' ')[0]}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-emerald-600 tracking-tight">+₹45.00</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">COMPLETED</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                        Withdraw Funds
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Earnings;
