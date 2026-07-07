import React from 'react';
import { motion } from 'framer-motion';

const WaveSeparator = ({ color = "#ffffff", topColor = null, bottomColor = null, position = "bottom", height = "80px" }) => {
  // If both topColor and bottomColor are provided, use gradient
  const useGradient = topColor && bottomColor;
  const gradientId = `wave-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  // For bottom position (rotated 180), we need to reverse the gradient colors
  // because the rotation flips the visual direction
  const gradientFrom = position === "bottom" ? bottomColor : topColor;
  const gradientTo = position === "bottom" ? topColor : bottomColor;
  
  const fillStyle = useGradient ? `url(#${gradientId})` : color;

  return (
    <div 
      className={`absolute left-0 w-full overflow-hidden leading-none z-10 ${position === "bottom" ? "-bottom-1 rotate-180" : "-top-1"}`}
      style={{ height }}
    >
      {useGradient && (
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradientFrom, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: gradientTo, stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Layer 1 (Back) - Opacity 30% - Horizontal animation */}
      <motion.svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="absolute bottom-0 w-[200%] h-full opacity-30"
        style={{ fill: fillStyle }}
        animate={{ x: [0, -600, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
      </motion.svg>

      {/* Layer 2 (Middle) - Opacity 50% - Horizontal animation */}
      <motion.svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="absolute bottom-0 w-[200%] h-full opacity-50"
        style={{ fill: fillStyle }}
        animate={{ x: [0, -600, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 1 }}
      >
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
      </motion.svg>

      {/* Layer 3 (Front) - Opacity 70% - Horizontal animation */}
      <motion.svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="absolute bottom-0 w-[200%] h-full opacity-70"
        style={{ fill: fillStyle }}
        animate={{ x: [0, -600, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
      >
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
      </motion.svg>

      {/* Layer 4 (Top) - Full Opacity - Static */}
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="relative block w-full h-full z-10"
        style={{ fill: fillStyle }}
      >
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
      </svg>
    </div>
  );
};

export default WaveSeparator;
