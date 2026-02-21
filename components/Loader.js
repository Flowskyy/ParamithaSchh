import { motion } from 'framer-motion';

export default function Loader({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-primary-500 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function InlineLoader({ className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-5 h-5 border-2 border-slate-300 border-t-[#4F8EF7] rounded-full animate-spin"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 p-4 animate-pulse">
      <div className="w-full h-48 bg-slate-200 rounded-lg mb-4"></div>
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
  );
}
