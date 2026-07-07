import React from 'react';

export default function WaveSeparator({ 
  topColor = '#1E1E8F', 
  bottomColor = '#ffffff',
  height = 80,
  flip = false 
}) {
  return (
    <div 
      className="w-full relative overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d={flip 
            ? "M0,120 C360,60 720,60 1080,90 C1260,105 1350,120 1440,120 L1440,0 L0,0 Z"
            : "M0,0 C360,60 720,60 1080,30 C1260,15 1350,0 1440,0 L1440,120 L0,120 Z"
          }
          fill={topColor}
        />
      </svg>
    </div>
  );
}
