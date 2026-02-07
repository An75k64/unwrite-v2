"use client";

import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Rocket, Users, Check, ArrowRight } from "lucide-react";
import GlobeSection from "@/components/GlobeDemo";
import Link from "next/link";

const beliefs = [
  {
    title: "Unwrite limits",
    description: "We remove what's blocking growth; cluttered design, confusing flows, noisy content.",
    icon: Lightbulb,
  },
  {
    title: "Build clarity",
    description: "Every touchpoint should feel obvious, clean, and easy to act on.",
    icon: Target,
  },
  {
    title: "Design for outcomes",
    description: "We obsess over work that moves metrics, not just moodboards.",
    icon: Rocket,
  },
  {
    title: "Iterate with intent",
    description: "We test, refine, and improve instead of shipping once and hoping it works.",
    icon: Eye,
  },
  {
    title: "Keep it human",
    description: "Strategy, tech, and storytelling stay rooted in real people, not vanity numbers.",
    icon: Users,
  },
];

const whatWeDo = [
  "Thoughtful strategy before execution",
  "Content that reflects real brand values",
  "Consistent communication across platforms",
  "Collaboration, feedback, and transparency"
];

const whatWeDont = [
  "Chase trends for the sake of relevance",
  "Build bloated systems or overdesigned interfaces",
  "Promise overnight growth or vanity metrics",
  "Say yes to every project"
];

const BeliefCard = ({ belief, index }) => {
  const Icon = belief.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group p-8 rounded-[2rem] bg-neutral-900/40 border border-white/5 hover:border-white/20 transition-all duration-500"
    >
      <div className="w-12 h-12 mb-6 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold mb-4 tracking-tight uppercase">{belief.title}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{belief.description}</p>
    </motion.div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Subtle Background Textures */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-40">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">Our Philosophy</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase">
            Unwrite Studios is here to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
              unwrite outdated systems
            </span>
          </h1>

          <p className="text-neutral-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            We merge creativity and technology to build sharper, faster, more meaningful digital experiences for brands worldwide.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 mb-32 rounded-3xl overflow-hidden">
          <div className="bg-black p-12 md:p-16">
            <span className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-6 block">01 / Purpose</span>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Mission</h3>
            <p className="text-neutral-500 text-lg leading-relaxed font-medium">
              To unwrite outdated digital experiences and rebuild bold, high‑performing brands for the internet age.
            </p>
          </div>
          <div className="bg-black p-12 md:p-16">
            <span className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-6 block">02 / Future</span>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Vision</h3>
            <p className="text-neutral-500 text-lg leading-relaxed font-medium">
              To unwrite broken, cluttered digital systems and replace them with sharp, conversion‑driven experiences that actually grow businesses.
            </p>
          </div>
        </section>

        {/* Core Beliefs */}
        <section className="mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-12 gap-6">
            <div className="max-w-xl">
              <span className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-2 block">Foundations</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Core Beliefs</h2>
            </div>
            <p className="text-neutral-500 text-sm md:text-base md:text-right max-w-xs font-medium">
              The principles that guide every decision we make in the studio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beliefs.map((belief, index) => (
              <BeliefCard key={index} belief={belief} index={index} />
            ))}
          </div>
        </section>

        {/* Approach Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-40">
          <div className="p-12 rounded-[3rem] bg-neutral-900/20 border border-white/5">
            <h3 className="text-2xl font-black uppercase tracking-widest mb-8">Our Approach</h3>
            <div className="space-y-6">
              {whatWeDo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Check className="w-5 h-5 text-white mt-1" />
                  <span className="text-neutral-400 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5">
            <h3 className="text-2xl font-black uppercase tracking-widest mb-8 text-neutral-500">What We Don't Do</h3>
            <div className="space-y-6">
              {whatWeDont.map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <span className="text-neutral-600 group-hover:text-white transition-colors">✕</span>
                  <span className="text-neutral-500 line-through decoration-white/10 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Globe Section - Spacing Updated */}
        <section className="text-center mb-60">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Where we've worked
          </h2>
          <p className="text-neutral-500 text-lg mb-20 max-w-2xl mx-auto uppercase tracking-widest text-[10px] font-bold">
            India / US / UK / Middle East
          </p>
          
          <div className="relative h-[500px] md:h-[650px] w-full pb-32"> 
             <GlobeSection />
          </div>
        </section>

        {/* Studio Culture */}
        <section className="mb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">
              Our Studio Culture
            </h2>
            <div className="space-y-6 text-xl text-neutral-400 font-medium leading-relaxed">
              <p>We don't ship ideas just because they sound smart.</p>
              <p>We ask questions, challenge defaults, and build things together.</p>
              <p className="text-white text-2xl font-black uppercase tracking-tight pt-4">
                Lean process. Real feedback. Sharp thinking.
              </p>
              <p className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 font-black">
                No fluff. No egos. Just work we're proud of.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Founder Note */}
        <section className="max-w-3xl mx-auto mb-60">
          <div className="relative p-12 md:p-16 bg-neutral-900/40 rounded-[3rem] border border-white/5">
            <div className="absolute top-0 right-12 -translate-y-1/2 bg-black px-4 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
              Founder's Note
            </div>
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-12 italic">
              "Growth doesn't come from adding more. It comes from removing what no longer fits. Unwrite is built on that simple belief."
            </p>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-white font-black uppercase tracking-widest text-sm">— Adeity</span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center py-20 border-t border-white/5"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Ready to <span className="text-neutral-600 italic">unwrite</span> your story?
          </h2>
          <Link href="/contact">
            <button className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all flex items-center gap-3 mx-auto">
              Start Your Project <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}