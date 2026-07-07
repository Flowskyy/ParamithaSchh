import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getVisitorLogs } from '../../services/api';

export default function VisitorLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function load() {
      setLogs(await getVisitorLogs(200) || []);
    }
    load();
  }, []);

  return (
    <AdminLayout title="Visitor Logs">
      <div className="rounded-xl bg-white border border-[rgba(0,0,0,0.08)] p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Visitor Logs</h2>
        <div className="overflow-x-auto rounded-xl border border-[rgba(0,0,0,0.08)]">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm rounded-xl overflow-hidden">
            <thead className="bg-[#1E1E8F]">
              <tr>
                <th className="px-4 py-3 font-medium text-white uppercase">Waktu</th>
                <th className="px-4 py-3 font-medium text-white uppercase">IP</th>
                <th className="px-4 py-3 font-medium text-white uppercase">Device</th>
                <th className="px-4 py-3 font-medium text-white uppercase">OS</th>
                <th className="px-4 py-3 font-medium text-white uppercase">Browser</th>
                <th className="px-4 py-3 font-medium text-white uppercase">URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-6 text-slate-500">Tidak ada log pengunjung.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id || `${log.ip}-${log.created_at}`} className="hover:bg-[#F8F8FF]">
                    <td className="px-4 py-3 text-slate-700">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-700 break-all">{log.ip || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{log.device_type || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{log.os_name || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{log.browser_name || '-'}</td>
                    <td className="px-4 py-3 text-slate-700 break-all">{log.current_url || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
