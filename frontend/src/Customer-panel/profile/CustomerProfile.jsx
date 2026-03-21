import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaSpinner,
  FaCalendarAlt,
  FaUserCircle,
  FaArrowLeft
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Navbar from "../../components/Navbar";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          toast.error("User not found in session");
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/customer/profile/${user.id}`);
        setProfile(res.data.data);
      } catch (err) {
        toast.error("Failed to load profile details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100 mt-20 font-sans">
        <p className="text-red-500 font-bold tracking-widest uppercase">Error: Could not load profile data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 font-sans">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-36 h-36 rounded-full bg-indigo-600 flex items-center justify-center text-white text-6xl font-black shadow-xl shadow-indigo-200 border-4 border-white transition-all">
             <FaUserCircle size={80} />
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black text-gray-900">{profile.fullName}</h1>
            <p className="text-indigo-600 font-bold flex items-center justify-center md:justify-start gap-2 uppercase tracking-widest text-sm">
              <FaUser /> Customer Account
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
               <span className="px-4 py-1.5 bg-gray-50 text-gray-600 text-sm font-bold rounded-full border border-gray-100 italic">User ID: {profile._id.slice(-8)}</span>
               <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-black uppercase tracking-wider">Active</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Information */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              My Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:bg-white transition-all cursor-default group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform"><FaEnvelope /></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                  <p className="font-bold text-gray-800">{profile.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:bg-white transition-all cursor-default group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform"><FaPhone /></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Phone Number</p>
                  <p className="font-bold text-gray-800">{profile.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 cursor-default group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:rotate-12 transition-transform"><FaCalendarAlt /></div>
                  <div className="flex-1">
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Joined Since</p>
                      <p className="font-bold text-indigo-700 capitalize">
                          {new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                  </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
               <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
               Location Details
            </h2>
            
            <div className="space-y-4">
               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:bg-white transition-all cursor-default group min-h-[100px]">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform mt-1"><FaMapMarkerAlt /></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Residence Address</p>
                  <p className="font-bold text-gray-800 leading-relaxed mb-3">{profile.address || "No address added yet."}</p>
                  
                  {profile.city && (
                    <div className="inline-flex items-center px-3 py-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <span className="text-[10px] text-gray-400 font-black mr-2 uppercase">CITY:</span>
                        <span className="text-sm font-bold text-indigo-600">{profile.city}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <p className="text-white/80 text-sm font-medium leading-relaxed relative z-10">
                      Looking to rent? Complete your profile to get access to exclusive rental discounts and faster checkouts.
                  </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerProfile;
