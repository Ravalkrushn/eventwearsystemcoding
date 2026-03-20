import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/categories");
        if (res.data.success && res.data.data.length > 0) {
          // Map API data to the format needed for the grid
          const dynamicCategories = res.data.data
            .filter(cat => cat.isActive)
            .map((cat, index) => ({
              title: cat.name,
              description: cat.description || "Curated collection",
              image: cat.image ? `http://localhost:5000${cat.image}` : "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
              cols: index === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
            }));
          setCategories(dynamicCategories);
        } else {
            setCategories(staticCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories(staticCategories);
      }
    };
    fetchCategories();
  }, []);

  const staticCategories = [
    {
      title: "Wedding",
      description: "Bridal lehengas, Sherwanis & more",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
      cols: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Party",
      description: "Cocktail dresses & Tuxedos",
      image:
        "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&q=80",
      cols: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Festival",
      description: "Traditional vibrant ethnic wear",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      cols: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Corporate",
      description: "Sharp suits & blazers",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
      cols: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Photoshoot",
      description: "Trendy outfits for influencers",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
      cols: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <section id="categories" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Occasion
            </h2>
            <p className="text-lg text-gray-600 max-w-xl">
              Find the perfect look for any event from our curated collections.
            </p>
          </div>
          <button className="hidden md:flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition">
            View all collections <FaArrowRight className="ml-2" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              onClick={() => navigate(`/category/${category.title}`)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer ${category.cols}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {category.title}
                </h3>
                <p className="text-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                  {category.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <button className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition">
            View all collections <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
