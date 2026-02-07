"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/* Floating Shapes */
function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96] }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

/* --- BADGE TYPING EFFECT --- */
function BadgeTyping() {
  const text = "UNWRITE";
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 80 : 150;
    const pauseTime = 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < text.length) {
          setCurrentText(text.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(text.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting]);

  return <span className="min-w-[70px] inline-block">{currentText}</span>;
}

/* Typing + Cut Animation for Title */
/* Typing + Cut Animation for Title */
function TypingTitle() {
  // We move "We " out of the text string so it doesn't animate
  const text = "unwrite the bad Chapters"; 
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 60 : 120;
    const pauseTime = 1500;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < text.length) {
          setCurrentText(text.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(text.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting]);

  return (
    <span>
      {/* "We " stays static here */}
      We {currentText}
    </span>
  );
}

/* Hero Component */
function HeroGeometric({
  badge = "Design Collective",
  title1 = "Every brand has a Story",
  description = "Transforming digital narratives through innovative design and strategic storytelling.",
  showContactButton = false,
  useTypingBadge = true,
}) {
  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#0A0714] text-white pt-20 pb-12">
      
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/[0.08] via-transparent to-pink-700/[0.06] blur-3xl" />

      {/* Shapes */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-purple-500/[0.15]" className="left-[-10%] top-[20%]" />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-pink-500/[0.15]" className="right-[-5%] top-[75%]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-7xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
            <Circle className="h-1.5 w-1.5 fill-pink-500/80 text-pink-500/80" />
            <span className="text-xs tracking-widest font-medium uppercase">
              {useTypingBadge ? <BadgeTyping /> : badge}
            </span>
          </div>

          {/* Reduced Font Sizes: 
              text-2xl (mobile) 
              md:text-6xl (desktop - down from 8xl) 
          */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              {title1}
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              <TypingTitle />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            {description}
          </p>

          {showContactButton && (
            <Link href="/contact">
              <button className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
                Contact Us →
              </button>
            </Link>
          )}

        </div>
      </div>
    </section>
  );
}


export { HeroGeometric };