import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Mail, ChevronRight, Facebook, Instagram, Youtube } from 'lucide-react';

export default function SidebarModal({ isOpen, onClose, links }) {
  const [openSubmenu, setOpenSubmenu] = React.useState(null);

  // Prevent scrolling when modal is open
  React.useEffect(() => {
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
    { icon: <Facebook size={18} />, href: '#', color: 'hover:text-blue-600' },
    { icon: <Instagram size={18} />, href: 'https://www.instagram.com/smkparamithajakartaofficial/', color: 'hover:text-pink-600' },
    { icon: <Youtube size={18} />, href: '#', color: 'hover:text-red-600' },
  ];

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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-xl overflow-hidden pointer-events-auto flex flex-col md:flex-row"
            >
              {/* Left Column: Navigation */}
              <div className="w-full md:w-5/12 bg-slate-50 p-8 flex flex-col border-r border-slate-100 overflow-y-auto">
                <div className="flex items-center justify-between mb-8 md:hidden">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                       <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain" sizes="40px" />
                    </div>
                    <span className="font-bold text-slate-900">Paramitha 2</span>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 hidden md:block">Menu Navigasi</h3>
                
                <nav className="space-y-2 flex-1">
                  {links.map((link, idx) => (
                    <div key={idx} className="group">
                      <div 
                        onClick={() => {
                          if (link.dropdown) {
                            toggleSubmenu(idx);
                          } else {
                            // If it's a direct link, we rely on the Link component inside, but here we can handle the click for the container
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer select-none ${openSubmenu === idx ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                      >
                        {link.dropdown ? (
                          <span className={`font-bold transition-colors flex-1 ${openSubmenu === idx ? 'text-primary-600' : 'text-slate-700'}`}>
                            {link.name}
                          </span>
                        ) : (
                          <Link href={link.href} className="flex-1 font-bold text-slate-700" onClick={onClose}>
                            {link.name}
                          </Link>
                        )}
                        
                        {link.dropdown && (
                           <ChevronRight 
                             size={16} 
                             className={`text-slate-300 transition-transform duration-300 ${openSubmenu === idx ? 'rotate-90 text-primary-400' : ''}`} 
                           />
                        )}
                      </div>
                      
                      {/* Submenu for Modal */}
                      <AnimatePresence>
                        {link.dropdown && openSubmenu === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-200 ml-4 py-2">
                              {link.dropdown.map((subItem, subIdx) => (
                                <Link
                                  key={subIdx}
                                  href={subItem.href}
                                  onClick={onClose}
                                  className="block py-2 px-3 text-sm text-slate-500 hover:text-primary-600 hover:bg-slate-100/50 rounded-lg transition-colors"
                                >
                                  {subItem.name}
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

              {/* Right Column: Info & Details */}
              <div className="w-full md:w-7/12 p-8 bg-white relative overflow-hidden flex flex-col">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="hidden md:flex justify-end mb-8">
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center">
                  <div className="mb-8">
                    <div className="relative w-16 h-16 mb-6 rounded-2xl overflow-hidden shadow-lg border border-slate-100 hidden md:block">
                      <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">SMK Paramitha 2 Jakarta</h2>
                    <p className="text-slate-500">Mencetak Generasi PINK JITU (Profesional, Inovatif, Nasionalis, Kompeten, Jujur, Iman, Tangguh, Unggul)</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <MapPin className="text-primary-600 shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Lokasi Kampus</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Jl. Komp. DDN Jl. Raya Kalimalang No. 68 I2, Pondok Kelapa, Kec. Duren Sawit, Kota Jakarta Timur, 13450
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <Phone className="text-primary-600" size={20} />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Telepon</h4>
                          <p className="text-sm text-slate-600">021-8650377</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <Mail className="text-primary-600" size={20} />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Email</h4>
                          <p className="text-sm text-slate-600">info@paramitha2.sch.id</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400">Ikuti Kami</span>
                    <div className="flex gap-4">
                      {socialLinks.map((social, idx) => (
                        <a 
                          key={idx}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-slate-400 transition-colors ${social.color}`}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
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
