import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../services/supabase';
import { showToast } from '../../utils/toast';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import Head from 'next/head';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast.error('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast.error(error.message);
      setLoading(false);
    } else {
      showToast.success('Login successful!');
      router.push('/admin/dashboard');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast.error('Please enter your email first');
      return;
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/update-password`,
    });

    if (error) {
      showToast.error(error.message);
    } else {
      showToast.success('Password reset email sent!');
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - SMK Paramitha 2</title>
      </Head>
      
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden" data-section="admin-login/root" aria-label="Admin Login Root">
        {/* Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative z-10"
          data-section="admin-login/card"
          aria-label="Admin Login Card"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-2xl shadow-primary-200 mb-4 bg-white">
              <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Portal</h1>
            <p className="text-slate-500 text-sm">Sign in to manage your school website</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" data-section="admin-login/form" aria-label="Admin Login Form">
            <div className="space-y-2">
              <label className="text-slate-700 text-sm font-medium ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-all"
                  placeholder="admin@paramitha.sch.id"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 text-sm font-medium ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end" data-section="admin-login/reset-password" aria-label="Reset Password">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </motion.div>
        
        <div className="absolute bottom-6 text-slate-500 text-xs text-center w-full">
          &copy; {new Date().getFullYear()} SMK Paramitha 2 Jakarta. All rights reserved.
        </div>
      </div>
    </>
  );
}
