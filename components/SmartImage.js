import { useState } from 'react';
import Image from 'next/image';

export default function SmartImage({ src, alt, className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800"; // School hallway/general education image

  // Default sizes for responsive images if not provided
  // Optimized for typical grid layouts
  const defaultSizes = props.fill 
    ? "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <div className={`relative overflow-hidden bg-slate-200/50 ${props.fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
      {!loaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}
      
      <Image
        src={hasError ? fallbackSrc : (src || fallbackSrc)}
        alt={alt || "Image"}
        sizes={props.sizes || defaultSizes}
        quality={props.quality || 75} // Reduced quality for faster load
        className={`duration-500 ease-in-out transition-all ${
          loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-lg'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}
