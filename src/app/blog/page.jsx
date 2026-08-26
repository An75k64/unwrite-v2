"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { ArrowRight, Clock, Calendar, User, ArrowUpRight, Send } from "lucide-react";
import Link from "next/link";
import BackgroundStars from "../../components/BackgroundStars";
import { getArticles } from "../../lib/adminStore";

// ─── Blog Data ────────────────────────────────────────────────────────────────
const categories = ["All", "Design", "Branding", "Development", "Photography", "AI", "Creative", "Motion"];


// ─── Floating Glass Magazine Pages (Hero Right) ───────────────────────────────
function FloatingMagazinePages({ mousePos, articles }) {
  const pages = [
    { angle: -12, x: 20, y: 40, z: 0, opacity: 0.35, delay: 0.2, scale: 0.85 },
    { angle: -5, x: 60, y: 20, z: 1, opacity: 0.6, delay: 0.4, scale: 0.92 },
    { angle: 3, x: 110, y: 60, z: 2, opacity: 1, delay: 0.6, scale: 1 },
  ];

  return (
    <div className="relative hidden lg:block h-[520px] w-full">
      {pages.map((page, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30, rotate: page.angle - 5 }}
          animate={{ opacity: page.opacity, y: 0, rotate: page.angle }}
          transition={{ duration: 1.2, delay: page.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: "absolute",
            left: page.x,
            top: page.y,
            zIndex: page.z + 1,
            transform: `
              rotate(${page.angle}deg)
              translateX(${mousePos.x * (0.2 + i * 0.15)}px)
              translateY(${mousePos.y * (0.15 + i * 0.1)}px)
              scale(${page.scale})
            `,
            transition: "transform 0.4s ease-out",
            willChange: "transform",
          }}
        >
          <div
            className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            style={{ width: 240, height: 320 }}
          >
            {/* Page header */}
            <div className="absolute top-0 left-0 right-0 z-20 h-14 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center px-5 gap-3">
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="h-px flex-1 bg-white/10" />
              <div className="text-[8px] font-black uppercase tracking-widest text-white/30">
                {["Design", "Branding", "Creative"][i]}
              </div>
            </div>

            {/* Content blocks */}
            <div className="absolute top-14 left-0 right-0 bottom-0 p-5 flex flex-col gap-3 bg-neutral-950/80 backdrop-blur-sm">
              <div className="h-2 w-3/4 rounded-full bg-white/10" />
              <div className="h-2 w-full rounded-full bg-white/[0.06]" />
              <div className="h-2 w-5/6 rounded-full bg-white/[0.06]" />
              <div className="flex-1 rounded-xl overflow-hidden mt-1">
                <img
                  src={articles[i + 1]?.src || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=90&auto=format&fit=crop"}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <div className="h-1.5 w-1/2 rounded-full bg-white/[0.08]" />
            </div>

            {/* Glass sheen */}
            <div
              className="absolute inset-0 z-30 pointer-events-none rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)" }}
            />
          </div>
        </motion.div>
      ))}

      {/* Soft shadow beneath */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-10 bg-black/40 blur-2xl rounded-full" />
    </div>
  );
}

// ─── Category Filter ──────────────────────────────────────────────────────────
function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          onClick={() => onChange(cat)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
            active === cat
              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              : "bg-white/5 text-neutral-500 border-white/5 hover:border-white/15 hover:text-white"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
}

