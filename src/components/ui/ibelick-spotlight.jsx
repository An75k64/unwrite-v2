"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function MouseSpotlight({ className, size = 200 }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useSpring(0);
  const mouseY = useSpring(0);
  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  const handleMouseMove = useCallback((event) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", () => setIsHovered(true));
    container.addEventListener("mouseleave", () => setIsHovered(false));

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", () => setIsHovered(true));
      container.removeEventListener("mouseleave", () => setIsHovered(false));
    };
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute rounded-full bg-gradient-radial blur-xl opacity-0 transition-opacity duration-500",
        isHovered ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        background: "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)",
      }}
    />
  );
}