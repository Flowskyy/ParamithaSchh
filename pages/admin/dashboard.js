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

      <div className="max-w-7xl mx-auto" data-section="admin-dashboard/main" aria-label="Admin Dashboard Main">
        {/* Header */}
        <div className="mb-8" data-section="admin-dashboard/header" aria-label="Admin Dashboard Header">
          <h1 className="text-3xl font-bold text-[#0A0A1A] mb-2">
            Selamat Datang, <span className="text-[#C0161C]">Admin</span>
          </h1>
          <p className="text-slate-500">
            Ringkasan aktivitas dan statistik website SMK Paramitha 2 Jakarta.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-section="admin-dashboard/stats-row-1" aria-label="Statistik Utama">
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
            title="Fasilitas" 
            count={loading ? '-' : stats.fasilitas} 
            icon={Settings} 
            color="#F5C400"
            href="/admin/fasilitas" 
          />
          <StatCard 
            title="Galeri Foto" 
            count={loading ? '-' : stats.galeri} 
            icon={ImageIcon} 
            color="#10B981"
            href="/admin/galeri" 
          />
        </div>
        
        {/* Second Row Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-section="admin-dashboard/stats-row-2" aria-label="Statistik Tambahan">
          <StatCard 
            title="Alumni" 
            count={loading ? '-' : stats.alumni} 
            icon={Users} 
            color="#6366F1"
            href="/admin/alumni" 
          />
           <StatCard 
            title="Mitra Industri" 
            count={loading ? '-' : stats.mitra} 
            icon={Briefcase} 
            color="#EC4899"
            href="/admin/mitra" 
          />
          <StatCard 
            title="Testimonial" 
            count={loading ? '-' : stats.testimonial} 
            icon={FileText} 
            color="#8B5CF6"
            href="/admin/testimonial" 
          />
          <StatCard 
            title="Total Laporan" 
            count={loading ? '-' : (stats.jurusan + stats.galeri + stats.testimonial + stats.fasilitas + stats.alumni + stats.mitra)} 
            icon={BarChart3} 
            color="#F97316"
            href="/admin/report" 
          />
        </div>

        {/* Activity Log Section */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6" data-section="admin-dashboard/activity-log" aria-label="Log Aktivitas Terbaru">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#0A0A1A] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#C0161C]" />
              Aktivitas Terbaru
            </h2>
            <Link href="/admin/log" className="text-sm font-medium text-[#C0161C] hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Belum ada aktivitas tercatat.</p>
            ) : (
              activities.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100" data-section="admin-dashboard/activity-item" aria-label={`Aktivitas ${log.action}`}>
                  <div className="p-2 bg-white rounded-full border border-slate-100 shadow-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[#0A0A1A] font-medium">{log.action}</p>
                    <p className="text-sm text-slate-500 mb-1">
                      {log.target} <span className="text-slate-300">•</span> <span className="text-slate-400">{log.admin_email}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(log.created_at).toLocaleString('id-ID', { 
                        dateStyle: 'medium', 
                        timeStyle: 'short' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default withAdmin(AdminDashboard)
