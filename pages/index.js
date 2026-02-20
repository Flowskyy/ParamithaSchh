import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, CheckCircle, Quote } from 'lucide-react';
import Layout from '../components/Layout';
import SmartImage from '../components/SmartImage';
import { getSekolahInfo, getAlumni, getMitra } from '../services/api';
import { fallbackSekolahInfo, fallbackAlumni } from '../utils/fallbackData';

// --- Components ---
import WaveSeparator from '../components/WaveSeparator';

const Section = ({ children, className, id }) => (
  <section id={id} className={`relative py-20 ${className}`}>
    {children}
  </section>
);

// --- Main Page ---

export default function Home({ sekolahInfo, alumniList, mitraList }) {
  const info = sekolahInfo || fallbackSekolahInfo;
  const alumni = alumniList && alumniList.length > 0 ? alumniList : fallbackAlumni;
  const mitra = mitraList || [];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>SMK Paramitha 2 Jakarta — Masa Depan Dimulai Di Sini</title>
        <meta name="description" content="SMK Paramitha 2 Jakarta - Sekolah Pusat Keunggulan dengan fasilitas modern dan kurikulum berbasis industri." />
      </Head>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SmartImage 
            src="/images/Carousel.png" 
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

      {/* 2. SAMBUTAN KEPALA SEKOLAH */}
      <Section className="bg-white pb-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Photo */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/3 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-all duration-500">
                <SmartImage 
                  src={info.kepsek_photo || "/images/Kepsek.JPG"} 
                  alt={info.kepsek_name}
                  width={600}
                  height={800}
                  className="w-full h-auto"
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1E1E8F] to-transparent p-6 pt-20">
                  <h3 className="text-white text-xl font-bold">{info.kepsek_name}</h3>
                  <p className="text-white/80 text-sm">Kepala Sekolah</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#F5C400]/20 rounded-full -z-10 blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#C0161C]/10 rounded-full -z-10 blur-xl" />
            </motion.div>

            {/* Text */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-2/3"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-[#C0161C]" />
                <h2 className="text-[#1E1E8F] font-bold text-sm tracking-widest uppercase">Sambutan Kepala Sekolah</h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                Membangun Generasi <br/>
                <span className="text-[#C0161C]">Berkarakter & Kompeten</span>
              </h3>
              
              <div className="relative pl-8 border-l-4 border-[#F5C400] mb-8">
                <Quote className="absolute -top-2 -left-3 bg-white text-[#F5C400] p-1" size={24} />
                <p className="text-slate-600 text-lg italic leading-relaxed">
                  &quot;SMK Paramitha 2 berkomitmen untuk tidak hanya mencetak lulusan yang ahli dalam bidangnya, tetapi juga memiliki integritas moral yang tinggi. Kami percaya bahwa pendidikan adalah kunci untuk membuka pintu masa depan.&quot;
                </p>
              </div>

              <p className="text-slate-600 mb-8 leading-relaxed">
                Kami terus berinovasi dalam metode pembelajaran dan fasilitas untuk memastikan setiap siswa mendapatkan pengalaman belajar terbaik yang relevan dengan kebutuhan industri saat ini.
              </p>

              <Link href="/tentang/sambutan-kepsek" className="inline-flex items-center gap-2 text-[#1E1E8F] font-bold hover:text-[#C0161C] transition-colors group">
                Baca Selengkapnya
                <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
        <WaveSeparator position="bottom" color="#FFF8F8" height="100px" />
      </Section>

      {/* 4. TEACHING FACTORY */}
      <Section className="bg-[#FFF8F8] pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[#1E1E8F] font-bold tracking-widest uppercase mb-2">Proyek PKK Paramitha 2</h2>
            <h3 className="text-3xl md:text-4xl font-normal text-slate-900" style={{ fontFamily: '"Belleza", sans-serif' }}>
              Paramitha <span className="text-[#F5C400]">Tour & Travel</span>
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/3"
            >
              <h4 className="text-2xl font-bold text-[#1E1E8F] mb-4">Praktik Nyata Dunia Industri</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Unit produksi SMK Paramitha 2 yang bergerak di bidang layanan perjalanan wisata. Dikelola langsung oleh siswa dengan standar industri profesional.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-[#F5C400]" /> Ticketing Pesawat & Kereta
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-[#F5C400]" /> Paket Wisata Domestik
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-[#F5C400]" /> Pengurusan Dokumen Perjalanan
                </li>
              </ul>
              <a 
                href="https://paramithatourandtravel.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#1E1E8F] text-white rounded-lg font-semibold hover:bg-[#151560] transition-colors inline-flex items-center gap-2"
              >
                Kunjungi Website <ArrowRight size={18} />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-2/3 h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
            >
              <iframe 
                src="https://paramithatourandtravel.vercel.app/" 
                className="w-full h-full border-0"
                title="Paramitha Tour and Travel"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
        <WaveSeparator position="bottom" color="#F0F0FF" height="100px" />
      </Section>

      {/* 5. ALUMNI SECTION */}
      <Section className="bg-[#F0F0FF] pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[#C0161C] font-bold tracking-widest uppercase mb-2">Jejak Sukses</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Alumni Berprestasi</h3>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center">
            {alumni.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 max-w-[280px] mx-auto w-full"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <SmartImage 
                    src={item.foto_url || `https://ui-avatars.com/api/?name=${item.nama}&background=random`} 
                    alt={item.nama}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-4 relative">
                  {/* Jurusan Badge */}
                  <div className="absolute -top-3 right-4 bg-[#F5C400] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    {item.angkatan ? `Angkatan ${item.angkatan}` : 'Alumni'}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">{item.nama}</h4>
                  <p className="text-[#1E1E8F] text-xs font-medium mb-3 line-clamp-1">{item.jurusan}</p>
                  
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Karir Saat Ini</p>
                    <p className="font-bold text-slate-800 text-xs line-clamp-1">{item.perusahaan}</p>
                    <p className="text-slate-600 text-xs line-clamp-1">{item.jabatan || item.posisi}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <WaveSeparator position="bottom" color="#ffffff" height="100px" />
      </Section>

      {/* 6. MITRA INDUSTRI */}
      <Section className="bg-white pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[#1E1E8F] font-bold tracking-widest uppercase mb-2">Partner & Kerjasama</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Mitra Industri Kami</h3>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center justify-items-center"
          >
            {mitra.map((item) => (
              <motion.div 
                key={item.id}
                variants={fadeInUp}
                className="w-full max-w-[180px] h-24 relative group grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-105"
              >
                <div className="relative w-full h-full">
                  <SmartImage 
                    src={item.logo_url} 
                    alt={item.nama}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            ))}
            
            {mitra.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400">
                <p>Belum ada data mitra.</p>
              </div>
            )}
          </motion.div>
        </div>
      </Section>

      {/* 7. CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <WaveSeparator position="top" color="#ffffff" height="100px" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1E8F] to-[#C0161C]" />
        
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Siap Bergabung?</h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              Jadilah bagian dari keluarga besar SMK Paramitha 2 Jakarta. Wujudkan mimpimu bersama kami.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ppdb" className="px-8 py-4 bg-white text-[#C0161C] rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition-colors">
                Daftar PPDB Online
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
        <WaveSeparator position="bottom" color="#F8F8FF" height="100px" />
      </section>

    </Layout>
  );
}

export async function getServerSideProps() {
  const [sekolahInfo, alumniList, mitraList] = await Promise.all([
    getSekolahInfo(),
    getAlumni(),
    getMitra()
  ]);

  return {
    props: {
      sekolahInfo: sekolahInfo || null,
      alumniList: alumniList || [],
      mitraList: mitraList || [],
    },
  };
}
