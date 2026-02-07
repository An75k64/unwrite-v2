"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ===== Custom Hooks =====
const useOutsideClick = (ref, onOutsideClick) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      onOutsideClick();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, onOutsideClick]);
};

// ===== Components =====
const Carousel = ({ items, initialScroll = 0 }) => {
  const carouselRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384;
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  return (
    <div className="relative w-full mt-10">
      <div
        className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none] py-5"
        ref={carouselRef}
        onScroll={checkScrollability}
      >
        <div
          className={cn(
            "flex flex-row justify-start gap-4 pl-3",
            "max-w-7xl mx-auto",
          )}
        >
          {items.map((item, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={`card-${index}`}
                className="last:pr-[5%] md:last:pr-[33%] rounded-3xl"
              >
                {React.cloneElement(item, {
                  onCardClose: () => {
                    return handleCardClose(index);
                  },
                })}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="relative z-40 h-10 w-10 rounded-full bg-gradient-to-r bg-black border-white flex items-center justify-center disabled:opacity-50 hover:opacity-80 transition-all duration-200"
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <button
          className="relative z-40 h-10 w-10 rounded-full bg-gradient-to-r bg-blend-color border-white flex items-center justify-center disabled:opacity-50 hover:opacity-80 transition-all duration-200"
          onClick={handleScrollRight}
          disabled={!canScrollRight}
        >
          <ArrowRight className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
  index,
  layout = false,
  onCardClose = () => {},
  backgroundImage = "https://images.unsplash.com/photo-1686806372726-388d03ff49c8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);

  const handleExpand = () => {
    return setIsExpanded(true);
  };
  const handleCollapse = () => {
    setIsExpanded(false);
    onCardClose();
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        handleCollapse();
      }
    };

    if (isExpanded) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
    }

    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      return window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isExpanded]);

  useOutsideClick(containerRef, handleCollapse);

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 h-screen z-50" data-lenis-prevent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 overflow-y-auto"
              style={{
                overflowY: "scroll",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="min-h-screen flex items-start justify-center p-4 md:p-10">
                <motion.div
                  ref={containerRef}
                  layoutId={layout ? `card-${testimonial.name}` : undefined}
                  className="max-w-5xl w-full bg-gradient-to-b from-[#000000] to-[#000000] z-[60] p-6 md:p-10 rounded-3xl relative border border-white/10 my-10"
                >
                  <button
                    className="sticky top-4 h-8 w-8 right-0 ml-auto rounded-full flex items-center justify-center bg-gradient-to-r from-[#0e080b] to-[#e2e0e5] hover:opacity-80 transition-opacity z-10"
                    onClick={handleCollapse}
                  >
                    <X className="h-6 w-6 text-white absolute" />
                  </button>

                  {/* Company Logo in Expanded View - FIXED */}
                  {testimonial.logo && (
                    <div className="flex items-center justify-center mb-8 px-0 md:px-20">
                      <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full p-1.5 bg-gradient-to-r from-[#1d171a] to-[#2f2c31]">
                        <div className="w-full h-full rounded-full bg-white p-5 flex items-center justify-center">
                          <img
                            src={testimonial.logo}
                            alt={`${testimonial.company} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <motion.p
                    layoutId={layout ? `title-${testimonial.name}` : undefined}
                    className="px-0 md:px-20 text-2xl md:text-4xl font-bold text-white mb-2"
                  >
                    {testimonial.name}
                  </motion.p>

                  <motion.p
                    layoutId={
                      layout ? `category-${testimonial.name}` : undefined
                    }
                    className="px-0 md:px-20 from-white/10  text-lg font-medium mb-2"
                  >
                    {testimonial.designation}
                  </motion.p>

                  {testimonial.location && (
                    <p className="px-0 md:px-20 text-gray-500 text-sm mb-8">
                      {testimonial.location}
                    </p>
                  )}

                  <div className="py-8 text-gray-300 px-0 md:px-20 text-lg md:text-xl leading-relaxed">
                    <Quote className="h-8 w-8 border-black-500 mb-4" />
                    {testimonial.description}
                  </div>

                  {/* Services/Scope List */}
                  {testimonial.services && testimonial.services.length > 0 && (
                    <div className="px-0 md:px-20 mt-8">
                      <h4 className="text-white font-bold text-xl mb-4">
                        Scope
                      </h4>
                      <ul className="space-y-3">
                        {testimonial.services.map((service, idx) => (
                          <li
                            key={idx}
                            className="text-gray-400 text-base flex items-start gap-3"
                          >
                            <span className="border-black mt-1 flex-shrink-0">
                              •
                            </span>
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${testimonial.name}` : undefined}
        onClick={handleExpand}
        className=""
        whileHover={{
          rotateX: 2,
          rotateY: 2,
          rotate: 3,
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <div
          className={`${
            index % 2 === 0 ? "rotate-1" : "-rotate-1"
          } rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 h-[500px] md:h-[550px] w-80 md:w-96 overflow-hidden flex flex-col items-center justify-center relative z-10 shadow-2xl hover:border-white/20 transition-all duration-300`}
        >
          {/* Background Image */}
          <div className="absolute opacity-20" style={{ inset: "-1px 0 0" }}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundImage})`,
              }}
            />
          </div>

          {/* Logo or Profile Image */}
          {testimonial.logo ? (
            <LogoImage src={testimonial.logo} alt={testimonial.company} />
          ) : (
            <ProfileImage
              src={testimonial.profileImage}
              alt={testimonial.name}
            />
          )}

          <motion.p
            layoutId={layout ? `description-${testimonial.name}` : undefined}
            className="text-gray-300 text-base md:text-lg font-normal text-center [text-wrap:balance] mt-6 px-6 relative z-10"
          >
            {testimonial.description.length > 120
              ? `${testimonial.description.slice(0, 120)}...`
              : testimonial.description}
          </motion.p>

          <motion.p
            layoutId={layout ? `title-${testimonial.name}` : undefined}
            className="text-white text-xl md:text-2xl font-bold text-center mt-6 relative z-10"
          >
            {testimonial.name}
          </motion.p>

          <motion.p
            layoutId={layout ? `category-${testimonial.name}` : undefined}
            className="border-black text-sm md:text-base font-medium text-center mt-2 relative z-10 px-4"
          >
            {testimonial.designation}
          </motion.p>

          {testimonial.location && (
            <p className="text-gray-500 text-xs text-center mt-1 relative z-10">
              {testimonial.location}
            </p>
          )}
        </div>
      </motion.button>
    </>
  );
};

const LogoImage = ({ src, alt, company, ...rest }) => {
  const [imageError, setImageError] = React.useState(false);

  if (!src || imageError) {
    const initials = company
      ? company
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "CO";

    return (
      <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full p-1 bg-black relative z-10">
        <div className="w-full h-full rounded-full bg-[#0A0714] flex items-center justify-center">
          <span className="text-white font-bold text-4xl md:text-5xl">
            {initials}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full p-1 bg-black relative z-10">
      <div className="w-full h-full rounded-full bg-[#0A0714] p-6 flex items-center justify-center">
        <img
          src={src}
          alt={alt || "Company logo"}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
};

// Export the components
export { Carousel, TestimonialCard, ProfileImage, LogoImage };