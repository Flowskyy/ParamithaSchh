import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, BookOpen, Users, Trophy } from 'lucide-react';
import Layout from '../../components/Layout';
import Section from '../../components/Section';
import SmartImage from '../../components/SmartImage';
import { getJurusan, getSekolahInfo } from '../../services/api';
import { fallbackJurusan } from '../../utils/fallbackData';

export default function JurusanList({ sekolahInfo, jurusanList }) {
  // Use props data initially, but can be updated if needed (though SSR provides fresh data)
  // No need for client-side fetch if SSR is doing it
  
  return (
    <Layout title="Program Keahlian - SMK Paramitha 2 Jakarta">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SmartImage 
            src="https://placehold.co/1920x1080/png?text=Jurusan"
            alt="Jurusan Hero"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-primary-500/20 text-primary-300 text-sm font-bold mb-6 border border-primary-500/30 backdrop-blur-sm">
              Program Keahlian Unggulan
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Pilih Masa Depanmu Disini
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              SMK Paramitha 2 Jakarta menyediakan berbagai kompetensi keahlian yang relevan dengan kebutuhan industri masa kini dan masa depan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Statistics/Features */}
      <Section className="bg-white relative z-20 -mt-10 pt-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Kurikulum Industri", desc: "Materi pembelajaran disesuaikan dengan standar industri terkini." },
              { icon: Users, title: "Pengajar Profesional", desc: "Didimbing oleh guru dan praktisi yang berpengalaman di bidangnya." },
              { icon: Trophy, title: "Sertifikasi Kompetensi", desc: "Lulusan dibekali sertifikat kompetensi yang diakui secara nasional." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* List Jurusan */}
      <Section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12">
            {jurusanList.map((jurusan, idx) => (
              <motion.div 
                key={jurusan.slug || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <SmartImage 
                      src={jurusan.image_url} 
                      alt={jurusan.title} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent lg:bg-gradient-to-r" />
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                    <div className="mb-4">
                      <span className="text-primary-600 font-bold tracking-wider text-sm uppercase">Kompetensi Keahlian</span>
                      <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4 group-hover:text-primary-600 transition-colors">
                        {jurusan.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed mb-8">
                        {jurusan.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        Materi Unggulan:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                        {jurusan.kurikulum && jurusan.kurikulum.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-center text-sm text-slate-600 gap-2">
                            <ChevronRight size={14} className="text-primary-500" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <Link 
                        href={`/jurusan/${jurusan.slug}`} 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-primary-600 transition-all group-hover:translate-x-2"
                      >
                        Selengkapnya <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [sekolahInfo, jurusanData] = await Promise.all([
      getSekolahInfo(),
      getJurusan()
    ]);

    let jurusanList = jurusanData;

    // Debugging and Fallback logic
    if (!jurusanList || jurusanList.length === 0) {
      console.log('DEBUG: Jurusan list is empty from Supabase, using fallback');
      jurusanList = fallbackJurusan;
    }

    return { 
      props: { 
        sekolahInfo: sekolahInfo || null,
        jurusanList
      } 
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    console.log('DEBUG: Error fetching data, using fallback for Jurusan list');
    return { 
      props: { 
        sekolahInfo: null,
        jurusanList: fallbackJurusan 
      } 
    };
  }
}
