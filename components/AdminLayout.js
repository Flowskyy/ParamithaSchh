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

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jurusanItems, setJurusanItems] = useState([]);
  
  // State for dropdown menus
  const [openMenus, setOpenMenus] = useState({
    beranda: false,
    tentang: false,
    ppdb: false,
    jurusan: false,
    laporan: false,
  });

  useEffect(() => {
    // Load jurusan for sidebar
    async function loadJurusan() {
      const { data } = await supabase.from('jurusan').select('id, slug, name').order('order_index');
      if (data) {
        setJurusanItems(data.map(j => ({ 
          href: `/admin/jurusan?edit=${j.slug}`, 
          label: j.name 
        })));
      }
    }
    loadJurusan();
  }, []);

  // Menu structure with CORRECT paths
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
        { href: '/admin/beranda/hero', label: 'Hero Section' },
        { href: '/admin/beranda/sections', label: 'Atur Urutan Section' },
        { href: '/admin/beranda/alumni', label: 'Alumni Sukses' },
        { href: '/admin/beranda/mitra', label: 'Mitra Industri' },
        { href: '/admin/sosmed', label: 'Sosial Media' },
      ]
    },
    {
      type: 'dropdown',
      id: 'tentang',
      label: 'Tentang Kami',
      icon: Info,
      items: [
        { href: '/admin/tentang/profil', label: 'Profil Sekolah' },
        { href: '/admin/tentang/sambutan-kepsek', label: 'Sambutan Kepsek' },
        { href: '/admin/tentang/fasilitas', label: 'Fasilitas' },
        { href: '/admin/tentang/galeri', label: 'Galeri Foto' },
      ]
    },
    {
      type: 'dropdown',
      id: 'ppdb',
      label: 'PPDB',
      icon: GraduationCap,
      items: [
        { href: '/admin/ppdb/jadwal', label: 'Jadwal Pendaftaran' },
        { href: '/admin/ppdb/pendaftar', label: 'Data Pendaftar' },
        { href: '/admin/ppdb/persyaratan', label: 'Persyaratan' },
      ]
    },
    {
      type: 'dropdown',
      id: 'jurusan',
      label: 'Jurusan',
      icon: BookOpen,
      items: [
        { href: '/admin/jurusan', label: 'Semua Jurusan' },
        ...jurusanItems,
        { href: '/admin/jurusan?action=new', label: '+ Tambah Jurusan', special: true },
      ]
    },
    {
      type: 'dropdown',
      id: 'laporan',
      label: 'Laporan',
      icon: BarChart,
      items: [
        { href: '/admin/report', label: 'Laporan PPDB', disabled: true },
        { href: '/admin/log', label: 'Log Aktivitas' },
      ]
    },
    { 
      type: 'single',
      href: '/admin/settings', 
      icon: Settings, 
      label: 'Pengaturan' 
    },
  ];

  // Auto-expand menu based on active route
  useEffect(() => {
    const path = router.pathname;
    const asPath = router.asPath;
    
    const activeMenu = menuStructure.find(item => {
      if (item.type !== 'dropdown') return false;
      
      // Check if any child matches
      return item.items.some(sub => {
        if (sub.href.includes('?')) return asPath === sub.href;
        return path.startsWith(sub.href);
      });
    });

    if (activeMenu) {
      setOpenMenus(prev => {
        // Only update if not already open to avoid loops, 
        // but we want to enforce "accordion" style (others closed)
        // So we just set the state to exactly what we want.
        const newState = {
          beranda: false,
          tentang: false,
          ppdb: false,
          jurusan: false,
          laporan: false,
        };
        newState[activeMenu.id] = true;
        
        // Simple comparison to avoid unnecessary re-renders
        if (JSON.stringify(prev) === JSON.stringify(newState)) return prev;
        
        return newState;
      });
    }
  }, [router.pathname, router.asPath, jurusanItems.length]); // Depend on length to re-run when items load

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => {
      const newState = {
        beranda: false,
        tentang: false,
        ppdb: false,
        jurusan: false,
        laporan: false,
      };
      // Toggle current, close others
      newState[menuId] = !prev[menuId];
      return newState;
    });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast.error('Gagal logout');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FF] font-sans text-slate-900">
      
      {/* MOBILE HEADER (Visible only on mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1E1E8F] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white">
            <Image src="/images/logo.jpg" alt="Logo" width={32} height={32} className="object-cover" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY (Mobile only) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR — selalu visible di desktop (lg:translate-x-0) */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-[#1E1E8F] text-white z-50 
        transform transition-transform duration-300 ease-in-out shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-[#151570]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white">
              <Image src="/images/logo.jpg" alt="Logo" width={32} height={32} className="object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">SMK Paramitha</h1>
              <p className="text-[10px] text-blue-200 font-bold tracking-wider">ADMINISTRATOR</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-1 hover:bg-white/10 rounded text-white/70"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
          <div className="space-y-1">
            {menuStructure.map((item) => {
              if (item.type === 'single') {
                const isActive = router.pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-[#1E1E8F] font-bold shadow-md' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-[#1E1E8F]' : 'text-white/70'} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              } else {
                const isOpen = openMenus[item.id];
                // Check if any child is active
                const hasActiveChild = item.items.some(sub => {
                   if (sub.href.includes('?')) return router.asPath === sub.href;
                   return router.pathname.startsWith(sub.href);
                });
                
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                        hasActiveChild 
                          ? 'bg-white/10 text-white font-semibold' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={hasActiveChild ? 'text-white' : 'text-white/70'} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    
                    {isOpen && (
                      <div className="pl-11 pr-2 space-y-1 mt-1 mb-2">
                        {item.items.map(sub => {
                          if (sub.disabled) return null; // Skip disabled items or render differently

                          const isSubActive = sub.href.includes('?') 
                            ? router.asPath === sub.href
                            : router.pathname === sub.href;
                            
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`block py-2 px-3 rounded-lg text-xs transition-all ${
                                isSubActive
                                  ? 'bg-[#C0161C] text-white font-bold shadow-sm'
                                  : 'text-white/60 hover:text-white hover:bg-white/5'
                              } ${sub.special ? 'text-[#F5C400] font-bold' : ''}`}
                            >
                              {sub.label}
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

          <div className="mt-8 pt-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-200 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen bg-[#F8F9FF]">
        {/* Top Bar Desktop */}
        <header className="hidden lg:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            Panel Administrasi
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">Administrator</p>
              <p className="text-xs text-slate-500">smkparamitha2@gmail.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
               <Image src="/images/logo.jpg" alt="Admin" width={40} height={40} />
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="p-4 lg:p-8 pt-20 lg:pt-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}