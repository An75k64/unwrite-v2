"use client";

import Hero from "../components/Hero";
import TrustedBySection from "../components/TrustedBySection";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import ClientSuccessStories from "../components/ClientSuccessStories";
import CTASection from "../components/CTASection";
import GlobeDemo from "@/components/GlobeDemo"


import FallingParticlesBackground from "../components/FallingParticlesBackground";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section - WITHOUT stars background */}
      <div className="relative">
        <Hero />
      </div>

      {/* Logo Cloud - Just below Hero */}
      <div className="relative bg-[#000000]">
        <TrustedBySection />
      </div>

      {/* Rest of the page - WITH stars background */}
      <div className="relative">
        <FallingParticlesBackground />
         <Services />
        <WhyChooseUs />
          
        <ClientSuccessStories />
      
        <CTASection />
      </div>
    </div>
  );
}
