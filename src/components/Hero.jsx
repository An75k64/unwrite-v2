"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "./ui/card";
import { Spotlight } from "./ui/spotlight";
import { SplineScene } from "./ui/spline";
import { MouseSpotlight } from "./ui/ibelick-spotlight";

const AnimatedText = () => {
  const words = ["write", "do", "ravel", "tie", "cover"];
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const word = words[currentIndex];

    if (!isDeleting) {
      if (textIndex < word.length) {
        const t = setTimeout(() => {
          setDisplayedText(word.slice(0, textIndex + 1));
          setTextIndex(textIndex + 1);
        }, 150);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setIsDeleting(true), 900);
        return () => clearTimeout(t);
      }
    } else {
      if (textIndex > 0) {
        const t = setTimeout(() => {
          setDisplayedText(word.slice(0, textIndex - 1));
          setTextIndex(textIndex - 1);
        }, 100);
        return () => clearTimeout(t);
      } else {
        setIsDeleting(false);
        setCurrentIndex((p) => (p + 1) % words.length);
        setDisplayedText("");
        setTextIndex(0);
      }
    }
  }, [textIndex, isDeleting, currentIndex]);

  return (
    <div className="flex items-baseline gap-1 justify-center lg:justify-start">
      <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
        Un
      </span>
      <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
        {displayedText}
      </span>
    </div>
  );
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Mouse spotlight */}
      <MouseSpotlight size={300} className="inset-0" />

      {/* MOBILE FULLSCREEN 3D BACKGROUND */}
      <div className="fixed inset-0 lg:hidden z-0 pointer-events-none">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <Card className="relative h-[75vh] lg:h-[80vh] bg-black/70 border-none overflow-hidden">
          {/* Static spotlight */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          <div className="flex h-full">
            {/* LEFT CONTENT */}
            <div className="relative flex-1 flex flex-col justify-center p-8 text-center lg:text-left z-20">
              {/* Mobile overlay */}
              <div className="absolute inset-0 bg-black/50 lg:hidden -z-10" />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <AnimatedText />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                Every brand has a story.
                <span className="block mt-2 text-white/90">
                  We unwrite the bad chapters.
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center lg:justify-start max-w-sm mx-auto lg:mx-0"
              >
                <Link href="/services" className="w-full lg:w-auto">
                  <button className="w-full lg:w-auto px-10 py-4 rounded-full bg-white text-black font-bold border border-white/20 hover:bg-neutral-200 transition-all duration-300 uppercase tracking-tight text-sm">
                    Explore Services
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* RIGHT 3D – DESKTOP ONLY */}
            <div className="hidden lg:block flex-1 relative z-0">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}