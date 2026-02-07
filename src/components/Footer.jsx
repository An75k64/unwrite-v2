"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { FooterBackgroundGradient } from "@/components/ui/hover-footer";

function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Services", href: "/services" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Web Development", href: "/services" },
        { label: "Digital Marketing", href: "/services" },
        { label: "SEO Optimization", href: "/services" },
        { label: "Support", href: "/contact" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={16} />,
      text: "hr.unwrite@gmail.com",
      href: "mailto:hr.unwrite@gmail.com",
    },
    {
      icon: <Phone size={16} />,
      text: "+91 6205698145",
      href: "tel:+916205698145",
    },
    {
      icon: <MapPin size={16} />,
      text: "Bengaluru, India",
    },
  ];

  const socialLinks = [
    { icon: <Instagram size={18} />, label: "Instagram", href: "https://www.instagram.com/unwrite_studios?igsh=eHB3MjBoenQxeHp3&utm_source=qr" },
    { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://www.linkedin.com/company/unwrite-studios/" },
    { icon: <Github size={18} />, label: "GitHub", href: "#" },
  ];

  return (
    <footer className="relative bg-black text-white px-6 py-12 md:py-20 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand section */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="group inline-flex flex-col">
              <span className="text-2xl font-black uppercase tracking-tighter leading-none">
                Unwrite
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mt-1">
                Studios
              </span>
            </Link>
            <p className="text-sm font-medium text-neutral-500 leading-relaxed max-w-[240px]">
              A digital studio that rebuilds websites and experiences for brands that have outgrown their old story.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-neutral-400 hover:text-white transition-all duration-300 flex items-center group/link"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-8">
              Get In Touch
            </h4>
            <ul className="space-y-5">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-neutral-400 group/contact">
                  <span className="text-neutral-600 group-hover/contact:text-white transition-colors">
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium group-hover/contact:text-white transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm font-medium">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          <div className="flex space-x-8">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-neutral-600 hover:text-white transition-all duration-500 transform hover:-translate-y-1"
              >
                {icon}
              </a>
            ))}
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700">
            &copy; {new Date().getFullYear()} Unwrite Studios &mdash; All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Optional: Subtle background gradient if needed */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <FooterBackgroundGradient />
      </div>
    </footer>
  );
}

export default Footer;