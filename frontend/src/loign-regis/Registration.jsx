import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaStore,
  FaUserShield,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Registration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shopImage, setShopImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    shopName: "",
    ownerName: "",
    aadhar: "",
    pan: "",
    bankAccount: "",
    ifsc: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // --- Configuration ---
  const roles = [
    {
      id: "customer",
      title: "Customer",
      icon: <FaUser className="text-3xl" />,
      description: "Rent premium outfits for your special events.",
    },
    {
      id: "vendor",
      title: "Vendor",
      icon: <FaStore className="text-3xl" />,
      description: "List your collection and earn from rentals.",
    },
    {
      id: "admin",
      title: "Admin",
      icon: <FaUserShield className="text-3xl" />,
      description: "Manage platform operations and users.",
    },
  ];

  const formFields = {
    customer: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "john@example.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "+91 98765 43210",
      },
      {
        name: "address",
        label: "Address",
        type: "text",
        placeholder: "123 Main St",
      },
      { name: "city", label: "City", type: "text", placeholder: "Mumbai" },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "••••••••",
      },
    ],
    vendor: [
      {
        name: "shopName",
        label: "Shop Name",
        type: "text",
        placeholder: "Fashion Hub",
      },
      {
        name: "ownerName",
        label: "Owner Name",
        type: "text",
        placeholder: "Jane Doe",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "contact@shop.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "+91 98765 43210",
      },
      {
        name: "address",
        label: "Shop Address",
        type: "text",
        placeholder: "Market Road",
      },
      { name: "city", label: "City", type: "text", placeholder: "Delhi" },
      {
        name: "aadhar",
        label: "Aadhar Number",
        type: "text",
        placeholder: "1234 5678 9012",
      },
      {
        name: "pan",
        label: "PAN Number",
        type: "text",
        placeholder: "ABCDE1234F",
      },
      {
        name: "bankAccount",
        label: "Bank Account",
        type: "text",
        placeholder: "1234567890",
      },
      {
        name: "ifsc",
        label: "IFSC Code",
        type: "text",
        placeholder: "SBIN0001234",
      },
      {
        name: "shopImage",
        label: "Shop Photo",
        type: "file",
        placeholder: "Upload Shop Photo",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "••••••••",
      },
    ],
    admin: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Admin User",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "admin@eventwear.com",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "••••••••",
      },
    ],
  };

  // --- Helpers ---
  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "shopImage") {
      setShopImage(files[0]);
      return;
    }
    setFormData({ ...formData, [name]: value });

    if (name === "password") checkPasswordStrength(value);

    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = formFields[role];

    fields.forEach((field) => {
      if (field.type !== "file" && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (role === 'vendor' && !shopImage) {
        newErrors.shopImage = "Shop image is required";
    }

    if (formData.email && !/\S+@\S+\.\S/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append("role", role);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      data.append("city", formData.city);

      if (role === 'customer') {
        data.append("fullName", formData.name);
        data.append("address", formData.address);
      } else if (role === 'vendor') {
        data.append("ownerName", formData.ownerName);
        data.append("shopName", formData.shopName);
        data.append("shopAddress", formData.address);
        data.append("aadharNumber", formData.aadhar);
        data.append("panNumber", formData.pan);
        data.append("bankAccount", formData.bankAccount);
        data.append("ifscCode", formData.ifsc);
        if (shopImage) data.append("shopImage", shopImage);
      } else if (role === 'admin') {
        data.append("fullName", formData.name);
      }

      const response = await axios.post("http://localhost:5000/api/auth/register", data, {
          headers: {
              "Content-Type": "multipart/form-data"
          }
      });

      if (response.data.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration Error Response:", error.response?.data);
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    // Reset form data for cleaner transition if needed,
    // but keeping it allows switching back without data loss
  };

  const nextStep = () => {
    if (role) setStep(2);
    else toast.error("Please select a role");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            E
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span
                  className={`text-sm font-semibold ${step >= 1 ? "text-indigo-600" : "text-gray-400"}`}
                >
                  Step 1
                </span>
                <span className="text-xs text-gray-500">Select Role</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  className="h-full bg-indigo-600"
                />
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`text-sm font-semibold ${step >= 2 ? "text-indigo-600" : "text-gray-400"}`}
                >
                  Step 2
                </span>
                <span className="text-xs text-gray-500">Details</span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Choose your account type
                </h3>
                <div className="grid gap-4 sm:grid-cols-3 mb-8">
                  {roles.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center text-center transition-all ${
                        role === r.id
                          ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`mb-3 ${role === r.id ? "text-indigo-600" : "text-gray-500"}`}
                      >
                        {r.icon}
                      </div>
                      <h4
                        className={`font-semibold ${role === r.id ? "text-indigo-900" : "text-gray-900"}`}
                      >
                        {r.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {r.description}
                      </p>
                      {role === r.id && (
                        <div className="mt-3 text-indigo-600">
                          <FaCheck />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={!role}
                    className="flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next Step <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Complete your {role} profile
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {formFields[role].map((field) => (
                      <div
                        key={field.name}
                        className={
                          // Make some fields full width based on index or specific logic if needed
                          ["address", "shopName"].includes(field.name)
                            ? "sm:col-span-2"
                            : "col-span-1"
                        }
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label} <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type={
                              field.name.includes("password") && !showPassword
                                ? "password"
                                : field.name.includes("password")
                                  ? "text"
                                  : field.type
                            }
                            name={field.name}
                            {...(field.type !== "file" ? { value: formData[field.name] } : {})}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={`appearance-none block w-full px-3 py-2 border ${
                              errors[field.name]
                                ? "border-red-300"
                                : "border-gray-200"
                            } ${field.type === "file" ? "bg-gray-50 py-1.5" : ""} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors`}
                          />

                          {/* Show/Hide Password Toggle */}
                          {field.name === "password" && (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          )}
                        </div>
                        {errors[field.name] && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors[field.name]}
                          </p>
                        )}

                        {/* Password Strength Indicator */}
                        {field.name === "password" && formData.password && (
                          <div className="mt-2 flex gap-1 h-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full transition-colors ${
                                  passwordStrength >= i
                                    ? passwordStrength < 2
                                      ? "bg-red-500"
                                      : passwordStrength < 3
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center py-2 px-8 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" /> Creating
                          Account...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Registration;
