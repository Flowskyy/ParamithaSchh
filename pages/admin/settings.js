import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { supabase } from '../../services/supabase';
import { showToast } from '../../utils/toast';
import { Lock, Save } from 'lucide-react';

function Settings() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showToast.error(error.message);
    } else {
      showToast.success('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8" data-section="admin-settings/header" aria-label="Admin Settings Header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your account settings</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl" data-section="admin-settings/card" aria-label="Change Password Card">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
          <Lock size={20} className="text-primary-600" /> Change Password
        </h2>
        
        <form onSubmit={handleUpdatePassword} className="space-y-6" data-section="admin-settings/form" aria-label="Change Password Form">
          <div className="space-y-2">
            <label className="text-slate-700 text-sm font-bold">New Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-700 text-sm font-bold">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end pt-4" data-section="admin-settings/actions" aria-label="Form Actions">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/30 transform hover:-translate-y-0.5"
            >
              <Save size={18} /> {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(Settings);
