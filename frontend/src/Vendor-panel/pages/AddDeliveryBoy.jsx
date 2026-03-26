import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaPhone,
  FaEnvelope,
  FaKey,
  FaArrowLeft,
  FaSpinner,
  FaUserTie,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddDeliveryBoy = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const vendorId = JSON.parse(localStorage.getItem("user"))?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/api/delivery-boys", {
        ...formData,
        vendorId: vendorId,
      });
      if (res.data.success) {
        toast.success("Delivery boy added successfully!");
        setFormData({ name: "", email: "", phone: "", password: "" });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding delivery boy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 uppercase tracking-widest mb-8 transition-colors"
      >
        <FaArrowLeft /> Back to Staff
      </button>

      {/* Card */}
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-10 py-8 flex items-center gap-5">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl">
            <FaUserTie />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Add Delivery Boy
            </h1>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">
              Fill in the details below
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
              <FaUserPlus className="text-indigo-400" /> Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl font-bold text-gray-700 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                <FaPhone className="text-indigo-400" /> Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl font-bold text-gray-700 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                placeholder="9876543210"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                <FaEnvelope className="text-indigo-400" /> Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl font-bold text-gray-700 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                placeholder="delivery@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
              <FaKey className="text-indigo-400" /> Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl font-bold text-gray-700 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 border-2 border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-gray-400 hover:text-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all border-b-4 border-indigo-600 active:translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <FaUserPlus /> Add Delivery Boy
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddDeliveryBoy;
