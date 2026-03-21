import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaBox, 
  FaCheckCircle, 
  FaClock, 
  FaMoneyBillWave, 
  FaPlus, 
  FaList, 
  FaUser, 
  FaBell, 
  FaSearch, 
  FaBars, 
  FaSignOutAlt,
  FaCog,
  FaShieldAlt
} from "react-icons/fa";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useNavigate } from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import VendorProfile from "./pages/VendorProfile";
import ViewProducts from "./pages/ViewProducts";
import ManagePolicies from "./pages/ManagePolicies";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard"); // View state
  const [productToEdit, setProductToEdit] = useState(null); // Product being edited

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { name: "John Doe" };
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Mock Data
  const stats = [
    { title: "Total Products", value: "124", icon: <FaBox />, color: "from-blue-500 to-blue-600" },
    { title: "Approved", value: "98", icon: <FaCheckCircle />, color: "from-green-500 to-green-600" },
    { title: "Pending", value: "26", icon: <FaClock />, color: "from-yellow-500 to-yellow-600" },
    { title: "Total Earnings", value: "₹45,200", icon: <FaMoneyBillWave />, color: "from-purple-500 to-purple-600" },
  ];

  const recentProducts = [
    { id: 1, name: "Velvet Sherwani", category: "Wedding", price: "₹2,500/day", status: "Approved", img: "https://randomuser.me/api/portraits/men/1.jpg" }, // Using placeholder
    { id: 2, name: "Floral Lehenga", category: "Wedding", price: "₹3,000/day", status: "Pending", img: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, name: "Tuxedo Suit", category: "Party", price: "₹1,500/day", status: "Approved", img: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 4, name: "Silk Saree", category: "Festival", price: "₹900/day", status: "Rejected", img: "https://randomuser.me/api/portraits/women/4.jpg" },
    { id: 5, name: "Designer Gown", category: "Party", price: "₹4,500/day", status: "Pending", img: "https://randomuser.me/api/portraits/women/5.jpg" },
  ];

  const pendingOrders = [
    { id: 101, customer: "Rahul Verma", item: "Velvet Sherwani", date: "2024-03-10", status: "Pending Shipment" },
    { id: 102, customer: "Priya Singh", item: "Floral Lehenga", date: "2024-03-11", status: "Pending Approval" },
    { id: 103, customer: "Amit Patel", item: "Tuxedo Suit", date: "2024-03-12", status: "Pending Shipment" },
  ];

  const chartData = [
    { name: 'Jan', earnings: 4000 },
    { name: 'Feb', earnings: 3000 },
    { name: 'Mar', earnings: 2000 },
    { name: 'Apr', earnings: 2780 },
    { name: 'May', earnings: 1890 },
    { name: 'Jun', earnings: 2390 },
    { name: 'Jul', earnings: 3490 },
  ];

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: isSidebarOpen ? 260 : 80 }}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-white flex flex-col fixed md:relative z-20 h-full shadow-xl"
      >
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">V</div>
            {isSidebarOpen && <span className="tracking-wide">VendorPanel</span>}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {[
            { id: "dashboard", name: "Dashboard", icon: <FaBox /> },
            { id: "view-products", name: "View Products", icon: <FaList /> },
            { id: "products", name: "Add Product", icon: <FaPlus /> },
            { id: "orders", name: "Orders", icon: <FaCheckCircle /> },
            { id: "earnings", name: "Earnings", icon: <FaMoneyBillWave /> },
            { id: "profile", name: "Profile", icon: <FaUser /> },
            { id: "policies", name: "Store Policies", icon: <FaShieldAlt /> },
            { id: "settings", name: "Settings", icon: <FaCog /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (item.id === "products") setProductToEdit(null); // Reset when adding new
              }}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${currentView === item.id ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }} 
            className="flex items-center w-full p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
            <FaBars size={20} />
          </button>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
            
            <button className="relative text-gray-500 hover:text-gray-700">
              <FaBell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>

            <div className="flex items-center space-x-2">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                 {getInitials(user.name)}
               </div>
               <span className="hidden md:block text-sm font-semibold text-gray-700">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {currentView === "dashboard" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Welcome & Quick Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                  <p className="text-gray-500 mt-1">Here's what's happening with your store today.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setCurrentView("products")}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
                  >
                    <FaPlus className="mr-2" /> Add Product
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    View Orders
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                 {/* Recent Products */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Recent Products</h2>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-xs font-semibold tracking-wide text-gray-500 uppercase border-b border-gray-200">
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {recentProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center text-sm">
                                <div className="relative hidden w-10 h-10 mr-3 rounded-lg md:block bg-gray-200">
                                   <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">IMG</div>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-700">{product.name}</p>
                                  <p className="text-xs text-gray-500">ID: #{product.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{product.price}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusColor(product.status)}`}>
                                {product.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Earnings Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Earnings Overview</h2>
                  <p className="text-sm text-gray-500 mb-6">Monthly revenue trends</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#9ca3af', fontSize: 12}} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#9ca3af', fontSize: 12}} 
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="#4f46e5" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                          activeDot={{ r: 6 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Pending Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Pending Orders</h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All Orders</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FaUser size={14} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{order.customer}</h4>
                          <p className="text-xs text-gray-500">{order.item}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full mb-1">
                          {order.status}
                        </span>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : currentView === "products" ? (
            <AddProduct 
              productToEdit={productToEdit} 
              onCancel={() => {
                setCurrentView("view-products");
                setProductToEdit(null);
              }} 
            />
          ) : currentView === "view-products" ? (
            <ViewProducts 
              onAddProduct={() => {
                setProductToEdit(null);
                setCurrentView("products");
              }} 
              onEditProduct={(product) => {
                setProductToEdit(product);
                setCurrentView("products");
              }}
            />
          ) : currentView === "profile" ? (
            <VendorProfile />
          ) : currentView === "policies" ? (
            <ManagePolicies />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              View for "{currentView}" is under development.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
