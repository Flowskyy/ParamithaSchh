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
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Visitor Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">Waktu</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">IP</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">Device</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">OS</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">Browser</th>
                <th className="px-4 py-3 font-medium text-slate-500 uppercase">URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-6 text-slate-500">Tidak ada log pengunjung.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id || `${log.ip}-${log.created_at}`}>
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
