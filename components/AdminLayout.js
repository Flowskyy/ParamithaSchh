import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getJurusan } from '../services/api';
import {
  LayoutDashboard,
  Home,
  Info,
  Mail,
  BookOpen,
  Building2,
  Image as ImageIcon,
  Users,
  Handshake,
  FileText,
  BarChart,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Building,
  Plus,
  Phone,
  ChevronDown as ChevronDownIcon
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Beranda',
    icon: Home,
    hasSubmenu: true,
    submenu: [
      { label: 'Hero Section', href: '/admin/hero' },
      { label: 'Atur Urutan Section', href: '/admin/homepage-sections' },
      { label: 'Alumni Sukses', href: '/admin/alumni' },
      { label: 'Mitra Industri', href: '/admin/mitra' },
      { label: 'Proyek PKK', href: '/admin/proyek-pkk' },
      { label: 'Footer', href: '/admin/footer' },
    ]
  },
  { label: 'Jurusan', icon: Building2, hasSubmenu: true, isDynamic: true },
  {
    label: 'Tentang Kami',
    icon: Info,
    hasSubmenu: true,
    submenu: [
      { label: 'Sejarah Sekolah', href: '/admin/sejarah' },
      { label: 'Visi Misi', href: '/admin/visi-misi' },
      { label: 'Motto & Mars', href: '/admin/motto-mars' },
      { label: 'Sambutan Kepsek', href: '/admin/sambutan' },
      { label: 'Fasilitas', href: '/admin/fasilitas' },
      { label: 'Galeri Foto', href: '/admin/galeri' },
    ]
  },
  { label: 'PPDB', href: '/admin/ppdb', icon: BookOpen },
  { label: 'Kontak', href: '/admin/kontak', icon: Phone },
  { label: 'Laporan', href: '/admin/laporan', icon: BarChart },
  { label: 'Media Manager', href: '/admin/media', icon: ImageIcon },
];

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [jurusanList, setJurusanList] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  useEffect(() => {
    const fetchJurusan = async () => {
      const data = await getJurusan();
      setJurusanList(data);
    };
    fetchJurusan();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [router.pathname, isMobile]);

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const getPageTitle = () => {
    for (const item of menuItems) {
      if (item.href && router.pathname === item.href) return item.label;
      if (item.submenu) {
        const subItem = item.submenu.find(sub => router.pathname === sub.href);
        if (subItem) return subItem.label;
      }
    }
    return title;
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] text-slate-900 flex" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-[#1E1E8F] flex flex-col z-50 transition-all duration-300 ${
        isMobile
          ? sidebarOpen
            ? 'w-[280px] translate-x-0'
            : 'w-[280px] -translate-x-full'
          : sidebarOpen
            ? 'w-[260px]'
            : 'w-[70px]'
      }`}>
        {/* Logo */}
        <div className="py-6 px-5 border-b border-white/10 flex justify-center">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            {(sidebarOpen || isMobile) && (
              <div>
                <h1 className="text-white font-bold text-lg">SMK Paramitha</h1>
                <p className="text-white/60 text-xs mt-0.5 tracking-wider">ADMINISTRATOR</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.hasSubmenu;
            const isExpanded = expandedMenus[item.label];
            const isActive = item.href && router.pathname === item.href;
            const isSubActive = hasSubmenu && item.submenu?.some(sub => router.pathname === sub.href);

            if (hasSubmenu) {
              // Handle dynamic submenu for Jurusan
              if (item.isDynamic && item.label === 'Jurusan') {
                const dynamicSubmenu = [
                  { label: 'Semua jurusan', href: '/admin/jurusan' },
                  ...jurusanList.map(j => ({ label: j.name, href: `/admin/jurusan/${j.id}`, id: j.id })),
                  { label: 'Tambah Jurusan', href: '/admin/jurusan/new', isAdd: true }
                ];
                const isSubActive = dynamicSubmenu.some(sub => 
                  sub.href === '/admin/jurusan' 
                    ? router.pathname === '/admin/jurusan'
                    : router.pathname === '/admin/jurusan/[id]' && router.query.id === sub.id
                );
                const isHovered = hoveredMenu === item.label;
                const shouldShowSubmenu = isExpanded || isHovered || (isSubActive && expandedMenus[item.label] !== false);

                return (
                  <div 
                    key={item.label}
                    onMouseEnter={() => !isMobile && setHoveredMenu(item.label)}
                    onMouseLeave={() => !isMobile && setHoveredMenu(null)}
                  >
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 w-full justify-center ${
                        isSubActive
                          ? 'bg-white/15 text-white font-semibold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={sidebarOpen ? 18 : 24} />
                      {(sidebarOpen || isMobile) && <span className="flex-1 text-left">{item.label}</span>}
                      {(sidebarOpen || isMobile) && ((isExpanded || isHovered || (isSubActive && expandedMenus[item.label] !== false)) ? <ChevronDown size={16} className="text-white/40" /> : <ChevronRight size={16} className="text-white/40" />)}
                    </button>
                    {shouldShowSubmenu && (sidebarOpen || isMobile) && (
                      <div 
                        className="ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: shouldShowSubmenu ? '1000px' : '0px',
                          opacity: shouldShowSubmenu ? '1' : '0'
                        }}
                        onMouseEnter={() => !isMobile && setHoveredMenu(item.label)}
                        onMouseLeave={() => !isMobile && setHoveredMenu(null)}
                      >
                        {dynamicSubmenu.map((subItem, idx) => {
                          const isSubItemActive = subItem.href === '/admin/jurusan' 
                            ? router.pathname === '/admin/jurusan'
                            : router.pathname === '/admin/jurusan/[id]' && router.query.id === subItem.id;
                          return (
                            <Link
                              key={subItem.href || idx}
                              href={subItem.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isSubItemActive
                                  ? 'bg-white text-[#1E1E5F] font-semibold'
                                  : subItem.isAdd
                                  ? 'text-[#F5C400] hover:bg-white/10'
                                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                              }`}
                              onClick={() => isMobile && setSidebarOpen(false)}
                            >
                              {subItem.isAdd && <Plus size={14} />}
                              <span className="flex-1">{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular static submenu
              const isHovered = hoveredMenu === item.label;
              const shouldShowSubmenu = isExpanded || isHovered || (isSubActive && expandedMenus[item.label] !== false);
              return (
                <div 
                  key={item.label}
                  onMouseEnter={() => !isMobile && setHoveredMenu(item.label)}
                  onMouseLeave={() => !isMobile && setHoveredMenu(null)}
                >
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 w-full justify-center ${
                      isSubActive
                        ? 'bg-white/15 text-white font-semibold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={sidebarOpen ? 18 : 24} />
                    {(sidebarOpen || isMobile) && <span className="flex-1 text-left">{item.label}</span>}
                    {(sidebarOpen || isMobile) && ((isExpanded || isHovered || (isSubActive && expandedMenus[item.label] !== false)) ? <ChevronDown size={16} className="text-white/40" /> : <ChevronRight size={16} className="text-white/40" />)}
                  </button>
                  {shouldShowSubmenu && (sidebarOpen || isMobile) && (
                    <div 
                      className="ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: shouldShowSubmenu ? '1000px' : '0px',
                        opacity: shouldShowSubmenu ? '1' : '0'
                      }}
                      onMouseEnter={() => !isMobile && setHoveredMenu(item.label)}
                      onMouseLeave={() => !isMobile && setHoveredMenu(null)}
                    >
                      {item.submenu.map((subItem) => {
                        const isSubItemActive = router.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isSubItemActive
                                ? 'bg-white text-[#1E1E5F] font-semibold'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                            onClick={() => isMobile && setSidebarOpen(false)}
                          >
                            <span className="flex-1">{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 justify-center ${
                  isActive
                    ? 'bg-white text-[#1E1E5F] font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => {
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Icon size={sidebarOpen ? 18 : 24} />
                {(sidebarOpen || isMobile) && <span className="flex-1">{item.label}</span>}
                {(sidebarOpen || isMobile) && !isActive && item.href !== '/admin' && item.href !== '/admin/ppdb' && item.href !== '/admin/laporan' && item.href !== '/admin/kontak' && item.href !== '/admin/media' && <ChevronRight size={16} className="text-white/40" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isMobile ? 'ml-0' : sidebarOpen ? 'ml-[260px]' : 'ml-[70px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-[70px] flex items-center px-4 md:px-8 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors mr-2 md:mr-4 text-slate-600"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-[#1E1E8F] truncate">Panel Administrasi</h1>
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-900">Administrator</p>
              <p className="text-xs text-slate-500">smkparamitha2@gmail.com</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="relative"
              >
                <img
                  src="/favicon.jpg"
                  alt="Logo"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#C0161C]/20 cursor-pointer hover:border-[#C0161C]/50 transition-colors"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      // Handle sign out logic here
                      router.push('/login');
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
