import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  LayoutDashboard, 
  Home,
  Info,
  GraduationCap,
  BookOpen, 
  Image as ImageIcon, 
  BarChart,
  Settings,
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { showToast } from '../utils/toast';
import Image from 'next/image';
import { initStorageBuckets } from '../services/api';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // State for dropdown menus
  const [openMenus, setOpenMenus] = useState({
    beranda: false,
    tentang: false,
    ppdb: false,
    jurusan: false,
    media: false,
    laporan: false
  });

  const [jurusanItems, setJurusanItems] = useState([]);

  useEffect(() => {
    async function loadJurusan() {
      const { data } = await supabase.from('jurusan').select('id, slug, name').order('order_index');
      if (data) {
        setJurusanItems(data.map(j => ({ 
          href: `/admin/jurusan?slug=${j.slug}`, 
          label: j.name 
        })));
      }
    }
    loadJurusan();
  }, []);

  const menuStructure = [
    { 
      type: 'single',
      href: '/admin/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard' 
    },
    {
      type: 'dropdown',
      id: 'beranda',
      label: 'Beranda',
      icon: Home,
      items: [
        { href: '/admin/beranda/hero', label: 'Hero' },
        { href: '/admin/beranda/alumni', label: 'Alumni' },
        { href: '/admin/beranda/mitra', label: 'Mitra' },
        { href: '/admin/beranda/cta', label: 'CTA', disabled: true },
      ]
    },
    {
      type: 'dropdown',
      id: 'tentang',
      label: 'Tentang Kami',
      icon: Info,
      items: [
        { href: '/admin/tentang/profil', label: 'Profil Sekolah' },
        { href: '/admin/tentang/visi-misi', label: 'Visi & Misi', disabled: true },
        { href: '/admin/tentang/sejarah', label: 'Sejarah', disabled: true },
        { href: '/admin/tentang/sambutan-kepsek', label: 'Sambutan Kepsek' },
        { href: '/admin/tentang/fasilitas', label: 'Fasilitas' },
        { href: '/admin/tentang/galeri', label: 'Galeri' },
        { href: '/admin/testimonial', label: 'Testimonial' },
        { href: '/admin/tentang/motto-mars', label: 'Motto & Mars', disabled: true },
      ]
    },
    {
      type: 'dropdown',
      id: 'ppdb',
      label: 'PPDB',
      icon: GraduationCap,
      items: [
        { href: '/admin/ppdb/jadwal', label: 'Jadwal Pendaftaran' },
        { href: '/admin/ppdb/pendaftar', label: 'Form Pendaftar' },
        { href: '/admin/ppdb/persyaratan', label: 'Persyaratan' },
      ]
    },
    {
      type: 'dropdown',
      id: 'jurusan',
      label: 'Jurusan',
      icon: BookOpen,
      items: [
        { href: '/admin/jurusan/baru', label: '+ Buat Jurusan Baru', special: true },
        ...jurusanItems
      ]
    },
    {
      type: 'dropdown',
      id: 'laporan',
      label: 'Laporan',
      icon: BarChart,
      items: [
        { href: '/admin/report', label: 'Report', disabled: true },
        { href: '/admin/log', label: 'Log Aktivitas', disabled: true },
      ]
    },
    { 
      type: 'single',
      href: '/admin/settings', 
      icon: Settings, 
      label: 'Pengaturan' 
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    // Initialize buckets on layout mount
    initStorageBuckets().catch(console.error);
    
    // Open menu based on current path
    const path = router.asPath; // Use asPath to catch query params
    
    const newOpenMenus = { ...openMenus };
    let hasUpdate = false;

    menuStructure.forEach(item => {
      if (item.type === 'dropdown') {
        // Check if any child matches the current path
        const isActive = item.items.some(sub => {
          // Exact match or starts with (for nested routes)
          // Handle query params comparison carefully
          if (sub.href.includes('?')) {
            return path === sub.href;
          }
          return path.startsWith(sub.href);
        });

        if (isActive && !newOpenMenus[item.id]) {
          newOpenMenus[item.id] = true;
          hasUpdate = true;
        }
      }
    });

    if (hasUpdate) {
      setOpenMenus(newOpenMenus);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, jurusanItems]);

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast.error('Error logging out');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-900 font-sans selection:bg-[#C0161C] selection:text-white">
      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
            <Image src="/images/logo.jpg" alt="Logo" width={32} height={32} className="object-cover" />
          </div>
          <span className="font-bold text-lg text-slate-800">Admin Panel</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
              <Image src="/images/logo.jpg" alt="Logo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-900">SMK Paramitha</h1>
              <p className="text-xs text-[#C0161C] font-bold tracking-wide">ADMINISTRATOR</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          
          <div className="space-y-1">
            {menuStructure.map((item) => {
              if (item.type === 'single') {
                const isActive = router.pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-[#C0161C] text-white shadow-lg shadow-[#C0161C]/25' 
                        : 'text-slate-500 hover:text-[#C0161C] hover:bg-red-50'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#C0161C] transition-colors'} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              } else {
                const isOpen = openMenus[item.id];
                const hasActiveChild = item.items.some(sub => {
                   if (sub.href.includes('?')) {
                      return router.asPath === sub.href;
                   }
                   return router.pathname.startsWith(sub.href);
                });
                
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                        hasActiveChild 
                          ? 'bg-red-50 text-[#C0161C]' 
                          : 'text-slate-500 hover:text-[#C0161C] hover:bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={hasActiveChild ? 'text-[#C0161C]' : 'text-slate-400 group-hover:text-[#C0161C] transition-colors'} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    
                    {isOpen && (
                      <div className="pl-11 pr-2 space-y-1">
                        {item.items.map(sub => {
                          if (sub.disabled) {
                            return (
                              <div
                                key={sub.href}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-300 cursor-not-allowed select-none"
                              >
                                <span>{sub.label}</span>
                                <span className="ml-auto text-[10px] font-bold border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">Locked</span>
                              </div>
                            );
                          }

                          const isSubActive = sub.href.includes('?') 
                            ? router.asPath === sub.href
                            : router.pathname === sub.href;
                            
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isSubActive
                                  ? 'bg-[#C0161C] text-white shadow-md shadow-[#C0161C]/20'
                                  : 'text-slate-500 hover:text-[#C0161C] hover:bg-red-50'
                              } ${sub.special ? 'text-yellow-600 font-bold hover:text-yellow-700 hover:bg-yellow-50' : ''}`}
                            >
                              <span>{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white/95 backdrop-blur-xl">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`lg:ml-72 min-h-screen transition-all duration-300 ${sidebarOpen ? 'blur-sm lg:blur-none' : ''}`}>
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
