"use client"

import React from "react"
import { motion } from "framer-motion"
import { Award, TrendingUp, Clock, Zap, Shield, Users, Rocket, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const WhyChooseUs = () => {
  const stats = [
    { id: 1, value: "120+", label: "Projects Completed", icon: Award },
    { id: 2, value: "80%", label: "Avg Growth in Traffic", icon: TrendingUp },
    { id: 3, value: "5+", label: "Years of Experience", icon: Clock },
    { id: 4, value: "30+", label: "Tech Stacks & Tools", icon: Zap },
  ]

  const features = [
    { icon: Rocket, title: "Fast Turnaround", description: "Quick delivery without compromising quality." },
    { icon: Shield, title: "24/7 Support", description: "Always available when you need us most." },
    { icon: Users, title: "Result-Driven", description: "Focus on metrics that matter to your business." },
  ]

  const benefits = [
    "Dedicated project manager",
    "Agile development process",
    "100% transparent workflow",
    "Free consultation & strategy",
    "Post-launch support included",
    "Money-back guarantee",
  ]

  return (
    <section className="relative w-full py-16 lg:py-24 overflow-hidden bg-black">
      
      {/* Subtle Monochrome Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-white/5 rounded-full border border-white/10 mb-6">
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">Value Proposition</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tighter">
            <span className="text-white">PROVEN RESULTS. </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase">
              Expert Execution
            </span>
          </h2>

          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Join hundreds of satisfied clients who chose excellence through our 
            minimalist and precise digital methodologies.
          </p>
        </motion.div>

        {/* Stats Section - High Contrast B&W */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div 
                key={stat.id} 
                whileHover={{ y: -5 }}
                className="bg-neutral-900/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 text-center transition-all hover:border-white/20"
              >
                <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Icon className="w-6 h-6 text-white/80" />
                </div>
                <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</h3>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Features - Minimalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="group bg-neutral-950 rounded-3xl p-8 border border-white/5 hover:bg-neutral-900 transition-all duration-500">
                <div className="w-10 h-10 mb-6 rounded-lg bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-medium">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Benefits Grid - Clean Glass Panel */}
        <div className="bg-neutral-900/30 rounded-[2.5rem] p-10 md:p-14 border border-white/5 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <CheckCircle2 size={120} className="text-white" />
          </div>
          
          <h3 className="text-2xl font-black text-white mb-10 text-center tracking-tight">
            THE UNWRITE ADVANTAGE
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white transition-all duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white group-hover:text-black" />
                </div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold mb-6">Ready to transform your digital presence?</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          >
            Start Your Project Today
          </motion.button>
        </div>

      </div>
    </section>
  )
}

export default WhyChooseUs