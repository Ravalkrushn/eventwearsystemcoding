import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaUsers, 
  FaStore, 
  FaBox, 
  FaChartLine, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaBell, 
  FaSearch, 
  FaBars, 
  FaSignOutAlt,
  FaCog,
  FaArrowRight
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import VendorManager from "./components/VendorManager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Stats
  const stats = [
    { title: "Total Users", value: "1,280", icon: <FaUsers />, color: "bg-blue-500", trend: "+12%" },
    { title: "Total Vendors", value: "45", icon: <FaStore />, color: "bg-purple-500", trend: "+5%" },
    { title: "Active Products", value: "850", icon: <FaBox />, color: "bg-green-500", trend: "+18%" },
    { title: "Total Revenue", value: "₹4.2L", icon: <FaChartLine />, color: "bg-orange-500", trend: "+25%" },
  ];

  const pendingApprovals = [
    { id: 1, name: "Luxury Silk Lehenga", vendor: "Royal Creations", price: "₹45,000", date: "2 hours ago" },
    { id: 2, name: "Wedding Tuxedo", vendor: "Gents Wear", price: "₹15,000", date: "5 hours ago" },
    { id: 3, name: "Ethnic Sherwani", vendor: "Vastra", price: "₹28,000", date: "1 day ago" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: isSidebarOpen ? 260 : 80 }}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-gray-900 text-white flex flex-col fixed h-full z-30 transition-all shadow-2xl"
      >
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-indigo-600/20">A</div>
          {isSidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight">Admin<span className="text-indigo-500">Hub</span></span>}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {[
            { id: "overview", name: "Overview", icon: <FaChartLine /> },
            { id: "vendors", name: "Vendors", icon: <FaStore /> },
            { id: "users", name: "Customers", icon: <FaUsers /> },
            { id: "products", name: "Products", icon: <FaBox /> },
            { id: "settings", name: "Settings", icon: <FaCog /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full p-3.5 rounded-xl transition-all ${
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="ml-4 font-semibold text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={() => navigate("/login")}
            className="flex items-center w-full p-3 text-red-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all group"
          >
            <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="ml-4 font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-[260px]" : "ml-[80px]"}`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2.5 bg-gray-50 text-gray-600 hover:text-indigo-600 rounded-xl transition-colors shadow-sm"
          >
            <FaBars size={18} />
          </button>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm w-80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <button className="p-2.5 text-gray-500 hover:text-indigo-600 bg-gray-50 rounded-xl relative transition-colors shadow-sm">
              <FaBell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Admin Panel</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-md">AD</div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-10">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview Dashboard</h1>
                <p className="text-gray-500 mt-2 font-medium">Monitoring platform health and growth metrics.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all"
                  >
                    <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg mb-4 w-fit`}>{stat.icon}</div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                    <div className="mt-4 flex items-center text-xs font-bold text-green-500 bg-green-50 w-fit px-2.5 py-1 rounded-full">{stat.trend} this month</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Pending Approvals */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-black text-gray-900">Item Approvals Required</h2>
                    <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">View All Products</button>
                  </div>
                  
                  <div className="space-y-6">
                    {pendingApprovals.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center font-bold text-gray-300">IMAGE</div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                            <p className="text-sm text-gray-500 flex items-center gap-2">by <span className="text-indigo-600 font-bold">{item.vendor}</span> • {item.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 scale-0 group-hover:scale-100 origin-right transition-transform">
                          <button className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 transition-all"><FaCheckCircle /></button>
                          <button className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all"><FaTimesCircle /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions / Notifications */}
                <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <h2 className="text-xl font-black mb-10 relative z-10">System Alerts</h2>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex gap-4 items-start p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 ring-4 ring-red-400/20"></div>
                      <div>
                        <p className="font-bold text-sm">Server load high</p>
                        <p className="text-xs text-white/60 mt-1">Check recent traffic spike logs.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 ring-4 ring-yellow-400/20"></div>
                      <div>
                        <p className="font-bold text-sm">5 New Vendors</p>
                        <p className="text-xs text-white/60 mt-1">Pending KYC verification check.</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-10 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                    Open Settings <FaArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "vendors" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <VendorManager />
            </motion.div>
          )}

          {activeTab !== "overview" && activeTab !== "vendors" && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 font-medium italic border-2 border-dashed border-gray-100 rounded-3xl">
              <FaCog className="text-4xl mb-4 animate-spin-slow" />
              Section "{activeTab}" is coming soon...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
