import React from "react";
import { motion } from "framer-motion";
import { 
  FaClock, 
  FaMapMarkerAlt, 
  FaStore, 
  FaUser, 
  FaDirections, 
  FaPhone, 
  FaBoxOpen, 
  FaRupeeSign,
  FaCheckCircle,
  FaChevronRight,
  FaShoppingBag,
  FaTruck
} from "react-icons/fa";

const JobCard = ({ task, updateStatus }) => {
    const [isStatusOpen, setIsStatusOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsStatusOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusTheme = (status) => {
        switch (status) {
            case 'Assigned': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', accent: 'bg-blue-600' };
            case 'Picked Up': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', accent: 'bg-amber-600' };
            case 'Out for Delivery': return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', accent: 'bg-indigo-600' };
            case 'Delivered': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', accent: 'bg-emerald-600' };
            case 'Returned': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', accent: 'bg-rose-600' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', accent: 'bg-gray-400' };
        }
    };

    const theme = getStatusTheme(task.items[0].deliveryStatus);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative group"
        >
            {/* Left Status Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.accent}`} />

            <div className="p-5 lg:p-7 flex flex-col gap-6">
                
                {/* Header: ID & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shrink-0">
                            <FaShoppingBag size={14} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ORDER ID</span>
                                <span className="text-xs font-bold text-gray-900 uppercase">#{task._id.slice(-6)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                <FaClock className="text-gray-300" /> {new Date(task.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${theme.bg} ${theme.text} ${theme.border}`}>
                            {task.items[0].deliveryStatus}
                        </div>
                    </div>
                </div>

                {/* Body: Locations & Package */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Pickup Information */}
                    <div className="relative pl-8 border-r border-gray-50 last:border-0 pr-4">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                            <FaStore size={10} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup Store</p>
                        <h3 className="text-sm font-black text-gray-800 uppercase leading-tight">{task.items[0].vendor?.shopName || 'Hub Store'}</h3>
                        <p className="text-[11px] font-semibold text-gray-500 mt-1 flex items-start gap-1">
                            <FaMapMarkerAlt className="shrink-0 mt-0.5" />
                            {task.items[0].vendor?.shopAddress}
                        </p>
                    </div>

                    {/* Delivery Information */}
                    <div className="relative pl-8 border-r border-gray-50 last:border-0 pr-4">
                        <div className="absolute left-0 top-1 w-6 h-6 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                            <FaUser size={10} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Destination</p>
                        <h3 className="text-sm font-black text-gray-800 uppercase leading-tight">{task.shippingAddress.name}</h3>
                        <p className="text-[11px] font-semibold text-gray-500 mt-1 flex items-start gap-1">
                            <FaMapMarkerAlt className="shrink-0 mt-0.5" />
                            {task.shippingAddress.address}, {task.shippingAddress.city}
                        </p>
                    </div>

                    {/* Package Selection & Payout */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col justify-between">
                         <div className="space-y-3">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-200 pb-2">
                                <span>Package Details</span>
                                <span className="text-indigo-600">{task.items.length} ITEM</span>
                             </div>
                             <div className="space-y-1 max-h-[60px] overflow-y-auto pr-2 scrollbar-hide">
                                 {task.items.map((item, idx) => (
                                     <div key={idx} className="flex justify-between items-baseline text-[11px] font-bold text-gray-700 uppercase">
                                         <span className="truncate pr-4">{item.name}</span>
                                         <span className="text-[9px] text-gray-400">{item.duration}d</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-200">
                             <div>
                                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Payout</p>
                                 <p className="text-xl font-black text-gray-900">₹45.00</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bill</p>
                                 <p className="text-sm font-black text-emerald-600">₹{task.totalAmount}</p>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-gray-200 hover:bg-black transition-all active:scale-95">
                            <FaDirections size={12} /> Navigation
                        </button>
                        <a 
                            href={`tel:${task.shippingAddress.phone}`}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <FaPhone size={10} className="text-indigo-500" /> Contact Info
                        </a>
                    </div>
                    
                    <div className="w-full sm:w-auto min-w-[220px] relative" ref={dropdownRef}>
                         <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest absolute -top-4 left-1">Update Status</label>
                         
                         {/* Custom Dropdown Trigger */}
                         <div className="relative">
                            <button 
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className={`w-full flex items-center justify-between px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all shadow-sm ${theme.bg} ${theme.text} ${theme.border}`}
                            >
                                <span className="flex items-center gap-2">
                                    {task.items[0].deliveryStatus === 'Assigned' && <FaTruck size={12} />}
                                    {task.items[0].deliveryStatus === 'Picked Up' && <FaBoxOpen size={12} />}
                                    {task.items[0].deliveryStatus === 'Out for Delivery' && <FaDirections size={12} />}
                                    {task.items[0].deliveryStatus === 'Delivered' && <FaCheckCircle size={12} />}
                                    {task.items[0].deliveryStatus === 'Returned' && <FaClock size={12} />}
                                    {task.items[0].deliveryStatus === 'Out for Delivery' ? 'En Route' : task.items[0].deliveryStatus}
                                </span>
                                <FaChevronRight size={10} className={`${isStatusOpen ? '-rotate-90' : 'rotate-90'} transition-transform opacity-40`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isStatusOpen && (
                                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    {[
                                        { val: 'Assigned', icon: <FaTruck className="text-blue-500" />, label: 'Assignment' },
                                        { val: 'Picked Up', icon: <FaBoxOpen className="text-amber-500" />, label: 'Picked Up' },
                                        { val: 'Out for Delivery', icon: <FaDirections className="text-indigo-500" />, label: 'En Route' },
                                        { val: 'Delivered', icon: <FaCheckCircle className="text-emerald-500" />, label: 'Delivered' },
                                        { val: 'Returned', icon: <FaClock className="text-rose-500" />, label: 'Returned' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => {
                                                updateStatus(task._id, opt.val);
                                                setIsStatusOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-5 py-3 text-[10px] font-bold text-gray-700 uppercase hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0"
                                        >
                                            {opt.icon}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                         </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default JobCard;
