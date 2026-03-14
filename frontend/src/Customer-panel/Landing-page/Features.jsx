import React from "react";
import { motion } from "framer-motion";
import { FaWallet, FaUserCheck, FaGem, FaCalendarCheck } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaWallet />,
      title: "Affordable Rentals",
      description:
        "Look your best without breaking the bank. Rent designer wear at a fraction of the retail price.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FaUserCheck />,
      title: "Verified Vendors",
      description:
        "We vet every vendor to ensure you get authentic and reliable service every time.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FaGem />,
      title: "Premium Quality",
      description:
        "All outfits are professionally dry-cleaned and quality checked before delivery.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Easy Online Booking",
      description:
        "Seamless calendar booking system to reserve your outfit in just a few clicks.",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            The EventWear Advantage
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make luxury accessible, affordable, and hassle-free.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-6`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
