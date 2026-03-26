import React from "react";
import { FaBars, FaBell, FaCheckCircle, FaSearch } from "react-icons/fa";

const Header = ({ isSidebarOpen, setSidebarOpen, user }) => {
  return (
    <header className="bg-white border-b border-gray-100 flex h-20 items-center justify-between px-6 z-30 sticky top-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-gray-50 text-gray-500 rounded-xl transition-all hover:bg-gray-100 active:scale-95 shadow-sm border border-gray-100 group"
        >
          <FaBars className="group-hover:scale-110 transition-transform" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl group focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
          <FaSearch className="text-gray-400 group-focus-within:text-indigo-500" size={12} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="bg-transparent border-none outline-none text-xs font-semibold text-gray-600 w-40 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-3 text-gray-400 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-all">
          <FaBell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-sm"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>

        {/* User Profile - Simplified without the box */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right flex flex-col items-end">
            <p className="text-[12px] font-black text-gray-900 uppercase tracking-tighter leading-none">{user.name}</p>
            <p className="text-[9px] font-bold text-emerald-500 flex items-center justify-end gap-1.5 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
              <span className="uppercase tracking-widest">Online</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
