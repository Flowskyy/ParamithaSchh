import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CustomToast = ({ t, type, message, details }) => {
  const [showDetails, setShowDetails] = useState(false);

  const icons = {
    success: (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    loading: (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    ),
    info: (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  };

  const copyToClipboard = () => {
    if (details) {
      navigator.clipboard.writeText(details);
    }
  };

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } pointer-events-auto flex w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl shadow-2xl border border-white/20`}
      style={{
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: t.visible ? 1 : 0,
        transform: t.visible ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
      }}
    >
      <div className="flex items-start p-5 gap-4">
        <div className="flex-shrink-0">
          {icons[type] || icons.info}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Paramitha Admin Panel
          </p>
          <p className="text-sm font-semibold text-slate-800 break-words leading-relaxed">
            {message}
          </p>
          {details && (
            <div className="mt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                {showDetails ? 'Sembunyikan detail' : 'Lihat detail error'}
              </button>
              {showDetails && (
                <div className="mt-2 p-3 bg-slate-100/80 rounded-xl text-xs text-slate-600 font-mono break-all max-h-32 overflow-y-auto border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-500">Error details:</span>
                    <button
                      onClick={copyToClipboard}
                      className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  {details}
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
