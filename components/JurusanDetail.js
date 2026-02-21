import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Briefcase, Phone, GraduationCap, Award, Users } from 'lucide-react';

const SectionHeader = ({ title, subtitle, center }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{title}</h2>
    {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

export default function JurusanDetail({ jurusan, sekolahInfo }) {
  if (!jurusan) return null;

  // Jika jurusan tidak aktif, tampilkan pesan tidak tersedia
  if (jurusan.aktif === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Jurusan Tidak Tersedia</h1>
          <p className="text-gray-600 mb-8">
            Mohon maaf, jurusan {jurusan.name} saat ini belum tersedia untuk pendaftaran baru.
          </p>
          <Link 
            href="/jurusan" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Lihat Jurusan Lain
          </Link>
        </div>
      </div>
    );
  }

  const { 
    name, 
    singkatan, 
    deskripsi, 
    warna_primer, 
    warna_sekunder, 
    kompetensi = [], 
    prospek_karir = [] 
  } = jurusan;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <>
      {/* 1. HERO FULLSCREEN */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${warna_primer} 0%, ${warna_sekunder} 100%)` 
        }}
      >
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex-1 text-white"
            >
              <motion.div variants={fadeInUp} className="inline-block mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold tracking-wider border border-white/30">
                  KOMPETENSI KEAHLIAN
                </span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {name}
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                {deskripsi}
              </motion.p>
              
              <motion.div variants={fadeInUp}>
                <Link 
                  href="/ppdb" 
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg group"
                  style={{ color: warna_primer }}
                >
                  Daftar Sekarang
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Badge Besar di Kanan Atas (Desktop) atau Tengah (Mobile) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:flex flex-col items-center justify-center w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative"
            >
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-white/30 animate-[spin_20s_linear_infinite]"></div>
              <span className="text-8xl md:text-9xl font-black text-white/90 tracking-tighter">
                {singkatan}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* 2. SECTION TENTANG */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Mengapa Memilih <span style={{ color: warna_primer }}>{name}</span>?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-gray-600 leading-relaxed mb-6">
                Program keahlian {name} di SMK Paramitha 2 dirancang untuk mencetak lulusan yang siap kerja dan kompeten. 
                Kurikulum kami disesuaikan dengan kebutuhan industri terkini, didukung fasilitas modern dan pengajar praktisi.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-gray-600 leading-relaxed">
                Siswa tidak hanya belajar teori, tetapi juga praktik langsung melalui Project Based Learning dan 
                program magang di perusahaan mitra terkemuka.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-4"
            >
              {[
                { icon: GraduationCap, title: "Kurikulum Industri", desc: "Materi pembelajaran update sesuai standar industri." },
                { icon: Users, title: "Pengajar Praktisi", desc: "Diajar langsung oleh ahli di bidangnya." },
                { icon: Award, title: "Sertifikasi Kompetensi", desc: "Lulusan dibekali sertifikat BNSP yang diakui." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeInUp}
                  className="p-6 rounded-xl bg-gray-50 border-l-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: warna_primer }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-white shadow-sm text-white" style={{ backgroundColor: warna_primer }}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SECTION KOMPETENSI */}
      <section className="py-20 bg-[#F8F8FF]">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Apa yang Dipelajari?" 
            subtitle={`Materi dan kompetensi utama jurusan ${name}`}
            center
          />
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {kompetensi.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 group"
                style={{ borderColor: warna_primer }}
              >
                <div className="mb-4 inline-flex p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <CheckCircle className="w-8 h-8" style={{ color: warna_primer }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[color:var(--hover-color)]" style={{ '--hover-color': warna_primer }}>
                  {item}
                </h3>
                <p className="text-gray-500">
                  Menguasai keahlian {item.toLowerCase()} secara mendalam dengan praktik intensif.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. SECTION PROSPEK KARIR */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Peluang Karir</h2>
            <p className="text-gray-600 text-lg">
              Lulusan {name} memiliki kesempatan luas untuk bekerja di berbagai sektor industri.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-4"
          >
            {prospek_karir.map((career, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="px-6 py-4 rounded-full border bg-white shadow-sm hover:shadow-md transition-all cursor-default flex items-center gap-3"
                style={{ borderColor: `${warna_primer}30` }}
              >
                <Briefcase className="w-5 h-5" style={{ color: warna_primer }} />
                <span className="text-lg font-medium text-gray-800">{career}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. CTA */}
      <section 
        className="py-20 text-white text-center"
        style={{ 
          background: `linear-gradient(to right, ${warna_primer}, ${warna_sekunder})` 
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap Bergabung?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Jadilah bagian dari {name} SMK Paramitha 2 dan raih masa depan gemilangmu sekarang juga.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/ppdb" 
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg"
                style={{ color: warna_primer }}
              >
                Daftar PPDB Online
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
