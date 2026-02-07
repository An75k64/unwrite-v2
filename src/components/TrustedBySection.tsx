"use client";

import { LogoCloud } from "@/components/ui/logo-cloud";

const logos = [
  { src: "/logos/addit.png", alt: "ADDIT" },
  { src: "/logos/bluesky.png", alt: "BlueSky" },
  { src: "/logos/eastern-lights.png", alt: "Eastern Lights" },
  { src: "/logos/ra1.png", alt: "RA1" },
  { src: "/logos/unstoppable.png", alt: "Unstoppable" },
  { src: "/logos/veda.png", alt: "Veda" },
  { src: "/logos/ecovision.png", alt: "EcoVision" },
  
  { src: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg", alt: "Stripe" },
  { src: "https://cdn.worldvectorlogo.com/logos/shopify.svg", alt: "Shopify" },
  { src: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg", alt: "Slack" }
];

export default function TrustedBySection() {
  return (
    <section className="relative mx-auto max-w-7xl py-20 px-6 bg-[#000]">

      <h2 className="mb-12 text-center font-bold text-white text-2xl tracking-tight md:text-4xl">
        <span className="text-gray-400">Trusted by innovators.</span>
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#eed9e3] to-[#7f7d81]">
          Built for success stories.
        </span>
      </h2>

      <LogoCloud logos={logos} className="py-8" />
    </section>
  );
}
