import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getActivityLog } from '../../services/api';

function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const data = await getActivityLog();
      if (data) setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
          <p className="text-slate-500">Track system changes and user actions</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold">Action</th>
                <th className="p-4 font-bold">Description</th>
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="text-slate-600 text-sm hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{log.action}</span>
                  </td>
                  <td className="p-4">{log.details || '-'}</td>
                  <td className="p-4 text-slate-500 text-xs font-mono">{log.user_email || 'System'}</td>
                  <td className="p-4 text-slate-500">{new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-500">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(ActivityLog);
