import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getReport, getVisitorSummary } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboardPage() {
  const [report, setReport] = useState({ pendaftar: 0, alumni: 0, mitra: 0, jurusan: 0 });
  const [visitorSummary, setVisitorSummary] = useState({ today: 0, week: 0, month: 0, deviceCounts: {}, logs: [] });

  useEffect(() => {
    async function load() {
      const data = await getReport();
      const visitors = await getVisitorSummary();
      setReport(data);
      setVisitorSummary(visitors);
    }
    load();
  }, []);

  const deviceData = Object.entries(visitorSummary.deviceCounts || {}).map(([name, value]) => ({ name, value }));

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-sm font-medium text-slate-500 uppercase">Pendaftar</h2>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{report.pendaftar}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-sm font-medium text-slate-500 uppercase">Alumni</h2>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{report.alumni}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-sm font-medium text-slate-500 uppercase">Mitra</h2>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{report.mitra}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-sm font-medium text-slate-500 uppercase">Jurusan</h2>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{report.jurusan}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Visitor Device Breakdown</h3>
            <span className="text-sm text-slate-500">Last 100 logs</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#CBD5E1' }} />
                <Bar dataKey="value" fill="#C0161C" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold">Quick Visitor Summary</h3>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Today</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{visitorSummary.today}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">This Week</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{visitorSummary.week}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">This Month</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{visitorSummary.month}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Latest Visitor Logs</h3>
          <span className="text-sm text-slate-500">Top recent activity</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">Time</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">IP</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">Device</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">OS</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">Browser</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(visitorSummary.logs || []).slice(0, 10).map((log) => (
                <tr key={log.id || `${log.ip}-${log.created_at}`}>
                  <td className="px-4 py-3 text-slate-700">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700 break-all">{log.ip || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{log.device_type || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{log.os_name || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{log.browser_name || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{log.current_url || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
