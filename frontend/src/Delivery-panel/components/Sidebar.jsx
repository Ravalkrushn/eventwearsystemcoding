import React from "react";
import { 
  FaBiking, 
  FaHistory, 
  FaUser, 
  FaSignOutAlt,
  FaHome,
  FaWallet
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, currentView, setCurrentView, handleLogout }) => {
  const menuItems = [
    { id: "dashboard", name: "Overview", icon: <FaHome /> },
    { id: "tasks", name: "Deliveries", icon: <FaBiking /> },
    { id: "earnings", name: "Wallet", icon: <FaWallet /> },
    { id: "history", name: "Log", icon: <FaHistory /> },
    { id: "profile", name: "Account", icon: <FaUser /> },
  ];

  return (
    <div className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 h-full fixed lg:relative z-40 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50 overflow-hidden">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shrink-0 shadow-lg shadow-indigo-100">
          <FaBiking />
        </div>
        {isSidebarOpen && (
          <div className="ml-3 overflow-hidden">
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tighter leading-none">RIDER HUB</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">STAFF v1.0</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all group ${
              currentView === item.id 
              ? "bg-indigo-50 text-indigo-700 font-bold" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className={`text-lg shrink-0 ${currentView === item.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>{item.icon}</span>
            {isSidebarOpen && <span className="ml-3 text-sm tracking-tight whitespace-nowrap">{item.name}</span>}
            {isSidebarOpen && (currentView === item.id) && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50 pb-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group overflow-hidden"
        >
          <FaSignOutAlt className="text-lg shrink-0 group-hover:rotate-12 transition-transform" />
          {isSidebarOpen && <span className="ml-3 text-sm font-semibold tracking-tight whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
