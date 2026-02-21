import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  BarChart3, Users, Image as ImageIcon, Briefcase, 
  Settings, ExternalLink, Clock, Activity, FileText
} from 'lucide-react'
import { getReport, getActivityLog } from '../../services/api'
import withAdmin from '../../utils/withAdmin'
import AdminLayout from '../../components/AdminLayout'

function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    jurusan: 0,
    galeri: 0,
    testimonial: 0,
    fasilitas: 0,
    carousel: 0,
    alumni: 0,
    mitra: 0,
    pendaftar: 0
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [reportData, logData] = await Promise.all([
          getReport(),
          getActivityLog(10)
        ])
        setStats(reportData)
        setActivities(logData || [])
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const StatCard = ({ title, count, icon: Icon, color, href }) => (
    <Link href={href} className="block group">
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
        {/* Background Icon Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon className="w-24 h-24" style={{ color }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <span className="text-slate-500 font-medium">{title}</span>
          </div>
          <div className="text-4xl font-bold text-[#0A0A1A] mb-2">{count}</div>
          <div className="text-sm text-slate-400 group-hover:text-[#C0161C] transition-colors flex items-center gap-1 font-medium">
            Kelola Data <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <AdminLayout>
      <Head><title>Dashboard — Admin SMK Paramitha 2</title></Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A0A1A] mb-2">
            Selamat Datang, <span className="text-[#C0161C]">Admin</span>
          </h1>
          <p className="text-slate-500">
            Ringkasan aktivitas dan statistik website SMK Paramitha 2 Jakarta.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Jurusan" 
            count={loading ? '-' : stats.jurusan} 
            icon={Briefcase} 
            color="#C0161C"
            href="/admin/jurusan" 
          />
          <StatCard 
            title="Pendaftar PPDB" 
            count={loading ? '-' : stats.pendaftar} 
            icon={Users} 
            color="#1E1E8F"
            href="/admin/ppdb/pendaftar" 
          />
          <StatCard 
            title="Galeri Foto" 
            count={loading ? '-' : stats.galeri} 
            icon={ImageIcon} 
            color="#F5C400"
            href="/admin/tentang/galeri" 
          />
          <StatCard 
            title="Mitra Industri" 
            count={loading ? '-' : stats.mitra} 
            icon={Briefcase} 
            color="#10B981"
            href="/admin/mitra" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#0A0A1A] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#F5C400]" />
                  Aktivitas Terbaru
                </h3>
                <Link href="/admin/log" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Lihat Semua
                </Link>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-10 text-slate-400">Memuat aktivitas...</div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">Belum ada aktivitas tercatat.</div>
                ) : (
                  activities.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#F5C400]"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 font-medium">{log.action}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {log.target} • <span className="text-slate-400">{log.admin_email}</span>
                        </p>
                      </div>
                      <div className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleDateString('id-ID', { 
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-xl font-bold text-[#0A0A1A] mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#1E1E8F]" />
                Menu Cepat
              </h3>
              
              <div className="grid gap-3">
                {[
                  { label: 'Edit Hero & Slider', href: '/admin/beranda/hero', icon: BarChart3 },
                  { label: 'Kelola Fasilitas', href: '/admin/tentang/fasilitas', icon: Settings },
                  { label: 'Kelola Jurusan', href: '/admin/jurusan', icon: Briefcase },
                  { label: 'Kelola PPDB', href: '/admin/ppdb/pendaftar', icon: Users },
                  { label: 'Kelola Galeri', href: '/admin/tentang/galeri', icon: ImageIcon },
                  { label: 'Mitra Industri', href: '/admin/mitra', icon: Briefcase },
                ].map((item, idx) => (
                  <Link 
                    key={idx}
                    href={item.href}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-slate-400 group-hover:text-[#1E1E8F] transition-colors" />
                      <span className="text-slate-700 font-medium group-hover:text-[#1E1E8F]">{item.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1E1E8F] group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-[#1E1E8F]/5 to-[#C0161C]/5 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2">Butuh Bantuan?</h4>
                <p className="text-sm text-slate-500 mb-4">
                  Hubungi tim developer jika mengalami kendala teknis pada sistem admin.
                </p>
                <a href="mailto:support@paramitha.sch.id" className="text-sm font-semibold text-[#1E1E8F] hover:text-[#C0161C]">
                  Contact Support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function ArrowRight({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export default withAdmin(AdminDashboard)
