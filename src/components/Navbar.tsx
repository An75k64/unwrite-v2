"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const pathname = usePathname();

  const navTabs = [
    { title: "Home", value: "home", href: "/" },
    { title: "Services", value: "services", href: "/services" },
    { title: "About", value: "about", href: "/about" }
  ];

  useEffect(() => {
    const currentTab = navTabs.find(tab => {
      if (tab.href === "/") return pathname === "/";
      return pathname.startsWith(tab.href);
    });
    if (currentTab) setActiveTab(currentTab.value);
  }, [pathname]);

  return (
    <div className="fixed top-4 w-full z-50 px-4 flex justify-center">
      <nav className="w-full max-w-6xl bg-black/80 backdrop-blur-lg border border-white/10 rounded-full px-6 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="relative z-50">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-36 h-10 sm:w-44 sm:h-12"
            >
              <Image
                src="/logo.png"
                alt="Unwrite Studios"
                fill
                className="object-contain brightness-200"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Nav Tabs */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {navTabs.map((tab) => (
              <Link
                key={tab.value}
                href={tab.href}
                className="relative px-5 py-2 transition-all duration-300 group"
              >
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 text-[11px] uppercase tracking-[0.2em] font-bold transition-colors duration-300",
                    activeTab === tab.value ? "text-black" : "text-gray-400 group-hover:text-white"
                  )}
                >
                  {tab.title}
                </span>
              </Link>
            ))}
          </div>

          {/* Luxury CTA Button */}
          <div className="hidden lg:block">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest border border-white transition-all"
              >
                Contact
              </motion.button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden mt-4"
            >
              <div className="flex flex-col gap-2 pb-4">
                {navTabs.map((tab) => (
                  <Link
                    key={tab.value}
                    href={tab.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
                      activeTab === tab.value 
                        ? "bg-white text-black shadow-lg" 
                        : "bg-white/5 text-gray-400 border border-white/5"
                    )}
                  >
                    {tab.title}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="px-6 py-4 rounded-2xl bg-gradient-to-r from-white to-gray-300 text-black text-center font-black uppercase tracking-widest mt-2"
                >
                  Let's Talk
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}