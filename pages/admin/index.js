import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
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
      
      <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4F8EF7]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F97316]/10 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0f0f1a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl shadow-[#4F8EF7]/20 mb-4 bg-white">
              <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Sign in to manage your school website</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080810]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] focus:outline-none transition-all"
                  placeholder="admin@paramitha.sch.id"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080810]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7] focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm text-[#4F8EF7] hover:text-[#4F8EF7]/80 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F8EF7] hover:bg-[#3b7acf] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#4F8EF7]/25 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </motion.div>
        
        <div className="absolute bottom-6 text-slate-600 text-xs text-center w-full">
          &copy; {new Date().getFullYear()} SMK Paramitha 2 Jakarta. All rights reserved.
        </div>
      </div>
    </>
  );
}
