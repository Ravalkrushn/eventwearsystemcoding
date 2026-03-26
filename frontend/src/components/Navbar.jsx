import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaShoppingCart, FaTruck } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [cartCount, setCartCount] = useState(0);
    const { scrollY } = useScroll();

    const updateCartCount = () => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(storedCart.length);
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener("cartUpdated", updateCartCount);
        return () => window.removeEventListener("cartUpdated", updateCartCount);
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your session.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#4F46E5",
            cancelButtonColor: "#EF4444",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "No, stay"
        });

        if (result.isConfirmed) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            
            await Swal.fire({
                title: "Logged Out!",
                text: "See you again soon.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            
            navigate("/");
        }
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50 || location.pathname !== "/");
    });

    useEffect(() => {
        setIsScrolled(window.scrollY > 50 || location.pathname !== "/");
        // Always show background on other pages
    }, [location.pathname]);

    const navLinks = [
        { name: "Categories", href: "/#categories" },
        { name: "Features", href: "/#features" },
        { name: "How it Works", href: "/#how-it-works" },
        { name: "Testimonials", href: "/#testimonials" },
    ];

    const isLandingPage = location.pathname === "/";

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || !isLandingPage
                ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                            E
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900">
                            EventWear
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                             isLandingPage ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <button
                                    key={link.name}
                                    onClick={() => navigate(link.href)}
                                    className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    {link.name.replace('/#', '').toUpperCase()}
                                </button>
                            )
                        ))}
                    </div>

                    {/* Auth Buttons & Cart */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex items-center gap-4">
                            {/* Orders Button (Truck Icon) */}
                            {user && user.role !== 'vendor' && user.role !== 'admin' && (
                                <button 
                                    onClick={() => navigate("/my-orders")}
                                    className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2 group"
                                    title="Track My Rentals"
                                >
                                    <FaTruck size={22} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">My Rentals</span>
                                </button>
                            )}

                            {/* Cart Button */}
                            <button 
                                onClick={() => navigate("/cart")}
                                className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                                title="My Cart"
                            >
                                <FaShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => {
                                        if (user.role === 'vendor') navigate("/vendor-dashboard");
                                        else if (user.role === 'admin') navigate("/admin-dashboard");
                                        else navigate("/profile");
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors bg-white border border-gray-200 rounded-full shadow-sm"
                                >
                                    <FaUserCircle className="text-xl" />
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-gray-500 hover:text-red-600 transition-colors bg-gray-100 rounded-full hover:bg-red-50"
                                    title="Logout"
                                >
                                    <FaSignOutAlt className="text-lg" />
                                </button>
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button 
                            onClick={() => navigate("/cart")}
                            className="relative p-2 text-gray-700"
                        >
                            <FaShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 p-2"
                        >
                            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-6 flex flex-col space-y-4"
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-base font-bold text-gray-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-4 flex flex-col space-y-3 border-t border-gray-100">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full text-center py-2 text-gray-700 font-bold"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="w-full text-center py-2 bg-indigo-600 text-white rounded-lg font-bold"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate("/my-orders");
                                    }}
                                    className="w-full text-center py-2 text-gray-700 font-bold flex items-center justify-center gap-2"
                                >
                                    <FaTruck /> My Rentals
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        if (user.role === 'vendor') navigate("/vendor-dashboard");
                                        else if (user.role === 'admin') navigate("/admin-dashboard");
                                        else navigate("/profile");
                                    }}
                                    className="w-full text-center py-2 text-gray-700 font-bold flex items-center justify-center gap-2"
                                >
                                    <FaUserCircle /> Profile
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-center py-2 bg-red-50 text-red-600 rounded-lg font-bold flex items-center justify-center gap-2"
                                >
                                    <FaSignOutAlt /> Log Out
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
