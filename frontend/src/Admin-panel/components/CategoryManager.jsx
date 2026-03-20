import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaTags, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaSpinner, 
  FaTimes,
  FaCheck
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/categories");
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("isActive", formData.isActive);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/admin/categories/${currentId}`, data, config);
        toast.success("Category updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/admin/categories", data, config);
        toast.success("Category added successfully");
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving category");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
      image: null
    });
    setImagePreview(category.image ? `http://localhost:5000${category.image}` : null);
    setCurrentId(category._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/categories/${id}`);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        toast.error("Error deleting category");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
      image: null
    });
    setImagePreview(null);
    setIsEditing(false);
    setCurrentId(null);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Category Management</h2>
          <p className="text-gray-500 font-medium">Manage product categories for vendors.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 whitespace-nowrap"
          >
            <FaPlus /> Add Category
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
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Image</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Category Name</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                      {category.image ? (
                        <img 
                          src={`http://localhost:5000${category.image}`} 
                          alt={category.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaTags />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-gray-900">{category.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-gray-500 font-medium">{category.description || "No description"}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${category.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center text-gray-400 italic">No categories found.</td>
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
                  <h3 className="text-2xl font-black text-gray-900">{isEditing ? "Edit Category" : "Add Category"}</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition">
                  <FaTimes className="text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Category Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all"
                    placeholder="e.g. Traditional Wear"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Category Description</label>
                  <textarea 
                    name="description" 
                    rows="3"
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium transition-all"
                    placeholder="Short description..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-2 uppercase">Category Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-100">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1">
                      <div className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-colors cursor-pointer flex items-center justify-center gap-2 text-gray-500 font-bold text-sm">
                        <FaPlus /> {imagePreview ? "Change Image" : "Upload Image"}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Active Category</label>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition"
                  >
                    {isEditing ? "Update Category" : "Create Category"}
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

export default CategoryManager;
