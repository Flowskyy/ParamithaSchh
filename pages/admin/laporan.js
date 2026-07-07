import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getVisitorLogsByDate, getVisitorSummary, getWhatsappClicks } from '../../services/api';
import { Calendar, Filter, Download, BarChart3, Users, Eye, TrendingUp, MessageCircle } from 'lucide-react';

export default function LaporanPage() {
  const [logs, setLogs] = useState([]);
  const [whatsappClicks, setWhatsappClicks] = useState([]);
  const [summary, setSummary] = useState({ today: 0, week: 0, month: 0, deviceCounts: {} });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSummary();
    loadLogs();
    loadWhatsappClicks();
  }, []);

  const loadSummary = async () => {
    const data = await getVisitorSummary();
    setSummary(data);
  };

  const loadLogs = async (start = null, end = null) => {
    setLoading(true);
    try {
      const data = await getVisitorLogsByDate(start, end);
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWhatsappClicks = async (start = null, end = null) => {
    try {
      const data = await getWhatsappClicks(start, end);
      setWhatsappClicks(data || []);
    } catch (error) {
      console.error('Error loading WhatsApp clicks:', error);
    }
  };

  const handleFilter = () => {
    loadLogs(startDate, endDate);
    loadWhatsappClicks(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    loadLogs();
    loadWhatsappClicks();
  };

  const handleExport = () => {
    const csvContent = [
      ['Waktu', 'IP', 'Device', 'OS', 'Browser', 'URL'].join(','),
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString('id-ID'),
        log.ip || '-',
        log.device_type || '-',
        log.os_name || '-',
        log.browser_name || '-',
        log.current_url || '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `visitor-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const deviceData = Object.entries(summary.deviceCounts || {}).map(([name, value]) => ({ name, value }));

  return (
    <AdminLayout title="Laporan Pengunjung">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E8F]">Laporan Pengunjung</h1>
          <p className="text-slate-500 mt-1">Analisis data pengunjung website</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl border border-black/7 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-500">Hari Ini</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{summary.today}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/7 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-500">Minggu Ini</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{summary.week}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/7 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-500">Bulan Ini</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{summary.month}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/7 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-500">Total Log</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{logs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Click Stats */}
        <div className="bg-white rounded-xl border border-black/7 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-slate-900">Statistik Klik WhatsApp</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-700 font-medium">Total Klik WhatsApp</p>
              <p className="text-2xl md:text-3xl font-bold text-green-900 mt-2">{whatsappClicks.length}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Dari Form PPDB</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-900 mt-2">
                {whatsappClicks.filter(c => c.button_type === 'ppdb_form').length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">Dari Form Kontak</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-900 mt-2">
                {whatsappClicks.filter(c => c.button_type === 'contact_form').length}
              </p>
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-black/7 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Breakdown Perangkat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deviceData.map((item) => (
              <div key={item.name} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 capitalize">{item.name}</span>
                  <span className="text-lg font-bold text-[#1E1E8F]">{item.value}</span>
                </div>
                <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#C0161C] rounded-full"
                    style={{ width: `${(item.value / logs.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl border border-black/7 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Filter Tanggal</h3>
          </div>
          <div className="flex flex-col md:flex-wrap gap-4 items-end">
            <div className="w-full md:flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E1E8F] focus:border-transparent"
              />
            </div>
            <div className="w-full md:flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Akhir</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E1E8F] focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleFilter}
                disabled={loading}
                className="px-4 md:px-6 py-2 bg-[#1E1E8F] text-white rounded-lg hover:bg-[#1E1E8F]/90 transition-colors disabled:opacity-50 flex-1 sm:flex-none"
              >
                {loading ? 'Memuat...' : 'Filter'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 md:px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex-1 sm:flex-none"
              >
                Reset
              </button>
              <button
                onClick={handleExport}
                className="px-4 md:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visitor Logs Table */}
        <div className="bg-white rounded-xl border border-black/7 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Log Pengunjung</h3>
            <p className="text-sm text-slate-500 mt-1">Menampilkan {logs.length} data</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Waktu</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">IP</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Device</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">OS</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Browser</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">URL</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">Memuat data...</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">Tidak ada data pengunjung</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id || `${log.ip}-${log.created_at}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700">
                        {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 break-all hidden md:table-cell">{log.ip || '-'}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 capitalize">{log.device_type || '-'}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 hidden md:table-cell">{log.os_name || '-'}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 hidden md:table-cell">{log.browser_name || '-'}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 break-all max-w-[150px] md:max-w-none truncate">{log.current_url || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
