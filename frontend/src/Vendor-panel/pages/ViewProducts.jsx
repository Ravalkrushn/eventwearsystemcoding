import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaPlus, 
  FaTrash, 
  FaSpinner, 
  FaTag, 
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const ViewProducts = ({ onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) return;

      const res = await axios.get(`http://localhost:5000/api/products/vendor/${user.id}`);
      setProducts(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch your products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Assuming there's a delete route, let's create one in backend if not exists
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        toast.error("Error deleting product");
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { icon: <FaCheckCircle />, text: "Approved", class: "bg-green-100 text-green-700" },
      pending: { icon: <FaClock />, text: "Pending Approval", class: "bg-yellow-100 text-yellow-700" },
      rejected: { icon: <FaTimesCircle />, text: "Rejected", class: "bg-red-100 text-red-700" }
    };
    const badge = badges[status.toLowerCase()] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${badge.class}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium italic">Loading your products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Products</h2>
          <p className="text-gray-500 font-medium">Manage and monitor all your rental uploads.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 whitespace-nowrap"
          >
            <FaPlus /> Add New
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <FaTag size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No products yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Start by uploading your first rental item to the platform.</p>
          <button 
            onClick={onAddProduct}
            className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Add First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Product Info</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Price / Deposit</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      key={product._id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 shadow-sm">
                            <img 
                              src={`http://localhost:5000${product.images[0]}`} 
                              alt={product.productName} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 leading-tight">{product.productName}</p>
                            <p className="text-xs text-indigo-500 font-bold uppercase mt-1 tracking-wider">{product.category}</p>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">Size: {product.size}</span>
                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">Material: {product.material}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div>
                          <p className="flex items-center text-lg font-black text-gray-900">
                            <FaRupeeSign className="text-gray-400" size={12} /> {product.pricePerDay}
                            <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">/ day</span>
                          </p>
                          <p className="flex items-center text-xs text-gray-500 mt-0.5">
                            Deposit: <FaRupeeSign className="ml-1" size={8} /> {product.deposit}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-8 py-10 text-center text-gray-400 italic">No products found for "{searchQuery}".</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
