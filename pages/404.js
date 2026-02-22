import { motion } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Home, Phone } from 'lucide-react';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Halaman Tidak Ditemukan — SMK Paramitha 2</title>
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F8FF] px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.8 
            }}
            className="mb-8 relative"
          >
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-[#C0161C] to-[#1E1E8F] bg-clip-text text-transparent select-none leading-none">
              404
            </h1>
            
            {/* Bounce Animation Effect */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-10 -right-10 md:-right-20 text-[#F5C400] opacity-20"
            >
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
              Halaman yang kamu cari tidak ada atau sudah dipindahkan ke alamat lain.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/"
                className="px-8 py-3.5 bg-[#C0161C] text-white rounded-full font-bold text-lg hover:bg-[#a01217] transition-all hover:-translate-y-1 shadow-lg shadow-red-900/20 flex items-center gap-2 group w-full sm:w-auto justify-center"
              >
                <Home size={20} className="group-hover:scale-110 transition-transform" />
                Kembali ke Beranda
              </Link>
              
              <Link 
                href="/contact"
                className="px-8 py-3.5 bg-transparent border-2 border-[#1E1E8F] text-[#1E1E8F] rounded-full font-bold text-lg hover:bg-[#1E1E8F] hover:text-white transition-all hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Phone size={20} />
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
