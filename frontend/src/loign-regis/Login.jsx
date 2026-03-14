import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaArrowLeft, FaSpinner } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        toast.success(`Welcome back, ${response.data.user.name}!`);

        // Save token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect based on role returned from backend
        if (response.data.user.role === 'vendor') {
          navigate("/vendor-dashboard");
        } else if (response.data.user.role === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Left Side - Decorative & Testimonial */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 relative overflow-hidden items-center justify-center p-12 text-white"
      >
        {/* Animated Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <motion.div
            animate={{ rotate: 360, y: [0, 20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ rotate: -360, x: [0, -30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          />
        </div>

        {/* Testimonial Card */}
        <div className="relative z-10 max-w-md backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div className="text-5xl mb-6 font-serif opacity-80">"</div>
          <p className="text-xl leading-relaxed mb-6 font-light">
            EventWear has completely transformed how I attend weddings. I can
            wear a new designer outfit every time without the guilt of spending
            a fortune.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold shadow-inner">
              SJ
            </div>
            <div>
              <h4 className="font-semibold text-lg">Sarah Jenkins</h4>
              <p className="text-sm text-indigo-200">Fashion Blogger</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white h-screen lg:h-auto overflow-y-auto"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 lg:top-10 lg:left-10 flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>

          <div className="text-center lg:text-left pt-12 lg:pt-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and password to access your account.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
