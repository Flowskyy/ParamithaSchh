import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getReport } from '../../services/api';
import { seedDatabase } from '../../utils/seed';
import { BookOpen, Users, ImageIcon, Building, Database, ArrowRight } from 'lucide-react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

function Dashboard() {
  const [stats, setStats] = useState({
    jurusan: 0,
    galeri: 0,
    testimonial: 0,
    fasilitas: 0
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadStats() {
      const data = await getReport();
      if (data) setStats(data);
      setLoading(false);
    }
    loadStats();
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
    { title: 'Total Jurusan', value: stats.jurusan, icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Total Galeri', value: stats.galeri, icon: ImageIcon, color: 'bg-purple-500' },
    { title: 'Total Fasilitas', value: stats.fasilitas, icon: Building, color: 'bg-green-500' },
    { title: 'Testimonial', value: stats.testimonial, icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard - Admin Panel</title>
      </Head>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Selamat datang kembali, Admin!</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Database size={16} />
            {seeding ? 'Seeding...' : 'Seed Database'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center text-white shadow-lg shadow-${card.color.replace('bg-', '')}/30`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => router.push('/admin/jurusan')} className="p-4 border border-slate-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all text-left group">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 group-hover:text-primary-700">Tambah Jurusan</span>
                <BookOpen size={20} className="text-slate-400 group-hover:text-primary-500" />
              </div>
              <p className="text-sm text-slate-500">Kelola daftar kompetensi keahlian</p>
            </button>
            <button onClick={() => router.push('/admin/galeri')} className="p-4 border border-slate-100 rounded-xl hover:border-purple-200 hover:bg-purple-50 transition-all text-left group">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 group-hover:text-purple-700">Upload Galeri</span>
                <ImageIcon size={20} className="text-slate-400 group-hover:text-purple-500" />
              </div>
              <p className="text-sm text-slate-500">Tambahkan foto kegiatan terbaru</p>
            </button>
            <button onClick={() => router.push('/admin/fasilitas')} className="p-4 border border-slate-100 rounded-xl hover:border-green-200 hover:bg-green-50 transition-all text-left group">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 group-hover:text-green-700">Update Fasilitas</span>
                <Building size={20} className="text-slate-400 group-hover:text-green-500" />
              </div>
              <p className="text-sm text-slate-500">Perbarui sarana prasarana</p>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Butuh Bantuan?</h3>
            <p className="text-primary-100 mb-6 text-sm">
              Jika mengalami kendala teknis, silakan hubungi tim pengembang.
            </p>
            <a href="mailto:support@example.com" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Hubungi Support <ArrowRight size={16} />
            </a>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <BookOpen size={120} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(Dashboard);
