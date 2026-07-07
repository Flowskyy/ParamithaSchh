import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { getSekolahInfo } from '../services/api';

// TikTok Icon Component
const TikTokIcon = ({ size = 18, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function SidebarModal({ isOpen, onClose, links }) {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [info, setInfo] = useState({});

  useEffect(() => {
    async function loadInfo() {
      const data = await getSekolahInfo();
      if (data) setInfo(data);
    }
    loadInfo();
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleSubmenu = (idx) => {
    setOpenSubmenu(openSubmenu === idx ? null : idx);
  };

  const socialLinks = [
    { icon: <Facebook size={16} />, href: info?.facebook || '#', color: 'hover:text-[#1E1E8F]' },
    { icon: <Instagram size={16} />, href: info?.instagram || '#', color: 'hover:text-[#C0161C]' },
    { icon: <Youtube size={16} />, href: info?.youtube || '#', color: 'hover:text-[#C0161C]' },
    { icon: <TikTokIcon size={16} />, href: info?.tiktok || '#', color: 'hover:text-[#C0161C]' },
  ].filter(link => link.href && link.href !== '#'); // Only show if link exists

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white w-full max-h-[85vh] md:h-auto md:max-w-2xl rounded-3xl shadow-2xl overflow-y-auto md:overflow-hidden pointer-events-auto flex flex-col min-[480px]:flex-row relative"
            >
              {/* Close Button - Positioned inside the card */}
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 z-50 p-1.5 bg-black/10 hover:bg-black/20 md:bg-white/10 md:hover:bg-white/20 backdrop-blur-md rounded-full text-slate-800 md:text-white transition-colors shadow-sm border border-transparent md:border-white/20"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>

              {/* Left Column: Navigation Menu */}
              <div className="w-full min-[480px]:w-1/2 md:w-2/5 md:h-full md:overflow-y-auto bg-white flex flex-col">
                <div className="p-4 md:p-6 flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-8 h-8">
                       <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain" sizes="32px" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm leading-tight">SMK Paramitha 2</h2>
                      <p className="text-[10px] text-slate-500 font-medium tracking-wide">JAKARTA</p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="space-y-0.5">
                    {links.map((link, idx) => (
                      <div key={idx} className="group">
                        <div 
                          onClick={() => {
                            if (link.dropdown) {
                              toggleSubmenu(idx);
                            } else {
                              // If it's a direct link, assume Link component handles navigation
                            }
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer select-none ${openSubmenu === idx ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                        >
                          {link.dropdown ? (
                            <span className={`font-bold text-sm md:text-base transition-colors flex-1 ${openSubmenu === idx ? 'text-[#C0161C]' : 'text-slate-800'}`}>
                              {link.name}
                            </span>
                          ) : (
                            <Link 
                              href={link.href} 
                              prefetch={true}
                              className="flex-1 font-bold text-sm md:text-base text-slate-800 hover:text-[#C0161C] transition-colors" 
                              onClick={onClose}
                            >
                              {link.name}
                            </Link>
                          )}
                          
                          {link.dropdown && (
                            <ChevronRight 
                              size={16} 
                              className={`text-slate-400 transition-transform duration-300 ${openSubmenu === idx ? 'rotate-90 text-[#C0161C]' : ''}`} 
                            />
                          )}
                        </div>

                        {/* Submenu */}
                        <AnimatePresence>
                          {link.dropdown && openSubmenu === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-3 pr-2 pb-1 space-y-0.5 ml-2 border-l-2 border-slate-100">
                                {link.dropdown.map((item, subIdx) => (
                                  <Link 
                                    key={subIdx} 
                                    href={item.href}
                                    prefetch={true}
                                    onClick={onClose}
                                    className={`block px-3 py-1.5 rounded-md text-xs hover:bg-slate-50 transition-colors ${item.isHighlight ? 'text-[#C0161C] font-semibold' : 'text-slate-600 hover:text-[#C0161C]'}`}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Right Column: CTA & Contact Info */}
              <div className="w-full min-[480px]:w-1/2 md:w-3/5 bg-gradient-to-br from-[#C0161C] to-[#1E1E8F] text-white p-5 md:p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Badge */}
                <div className="relative z-10 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F5C400] text-[#1E1E8F] text-[10px] font-bold tracking-wider mb-3 shadow-lg shadow-yellow-900/20">
                    PENERIMAAN SISWA BARU
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">Bergabung Bersama Kami</h3>
                  <p className="text-white/90 text-xs md:text-sm mb-6 leading-relaxed max-w-xs">
                    Siapkan masa depan gemilang dengan pendidikan vokasi berkualitas dan berkarakter.
                  </p>
                  
                  <Link 
                    href="/ppdb"
                    prefetch={true}
                    onClick={onClose}
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-[#C0161C] hover:bg-[#a01217] text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/30 group text-sm border border-white/10 w-full sm:w-auto"
                  >
                    <span>Daftar PPDB Online</span>
                    <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Contact Info */}
                <div className="relative z-10 space-y-4 mt-auto">
                  <div className="space-y-3 border-t border-white/10 pt-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="shrink-0 mt-0.5 text-[#F5C400]" size={16} />
                      <p className="text-xs text-white/90 leading-snug">
                        {info.address || '-' }
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="shrink-0 text-[#F5C400]" size={16} />
                      <p className="text-xs text-white/90">{info.phone || '-'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="shrink-0 text-[#F5C400]" size={16} />
                      <p className="text-xs text-white/90">{info.email || '-'}</p>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="flex gap-2">
                    {socialLinks.map((social, idx) => (
                      <a 
                        key={idx} 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/90 transition-all hover:bg-white hover:text-[#1E1E8F] hover:scale-110"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}