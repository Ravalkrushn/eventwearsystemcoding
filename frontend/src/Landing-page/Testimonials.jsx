import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Bride",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      text: "I found my dream wedding lehenga on EventWear at 1/10th of the price. The quality was impeccable and fit perfectly!",
    },
    {
      name: "Michael Chen",
      role: "Corporate Professional",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "Renting a tuxedo for the gala was so easy. The vendor process is transparent, and the delivery was right on time.",
    },
    {
      name: "Emily Davis",
      role: "Fashion Blogger",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
      text: "As a creator, I need new looks constantly. This platform allows me to wear premium brands without cluttering my closet.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-lg text-gray-600">
            See what people are saying about their EventWear experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 relative"
            >
              <FaQuoteLeft className="text-indigo-100 text-4xl absolute top-6 right-6" />
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full mr-4 border-2 border-indigo-50"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                  <div className="flex text-yellow-400 gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} size={14} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic relative z-10">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
