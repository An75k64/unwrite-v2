"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const portfolioData = [
  {
    title: "Modern SaaS Platform",
    category: "Website",
    description: "A cutting-edge SaaS solution with seamless user experience",
    image: "/images/red_blocks.jpg",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "E-commerce Excellence",
    category: "Web App",
    description: "Full-featured online store with advanced analytics",
    image: "/images/laptop_mockup.jpg",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Corporate Identity",
    category: "Branding",
    description: "Complete brand transformation for enterprise client",
    image: "/images/coca_cola.jpg",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Retail Management",
    category: "Website",
    description: "Inventory and customer management system",
    image: "/images/retail.jpg",
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "Design Portfolio",
    category: "Branding",
    description: "Showcase platform for creative professionals",
    image: "/images/clean_design.jpg",
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Finance App",
    category: "Web App",
    description: "Secure financial management dashboard",
    image: "/images/business_man.jpg",
    color: "from-indigo-500 to-blue-500",
  },
];

const PortfolioCard = ({ project, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -10 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-800">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
        <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/10">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${project.color} text-white mb-3`}>
          {project.category}
        </span>
        
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition duration-300">
          {project.title}
        </h3>
        
        <p className="text-gray-400 mb-4">{project.description}</p>
        
        <motion.button
          whileHover={{ x: 5 }}
          className="text-sm font-medium text-gray-500 group-hover:text-white transition duration-300 flex items-center gap-2"
        >
          View Project
          <span>→</span>
        </motion.button>
      </div>

      {/* Hover Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </motion.div>
  );
};

export default function PortfolioPage() {
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0714] pt-24">
      <section className="relative py-24 overflow-hidden">
        
        {/* Background Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 tracking-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Portfolio
            </motion.h2>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              <span className="block">Explore our work</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0077] to-[#8800FF]">
                across industries
              </span>
            </h3>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
              Successful projects that showcase our expertise and creativity
            </p>
          </motion.div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.map((project, index) => (
              <PortfolioCard key={index} project={project} index={index} />
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg
                       hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition duration-300"
            >
              Start Your Project
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
