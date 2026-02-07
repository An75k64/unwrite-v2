"use client";
import Link from "next/link";
import React from "react";
import { ArrowRight, Mail, Check } from "lucide-react";

const CTASection = () => {
  const benefits = ["Free Consultation", "No Hidden Fees", "Tailored Strategy"];

  return (
    <section className="relative w-full pt-2 pb-8 md:pt-4 md:pb-10 bg-black text-white overflow-hidden">
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, #444 1px, transparent 1px)",
            backgroundSize: "4rem 100%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 z-10">
        
        {/* Main CTA Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-neutral-900/20 backdrop-blur-3xl p-8 md:p-12 text-center">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.3em]">
                Ready to Start
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-[0.95]">
              Build Something
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
                Incredible Together
              </span>
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mb-8 leading-relaxed font-medium">
              Transform your digital presence with intentional design and
              high-performance systems. Let's unwrite the noise and build what
              matters.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10">
              
              <button className="group relative px-8 py-4 bg-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-white/5">
                <span className="relative z-10">Start Project</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                  <Mail className="w-4 h-4 text-white/60" />
                  <span>Contact Us</span>
                </button>
              </Link>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;