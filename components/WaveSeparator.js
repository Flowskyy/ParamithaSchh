import React from 'react';
import { motion } from 'framer-motion';

const WaveSeparator = ({ color = "#ffffff", position = "bottom", height = "120px", gradient = null }) => {
  const fillStyle = gradient ? `url(#${gradient.id})` : color;

  return (
    <div 
      className={`absolute left-0 w-full overflow-hidden leading-none z-10 ${position === "bottom" ? "-bottom-1 rotate-180" : "-top-1"}`}
      style={{ height }}
    >
      {gradient && (
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
          <defs>
            <linearGradient id={gradient.id} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: gradient.from, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: gradient.to, stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Layer 1 (Back) - Opacity 30% */}
      <motion.svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="absolute bottom-0 w-full h-full opacity-30 transform scale-x-125 translate-y-2"
        style={{ fill: fillStyle }}
        animate={{ y: [0, -5, 0], scaleY: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </motion.svg>

      {/* Layer 2 (Middle) - Opacity 60% */}
      <motion.svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="absolute bottom-0 w-full h-full opacity-60 transform scale-x-110 -translate-x-10 translate-y-1"
        style={{ fill: fillStyle }}
        animate={{ y: [0, -3, 0], x: [-10, -5, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </motion.svg>

      {/* Layer 3 (Front) - Full Opacity */}
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="relative block w-[calc(100%+1.3px)] h-full z-10"
        style={{ fill: fillStyle }}
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </svg>
    </div>
  );
};

export default WaveSeparator;
