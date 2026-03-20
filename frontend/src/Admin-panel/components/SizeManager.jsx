import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaRulerCombined, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaSpinner, 
  FaTimes,
  FaInfoCircle
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const SizeManager = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    ageRange: "",
    notes: ""
  });

  const fetchSizes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/sizes");
      setSizes(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch sizes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/admin/sizes/${currentId}`, formData);
        toast.success("Size updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/admin/sizes", formData);
        toast.success("Size added successfully");
      }
      setShowModal(false);
      resetForm();
      fetchSizes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving size");
    }
  };

  const handleEdit = (size) => {
    setFormData({
      name: size.name,
      ageRange: size.ageRange,
      notes: size.notes || ""
    });
    setCurrentId(size._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/sizes/${id}`);
        toast.success("Size deleted successfully");
        fetchSizes();
      } catch (err) {
        toast.error("Error deleting size");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      ageRange: "",
      notes: ""
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const filteredSizes = sizes.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ageRange.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Size Management</h2>
          <p className="text-gray-500 font-medium">Manage product sizes and age ranges.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search sizes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 whitespace-nowrap"
          >
            <FaPlus /> Add Size
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Age (Years)</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Notes</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSizes.map((size) => (
                <tr key={size._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5 font-black text-indigo-600">{size.name}</td>
                  <td className="px-8 py-5 font-bold text-gray-900">{size.ageRange}</td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">{size.notes || "-"}</td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(size)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(size._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSizes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-gray-400 italic">No sizes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{isEditing ? "Edit Size" : "Add Size"}</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition">
                  <FaTimes className="text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Size Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all"
                    placeholder="e.g. XS"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Age Range (Years)</label>
                  <input 
                    type="text" 
                    name="ageRange" 
                    required 
                    value={formData.ageRange} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all"
                    placeholder="e.g. 12–14 yrs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Notes (Optional)</label>
                  <textarea 
                    name="notes" 
                    rows="2"
                    value={formData.notes} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all"
                    placeholder="e.g. Early teens / slim"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition"
                  >
                    {isEditing ? "Update Size" : "Create Size"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SizeManager;
