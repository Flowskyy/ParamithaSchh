import Head from 'next/head';
import Layout from '../components/Layout';
import Section from '../components/Section';
import SmartImage from '../components/SmartImage';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Quote, Building2, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { 
  getHero, 
  getJurusan, 
  getFasilitas, 
  getAlumni, 
  getMitra,
  getCarousel 
} from '../services/api';
import { 
  fallbackHero, 
  fallbackJurusan, 
  fallbackFasilitas, 
  fallbackAlumni, 
  fallbackMitra 
} from '../utils/fallbackData';
import { useState } from 'react';

export default function Home({ hero, jurusan, fasilitas, alumni, mitra, carousel }) {
  // Use hero data or fallback
  const heroData = hero || fallbackHero;
  const jurusanList = jurusan && jurusan.length > 0 ? jurusan : fallbackJurusan;
  const fasilitasList = fasilitas && fasilitas.length > 0 ? fasilitas : fallbackFasilitas;
  const alumniList = alumni && alumni.length > 0 ? alumni : fallbackAlumni;
  const mitraList = mitra && mitra.length > 0 ? mitra : fallbackMitra;
  
  // Only active mitra
  const activeMitra = mitraList.filter(m => m.aktif !== false).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image/Slider */}
        <div className="absolute inset-0 z-0">
          <SmartImage 
            src="/images/Carousel.png" 
            alt="Hero Background" 
            fill 
            priority
            style={{ objectFit: 'cover' }}
          />
          {/* Subtle overlay for text readability only */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white border border-white/20 text-sm font-bold mb-6 backdrop-blur-md">
              SEKOLAH PUSAT KEUNGGULAN
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-sans text-white mb-4 leading-tight drop-shadow-lg">
              Selamat Datang di <br/>
              <span className="text-primary-400">SMK Paramitha 2 Jakarta</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-10 leading-relaxed max-w-2xl drop-shadow-md font-medium">
              {heroData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/pendaftaran" className="px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2">
                Daftar Sekarang <ArrowRight size={20} />
              </Link>
              <Link href="#jurusan" className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center">
                Lihat Jurusan
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Project PKK Section */}
      <section className="bg-slate-50 py-16 md:py-24 w-full">
        <div className="container mx-auto px-6 mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Project PKK</h2>
            <p className="text-lg text-slate-500">Produk Kreatif dan Kewirausahaan Siswa</p>
        </div>
        
        <div className="w-full bg-slate-900 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-700 max-w-6xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                  {/* Browser Header */}
                  <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="bg-slate-900 px-4 py-1 rounded-md text-xs text-slate-400 flex-1 text-center font-mono border border-slate-700 mx-4 truncate">
                      paramithatourandtravel.vercel.app
                    </div>
                  </div>
                  {/* Iframe */}
                  <div className="relative w-full h-[500px] md:h-[700px]">
                    <iframe 
                      src="https://paramithatourandtravel.vercel.app/" 
                      title="Paramitha Tour & Travel"
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                    {/* Overlay info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pointer-events-none flex flex-col md:flex-row justify-between items-end gap-4">
                      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg pointer-events-auto max-w-lg border-l-4 border-primary-600">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                          <Building2 className="text-primary-600" />
                          Paramitha Tour & Travel
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Unit usaha travel resmi yang dikelola oleh siswa dan guru jurusan Usaha Layanan Wisata (ULW).
                        </p>
                      </div>
                      <Link 
                        href="https://paramithatourandtravel.vercel.app/" 
                        target="_blank"
                        className="pointer-events-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2 mb-2 whitespace-nowrap"
                      >
                        Lihat Website Full <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <Section id="jurusan" title="Kompetensi Keahlian" subtitle="Pilihan jurusan unggulan untuk masa depan gemilang">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {jurusanList.map((item) => (
            <Link href={`/jurusan/${item.slug}`} key={item.id} className="group relative block h-[320px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
              {/* Image Background */}
              <div className="absolute inset-0">
                <SmartImage 
                  src={item.image_url} 
                  alt={item.title} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    {item.singkatan || 'Jurusan'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-primary-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-sm line-clamp-2 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 mb-4">
                  {item.short_desc}
                </p>
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                  <span>Lihat Detail</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Fasilitas Section */}
      <Section className="bg-slate-50" title="Fasilitas Sekolah" subtitle="Sarana prasarana modern standar industri">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fasilitasList.map((item, idx) => (
            <div key={item.id} className={`relative rounded-2xl overflow-hidden group ${idx === 0 ? 'md:col-span-2 md:row-span-2 h-[400px]' : 'h-[190px]'}`}>
              <SmartImage 
                src={item.image_url} 
                alt={item.title} 
                fill 
                style={{ objectFit: 'cover' }}
                className="group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className={`font-bold text-white mb-1 ${idx === 0 ? 'text-2xl' : 'text-lg'}`}>{item.title}</h3>
                <p className="text-slate-300 text-sm line-clamp-2">{item.description || item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/tentang/fasilitas" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:text-primary-600 transition-colors">
            Lihat Semua Fasilitas
          </Link>
        </div>
      </Section>

      {/* Mitra Perusahaan Section */}
      <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
        <div className="container mx-auto px-6 mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Dipercaya oleh Perusahaan Terkemuka</h2>
          <p className="text-slate-500 mt-2">Partner industri untuk praktek kerja dan penyaluran lulusan</p>
        </div>
        
        <div className="relative w-full">
          <div className="marquee-track flex gap-12 w-max items-center">
            {/* Double the list for seamless loop */}
            {[...activeMitra, ...activeMitra].map((mitra, idx) => (
              <div 
                key={`${mitra.id}-${idx}`} 
                className="group relative flex flex-col items-center justify-center w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110 cursor-pointer"
              >
                {mitra.logo_url ? (
                  <div className="w-32 h-20 relative">
                    <img 
                      src={mitra.logo_url} 
                      alt={mitra.nama} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="px-6 py-3 bg-slate-100 rounded-lg text-slate-600 font-bold text-center border border-slate-200">
                    {mitra.nama}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Section */}
      <Section className="bg-[#080810]" title={<span className="text-white">Alumni Kami</span>} subtitle="Kisah sukses para lulusan SMK Paramitha 2">
        <div className="overflow-x-auto pb-8 -mx-6 px-6 md:overflow-visible md:pb-0">
          <div className="flex md:grid md:grid-cols-3 gap-6 w-max md:w-full">
            {alumniList.map((item) => (
              <div key={item.id} className="w-[300px] md:w-full bg-[#0f0f1a] border border-white/5 rounded-3xl p-6 relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-primary-500 to-orange-500">
                    <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-[#0f0f1a]">
                      <SmartImage src={item.foto_url} fill style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.nama}</h4>
                    <p className="text-slate-400 text-sm">{item.jurusan} '{item.angkatan}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-primary-400 mb-1 font-bold">
                    <Building2 size={16} />
                    <span>{item.perusahaan}</span>
                  </div>
                  <p className="text-white font-medium">{item.posisi}</p>
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 text-white/5 transform -scale-x-100" size={40} />
                  <p className="text-slate-400 italic relative z-10 leading-relaxed text-sm">
                    "{item.deskripsi}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-primary-600 text-white text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Siap Menjadi Bagian dari Kami?</h2>
          <p className="text-xl text-primary-100 mb-10">
            Bergabunglah dengan SMK Paramitha 2 Jakarta dan raih masa depan gemilang dengan kompetensi siap kerja.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pendaftaran" className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 transition-colors shadow-xl">
              Daftar Online
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-primary-700 text-white rounded-xl font-bold text-lg hover:bg-primary-800 transition-colors border border-primary-500">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [hero, jurusan, fasilitas, alumni, mitra] = await Promise.all([
      getHero(),
      getJurusan(),
      getFasilitas(),
      getAlumni(),
      getMitra()
    ]);

    // Debug logs
    if (!hero) console.log('DEBUG: Hero data empty');
    if (!jurusan || jurusan.length === 0) console.log('DEBUG: Jurusan data empty');
    if (!alumni || alumni.length === 0) console.log('DEBUG: Alumni data empty');

    return {
      props: {
        hero: hero || null,
        jurusan: jurusan || [],
        fasilitas: fasilitas || [],
        alumni: alumni || [],
        mitra: mitra || []
      },
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      props: {
        hero: null,
        jurusan: [],
        fasilitas: [],
        alumni: [],
        mitra: []
      },
    };
  }
}
