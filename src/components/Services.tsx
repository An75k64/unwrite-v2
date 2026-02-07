"use client";

import { motion } from "framer-motion";
import { Brain, Users, Rocket, Globe, Bot, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const serviceLayers = [
  {
    id: "01",
    name: "Strategy & Brand",
    subtitle: "Foundation Layer",
    description:
      "Clarity before creativity. We define your positioning and digital roadmap.",
    icon: Brain,
    services: ["Brand Strategy", "Digital Marketing Strategy"],
  },
  {
    id: "02",
    name: "Social & Content",
    subtitle: "Visibility Layer",
    description:
      "Intentional content that builds presence, trust, and recognition.",
    icon: Users,
    services: ["Social Media Marketing", "Content Creation"],
  },
  {
    id: "03",
    name: "Campaigns & Growth",
    subtitle: "Performance Layer",
    description:
      "Campaigns, ads, and funnels designed to drive measurable outcomes.",
    icon: Rocket,
    services: ["Campaign Strategy", "Ad Management"],
  },
  {
    id: "04",
    name: "Branding & Identity",
    subtitle: "Creative Layer",
    description:
      "Visual languages that resonate. We craft identities that stand the test of time.",
    icon: Rocket,
    services: ["Logo Design", "Visual Identity Systems"],
  },
  {
    id: "05",
    name: "Web & Tech",
    subtitle: "Experience Layer",
    description:
      "Websites and apps that are clean, intuitive, and built to perform.",
    icon: Globe,
    services: ["Web Design", "App Development"],
  },
  {
    id: "06",
    name: "Automation & Systems",
    subtitle: "Scale Layer",
    description:
      "Smart systems that scale communication and lead handling effortlessly.",
    icon: Bot,
    services: ["WhatsApp Automation", "AI Integration"],
  },
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-black">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-white/5 rounded-full border border-white/10 mb-6">
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">
              Our Expertise
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tighter">
            <span className="text-white">WHAT WE </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              UNWRITE
            </span>
          </h2>

          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Breaking traditional patterns to rebuild digital excellence through a
            minimalist and result-driven approach.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {serviceLayers.map((layer, index) => {
            const Icon = layer.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={layer.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group"
              >
                <div
                  className={cn(
                    "relative h-full rounded-3xl p-8 border backdrop-blur-md transition-all duration-500",
                    "bg-neutral-900/40",
                    isHovered
                      ? "border-white/30 bg-neutral-800/50 -translate-y-2 shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                      : "border-white/5"
                  )}
                >
                  <div
                    className={cn(
                      "w-14 h-14 mb-8 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isHovered
                        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        : "bg-white/5 text-white"
                    )}
                  >
                    <Icon size={28} strokeWidth={1.5} />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-white font-black text-lg">
                      {layer.id}
                    </span>
                    <div className="h-px w-8 bg-white/20" />
                    <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">
                      {layer.subtitle}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">
                    {layer.name}
                  </h3>

                  <p className="text-gray-500 mb-8 text-xs font-medium leading-relaxed">
                    {layer.description}
                  </p>

                  <div className="space-y-3">
                    {layer.services.map((service) => (
                      <div
                        key={service}
                        className="flex items-center text-white/60 text-[11px] font-bold uppercase tracking-wider"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white mr-3 opacity-20 group-hover:opacity-100 transition-opacity" />
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3"
            >
              Explore All Solutions
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
