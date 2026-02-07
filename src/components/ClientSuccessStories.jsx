"use client";

import { Carousel, TestimonialCard } from "@/components/ui/retro-testimonial";
import { motion } from "framer-motion";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

const testimonialData = {
  ids: [
    "addit-uae",
    "eastern-lights",
    "ecovision",
    "veda-by-sonia",
    "bluesky-disposal",
    "ra1-education",
    "you-are-unstoppable",
  ],
  details: {
    "addit-uae": {
      id: "addit-uae",
      company: "ADDIT",
      location: "UAE",
      description:
        "Unwrite Studios supported ADDIT with end-to-end social media management, focused on content creation and funnel-led lead generation.",
      logo: "/logos/addit.png",
      services: ["Social media content creation", "Funnel strategy"],
      name: "ADDIT",
      designation: "Social Media Management",
    },
    "eastern-lights": {
      id: "eastern-lights",
      company: "Eastern Lights",
      location: "Brand Creation",
      description:
        "Unwrite Studios built Eastern Lights from the ground up, shaping the brand's visual and strategic foundation.",
      logo: "/logos/eastern-lights.png",
      services: ["Logo design", "Brand identity"],
      name: "Eastern Lights",
      designation: "Brand Creation",
    },
    ecovision: {
      id: "ecovision",
      company: "ECOVISION",
      location: "Brand & Web",
      description:
        "Developed a complete brand presence alongside a functional, brand-aligned website.",
      logo: "/ecovision.png",
      services: ["Brand identity", "Website development"],
      name: "ECOVISION Innovations",
      designation: "Website Development",
    },
    "veda-by-sonia": {
      id: "veda-by-sonia",
      company: "VEDA by Sonia",
      location: "USA",
      description:
        "Partnered on a full digital rebuild, combining social media and personal brand marketing.",
      logo: "/IMG_6929.png",
      services: ["Social media strategy", "Content creation"],
      name: "VEDA by Sonia",
      designation: "Personal Brand Marketing",
    },
    "bluesky-disposal": {
      id: "bluesky-disposal",
      company: "BlueSky Disposal",
      location: "E-commerce",
      description:
        "Developed an e-commerce website designed to support clear navigation and operational flow.",
      logo: "/logos/bluesky.png",
      services: ["E-commerce design", "User flow"],
      name: "BlueSky Disposal",
      designation: "E-commerce Development",
    },
    "ra1-education": {
      id: "ra1-education",
      company: "RA1 Education",
      location: "EdTech",
      description:
        "Created a connected digital ecosystem for their education platform including website and app.",
      logo: "/logos/ra1.png",
      services: ["Website development", "App development"],
      name: "RA1 Education",
      designation: "Website & App Development",
    },
    "you-are-unstoppable": {
      id: "you-are-unstoppable",
      company: "You Are Unstoppable",
      location: "Podcast",
      description:
        "Supported podcast infrastructure and website development for long-form content.",
      logo: "/logos/unstoppable.png",
      services: ["Podcast setup", "Website design"],
      name: "You Are Unstoppable",
      designation: "Podcast Development",
    },
  },
};

export default function ClientSuccessStories() {
  const cards = testimonialData.ids
    .map((cardId, index) => {
      const data = testimonialData.details[cardId];
      if (!data) return null;

      return (
        <TestimonialCard
          key={cardId}
          testimonial={data}
          index={index}
          backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3000&auto=format&fit=crop"
        />
      );
    })
    .filter(Boolean);

  return (
    <section className="relative pt-12 pb-0 lg:pt-16 lg:pb-8 overflow-hidden bg-black text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-10 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 mb-8">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">
                Case Stories
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 tracking-tighter uppercase leading-tight">
              HOW WE WORK <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">
                Together
              </span>
            </h2>

            <div className="max-w-xl space-y-6 font-medium text-lg leading-relaxed">

              {/* FIXED QUOTE SECTION */}
              <div className="text-white/90 font-semibold italic space-y-1">
                <p>Less posturing. More thinking.</p>
                <p>Less hierarchy. More action.</p>
              </div>

              <p className="text-white/80">
                We’re a young, focused studio that ships, learns, and improves
                as one team. We partner with ambitious brands to build
                meaningful digital experiences.
              </p>

              <p className="inline-block bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/10 shadow-md font-semibold">
                Working with brands across the{" "}
                <span className="text-white">US</span>,{" "}
                <span className="text-white">Middle East</span>,{" "}
                <span className="text-white">UK</span>, and{" "}
                <span className="text-white">India</span>.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <RotatingEarth width={550} height={550} />
          </motion.div>
        </div>

        <div className="mb-20">
          <Carousel items={cards} />
        </div>
      </div>
    </section>
  );
}