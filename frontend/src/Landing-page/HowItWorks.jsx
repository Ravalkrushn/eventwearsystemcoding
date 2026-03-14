import React from "react";
import { motion } from "framer-motion";
import {
  FaStore,
  FaClipboardCheck,
  FaSearchDollar,
  FaShippingFast,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaStore />,
      title: "Vendor Lists Outfits",
      description:
        "Vendors upload their premium collection with details and pricing.",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Admin Approves",
      description: "Our team quality checks and approves items for listing.",
    },
    {
      icon: <FaSearchDollar />,
      title: "Customer Rents",
      description:
        "Browse the curated collection and book your favorite outfit.",
    },
    {
      icon: <FaShippingFast />,
      title: "Fast Delivery",
      description: "Outfit is delivered to your doorstep ready for your event.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A seamless process for both vendors and customers.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center group"
            >
              {/* Icon Circle */}
              <div className="inline-block mb-6 relative bg-white p-2">
                <div className="w-24 h-24 bg-indigo-50 group-hover:bg-indigo-600 transition-colors duration-300 rounded-full flex items-center justify-center text-indigo-600 group-hover:text-white text-3xl shadow-sm">
                  {step.icon}
                </div>
                {/* Step Number */}
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-white">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
