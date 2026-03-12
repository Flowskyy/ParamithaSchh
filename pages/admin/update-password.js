import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../services/supabase';
import { showToast } from '../../utils/toast';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have a session (recovery link logs user in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If no session, maybe token is invalid or expired
        showToast.error('Invalid or expired recovery link');
        router.push('/admin');
      }
    });
  }, [router]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showToast.error(error.message);
    } else {
      showToast.success('Password updated successfully! Please login.');
      await supabase.auth.signOut();
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Update Password - SMK Paramitha 2</title>
      </Head>
      
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden" data-section="admin-update-password/root" aria-label="Admin Update Password Root">
        {/* Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative z-10"
          data-section="admin-update-password/card"
          aria-label="Update Password Card"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-2xl shadow-primary-200 mb-4 bg-white">
              <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Update Password</h1>
            <p className="text-slate-500 text-sm">Enter your new password below</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5" data-section="admin-update-password/form" aria-label="Update Password Form">
            <div className="space-y-2">
              <label className="text-slate-700 text-sm font-medium ml-1">New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
