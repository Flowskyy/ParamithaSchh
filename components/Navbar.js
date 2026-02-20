import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { X, ChevronDown, ArrowRight, Phone, MapPin, LayoutGrid, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarModal from './SidebarModal';

export default function Navbar() {
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
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3 border-b border-black/5' : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className={`relative w-12 h-12 transition-transform group-hover:scale-105`}>
                 <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain" sizes="48px" />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg leading-tight transition-colors text-slate-900`}>
                  SMK Paramitha 2
                </span>
                <span className={`text-[10px] uppercase tracking-widest font-medium text-primary-600`}>
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
                    className={`flex items-center gap-1 font-medium text-sm transition-colors py-2 ${
                      scrolled 
                        ? 'text-slate-600 hover:text-primary-600' 
                        : 'text-slate-700 hover:text-primary-600'
                    }`}
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
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                }`}
              >
                PPDB Online <ArrowRight size={16} />
              </Link>
            </div>

            {/* Sidebar Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ml-2 lg:ml-4 ${
                scrolled 
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                  : 'bg-white/80 text-slate-700 hover:bg-white shadow-sm'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Info</span>
            </button>
          </div>
        </div>
      </nav>

      <SidebarModal 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        links={links} 
      />
    </>
  );
}