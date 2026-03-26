import React from "react";
import { motion } from "framer-motion";
import { 
  FaMoneyBillWave, 
  FaArrowUp, 
  FaChartLine, 
  FaRegListAlt, 
  FaCheckCircle,
  FaFileInvoiceDollar
} from "react-icons/fa";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const EarningsView = () => {
    // Mock data for sales trends
    const chartData = [
        { name: 'Jan', earnings: 4000 },
        { name: 'Feb', earnings: 12000 },
        { name: 'Mar', earnings: 8000 },
        { name: 'Apr', earnings: 18000 },
        { name: 'May', earnings: 25000 },
        { name: 'Jun', earnings: 21000 },
        { name: 'Jul', earnings: 34000 },
    ];

    const recentLogs = [
        { id: "#7812", customer: "Rahul V.", item: "Silk Saree", amt: 1200, status: "Cleared", date: "26 Mar" },
        { id: "#7845", customer: "Priya K.", item: "Sherwani", amt: 4500, status: "Pending", date: "27 Mar" },
        { id: "#7910", customer: "Amit S.", item: "Party Suit", amt: 2200, status: "Cleared", date: "28 Mar" },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter leading-none">Vendor Wallet</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Detailed revenue reports and payout logs</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
                            <FaMoneyBillWave size={22} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 underline decoration-indigo-200">Total Settlement</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-none tracking-tight">₹45,200.00</h3>
                        <p className="text-[9px] font-bold text-emerald-500 mt-3 flex items-center gap-1">
                            <FaArrowUp /> +18% from last month
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
                            <FaCheckCircle size={22} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Cleared Balance</p>
                        <h3 className="text-3xl font-black text-gray-900 leading-none tracking-tight">₹38,500.00</h3>
                        <p className="text-[9px] font-bold text-gray-400 mt-3 uppercase tracking-widest">
                           Ready to withdraw
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group col-span-1 md:col-span-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-30"></div>
                    <div className="relative h-full flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 underline decoration-indigo-200">Revenue Stream (Last 7 Days)</p>
                            <h3 className="text-3xl font-black text-gray-900 leading-none tracking-tight">₹12,400.00</h3>
                        </div>
                        <div className="w-48 h-16 mr-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.slice(-7)}>
                                    <Area type="monotone" dataKey="earnings" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Analytics & Transaction Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                         <div>
                             <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Earnings Trend</h2>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth analytics for the current fiscal year</p>
                         </div>
                         <button className="px-4 py-2 border border-gray-200 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-colors">Export CSV</button>
                    </div>
                    
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={5} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-8 border-b border-gray-50 pb-6">
                         <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                             <FaFileInvoiceDollar size={18} />
                         </div>
                         <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex-1">Order Logs</h2>
                    </div>
                    
                    <div className="space-y-6 flex-1 pr-1 overflow-y-auto scrollbar-hide">
                         {recentLogs.map((log) => (
                             <div key={log.id} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100 group hover:border-indigo-100 transition-all cursor-pointer">
                                 <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm group-hover:shadow-indigo-50 border border-gray-50">
                                         {log.id}
                                     </div>
                                     <div>
                                         <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{log.customer}</p>
                                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-70 underline decoration-indigo-100">{log.item}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-xs font-black text-gray-900 leading-none">₹{log.amt}</p>
                                     <p className={`text-[8px] font-black uppercase tracking-widest mt-2 ${log.status === 'Cleared' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                         {log.status}
                                     </p>
                                 </div>
                             </div>
                         ))}
                    </div>

                    <button className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-black transition-all transform active:scale-95">
                        Withdraw Balance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EarningsView;
