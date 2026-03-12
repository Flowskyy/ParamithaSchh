import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../services/supabase';
import { showToast } from '../../utils/toast';
import { Check, X, AlertTriangle, RefreshCw, Database, HardDrive, Shield } from 'lucide-react';

export default function DebugPage() {
  const [checks, setChecks] = useState({
    database: { status: 'pending', details: [] },
    storage: { status: 'pending', details: [] },
    auth: { status: 'pending', details: null },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    const newChecks = {
      database: { status: 'pending', details: [] },
      storage: { status: 'pending', details: [] },
      auth: { status: 'pending', details: null },
    };

    // 1. Check Auth
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      newChecks.auth = {
        status: session ? 'success' : 'warning',
        details: session ? `Logged in as ${session.user.email}` : 'No active session (Guest)',
      };
    } catch (e) {
      newChecks.auth = { status: 'error', details: e.message };
    }

    // 2. Check Database Tables
    const tables = ['hero', 'sekolah_info', 'jurusan', 'fasilitas', 'galeri', 'alumni', 'mitra_perusahaan', 'testimonial', 'slider_images'];
    const dbDetails = [];
    let dbSuccess = true;

    for (const table of tables) {
      try {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
          dbDetails.push({ name: table, status: 'error', message: error.message });
          dbSuccess = false;
        } else {
          dbDetails.push({ name: table, status: 'success', message: `${count} rows` });
        }
      } catch (e) {
        dbDetails.push({ name: table, status: 'error', message: e.message });
        dbSuccess = false;
      }
    }
    newChecks.database = { status: dbSuccess ? 'success' : 'error', details: dbDetails };

    // 3. Check Storage Buckets
    const requiredBuckets = ['hero', 'jurusan', 'fasilitas', 'galeri', 'alumni', 'carousel', 'media', 'mitra', 'testimonial', 'images'];
    const storageDetails = [];
    let storageSuccess = true;

    // We check each bucket individually by trying to list its content.
    // This is more reliable than listBuckets() which often requires special permissions.
    for (const bucket of requiredBuckets) {
      try {
        // Try to list files in the bucket (limit 1) to verify access
        const { data, error } = await supabase.storage.from(bucket).list(null, { limit: 1 });
        
        if (error) {
           // If error is specifically "Bucket not found", then it's missing.
           if (error.message.includes('Bucket not found')) {
             storageDetails.push({ name: bucket, status: 'error', message: 'Bucket not found' });
             storageSuccess = false;
             
             // Attempt to create if missing (only works if policy allows, usually fails for anon)
             try {
               const { error: createError } = await supabase.storage.createBucket(bucket, { public: true });
               if (!createError) {
                 storageDetails[storageDetails.length - 1].message = 'Created successfully';
                 storageDetails[storageDetails.length - 1].status = 'success';
                 storageSuccess = true; // Recovered
               }
             } catch (e) {
               // ignore create error
             }
           } else {
             storageDetails.push({ name: bucket, status: 'warning', message: `Access Error: ${error.message}` });
             // We don't mark as failure for RLS errors if we can't be sure, but usually access error means we can't use it.
             // However, for "new row violates...", that's creation. Here we are listing.
             storageSuccess = false;
           }
        } else {
           storageDetails.push({ name: bucket, status: 'success', message: 'Accessible' });
        }
      } catch (e) {
        storageDetails.push({ name: bucket, status: 'error', message: `Exception: ${e.message}` });
        storageSuccess = false;
      }
    }
    newChecks.storage = { status: storageSuccess ? 'success' : 'error', details: storageDetails };

    setChecks(newChecks);
    setLoading(false);
  };

  const StatusIcon = ({ status }) => {
    if (status === 'success') return <Check className="text-green-500" size={20} />;
    if (status === 'warning') return <AlertTriangle className="text-yellow-500" size={20} />;
    if (status === 'error') return <X className="text-red-500" size={20} />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-slate-400 animate-spin" />;
  };

  const hasRLSError = 
    checks.database.details.some(d => d.message?.includes('row-level security')) ||
    checks.storage.details.some(d => d.message?.includes('row-level security'));

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8" data-section="admin-debug/root" aria-label="Admin Debug Root">
        <div className="flex items-center justify-between" data-section="admin-debug/header" aria-label="System Diagnostics Header">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Diagnostics</h1>
            <p className="text-slate-500">Check connection status for Database and Storage</p>
          </div>
          <button 
            onClick={runDiagnostics} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Run Checks</span>
          </button>
        </div>

        {hasRLSError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm" data-section="admin-debug/rls-warning" aria-label="RLS Policy Warning">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-red-800">RLS Policy Errors Detected</h3>
                <p className="text-red-700 text-sm mt-1">
                  Database tables or Storage buckets are blocked by Row-Level Security policies.
                  This prevents saving data and uploading images.
                </p>
                <div className="mt-3 bg-white p-3 rounded border border-red-200 text-xs font-mono text-slate-600 overflow-x-auto">
                  Please run the content of <strong>supabase_fix_tables.sql</strong> in your Supabase SQL Editor.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" data-section="admin-debug/auth" aria-label="Authentication Status">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-[#1E1E8F]" size={24} />
            <h2 className="text-lg font-bold text-slate-900">Authentication</h2>
            <div className="ml-auto"><StatusIcon status={checks.auth.status} /></div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg text-sm font-mono">
            {checks.auth.details || 'Checking...'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" data-section="admin-debug/database" aria-label="Database Tables Status">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-[#1E1E8F]" size={24} />
            <h2 className="text-lg font-bold text-slate-900">Database Tables</h2>
            <div className="ml-auto"><StatusIcon status={checks.database.status} /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checks.database.details.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100" data-section="admin-debug/database-item" aria-label={`Database ${item.name}`}>
                <span className="font-medium text-slate-700">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{item.message}</span>
                  <StatusIcon status={item.status} />
                </div>
              </div>
            ))}
            {checks.database.details.length === 0 && <div className="text-slate-400 italic">No checks run yet</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6" data-section="admin-debug/storage" aria-label="Storage Buckets Status">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive className="text-[#1E1E8F]" size={24} />
            <h2 className="text-lg font-bold text-slate-900">Storage Buckets</h2>
            <div className="ml-auto"><StatusIcon status={checks.storage.status} /></div>
          </div>
          <div className="space-y-3">
            {checks.storage.details.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100" data-section="admin-debug/storage-item" aria-label={`Bucket ${item.name}`}>
                <span className="font-medium text-slate-700">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{item.message}</span>
                  <StatusIcon status={item.status} />
                </div>
              </div>
            ))}
             {checks.storage.details.length === 0 && <div className="text-slate-400 italic">No checks run yet</div>}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
