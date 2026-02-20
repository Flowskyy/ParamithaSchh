import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Building2, 
  Image as ImageIcon, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Monitor,
  Briefcase,
  MessageSquare,
  Activity,
  Bug
} from 'lucide-react';
import { showToast } from '../utils/toast';
import Image from 'next/image';
import { initStorageBuckets } from '../services/api';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    // Initialize buckets on layout mount
    initStorageBuckets().catch(console.error);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast.error('Error logging out');
    } else {
      router.push('/admin');
    }
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/hero', icon: Monitor, label: 'Hero & Info' },
    { href: '/admin/jurusan', icon: BookOpen, label: 'Jurusan' },
    { href: '/admin/fasilitas', icon: Building2, label: 'Fasilitas' },
    { href: '/admin/alumni', icon: Users, label: 'Alumni' },
    { href: '/admin/mitra', icon: Briefcase, label: 'Mitra' },
    { href: '/admin/galeri', icon: ImageIcon, label: 'Galeri' },
    { href: '/admin/log', icon: Activity, label: 'Activity Log' },
    { href: '/admin/debug', icon: Bug, label: 'System Check' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-900 font-sans selection:bg-[#1E1E8F] selection:text-white">
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

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#1E1E8F] text-white shadow-lg shadow-[#1E1E8F]/25' 
                    : 'text-slate-500 hover:text-[#1E1E8F] hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#1E1E8F] transition-colors'} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white/95 backdrop-blur-xl">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
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