import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SmartImage from '../SmartImage';
import WaveSeparator from '../WaveSeparator';

export default function HeroSection({ info }) {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <SmartImage 
          src={info.hero_image || "/images/Carousel.png"} 
          alt="Hero Background" 
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Overlay Gradient */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ background: 'linear-gradient(135deg, rgba(30,30,143,0.85) 0%, rgba(192,22,28,0.75) 100%)' }} 
      />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 pt-20 text-center text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.span variants={fadeInUp} className="inline-block py-2 px-4 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm mb-6 text-sm md:text-base font-semibold tracking-wider uppercase text-[#F5C400]">
            Selamat Datang di SMK Paramitha 2
          </motion.span>
          
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Masa Depan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C400] to-orange-300">Dimulai Di Sini</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Mencetak generasi unggul, kompeten, dan berkarakter siap kerja di era industri 4.0 dengan fasilitas modern dan kurikulum terintegrasi.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/ppdb" className="group px-8 py-4 bg-[#C0161C] hover:bg-[#a01217] text-white rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-red-900/30 flex items-center gap-2">
              Daftar Sekarang
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/jurusan" className="group px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1E1E8F] rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center gap-2">
              Jelajahi Jurusan
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={32} className="text-white/70" />
        </motion.div>
      </div>

      <WaveSeparator position="bottom" color="#ffffff" height="100px" />
    </section>
  );
}
