import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { getReport, getVisitorSummary, getJurusan, getFasilitas, getGaleri, getAlumni, getMitra } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  Briefcase, 
  Users, 
  Settings, 
  Image as ImageIcon, 
  Eye,
  Calendar
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    jurusan: 0,
    fasilitas: 0,
    galeri: 0,
    alumni: 0,
    mitra: 0,
  });
  const [visitorSummary, setVisitorSummary] = useState({ today: 0, week: 0, month: 0, deviceCounts: {}, logs: [] });

  useEffect(() => {
    async function load() {
      const [jurusanData, fasilitasData, galeriData, alumniData, mitraData, visitors] = await Promise.all([
        getJurusan(),
        getFasilitas(),
        getGaleri(),
        getAlumni(),
        getMitra(),
        getVisitorSummary(),
      ]);

      setStats({
        jurusan: Array.isArray(jurusanData) ? jurusanData.length : 0,
        fasilitas: Array.isArray(fasilitasData) ? fasilitasData.length : 0,
        galeri: Array.isArray(galeriData) ? galeriData.length : 0,
        alumni: Array.isArray(alumniData) ? alumniData.length : 0,
        mitra: Array.isArray(mitraData) ? mitraData.length : 0,
      });
      setVisitorSummary(visitors);
    }
    load();
  }, []);

  const deviceData = Object.entries(visitorSummary.deviceCounts || {}).map(([name, value]) => ({ name, value }));

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E8F]">
            Selamat Datang, <span className="text-[#C0161C]">Admin</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Ringkasan aktivitas dan statistik website SMK Paramitha 2 Jakarta.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Briefcase}
            label="Jurusan"
            value={stats.jurusan}
            href="/admin/jurusan"
            iconColor="red"
            watermarkIcon={Briefcase}
          />
          <StatCard
            icon={Settings}
            label="Fasilitas"
            value={stats.fasilitas}
            href="/admin/fasilitas"
            iconColor="yellow"
            watermarkIcon={Settings}
          />
          <StatCard
            icon={ImageIcon}
            label="Galeri Foto"
            value={stats.galeri}
            href="/admin/galeri"
            iconColor="green"
            watermarkIcon={ImageIcon}
          />
          <StatCard
            icon={Users}
            label="Alumni"
            value={stats.alumni}
            href="/admin/alumni"
            iconColor="blue"
            watermarkIcon={Users}
          />
          <StatCard
            icon={Briefcase}
            label="Mitra Industri"
            value={stats.mitra}
            href="/admin/mitra"
            iconColor="red"
            watermarkIcon={Briefcase}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Visitor Device Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-black/7 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Visitor Device Breakdown</h3>
              <span className="text-sm text-slate-500">Last 100 logs</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#E2E8F0', fontSize: 12 }} />
                  <Bar dataKey="value" fill="#C0161C" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Visitor Summary */}
          <div className="bg-white rounded-xl border border-black/7 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Visitor Summary</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Eye className="text-[#1E1E8F]" size={20} />
                  <div>
                    <p className="text-sm text-slate-500">Today</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{visitorSummary.today}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#C0161C]" size={20} />
                  <div>
                    <p className="text-sm text-slate-500">This Week</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{visitorSummary.week}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#1E1E8F]" size={20} />
                  <div>
                    <p className="text-sm text-slate-500">This Month</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{visitorSummary.month}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Logs Table */}
        <div className="bg-white rounded-xl border border-black/7 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Latest Visitor Logs</h3>
            <p className="text-sm text-slate-500 mt-1">Top recent activity</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">IP</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Device</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">OS</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Browser</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Page</th>
                </tr>
              </thead>
              <tbody>
                {(visitorSummary.logs || []).slice(0, 10).map((log) => (
                  <tr key={log.id || `${log.ip}-${log.created_at}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-slate-700">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-700 break-all">{log.ip || '-'}</td>
                    <td className="py-3 px-4 text-slate-700">{log.device_type || '-'}</td>
                    <td className="py-3 px-4 text-slate-700">{log.os_name || '-'}</td>
                    <td className="py-3 px-4 text-slate-700">{log.browser_name || '-'}</td>
                    <td className="py-3 px-4 text-slate-700">{log.current_url || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
