"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Target, Users, Layout, Zap, Rocket, TrendingUp, Globe, Smartphone, MessageSquare, Bot, ArrowRight, X, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (selectedService) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [selectedService]);

  const serviceDetails = {
    "brand-strategy": {
      title: "Brand Strategy & Positioning",
      subtitle: "Including brand narratives, messaging, and identity systems",
      intro: "Most brands don't need a rebrand, they need a rethink. Brand Strategy & Positioning is where we define who you are, what you stand for, and how you should be perceived. This is the foundation that informs every website decision, every campaign idea, and every piece of content that follows.",
      unwrite: [
        "Vague positioning that sounds like everyone else",
        "Overcomplicated messaging that no one remembers",
        "Brand stories that feel forced, generic, or performative"
      ],
      build: [
        "Clear brand positioning and differentiation",
        "A strong brand narrative that feels true, not manufactured",
        "Messaging frameworks that guide all communication",
        "Tone of voice and brand language systems",
        "Clarity on what to say, what not to say, and why"
      ],
      conclusion: "This is where your brand story is written once, and used everywhere.",
      bestFor: "Brands that feel established but inconsistent, or clear internally but unclear externally."
    },
    "digital-marketing-strategy": {
      title: "Digital Marketing Strategy & Consulting",
      subtitle: "Marketing without strategy is just activity",
      intro: "This service exists to help brands slow down, zoom out, and make intentional decisions before spending time or money on execution. We help you connect business goals to digital actions, so your marketing stops feeling scattered and starts feeling aligned.",
      unwrite: [
        "Random tactics without direction",
        "Platform overload and trend-chasing",
        "Campaigns that look good but don't move metrics"
      ],
      build: [
        "End-to-end digital marketing strategy",
        "Platform prioritisation (where to focus, where to ignore)",
        "Campaign and content direction",
        "Funnel thinking and customer journey mapping",
        "Clear success metrics and performance intent"
      ],
      conclusion: "This is where we decide what actually deserves to be built — and what doesn't.",
      bestFor: "Founders and teams who want structure, clarity, and a long-term view before execution."
    },
    "social-media-marketing": {
      title: "Social Media Strategy & Marketing",
      subtitle: "Most brands are active on social media. Very few are intentional",
      intro: "This service focuses on building a clear, consistent social presence that actually supports your brand and business goals — not just vanity metrics.",
      unwrite: [
        "Posting without purpose",
        "Copy-paste content across platforms",
        "Growth tactics that attract the wrong audience"
      ],
      build: [
        "Platform-specific strategy (Instagram, LinkedIn, YouTube)",
        "Clear content pillars and narratives",
        "Content calendars with intent, not filler",
        "Brand voice and tone adapted for each platform",
        "Audience growth and engagement strategy"
      ],
      conclusion: "Social becomes a system — not a scramble.",
      bestFor: "Founders, startups, and brands looking to build credibility, consistency, and long-term presence online."
    },
    "content-creation": {
      title: "Content Creation & Management",
      subtitle: "Good content isn't about trends. It's about clarity",
      intro: "This service takes your strategy and turns it into consistent, thoughtful content that sounds like you and speaks to the right audience.",
      unwrite: [
        "Trend-chasing without context",
        "Disconnected visuals and messaging",
        "Content that looks fine but says nothing"
      ],
      build: [
        "Static posts, carousels, reels, and short-form videos",
        "Caption writing and brand-led storytelling",
        "Content planning and publishing workflows",
        "Visual and narrative consistency across platforms"
      ],
      conclusion: "We manage content end-to-end so it stays aligned as you grow.",
      bestFor: "Brands that want meaningful, well-thought-out content instead of random output."
    },
    "video-editing": {
      title: "Video Editing & Visual Storytelling",
      subtitle: "Video works when it respects attention",
      intro: "We focus on clean, intentional edits that support the message instead of overpowering it. This is storytelling through structure, pacing, and clarity.",
      unwrite: [
        "Over-edited, trend-heavy visuals",
        "Long videos without narrative flow",
        "One-off videos with no reuse plan"
      ],
      build: [
        "Reels and short-form video editing",
        "Brand-led video storytelling systems",
        "Content repurposing across platforms",
        "Visual consistency across all video formats"
      ],
      conclusion: "Every edit serves a purpose.",
      bestFor: "Personal brands, creators, and businesses using video as a core communication tool."
    },
    "campaign-strategy": {
      title: "Campaign Strategy & Execution",
      subtitle: "Campaigns work when they're built around a clear idea, not just a deadline",
      intro: "We design and execute campaigns that align brand messaging, creative direction, and distribution into one focused push. Every campaign starts with why and ends with what changed.",
      unwrite: [
        "Campaigns built only to 'stay active'",
        "Disconnected creatives with no core idea",
        "One-time launches with no learning loop"
      ],
      build: [
        "Campaign concepts rooted in brand and audience insight",
        "Clear objectives (awareness, engagement, conversion)",
        "Messaging frameworks and creative direction",
        "Cross-platform execution and rollout planning",
        "Ongoing optimisation during the campaign lifecycle"
      ],
      conclusion: "",
      bestFor: "Brands launching products, initiatives, or narratives that need focus and momentum."
    },
    "ad-management": {
      title: "Ad Management (Meta, Google, LinkedIn)",
      subtitle: "Paid ads work best when they feel like guidance, not interruption",
      intro: "We manage paid media with a performance-first approach, aligning strategy, creative, and targeting so every rupee has a job to do.",
      unwrite: [
        "Random boosts and impulsive ad spends",
        "Vanity metrics with no business impact",
        "Aggressive scaling without testing"
      ],
      build: [
        "Platform-specific ad strategies (Meta, Google, LinkedIn)",
        "Audience research and funnel-stage targeting",
        "Creative and copy aligned to user intent",
        "A/B testing and performance optimisation",
        "Clear reporting with actionable insights"
      ],
      conclusion: "",
      bestFor: "Brands looking to scale reach, leads, or conversions without wasting budget."
    },
    "lead-funnel-optimization": {
      title: "Lead Funnel Strategy & Conversion Optimization",
      subtitle: "Traffic without direction is just distraction",
      intro: "We design lead funnels that guide users logically from first interaction to meaningful action, smoothly, clearly, and without friction.",
      unwrite: [
        "Traffic-heavy, conversion-light systems",
        "Confusing landing pages and drop-offs",
        "Funnels built without follow-through"
      ],
      build: [
        "Funnel mapping and journey planning",
        "Landing page structure and messaging clarity",
        "Conversion optimisation across touchpoints",
        "Funnel refinement based on real data"
      ],
      conclusion: "",
      bestFor: "Brands running ads or content who want better conversions — not just more clicks."
    },
    "web-design-development": {
      title: "Web Design & Development",
      subtitle: "Your website is your brand's most important digital asset",
      intro: "We design and develop websites that communicate clearly, guide users naturally, and support business goals — without clutter or confusion.",
      unwrite: [
        "Overdesigned websites with no clear flow",
        "Pages built for aesthetics, not action",
        "Slow, outdated, or confusing user experiences"
      ],
      build: [
        "Website audits and experience reviews",
        "Information architecture and page flow planning",
        "Clean, conversion-focused UI/UX design",
        "Responsive website development",
        "Speed, performance, and optimisation checks"
      ],
      conclusion: "",
      bestFor: "Brands that want a website that works harder — and makes sense on the first visit."
    },
    "app-design-development": {
      title: "App Design & Development",
      subtitle: "Good products feel simple, even when the system behind them isn't",
      intro: "We help shape and support app development with a strong focus on usability, clarity, and real user needs — before scale.",
      unwrite: [
        "Feature-heavy apps with unclear purpose",
        "Complicated user flows",
        "Building before validating"
      ],
      build: [
        "App concept clarity and feature prioritisation",
        "User journey and experience design",
        "Interface systems and product structure",
        "Development coordination and support",
        "Iteration and optimisation post-launch"
      ],
      conclusion: "",
      bestFor: "Startups and businesses building digital products, platforms, or internal tools that need clarity before growth."
    },
    "whatsapp-automation": {
      title: "WhatsApp Automation & CRM Integration",
      subtitle: "Conversations shouldn't break just because your inbox is full",
      intro: "We design WhatsApp automation and CRM systems that respond faster, qualify leads better, and keep communication consistent - without losing your brand's tone.",
      unwrite: [
        "Manual follow-ups that drain time",
        "Missed leads and delayed responses",
        "Disconnected tools and messy contact data"
      ],
      build: [
        "WhatsApp automation workflows",
        "Lead capture and qualification flows",
        "CRM integration and contact structuring",
        "Automated follow-ups and reminders",
        "Brand-aligned message logic and tone"
      ],
      conclusion: "Every message has a purpose. Every response moves the journey forward.",
      bestFor: "Brands handling high enquiry volumes, sales conversations, or lead-driven campaigns."
    },
    "chatbot-ai-integration": {
      title: "Chatbot Design & AI Integration",
      subtitle: "Good chatbots don't replace people. They support them",
      intro: "We design chatbots and AI-driven systems that answer clearly, guide users logically, and hand off to humans when it actually matters.",
      unwrite: [
        "Generic bots with scripted dead-ends",
        "Over-automation that frustrates users",
        "Chat systems with no conversion logic"
      ],
      build: [
        "Purpose-driven chatbot flows",
        "AI-assisted responses and logic mapping",
        "Website and platform chatbot integration",
        "Lead routing and qualification systems",
        "Continuous refinement based on user behaviour"
      ],
      conclusion: "Automation becomes a support system — not a barrier.",
      bestFor: "Businesses that want faster responses, better lead handling, and scalable communication systems."
    }
  };

  const layers = [
    {
      id: "Layer 1",
      name: "Strategy & Brand",
      subtitle: "Foundation Layer",
      description: "Clarity before creativity. We define your positioning, direction, and digital roadmap.",
      services: [
        {
          slug: "brand-strategy",
          title: "Brand Strategy & Positioning",
          description: "Including brand narratives, messaging, and identity systems",
          icon: Brain,
        },
        {
          slug: "digital-marketing-strategy",
          title: "Digital Marketing Strategy & Consulting",
          description: "End-to-end strategy and platform prioritization",
          icon: Target,
        },
      ]
    },
    {
      id: "Layer 2",
      name: "Social & Content",
      subtitle: "Visibility Layer",
      description: "Intentional content that builds presence, trust, and recognition, not noise.",
      services: [
        {
          slug: "social-media-marketing",
          title: "Social Media Strategy & Marketing",
          description: "Platform-specific strategy and audience growth",
          icon: Users,
        },
        {
          slug: "content-creation",
          title: "Content Creation & Management",
          description: "Multi-format content with brand-led storytelling",
          icon: Layout,
        },
        {
          slug: "video-editing",
          title: "Video Editing & Visual Storytelling",
          description: "Short-form video and intentional edits",
          icon: Zap,
        },
      ]
    },
    {
      id: "Layer 3",
      name: "Campaigns & Growth",
      subtitle: "Performance Layer",
      description: "Campaigns, ads, and funnels designed to drive measurable outcomes.",
      services: [
        {
          slug: "campaign-strategy",
          title: "Campaign Strategy & Execution",
          description: "End-to-end campaign planning and optimization",
          icon: Rocket,
        },
        {
          slug: "ad-management",
          title: "Ad Management (Meta, Google, LinkedIn)",
          description: "Performance-first paid media management",
          icon: TrendingUp,
        },
        {
          slug: "lead-funnel-optimization",
          title: "Lead Funnel Strategy & Conversion Optimization",
          description: "Funnel mapping and conversion improvement",
          icon: Target,
        },
      ]
    },
    {
      id: "Layer 4",
      name: "Web & Tech",
      subtitle: "Experience Layer",
      description: "Websites and apps that are clean, intuitive, and built to perform.",
      services: [
        {
          slug: "web-design-development",
          title: "Web Design & Development",
          description: "Conversion-focused websites with clear flow",
          icon: Globe,
        },
        {
          slug: "app-design-development",
          title: "App Design & Development",
          description: "Product design with usability and clarity focus",
          icon: Smartphone,
        },
      ]
    },
    {
      id: "Layer 5",
      name: "Automation & Systems",
      subtitle: "Scale Layer",
      description: "Smart systems that scale communication and lead handling effortlessly.",
      services: [
        {
          slug: "whatsapp-automation",
          title: "WhatsApp Automation & CRM Integration",
          description: "Automated workflows and lead qualification",
          icon: MessageSquare,
        },
        {
          slug: "chatbot-ai-integration",
          title: "Chatbot Design & AI Integration",
          description: "Purpose-driven bots with smart handoff",
          icon: Bot,
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Background - Mobile Responsive */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 md:top-40 left-10 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-black-500/30 rounded-full blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-10 md:bottom-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-grey-300 rounded-full blur-[100px] md:blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 lg:py-32">
        {/* Heading - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="inline-block mt-8 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-border-white/20 to-text-black rounded-full border text-white mb-4 md:mb-6">
            <span className="text-white text-xs md:text-sm font-medium uppercase tracking-wider">
              Services
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 px-4">
            <span className="text-white">What we unwrite</span>
            <br />
            <span className="bg-gradient-to-r from-[#484545] text-gray-100 to-[#ffffff] text-transparent bg-clip-text">
              for you
            </span>
          </h1>
          
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-4">
            We help brands unwrite whats outdated and rebuild what actually works.
            <br className="hidden md:block" />
            From strategy to systems, we design digital experiences with intent.
            <br className="hidden md:block" />
            <span className="text-white font-medium">Less noise. More clarity. Better outcomes.</span>
          </p>
        </motion.div>

        {/* Service Layers - Mobile Responsive */}
        <div className="space-y-12 md:space-y-20">
          {layers.map((layer, layerIndex) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: layerIndex * 0.1 }}
            >
              {/* Layer Header - Mobile Responsive */}
              <div className="mb-6 md:mb-10 text-center px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <span className="bg-black font-bold text-base md:text-lg">{layer.id}:</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{layer.name}</h2>
                  <span className="text-gray-500 text-xs md:text-sm">({layer.subtitle})</span>
                </div>
                <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                  {layer.description}
                </p>
              </div>

              {/* Services Grid - Mobile Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {layer.services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => setSelectedService(service.slug)}
                      className="group relative bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-6 border border-white/10 hover:border-white/20 transition-all duration-500 h-full cursor-pointer"
                    >
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500 rounded-xl md:rounded-2xl" />

                      {/* Icon */}
                      <div className="relative w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-white/15">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ffd3d3] group-hover:to-[#89899c] transition-all duration-300">
                        {service.title}
                      </h3>
                      
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed relative z-10 mb-3 md:mb-4">
                        {service.description}
                      </p>

                      {/* Arrow */}
                      <div className="flex items-center gap-2 text-white   text-xs md:text-sm font-medium relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Learn More
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 md:mt-20 text-center bg-gradient-to-r from-text-white to-grey-500/10 rounded-xl md:rounded-2xl p-6 md:p-12 border border-white/20
"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 px-4">
            Not sure where to start?
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            Share your current website or brand and tell us what feels off. We well show you what needs to be unwritten first.
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-6 md:px-10 py-3 md:py-4 rounded-full bg-white/10 backdrop-blur-md text-white text-sm md:text-base lg:text-lg font-semibold
                       border border-white/20 hover:bg-white/20 hover:border-white/30
                       transition-all duration-300
                       overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center mx-auto">
                Lets Talk
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Service Detail Drawer - Mobile Responsive */}
      <AnimatePresence>
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              data-lenis-prevent
              className="fixed right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2 bg-[#0A0714] z-[101] overflow-y-auto"
              style={{ overscrollBehavior: 'contain' }}
            >
              {/* Close Button */}
              <div className="sticky top-0 z-10 bg-[#0A0714] border-b border-white/10 p-4 md:p-6 flex justify-end">
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 lg:p-12">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                    {serviceDetails[selectedService]?.title}
                  </h2>
                  <p className="text-lg md:text-xl text-grey-700 font-medium mb-4 md:mb-6">
                    {serviceDetails[selectedService]?.subtitle}
                  </p>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {serviceDetails[selectedService]?.intro}
                  </p>
                </div>

                {/* What We Unwrite */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">What we unwrite</h3>
                  <div className="space-y-2 md:space-y-3">
                    {serviceDetails[selectedService]?.unwrite.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 md:gap-3">
                        <span className="text-grey-300 mt-1 flex-shrink-0 text-sm md:text-base">✕</span>
                        <span className="text-gray-400 text-sm md:text-base">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What We Build Instead */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">What we build instead</h3>
                  <div className="space-y-2 md:space-y-3">
                    {serviceDetails[selectedService]?.build.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 md:gap-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm md:text-base">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conclusion */}
                {serviceDetails[selectedService]?.conclusion && (
                  <div className="mb-6 md:mb-8 p-4 md:p-6 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                    <p className="text-gray-300 italic text-sm md:text-base">
                      {serviceDetails[selectedService]?.conclusion}
                    </p>
                  </div>
                )}

                {/* Best For */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Best for:</h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {serviceDetails[selectedService]?.bestFor}
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-4 md:pt-6 border-t border-white/10 pb-6 md:pb-8">
                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-[#645b5f] to-[#141414] text-white text-sm md:text-base font-semibold hover:shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-all duration-300"
                    >
                      Lets Discuss Your Project
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}