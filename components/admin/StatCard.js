import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

const iconColors = {
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  href,
  iconColor = 'blue',
  watermarkIcon: WatermarkIcon,
}) {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
      {/* Watermark Icon */}
      {WatermarkIcon && (
        <WatermarkIcon 
          size={80} 
          className="absolute right-4 bottom-4 opacity-5" 
        />
      )}

      {/* Icon and Label */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`p-2.5 rounded-lg ${iconColors[iconColor] || iconColors.blue}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>

      {/* Value */}
      <div className="mb-4">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>

      {/* Link */}
      <Link 
        href={href}
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        Kelola Data
        <svg 
          className="ml-1 w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </Link>
    </div>
  );
}
