import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaTimes, FaPlus, FaTshirt, FaTag, FaRupeeSign, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

const AddProduct = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    pricePerDay: "",
    deposit: "",
    description: "",
    size: "",
    color: "",
    material: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, sizeRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/categories"),
          axios.get("http://localhost:5000/api/admin/sizes")
        ]);
        setCategories(catRes.data.data.filter(c => c.isActive));
        setSizes(sizeRes.data.data);
      } catch (err) {
        console.error("Failed to fetch categories/sizes:", err);
        // Fallback to defaults or empty if needed
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "vendor") {
      toast.error("You must be logged in as a vendor to add products");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    
    // Append text fields
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    // Append images
    images.forEach(image => {
      data.append("images", image);
    });

    // Append vendor ID
    data.append("vendorId", user.id);

    try {
      const response = await axios.post("http://localhost:5000/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        toast.success("Product added successfully! Waiting for admin approval.");
        // Reset form
        setFormData({
          productName: "",
          category: "",
          pricePerDay: "",
          deposit: "",
          description: "",
          size: "",
          color: "",
          material: "",
        });
        setImages([]);
        setPreviews([]);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Error adding product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-500 mt-2">List your item for rental and start earning.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCloudUploadAlt className="text-indigo-600" /> Product Images (Max 4)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
            
            {previews.length < 4 && (
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-indigo-100 transition-colors">
                  <FaPlus className="text-gray-400 group-hover:text-indigo-600" />
                </div>
                <span className="mt-2 text-xs font-medium text-gray-500 group-hover:text-indigo-600">Add Photo</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-4 italic">* High quality photos help you rent faster.</p>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaInfoCircle className="text-indigo-600" /> Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <div className="relative">
                <FaTshirt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="productName"
                  required
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Designer Wedding Sherwani"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="relative">
                <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select Category</option>
                   {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rental Price (per day)</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="pricePerDay"
                  required
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Security Deposit</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="deposit"
                  required
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Refundable deposit amount"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Product Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Size</label>
              <select
                name="size"
                required
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="">Select Size</option>
                 {sizes.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name} ({s.ageRange})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Royal Blue"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Velvet"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="Tell customers about your product, its condition, and any special care instructions..."
            ></textarea>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Uploading Product..." : "Submit Product for Approval"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProduct;
