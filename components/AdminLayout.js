import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Sekolah Info', href: '/admin/sekolah-info' },
  { label: 'Jurusan', href: '/admin/jurusan' },
  { label: 'Visi & Misi', href: '/admin/visi-misi' },
  { label: 'Sejarah', href: '/admin/sejarah' },
  { label: 'Motto & Mars', href: '/admin/motto-mars' },
  { label: 'Fasilitas', href: '/admin/fasilitas' },
  { label: 'Galeri', href: '/admin/galeri' },
  { label: 'Visitor Logs', href: '/admin/visitor-logs' },
];

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-950 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Paramitha Admin</p>
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  router.pathname === item.href
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
