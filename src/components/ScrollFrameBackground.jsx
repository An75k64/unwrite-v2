"use client";

import { useEffect, useRef } from "react";

export default function ScrollFrameBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const frameCount = 148;
    const images = [];
    let imagesLoaded = 0;
    
    let currentFrame = 0;
    let targetFrame = 0;
    let rafId = null;
    let lastRenderedIndex = -1;

    // High DPI Canvas Setup
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Maximize render quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      // Force a re-render on resize
      lastRenderedIndex = -1;
      renderFrame(Math.round(currentFrame));
    };

    const currentFrameURL = (index) => 
      `/frames/gallery/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

    const preloadImages = () => {
      // Initialize array
      for (let i = 0; i < frameCount; i++) {
        images.push(null);
      }

      // Load first frame immediately
      const firstImg = new Image();
      firstImg.src = currentFrameURL(0);
      firstImg.onload = () => {
        imagesLoaded++;
        setupCanvas();
        if (Math.round(currentFrame) === 0) {
          lastRenderedIndex = -1;
          renderFrame(0);
        }

        // Stagger load the rest in batches
        let i = 1;
        const loadNextBatch = () => {
          const batchSize = 10;
          for (let b = 0; b < batchSize && i < frameCount; b++, i++) {
            const img = new Image();
            img.src = currentFrameURL(i);
            const captureI = i; // capture loop variable
            img.onload = () => {
              imagesLoaded++;
              if (captureI === Math.round(currentFrame)) {
                lastRenderedIndex = -1;
                renderFrame(captureI);
              }
            };
            images[captureI] = img;
          }
          if (i < frameCount) {
             setTimeout(loadNextBatch, 50); // Yield to main thread
          }
        };
        loadNextBatch();
      };
      images[0] = firstImg;
    };

    const renderFrame = (index) => {
      if (index === lastRenderedIndex) return; // Skip if already rendered
      if (!images[index] || !images[index].complete) return;
      
      const img = images[index];
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      
      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      // "Cover" behavior
      if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Force quality before drawing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      lastRenderedIndex = index;
    };

    const tick = () => {
      // Faster lerp for snappier, smoother Apple-like response
      currentFrame += (targetFrame - currentFrame) * 0.25;
      
      const renderIndex = Math.round(currentFrame);
      
      if (Math.abs(targetFrame - currentFrame) > 0.01) {
        renderFrame(renderIndex);
        rafId = requestAnimationFrame(tick);
      } else {
        currentFrame = targetFrame;
        renderFrame(Math.round(currentFrame));
        rafId = null;
      }
    };

    const handleScroll = () => {
      // Use document scroll element for maximum cross-browser accuracy
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      targetFrame = Math.min(
        frameCount - 1,
        Math.max(0, scrollFraction * (frameCount - 1))
      );
      
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleResize = () => {
      setupCanvas();
    };

    preloadImages();
    
    // Attach passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    // Initial draw trigger if scroll is already > 0 on load
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none w-full h-full overflow-hidden bg-[#050505]" style={{ zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      {/* Subtle dark overlay as requested */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: "rgba(0,0,0,0.20)" }} 
      />
    </div>
  );
}
