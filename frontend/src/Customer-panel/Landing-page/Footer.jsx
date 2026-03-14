import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold text-white">EventWear</span>
            </div>
            <p className="text-sm text-gray-400">
              Your premier destination for renting high-quality designer outfits
              for weddings, parties, and corporate events.
            </p>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">About</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-indigo-400 transition"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-indigo-400 transition"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-indigo-400 transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-indigo-400 transition"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#categories"
                  className="text-gray-400 hover:text-indigo-400 transition"
                >
                  Browse Outfits
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-400 hover:text-indigo-400 transition"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="/vendor-register"
                  className="text-gray-400 hover:text-indigo-400 transition"
                >
                  Become a Vendor
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-gray-400 hover:text-indigo-400 transition"
                >
                  Login / Register
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-indigo-500" /> 123 Fashion Ave,
                NY 10001
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-indigo-500" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-indigo-500" /> support@eventwear.com
              </li>
            </ul>

            <div className="flex space-x-4 mt-6">
              <a
                href="/"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition duration-300"
              >
                <FaFacebookF />
              </a>
              <a
                href="/"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition duration-300"
              >
                <FaInstagram />
              </a>
              <a
                href="/"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition duration-300"
              >
                <FaTwitter />
              </a>
              <a
                href="/"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition duration-300"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 EventWear Rental Hub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="/" className="hover:text-white transition">
                Terms of Service
              </a>
              <a href="/" className="hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
