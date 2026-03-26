import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaUserPlus, 
  FaUserTie, 
  FaPhone, 
  FaEnvelope, 
  FaTrash, 
  FaCheckCircle,
  FaSearch,
  FaUserAlt,
  FaSpinner
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

const ManageStaff = ({ onAddStaff }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const vendorId = JSON.parse(localStorage.getItem('user'))?.id;

    useEffect(() => {
        fetchStaff();
    }, [vendorId]);

    const fetchStaff = async () => {
        if (!vendorId) return;
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/delivery-boys/vendor/${vendorId}`);
            if (res.data.success) {
                setStaff(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching staff:", err);
            toast.error("Failed to load staff members");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this staff member?")) {
            try {
                const res = await axios.delete(`http://localhost:5000/api/delivery-boys/${id}`);
                if (res.data.success) {
                    toast.success("Staff member removed");
                    fetchStaff();
                }
            } catch (err) {
                toast.error("Error deleting staff member");
            }
        }
    };

    const toggleStatus = async (member) => {
        try {
            const newStatus = member.status === 'active' ? 'inactive' : 'active';
            const res = await axios.put(`http://localhost:5000/api/delivery-boys/${member._id}`, {
                status: newStatus
            });
            if (res.data.success) {
                toast.success(`Staff status updated to ${newStatus}`);
                fetchStaff();
            }
        } catch (err) {
            toast.error("Error updating status");
        }
    };

    const filteredStaff = staff.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Manage Staff</h1>
                    <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Your dedicated delivery team</p>
                </div>
                <button 
                   onClick={onAddStaff}
                   className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95"
                >
                    <FaUserPlus /> Add New Delivery Boy
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search staff members..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
                />
            </div>

            {/* Staff Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-[2.5rem] border border-gray-100">
                    <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Loading Team...</p>
                </div>
            ) : filteredStaff.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <FaUserTie size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-tight">No staff members found</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Click the button above to add a team member.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((member) => (
                        <motion.div
                            key={member._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`bg-white rounded-[2rem] border p-6 shadow-sm transition-all hover:shadow-xl ${member.status === 'inactive' ? 'opacity-75 grayscale' : 'border-gray-100'}`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black">
                                    <FaUserAlt />
                                </div>
                                    <div className="flex items-center gap-3">
                                      <button 
                                          onClick={() => toggleStatus(member)}
                                          title={member.status === 'active' ? "Deactivate" : "Activate"}
                                          className={`relative w-14 h-7 rounded-full transition-all duration-500 shadow-inner focus:outline-none flex items-center px-1 ${member.status === 'active' ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                      >
                                          <motion.div 
                                              layout
                                              animate={{ x: member.status === 'active' ? 28 : 0 }}
                                              transition={{ type: "spring", stiffness: 700, damping: 40 }}
                                              className="w-5 h-5 bg-white rounded-full shadow-lg"
                                          />
                                      </button>
                                      <button 
                                          onClick={() => handleDelete(member._id)}
                                          className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                                      >
                                          <FaTrash size={14} />
                                      </button>
                                    </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{member.name}</h3>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-3 text-sm font-bold text-gray-600"><FaEnvelope className="text-indigo-400" /> {member.email}</p>
                                    <p className="flex items-center gap-3 text-sm font-bold text-gray-600"><FaPhone className="text-indigo-400" /> {member.phone}</p>
                                </div>
                                <div className="pt-4 flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${member.isAvailable ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {member.isAvailable ? 'Available' : 'Busy'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${member.status === 'active' ? 'border-indigo-100 text-indigo-600' : 'border-gray-200 text-gray-400'}`}>
                                        {member.status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageStaff;
