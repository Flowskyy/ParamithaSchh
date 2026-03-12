import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChevronDown, Menu, LayoutGrid } from 'lucide-react';
import SidebarModal from './SidebarModal';
import { getJurusan } from '../services/api';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [jurusanItems, setJurusanItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch Jurusan dynamically
    async function loadJurusan() {
      try {
        const data = await getJurusan();
        if (data && Array.isArray(data)) {
          const items = data.map(j => {
            if (!j) return null;
            return { 
              name: j.name || 'Jurusan', 
              href: `/jurusan/${j.slug || '#'}`, 
              desc: j.short_desc 
                ? (j.short_desc.length > 30 ? j.short_desc.substring(0, 30) + '...' : j.short_desc) 
                : (j.description ? (j.description.length > 30 ? j.description.substring(0, 30) + '...' : j.description) : (j.deskripsi ? (j.deskripsi.length > 30 ? j.deskripsi.substring(0, 30) + '...' : j.deskripsi) : 'Program Keahlian')),
              isHighlight: false 
            };
          }).filter(Boolean);
          setJurusanItems(items);
        } else {
          setJurusanItems([]);
        }
      } catch (err) {
        console.error('Navbar loadJurusan error:', err);
        setJurusanItems([]);
      }
    }
    loadJurusan();

    const handleDbChange = () => {
      console.log('Refreshing Navbar data...');
      loadJurusan();
    };
    window.addEventListener('db-change', handleDbChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('db-change', handleDbChange);
    };
  }, []);

  const links = [
    { name: 'Beranda', href: '/' },
    { 
      name: 'Tentang Kami', 
      href: '#', 
      dropdown: [
        { name: 'Lihat Semua', href: '/tentang', desc: 'Tentang Sekolah', isHighlight: router.asPath === '/tentang' },
        { name: 'Sejarah Sekolah', href: '/tentang/sejarah', desc: 'Perjalanan & Milestone' },
        { name: 'Visi & Misi', href: '/tentang/visi-misi', desc: 'Tujuan & Nilai Utama' },
        { name: 'Motto & Mars', href: '/tentang/motto-mars', desc: 'Semangat & Identitas' },
        { name: 'Sambutan Kepsek', href: '/tentang/sambutan-kepsek', desc: 'Pesan Kepala Sekolah' },
        { name: 'Fasilitas', href: '/tentang/fasilitas', desc: 'Sarana Prasarana' },
        { name: 'Galeri', href: '/tentang/galeri', desc: 'Dokumentasi Kegiatan' },
      ].map(item => ({ ...item, isHighlight: item.isHighlight || router.asPath === item.href }))
    },
    { 
      name: 'Jurusan', 
      href: '#',
      dropdown: [
        { name: 'Semua Jurusan', href: '/jurusan', desc: 'Daftar Program Keahlian', isHighlight: router.asPath === '/jurusan' },
        ...jurusanItems.map(item => ({ ...item, isHighlight: router.asPath === item.href }))
      ] 
    },
    { name: 'Hubungi Kami', href: '/contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
            : 'bg-gradient-to-b from-black/30 to-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className={`relative w-12 h-12 transition-transform group-hover:scale-105`}>
                 <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain" sizes="48px" />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg leading-tight transition-colors ${
                  scrolled ? 'text-slate-900' : 'text-white'
                }`}>
                  SMK Paramitha 2
                </span>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${
                  scrolled ? 'text-[#C0161C]' : 'text-white/80'
                }`}>
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
                    prefetch={true}
                    className={`flex items-center gap-1 font-medium text-sm transition-colors py-2 ${
                      scrolled 
                        ? 'text-slate-700 hover:text-[#C0161C]' 
                        : 'text-white hover:text-white/80'
                    }`}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform" />}
                  </Link>

                  {/* Dropdown */}
                  {link.dropdown && (
                    <div className={`absolute top-full left-0 w-72 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0`}>
                      <div className="bg-white rounded-xl shadow-xl border border-[#F5C400]/30 p-2 overflow-hidden">
                        {link.dropdown.map((item, subIdx) => (
                          <Link 
                            key={subIdx} 
                            href={item.href}
                            prefetch={true}
                            className="block px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors group/item"
                          >
                            <div className={`font-medium text-sm group-hover/item:text-[#C0161C] ${item.isHighlight ? 'text-[#C0161C] font-bold' : 'text-slate-700'}`}>
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 group-hover/item:text-slate-500 mt-0.5">
                              {item.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Info Button (Desktop) */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${
                  scrolled 
                    ? 'border-[#1E1E8F] text-[#1E1E8F] hover:bg-[#1E1E8F] hover:text-white' 
                    : 'border-white text-white hover:bg-white/20'
                }`}
              >
                <LayoutGrid size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Info</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden flex items-center gap-2 px-3 py-2 rounded-full transition-all ml-2 ${
                scrolled 
                  ? 'bg-slate-100 text-[#C0161C] hover:bg-slate-200' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <Menu size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Modal */}
      <SidebarModal 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        links={links}
      />
    </>
  );
}
