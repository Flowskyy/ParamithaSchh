import Head from 'next/head';
import { useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Section from '../components/Section';
import SmartImage from '../components/SmartImage';
import { motion, useScroll, useTransform, useSpring, useInView, animate } from 'framer-motion';
import { ArrowRight, Play, Award, CheckCircle, Music, Star, ChevronDown, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

// Counter Component
function Counter({ from = 0, to, duration = 2, suffix = '' }) {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    const node = nodeRef.current;
    if (inView) {
      const controls = animate(from, to, {
        duration,
        onUpdate(value) {
          node.textContent = Math.floor(value) + suffix;
        },
      });
      return () => controls.stop();
    }
  }, [inView, from, to, duration, suffix]);

  return <span ref={nodeRef} className="tabular-nums">{from}</span>;
}

import { 
  getHero, 
  getJurusan, 
  getFasilitas, 
  getAlumni, 
  getMitra,
  getSekolahInfo 
} from '../services/api';
import { 
  fallbackHero, 
  fallbackJurusan, 
  fallbackFasilitas, 
  fallbackAlumni, 
  fallbackMitra,
  fallbackSekolahInfo
} from '../utils/fallbackData';

export default function Home({ hero, jurusan, fasilitas, alumni, mitra, sekolahInfo }) {
  const heroData = hero || fallbackHero;
  const jurusanList = jurusan && jurusan.length > 0 ? jurusan : fallbackJurusan;
  const fasilitasList = fasilitas && fasilitas.length > 0 ? fasilitas : fallbackFasilitas;
  const info = sekolahInfo || fallbackSekolahInfo;
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Layout>
      <Head>
        <title>SMK Paramitha 2 Jakarta — Sekolah Pusat Keunggulan</title>
        <meta name="description" content="SMK Paramitha 2 Jakarta - Mencetak Generasi PINK JITU (Profesional, Inovatif, Nasionalis, Kompeten, Jujur, Iman, Tangguh, Unggul)" />
      </Head>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* HERO SECTION - FUTURISTIC */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <SmartImage 
            src="/images/Carousel.png" 
            alt="Hero Background" 
            fill 
            priority
            style={{ objectFit: 'cover' }}
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />
          
          {/* Animated Particles/Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3], 
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2], 
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-bold mb-8 backdrop-blur-md uppercase tracking-wider">
                <Star size={14} className="fill-current" /> Sekolah Pusat Keunggulan
              </span>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
                Masa Depan <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400 animate-gradient bg-300%">
                  Dimulai Di Sini
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto font-light">
                {heroData.subtitle || "Mencetak generasi unggul dengan kompetensi standar industri dan karakter berakhlak mulia."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/ppdb" className="group relative px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(79,142,247,0.5)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Daftar Sekarang <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                
                <Link href="#jurusan" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                  Jelajahi Jurusan
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </div>

      {/* MOTTO SECTION - PINK JITU */}
      <section className="relative py-24 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-primary-500 uppercase tracking-[0.2em] mb-4">Nilai-Nilai Utama</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white">Motto <span className="text-primary-500">PINK JITU</span></h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* PINK */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                  <h4 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6">PINK</h4>
                  <ul className="space-y-4">
                    {[
                      { l: 'P', t: 'rofesional', d: 'Bekerja dengan keahlian tinggi' },
                      { l: 'I', t: 'novatif', d: 'Selalu menciptakan kebaruan' },
                      { l: 'N', t: 'asionalis', d: 'Cinta tanah air dan bangsa' },
                      { l: 'K', t: 'ompeten', d: 'Menguasai bidang keahlian' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold">{item.l}</span>
                        <div>
                          <strong className="text-white block">{item.t}</strong>
                          <span className="text-slate-400 text-sm">{item.d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* JITU */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                  <h4 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 mb-6">JITU</h4>
                  <ul className="space-y-4">
                    {[
                      { l: 'J', t: 'ujur', d: 'Integritas dalam tindakan' },
                      { l: 'I', t: 'man', d: 'Berlandaskan ketuhanan' },
                      { l: 'T', t: 'angguh', d: 'Kuat menghadapi tantangan' },
                      { l: 'U', t: 'nggul', d: 'Terbaik dalam prestasi' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">{item.l}</span>
                        <div>
                          <strong className="text-white block">{item.t}</strong>
                          <span className="text-slate-400 text-sm">{item.d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARS SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="w-full md:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square rounded-full bg-slate-100 flex items-center justify-center border-[20px] border-slate-50 shadow-inner"
              >
                <div className="absolute inset-0 rounded-full border border-slate-200 animate-[spin_10s_linear_infinite]" />
                <div className="text-center z-10">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary-600/30">
                    <Music size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Mars SMK Paramitha</h3>
                  <p className="text-slate-500 mt-2">Pembangkit Semangat Juang</p>
                </div>
                
                {/* Floating notes */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                    className="absolute text-primary-400"
                    style={{ 
                      left: `${20 + i * 20}%`, 
                      top: `${30 + i * 10}%` 
                    }}
                  >
                    <Music size={20} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-slate-900 mb-8 border-l-4 border-primary-600 pl-6">
                  Lirik Mars
                </h2>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium italic">
                  <p>
                    &quot;Kami Para Putra-Putri Siswa Paramitha<br/>
                    Pewaris Penerus Cita Pembangunan Negara<br/>
                    Kami Semua Berusaha Tuk Mencapai Cita-Cita<br/>
                    Giat Belajar Bekerja Berjuang Bersama Gembira&quot;
                  </p>
                  <p>
                    &quot;Sekolah Menengah Industri Pariwisata<br/>
                    Serta Teknologi Informatika<br/>
                    Dibina Dididik Jiwa Raganya<br/>
                    Agar Berguna Tuk Nusa Bangsa&quot;
                  </p>
                  <p className="font-bold text-primary-700">
                    &quot;Dunia Usaha Kita Memanggil Kita Semua<br/>
                    Marilah Giat Belajar<br/>
                    Jayalah Paramitha Kita<br/>
                    Marilah Giat Belajar<br/>
                    Jayalah Paramitha Kita&quot;
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG SEKOLAH (SHORT PROFILE) */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Tentang SMK Paramitha 2</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              SMK Paramitha 2 Jakarta adalah lembaga pendidikan kejuruan yang berkomitmen mencetak lulusan 
              siap kerja dengan kompetensi unggul di bidang Teknologi dan Pariwisata. 
              Didukung fasilitas modern dan tenaga pengajar profesional, kami siap mengantarkan siswa 
              menuju gerbang kesuksesan di dunia industri maupun wirausaha.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <h4 className="text-3xl font-bold text-primary-600 mb-1">A</h4>
                <p className="text-sm text-slate-500">Akreditasi</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <h4 className="text-3xl font-bold text-primary-600 mb-1">SPK</h4>
                <p className="text-sm text-slate-500">Sekolah Pusat Keunggulan</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <h4 className="text-3xl font-bold text-primary-600 mb-1">
                  <Counter to={jurusanList.length} />
                </h4>
                <p className="text-sm text-slate-500">Program Keahlian</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <h4 className="text-3xl font-bold text-primary-600 mb-1">
                  <Counter to={1000} suffix="+" />
                </h4>
                <p className="text-sm text-slate-500">Lulusan Kompeten</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JURUSAN SECTION */}
      <Section id="jurusan" title="Program Keahlian" subtitle="Pilih jurusan sesuai minat dan bakatmu" className="bg-slate-900 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jurusanList.map((item, idx) => (
            <Link href={`/jurusan/${item.slug}`} key={item.id} className="group perspective">
              <motion.div 
                whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-slate-800 border border-slate-700"
              >
                {/* Image */}
                <SmartImage 
                  src={item.image_url} 
                  alt={item.title} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-lg mb-2">
                      {item.singkatan || 'JURUSAN'}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight mb-2">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    {item.short_desc}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 flex items-center text-primary-400 text-sm font-bold gap-2">
                    Selengkapnya <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Section>

      {/* PROJECT PKK SECTION */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/3">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Project Kreatif & Kewirausahaan</h2>
              <p className="text-lg text-slate-600 mb-8">
                Siswa kami tidak hanya belajar teori, tetapi juga praktik langsung membuat produk dan layanan nyata. Salah satu karya terbaik siswa jurusan ULW adalah Paramitha Tour & Travel.
              </p>
              <Link 
                href="https://paramithatourandtravel.vercel.app/" 
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Kunjungi Website <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="w-full lg:w-2/3">
              <motion.div 
                whileHover={{ y: -10 }}
                className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white"
              >
                <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-white px-4 py-1 rounded text-xs text-slate-400 flex-1 text-center font-mono border border-slate-200 mx-4">
                    paramithatourandtravel.vercel.app
                  </div>
                </div>
                <div className="relative h-[400px] w-full bg-slate-50">
                   <iframe 
                      src="https://paramithatourandtravel.vercel.app/" 
                      title="Paramitha Tour & Travel"
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FASILITAS HIGHLIGHT */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fasilitas Modern</h2>
            <p className="text-slate-500">Menunjang kegiatan belajar mengajar dengan teknologi terkini</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fasilitasList.slice(0, 4).map((item, idx) => (
              <motion.div 
                key={item.id || idx}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-2xl overflow-hidden group"
              >
                <SmartImage 
                  src={item.image_url} 
                  alt={item.title} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/tentang/fasilitas" className="text-primary-600 font-bold hover:underline">
              Lihat Semua Fasilitas
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Siap Bergabung?</h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Jadilah bagian dari keluarga besar SMK Paramitha 2 Jakarta dan raih masa depan gemilang bersama kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ppdb" className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold text-lg shadow-xl hover:bg-slate-100 transition-colors">
              Daftar PPDB Online
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-primary-700 text-white border border-primary-500 rounded-full font-bold text-lg hover:bg-primary-800 transition-colors">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [hero, jurusan, fasilitas, alumni, mitra, sekolahInfo] = await Promise.all([
      getHero(),
      getJurusan(),
      getFasilitas(),
      getAlumni(),
      getMitra(),
      getSekolahInfo()
    ]);

    return {
      props: {
        hero: hero || null,
        jurusan: jurusan || null,
        fasilitas: fasilitas || null,
        alumni: alumni || null,
        mitra: mitra || null,
        sekolahInfo: sekolahInfo || null
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        hero: null,
        jurusan: null,
        fasilitas: null,
        alumni: null,
        mitra: null,
        sekolahInfo: null
      }
    };
  }
}