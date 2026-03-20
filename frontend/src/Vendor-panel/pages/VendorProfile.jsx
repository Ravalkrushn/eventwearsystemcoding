import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaStore, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaIdCard, 
  FaUniversity, 
  FaCheckCircle,
  FaSpinner,
  FaCamera
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const VendorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          toast.error("User not found in session");
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/vendors/profile/${user.id}`);
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: Single image size check
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("shopImage", file);

    try {
      setUpdating(true);
      const res = await axios.put(`http://localhost:5000/api/vendors/profile/${profile._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        setProfile(res.data.data);
        toast.success("Profile photo updated!");
      }
    } catch (err) {
      toast.error("Failed to update profile photo");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
        <p className="text-red-500 font-bold">Error: Could not load profile data.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative group">
          <div className="w-36 h-36 rounded-3xl bg-indigo-600 overflow-hidden shadow-xl shadow-indigo-200 border-4 border-white relative transition-all group-hover:shadow-indigo-300">
            {profile.shopImage ? (
              <img 
                src={`http://localhost:5000${profile.shopImage}`} 
                alt="Shop" 
                className="w-full h-full object-cover"
              />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black">
                    {profile.ownerName?.charAt(0).toUpperCase()}
                </div>
            )}
            
            {/* Overlay for Camera */}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {updating ? (
                    <FaSpinner className="animate-spin text-white" size={24} />
                ) : (
                    <FaCamera className="text-white" size={28} />
                )}
                <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    disabled={updating}
                />
            </label>
          </div>
          {profile.isApproved && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-xl shadow-lg border-4 border-white z-10">
              <FaCheckCircle size={16} />
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-black text-gray-900">{profile.ownerName}</h1>
          <p className="text-indigo-600 font-bold flex items-center justify-center md:justify-start gap-2">
            <FaStore /> {profile.shopName}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
             <span className="px-4 py-1.5 bg-gray-50 text-gray-600 text-sm font-bold rounded-full border border-gray-100 italic">Vendor ID: {profile._id.slice(-8)}</span>
             <span className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider ${profile.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
               {profile.isApproved ? "Verified Account" : "Pending Verification"}
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Contact Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 decoration-indigo-500 decoration-4">
            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
            Contact Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><FaEnvelope /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                <p className="font-bold text-gray-800">{profile.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><FaPhone /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                <p className="font-bold text-gray-800">{profile.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><FaMapMarkerAlt /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shop Location</p>
                <p className="font-bold text-gray-800">{profile.shopAddress}, {profile.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification & Banking */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
             <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
             Kyc & Banking Details
          </h2>
          
          <div className="space-y-4">
             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><FaIdCard /></div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Document Details</p>
                <div className="grid grid-cols-2 mt-1">
                   <div>
                     <p className="text-[10px] text-gray-400 font-black">AADHAR</p>
                     <p className="font-bold text-gray-800">{profile.aadharNumber.replace(/\d(?=\d{4})/g, "*")}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-black">PAN</p>
                     <p className="font-bold text-gray-800">{profile.panNumber.replace(/\w(?=\w{4})/g, "*")}</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><FaUniversity /></div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Banking Info</p>
                <div className="grid grid-cols-2 mt-1">
                   <div>
                     <p className="text-[10px] text-gray-400 font-black">A/C NUMBER</p>
                     <p className="font-bold text-gray-800">{profile.bankAccount.replace(/\d(?=\d{4})/g, "*")}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-black">IFSC CODE</p>
                     <p className="font-bold text-gray-800">{profile.ifscCode}</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">Registration Date</p>
                <p className="font-bold text-indigo-700">{new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VendorProfile;
