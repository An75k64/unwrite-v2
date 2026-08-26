"use client";

import { useEffect, useState, useRef } from "react";

export default function BackgroundVideo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none w-full h-full overflow-hidden bg-[#050505]"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ opacity: 0.55 }}
        src="/videos/splash.mp4"
      />

      {/* Strong top vignette — keeps navbar + hero text crystal clear */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/70" />

      {/* Extra left-side darkening where hero text sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
    </div>
  );
}
