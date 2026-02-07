'use client';

import React from 'react';

const NUMBER_OF_PARTICLES = 150;

const generateParticle = (index) => {
  return {
    id: index,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 5}s`,
    size: `${2 + Math.random() * 2}px`,
    opacity: `${0.2 + Math.random() * 0.5}`,
  };
};

const FallingParticlesBackground = () => {
  const particles = Array.from({ length: NUMBER_OF_PARTICLES }, (_, i) =>
    generateParticle(i)
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ 
        top: '100vh', // Start after hero section (full viewport height)
        zIndex: 0 
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white rounded-full"
          style={{
            left: particle.left,
            top: '-10px',
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animation: `fall ${particle.animationDuration} linear infinite`,
            animationDelay: particle.animationDelay,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default FallingParticlesBackground;
