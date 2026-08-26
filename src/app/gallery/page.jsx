"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Link from "next/link";
import ScrollFrameBackground from "../../components/ScrollFrameBackground";
import { getGallery } from "../../lib/adminStore";

// ─── Gallery Data ────────────────────────────────────────────────────────────

const heightMap = {
  short: "h-52",
  medium: "h-72",
  tall: "h-96",
};

// ─── Floating Glass Hero Element ─────────────────────────────────────────────
function FloatingFrame({ src, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 rounded-2xl" />
      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/20 z-[5] rounded-2xl" />
    </motion.div>
  );
}


// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ items, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  const item = items[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <X size={18} />
      </button>

      {/* Navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Image */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 max-w-5xl w-full mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
          <img
            src={item.src}
            alt={item.title}
            className="w-full object-cover max-h-[75vh]"
          />
        </div>
        <div className="mt-4 flex items-center justify-between px-1">
          <div>
            <p className="text-white font-bold tracking-tight">{item.title}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-widest font-black mt-0.5">{item.category}</p>
          </div>
          <p className="text-neutral-600 text-xs font-black uppercase tracking-widest">
            {currentIndex + 1} / {items.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────
function GalleryCard({ item, index, onClick }) {
  const ref = useRef(null);
  
  // Spring physics for ultra-smooth 120hz interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const scale = useSpring(1, springConfig);
  const opacity = useSpring(0, springConfig);
  const sheenOpacity = useSpring(0, { damping: 30, stiffness: 400 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    scale.set(1.03); // Subtle card lift
    opacity.set(1);
    sheenOpacity.set(1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
    opacity.set(0);
    sheenOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={() => onClick(index)}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1200,
      }}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/40 ${heightMap[item.height || "medium"]} will-change-transform`}
    >
      {/* Image with spring scale */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover"
          style={{ scale: useSpring(useTransform(scale, [1, 1.03], [1, 1.1]), springConfig) }}
          loading="lazy"
        />
      </div>

      {/* Dark vignette - deepens on hover */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: useMotionTemplate`linear-gradient(to top, rgba(0,0,0,${useTransform(opacity, [0,1],[0.6,0.92])}) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)`,
        }}
      />

      {/* Dynamic Glass Spotlight Sweep */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
        style={{
          background: useMotionTemplate`radial-gradient(
            500px circle at ${useTransform(mouseX, [-0.5, 0.5], [0, 100])}% ${useTransform(mouseY, [-0.5, 0.5], [0, 100])}%,
            rgba(255,255,255,0.18),
            transparent 38%
          )`,
          opacity: sheenOpacity,
        }}
      />

      {/* Shimmer scan line that sweeps top→bottom on hover */}
      <motion.div
        className="absolute inset-x-0 z-25 pointer-events-none"
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
          top: useTransform(opacity, [0, 1], ["-4%", "110%"]),
          opacity: sheenOpacity,
        }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-30"
        style={{
          boxShadow: useMotionTemplate`inset 0 0 0 1px rgba(255,255,255,${useTransform(opacity, [0, 1], [0.05, 0.18])}), 0 ${useTransform(opacity, [0, 1], [8, 28])}px ${useTransform(opacity, [0, 1], [20, 70])}px rgba(0,0,0,${useTransform(opacity, [0, 1], [0.3, 0.6])})`
        }}
      />

      {/* Zoom / VIEW icon top-right */}
      <motion.div
        style={{ opacity, scale: useTransform(opacity, [0, 1], [0.7, 1]) }}
        className="absolute top-4 right-4 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white will-change-transform"
      >
        <ZoomIn size={12} />
        <span className="text-[9px] font-black tracking-widest uppercase">View</span>
      </motion.div>

      {/* Info content — slides up on hover */}
      <motion.div
        style={{ y: useTransform(opacity, [0, 1], [20, 0]) }}
        className="absolute bottom-0 left-0 w-full p-6 z-30 will-change-transform"
      >
        <motion.span
          style={{ opacity: useTransform(opacity, [0, 1], [0.4, 1]) }}
          className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/80 mb-3"
        >
          {item.category}
        </motion.span>
        <h3 className="text-white font-bold tracking-tight text-xl leading-tight">
          {item.title}
        </h3>
        {/* Thin animated underline */}
        <motion.div
          style={{ scaleX: opacity, originX: 0 }}
          className="h-px bg-white/40 mt-3 will-change-transform"
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const fetchItems = () => {
      setGalleryItems(getGallery().filter(i => i.status !== "draft"));
    };
    fetchItems();
    window.addEventListener("storage", fetchItems);
    return () => window.removeEventListener("storage", fetchItems);
  }, []);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  // Mouse parallax for hero
  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      if (e.clientY > rect.bottom) return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((i) => (i - 1 + galleryItems.length) % galleryItems.length);
  const nextImage = () => setLightboxIndex((i) => (i + 1) % galleryItems.length);

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">

      {/* ── Ambient Background ─────────────────────────────── */}
      <ScrollFrameBackground />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-white/[0.025] rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.015] rounded-full blur-[120px]" />
      </div>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-24"
      >


        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Typography */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">Visual Archive</span>
            </motion.div>

            {/* Stacked editorial heading with floating word tags */}
            <div className="space-y-1 mb-10 relative">
              {/* Floating word family beside the heading */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="absolute -right-4 top-0 bottom-0 hidden xl:flex flex-col justify-around pointer-events-none select-none z-50"
                style={{ width: 120 }}
              >
                {[
                  { word: "CREATIVE", delay: 0.9, x: 20, yOff: 0 },
                  { word: "PREMIUM", delay: 1.1, x: 8,  yOff: 0 },
                  { word: "VISUAL",  delay: 1.3, x: 24, yOff: 0 },
                  { word: "STORY",   delay: 1.5, x: 14, yOff: 0 },
                  { word: "DESIGN",  delay: 1.7, x: 6,  yOff: 0 },
                  { word: "ART",     delay: 1.9, x: 30, yOff: 0 },
                ].map(({ word, delay, x }, wi) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{
                      opacity: [0, 0.9, 0.7, 0.9],
                      x: [30, x, x + 4, x],
                    }}
                    transition={{
                      delay,
                      duration: 3 + wi * 0.4,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                    className="text-[10px] font-black tracking-[0.25em] text-white/80 border border-white/20 rounded-full px-3 py-1 bg-white/10 backdrop-blur-md whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    style={{ marginLeft: x }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>

              {["OUR", "GALLERY", "VISUAL", "STORIES", "CAPTURED", "WITH PURPOSE."].map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <span
                    className={`block font-black tracking-tighter uppercase leading-[0.88] ${
                      i < 2
                        ? "text-5xl md:text-7xl lg:text-8xl text-white"
                        : i < 4
                        ? "text-4xl md:text-6xl lg:text-7xl text-white/80"
                        : "text-3xl md:text-4xl lg:text-5xl text-white/60"
                    }`}
                  >
                    {line}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-white/70 text-base md:text-lg max-w-md leading-relaxed font-medium"
            >
              Every frame a deliberate choice. Every composition a story. A curated visual archive of our most defining work.
            </motion.p>
          </div>

          {/* Right — Floating 3D Glass Frames */}
          <motion.div
            className="relative hidden lg:block h-[540px]"
            style={{ y: heroParallax }}
          >
            {/* Back frame */}
            <motion.div
              style={{
                transform: `translateX(${mousePos.x * 0.3}px) translateY(${mousePos.y * 0.3}px)`,
                transition: "transform 0.6s ease-out",
              }}
            >
              <FloatingFrame
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop"
                style={{ width: 260, height: 340, top: 60, left: 80, opacity: 0.5, filter: "blur(1px)" }}
                delay={0.2}
              />
            </motion.div>

            {/* Middle frame */}
            <motion.div
              style={{
                transform: `translateX(${mousePos.x * 0.6}px) translateY(${mousePos.y * 0.5}px)`,
                transition: "transform 0.4s ease-out",
              }}
            >
              <FloatingFrame
                src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80&auto=format&fit=crop"
                style={{ width: 300, height: 380, top: 20, left: 160, opacity: 0.75 }}
                delay={0.4}
              />
            </motion.div>

            {/* Front frame */}
            <motion.div
              style={{
                transform: `translateX(${mousePos.x * 1.0}px) translateY(${mousePos.y * 0.8}px)`,
                transition: "transform 0.25s ease-out",
              }}
            >
              <FloatingFrame
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop"
                style={{ width: 220, height: 280, top: 180, left: 80, opacity: 1 }}
                delay={0.6}
              />
            </motion.div>

            {/* Floating chips */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-16 right-8 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white/60"
            >
              9 Works
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute top-12 right-4 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white/60"
            >
              Since 2022
            </motion.div>
          </motion.div>

        </div>


        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
          />
          <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em]">Scroll</span>
        </motion.div>
      </section>

      {/* ── GALLERY SECTION HEADER ────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-4"
        >
          <div>
            <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">
              Archive
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Selected Works
            </h2>
          </div>
          <p className="text-neutral-600 text-sm font-medium max-w-xs text-right hidden md:block">
            A curated selection spanning branding, digital, motion, and photography.
          </p>
        </motion.div>
      </section>

      {/* ── MASONRY GALLERY ───────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-0">
          {galleryItems.map((item, i) => (
            <div key={item.id} className="break-inside-avoid mb-5">
              <GalleryCard item={item} index={i} onClick={openLightbox} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED COLLECTION BANNER ────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="group relative h-[60vh] min-h-[420px] rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer"
        >
          {/* Background image */}
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=90&auto=format&fit=crop"
              alt="Featured Collection"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

          {/* Glass panel content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 block">
                Featured Collection
              </span>
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
                The Editorial<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
                  Series 01
                </span>
              </h3>
              <p className="text-neutral-400 text-base font-medium max-w-lg mb-8 leading-relaxed">
                A landmark series exploring the intersection of minimal design and emotional storytelling. Each piece crafted with obsessive intent.
              </p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] transition-all"
                >
                  View Project
                  <ArrowRight size={14} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── LIGHTBOX ──────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={galleryItems}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
