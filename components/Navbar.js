import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Menu, X, ChevronDown, ArrowRight, Phone, MapPin, LayoutGrid, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarModal from './SidebarModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Beranda', href: '/' },
    { 
      name: 'Tentang Kami', 
      href: '#', 
      dropdown: [
        { name: 'Sejarah Sekolah', href: '/tentang/sejarah', desc: 'Perjalanan & Milestone' },
        { name: 'Visi & Misi', href: '/tentang/visi-misi', desc: 'Tujuan & Nilai Utama' },
        { name: 'Sambutan Kepsek', href: '/tentang/sambutan-kepsek', desc: 'Pesan Kepala Sekolah' },
        { name: 'Fasilitas', href: '/tentang/fasilitas', desc: 'Sarana Prasarana' },
        { name: 'Galeri', href: '/tentang/galeri', desc: 'Dokumentasi Kegiatan' },
      ]
    },
    { 
      name: 'Jurusan', 
      href: '#',
      dropdown: [
        { name: 'Rekayasa Perangkat Lunak', href: '/jurusan/rpl', desc: 'Software Engineering' },
        { name: 'Desain Komunikasi Visual', href: '/jurusan/dkv', desc: 'Creative Design' },
        { name: 'Perhotelan', href: '/jurusan/perhotelan', desc: 'Hospitality' },
        { name: 'Kuliner', href: '/jurusan/kuliner', desc: 'Culinary Art' },
        { name: 'Usaha Layanan Wisata', href: '/jurusan/ulw', desc: 'Tourism Services' },
        { name: 'Manajemen Logistik', href: '/jurusan/manajemen-logistik', desc: 'Logistics & Supply Chain' },
      ] 
    },
    { name: 'Hubungi Kami', href: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0f0f1a]/80 backdrop-blur-md shadow-sm py-3 border-b border-white/5' : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className={`relative w-12 h-12 transition-transform group-hover:scale-105`}>
                 <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain" sizes="48px" />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg leading-tight transition-colors text-white`}>
                  SMK Paramitha 2
                </span>
                <span className={`text-[10px] uppercase tracking-widest font-medium text-primary-400`}>
                  Jakarta
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {links.map((link, idx) => (
                <div 
                  key={idx} 
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link 
                    href={link.href}
                    className={`flex items-center gap-1 font-medium text-sm transition-colors py-2 text-white/90 hover:text-white`}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform" />}
                  </Link>

                  {/* Dropdown */}
                  {link.dropdown && (
                    <div className={`absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0`}>
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                        {link.dropdown.map((item, subIdx) => (
                          <Link 
                            key={subIdx} 
                            href={item.href}
                            className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group/item"
                          >
                            <span className="block font-bold text-slate-800 text-sm group-hover/item:text-primary-600 transition-colors">{item.name}</span>
                            <span className="block text-xs text-slate-400 mt-0.5">{item.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link 
                href="/ppdb" 
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                  scrolled 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20' 
                    : 'bg-white text-primary-900 hover:bg-primary-50 shadow-lg shadow-black/10'
                }`}
              >
                PPDB Online <ArrowRight size={16} />
              </Link>
            </div>

            {/* Sidebar Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ml-2 lg:ml-4 bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm`}
            >
              <LayoutGrid size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Info</span>
            </button>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ml-1 text-white hover:bg-white/10`}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - CENTERED MODAL STYLE */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[60] lg:hidden flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed z-[61] w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 lg:hidden max-h-[85vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/50 backdrop-blur-sm z-10">
                 <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                      <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <span className="font-bold text-lg text-slate-900 block leading-none">Paramitha 2</span>
                      <span className="text-xs text-slate-500 font-medium tracking-wide">MENU UTAMA</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                  {links.map((link, idx) => (
                    <div key={idx} className="border-b border-slate-50 last:border-0 pb-1 last:pb-0">
                      <div 
                        className={`flex items-center justify-between py-3 px-2 rounded-xl transition-colors ${activeDropdown === idx ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                        onClick={() => link.dropdown ? setActiveDropdown(activeDropdown === idx ? null : idx) : setIsOpen(false)}
                      >
                        <Link 
                          href={link.href}
                          onClick={(e) => {
                            if (link.dropdown) e.preventDefault();
                            else setIsOpen(false);
                          }}
                          className={`font-bold text-lg flex-1 ${router.pathname === link.href ? 'text-primary-600' : 'text-slate-800'}`}
                        >
                          {link.name}
                        </Link>
                        {link.dropdown && (
                          <ChevronDown 
                            size={20} 
                            className={`text-slate-400 transition-transform ${activeDropdown === idx ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {link.dropdown && activeDropdown === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pr-2 py-2 space-y-1">
                              {link.dropdown.map((item, subIdx) => (
                                <Link 
                                  key={subIdx} 
                                  href={item.href}
                                  className="flex flex-col p-3 rounded-xl bg-slate-50/50 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-100"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span className="font-bold text-slate-700 text-sm">{item.name}</span>
                                  <span className="text-xs text-slate-400 mt-0.5">{item.desc}</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4">
                  <Link 
                    href="/ppdb" 
                    className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
                    onClick={() => setIsOpen(false)}
                  >
                    Daftar PPDB <ArrowRight size={20} />
                  </Link>
                  
                  <div className="mt-6 flex justify-center gap-6 text-slate-400">
                    <a href="#" className="hover:text-primary-600 transition-colors"><Phone size={20} /></a>
                    <a href="#" className="hover:text-primary-600 transition-colors"><Mail size={20} /></a>
                    <a href="#" className="hover:text-primary-600 transition-colors"><MapPin size={20} /></a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SidebarModal 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        links={links} 
      />
    </>
  );
}