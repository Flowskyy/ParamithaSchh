import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getReport, initStorageBuckets, getActivityLog } from '../../services/api';
import { seedDatabase } from '../../utils/seed';
import { BookOpen, Users, Image as ImageIcon, Building, Database, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

function Dashboard() {
  const [stats, setStats] = useState({
    jurusan: 0,
    galeri: 0,
    testimonial: 0,
    fasilitas: 0,
    alumni: 0
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const router = useRouter();

  // Get current date for header
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Initialize buckets
        const bucketResult = await initStorageBuckets();
        if (!bucketResult.success) {
           console.error("Bucket Init Failed:", bucketResult.message);
           // Optional: toast.error("Storage buckets failed to initialize");
        }
        
        // Fetch stats and logs
        const [reportData, logData] = await Promise.all([
          getReport(),
          getActivityLog(5)
        ]);
        
        if (reportData) setStats(reportData);
        if (logData) setLogs(logData);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSeed = async () => {
    if (!confirm('Apakah Anda yakin ingin mengisi database dengan data dummy? Ini hanya akan mengisi data jika tabel kosong.')) return;
    
    setSeeding(true);
    const result = await seedDatabase();
    setSeeding(false);
    
    if (result.success) {
      toast.success(result.message);
      // Reload stats
      const data = await getReport();
      if (data) setStats(data);
    } else {
      toast.error('Gagal seeding database: ' + result.message);
    }
  };

  const statCards = [
    { 
      title: 'Total Jurusan', 
      value: stats.jurusan, 
      icon: BookOpen, 
      color: 'bg-[#C0161C]', // Merah
      textColor: 'text-[#C0161C]',
      bgColor: 'bg-red-50'
    },
    { 
      title: 'Total Fasilitas', 
      value: stats.fasilitas, 
      icon: Building, 
      color: 'bg-[#1E1E8F]', // Navy
      textColor: 'text-[#1E1E8F]',
      bgColor: 'bg-indigo-50'
    },
    { 
      title: 'Total Galeri', 
      value: stats.galeri, 
      icon: ImageIcon, 
      color: 'bg-[#F5C400]', // Emas
      textColor: 'text-[#F5C400]',
      bgColor: 'bg-yellow-50'
    },
    { 
      title: 'Total Alumni', 
      value: stats.alumni || 0, 
      icon: Users, 
      color: 'bg-green-600', // Hijau
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
  ];

  const quickActions = [
    { label: 'Kelola Jurusan', href: '/admin/jurusan', icon: BookOpen, color: 'text-[#C0161C]' },
    { label: 'Kelola Alumni', href: '/admin/alumni', icon: Users, color: 'text-green-600' },
    { label: 'Kelola Galeri', href: '/admin/galeri', icon: ImageIcon, color: 'text-[#F5C400]' },
    { label: 'Kelola Fasilitas', href: '/admin/fasilitas', icon: Building, color: 'text-[#1E1E8F]' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard - Admin Panel</title>
      </Head>
      
      <div className="bg-[#F8F9FF] min-h-screen p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Selamat Datang, Admin</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Clock size={14} />
              {today}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50 shadow-sm"
            >
              <Database size={16} />
              {seeding ? 'Seeding...' : 'Seed Database'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div variants={item} key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center ${card.textColor}`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.bgColor} ${card.textColor}`}>
                    +2.5%
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    {loading ? '...' : card.value}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <Link 
                        key={idx} 
                        href={action.href}
                        className="flex items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all group"
                      >
                        <div className={`p-3 rounded-lg bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all mr-4 ${action.color}`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 group-hover:text-[#1E1E8F] transition-colors">{action.label}</h4>
                          <p className="text-xs text-slate-400">Manage data</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
             </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#1E1E8F]" />
                      <div>
                        <p className="text-sm text-slate-800 font-medium">{log.action}</p>
                        <p className="text-xs text-slate-500">{log.target} • {new Date(log.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">Belum ada aktivitas tercatat</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(Dashboard);
