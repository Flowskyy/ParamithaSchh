import { useState } from 'react';
import Image from 'next/image';

export default function SmartImage({ src, alt, className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800"; // School hallway/general education image

  // Default sizes for responsive images if not provided
  const defaultSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${props.fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
      {!loaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}
      
      <Image
        src={hasError ? fallbackSrc : (src || fallbackSrc)}
        alt={alt || "Image"}
        sizes={props.sizes || defaultSizes}
        className={`duration-700 ease-in-out transition-all ${
          loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-2xl'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}