// ─── Featured Article ─────────────────────────────────────────────────────────
function FeaturedArticle({ article }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/blog/${article.id}`} className="block">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group rounded-[2.5rem] overflow-hidden border border-white/5 h-[70vh] min-h-[500px] cursor-pointer"
    >
      {/* Cover image */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <img
          src={article.src}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />

      {/* Glass reflection on hover */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)" }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end p-10 md:p-14">
        {/* Featured badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1.5 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-[0.25em]">
            Featured
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-[0.25em]">
            {article.category}
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.92] mb-5 max-w-3xl">
          {article.title}
        </h2>
        <p className="text-neutral-400 text-base font-medium max-w-2xl mb-8 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-medium">
            <User size={12} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-medium">
            <Calendar size={12} />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-medium">
            <Clock size={12} />
            <span>{article.readTime}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] w-fit transition-all">
          Continue Reading
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article, index }) {
  const ref = useRef(null);

  // Spring physics for ultra-smooth 120hz interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
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
    scale.set(1.02);
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
    <Link href={`/blog/${article.id}`} className="contents">
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1200,
      }}
      className="relative group flex flex-col rounded-[1.75rem] overflow-hidden border border-white/5 bg-neutral-900/30 transition-colors duration-500 cursor-pointer will-change-transform shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
    >
      {/* Background glow when hovered */}
      <motion.div 
        className="absolute inset-0 bg-neutral-900/50 pointer-events-none z-0"
        style={{ opacity }}
      />
      
      {/* Dynamic Glass Reflection Sweep */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay rounded-[1.75rem]"
        style={{
          background: useMotionTemplate`radial-gradient(
            800px circle at ${useTransform(mouseX, [-0.5, 0.5], [0, 100])}% ${useTransform(mouseY, [-0.5, 0.5], [0, 100])}%,
            rgba(255,255,255,0.1),
            transparent 30%
          )`,
          opacity: sheenOpacity,
        }}
      />
      
      {/* Dynamic Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-[1.75rem] pointer-events-none z-30"
        style={{
          boxShadow: useMotionTemplate`inset 0 0 0 1px rgba(255,255,255,${useTransform(opacity, [0, 1], [0.02, 0.1])})`
        }}
      />

      {/* Cover image */}
      <div className="relative h-52 overflow-hidden z-10 rounded-t-[1.75rem]">
        <motion.img
          src={article.src}
          alt={article.title}
          className="w-full h-full object-cover"
          style={{ scale: useSpring(useTransform(scale, [1, 1.02], [1, 1.08]), springConfig) }}
          loading="lazy"
        />
        {/* Deepening gradient on hover */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: useMotionTemplate`linear-gradient(to top, rgba(0,0,0,${useTransform(opacity, [0,1],[0.45,0.75])}) 0%, transparent 60%)`,
          }}
        />

        {/* Shimmer scan line sweeping top→bottom */}
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            height: 1.5,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            top: useTransform(opacity, [0, 1], ["-5%", "115%"]),
            opacity: sheenOpacity,
          }}
        />

        {/* Category badge — shifts right on hover */}
        <div className="absolute top-4 left-4">
          <motion.span
            style={{ x: useTransform(opacity, [0,1], [0, 3]) }}
            className="inline-block px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.25em] text-white/60 will-change-transform"
          >
            {article.category}
          </motion.span>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-1 p-6 z-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-white/5 text-[9px] font-black uppercase tracking-[0.24em] text-white/65 border border-white/10 px-3 py-1.5">
            {article.category}
          </span>
          <motion.div
            style={{ scaleX: opacity, originX: 0 }}
            className="h-px flex-1 bg-white/15 ml-3 will-change-transform"
          />
        </div>

        <h3 className="text-white font-black tracking-tight text-lg leading-snug uppercase">
          {article.title}
        </h3>

        <p
          className="text-neutral-400 text-sm font-medium leading-6 mt-3 mb-5 flex-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 relative gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-neutral-600 text-[11px] font-medium">
              <Clock size={10} />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600 text-[11px] font-medium">
              <Calendar size={10} />
              <span>{article.date}</span>
            </div>
          </div>

          <motion.div
            style={{
              x: useTransform(opacity, [0, 1], [0, 4]),
              opacity: useTransform(opacity, [0, 1], [0.4, 1]),
              scale: useTransform(opacity, [0, 1], [0.9, 1.05])
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black font-black text-[8px] uppercase tracking-[0.22em] will-change-transform"
          >
            <span>Read More</span>
            <ArrowUpRight size={11} />
          </motion.div>
        </div>
      </div>
    </motion.article>
    </Link>
  );
}

// ─── Newsletter Section ───────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative max-w-7xl mx-auto px-6 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-neutral-900/20 backdrop-blur-sm p-10 md:p-16 text-center"
      >
        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/[0.025] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">Newsletter</span>
          </div>

          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            STAY
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
              INSPIRED.
            </span>
          </h2>

          <p className="text-neutral-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed font-medium mb-10">
            Ideas, case studies, and design perspectives delivered to your inbox. No noise. Just substance.
          </p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-neutral-600 text-sm font-medium outline-none focus:border-white/25 focus:bg-white/[0.08] transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] whitespace-nowrap transition-all"
                >
                  Subscribe
                  <Send size={12} />
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 border border-white/15"
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-white font-black text-[11px] uppercase tracking-[0.2em]">
                  You're on the list. Welcome.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-neutral-700 text-xs font-medium mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const fetchArticles = () => setArticles(getArticles().filter(a => a.status !== "draft"));
    fetchArticles();
    window.addEventListener("storage", fetchArticles);
    return () => window.removeEventListener("storage", fetchArticles);
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  // Mouse parallax for hero
  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      if (e.clientY > rect.bottom) return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 24,
        y: (e.clientY / window.innerHeight - 0.5) * 18,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const featuredArticle = articles.find((a) => a.featured);
  const filteredArticles = articles.filter((a) => {
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    return !a.featured && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">

      {/* ── Ambient Background ─────────────────────────────── */}
      <BackgroundStars />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-white/[0.025] rounded-full blur-[130px]" />
        <div className="absolute bottom-[-15%] left-[-8%] w-[40%] h-[40%] bg-white/[0.015] rounded-full blur-[120px]" />
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
              <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">Editorial</span>
            </motion.div>

            {/* Stacked editorial heading with floating word family */}
            <div className="space-y-1 mb-10 relative">
              {/* Floating word family removed per user request */}

              {["INSIGHTS", "STORIES", "IDEAS", "THAT INSPIRE."].map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <span
                    className={`block font-black tracking-tighter uppercase leading-[0.88] ${
                      i < 2
                        ? "text-6xl md:text-8xl lg:text-9xl text-white"
                        : i === 2
                        ? "text-5xl md:text-7xl lg:text-8xl text-neutral-500"
                        : "text-3xl md:text-4xl lg:text-5xl text-neutral-700 italic"
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
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-neutral-500 text-base md:text-lg max-w-md leading-relaxed font-medium"
            >
              Perspectives on design, branding, technology, and creativity from inside the Unwrite studio.
            </motion.p>
          </div>

          {/* Right — Floating 3D Glass Magazine Pages */}
          <motion.div style={{ y: heroParallax }}>
            <FloatingMagazinePages mousePos={mousePos} articles={articles} />
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

      {/* ── FEATURED ARTICLE ───────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between border-b border-white/5 pb-8 mb-12"
        >
          <div>
            <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">01</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Featured Story</h2>
          </div>
        </motion.div>

        {featuredArticle && <FeaturedArticle article={featuredArticle} />}
      </section>

      {/* ── CATEGORY FILTER ────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          <div className="flex items-end justify-between border-b border-white/5 pb-8">
            <div>
              <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">02</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Latest Articles</h2>
            </div>
            <p className="text-neutral-600 text-sm font-medium hidden md:block">
              {filteredArticles.length} articles
            </p>
          </div>

          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </motion.div>
      </section>

      {/* ── ARTICLES GRID ──────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pb-32">
        <AnimatePresence mode="popLayout">
          {filteredArticles.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredArticles.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <p className="text-neutral-600 text-sm font-medium uppercase tracking-widest">
                No articles in this category yet.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── NEWSLETTER ─────────────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
}
