import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Briefcase, BookOpen, Monitor } from 'lucide-react';
import Link from 'next/link';
import Layout from './Layout';
import Section from './Section';
import SmartImage from './SmartImage';

export default function JurusanDetail({ data }) {
  if (!data) return null;

  const kurikulum = data.kurikulum || data.competencies || data.kompetensi || [];
  const prospek = data.prospek || data.careers || data.prospek_kerja || [];
  const fasilitas = data.fasilitas || data.facilities || [];

  return (
    <Layout title={`${data.title || data.name} - SMK Paramitha 2`}>
      {/* Hero Header */}
      <div className="relative h-[60vh] flex items-center bg-slate-900">
        <div className="absolute inset-0 z-0">
          <SmartImage 
            src={data.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1920'} 
            alt={data.title || data.name}
            fill
            priority
            style={{ objectFit: 'cover' }}
            className="opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <Link href="/jurusan" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft size={20} /> Kembali ke Daftar Jurusan
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {data.title || data.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-200 max-w-2xl leading-relaxed"
          >
            {data.description || "Program keahlian unggulan untuk mencetak tenaga profesional siap kerja."}
          </motion.p>
        </div>
      </div>

      <Section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Tentang */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                    <BookOpen size={20} />
                  </span>
                  Tentang Kompetensi
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                  <p>{data.description || "Deskripsi lengkap mengenai jurusan ini akan segera ditambahkan."}</p>
                </div>
              </div>

              {/* Kurikulum & Prospek Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Kurikulum */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <CheckCircle className="text-primary-600" size={24} />
                    Materi Pembelajaran
                  </h3>
                  {kurikulum.length > 0 ? (
                    <ul className="space-y-4">
                      {kurikulum.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600">
                          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 italic">Data kurikulum belum tersedia.</p>
                  )}
                </div>
                
                {/* Prospek */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Briefcase className="text-primary-600" size={24} />
                    Prospek Karir
                  </h3>
                  {prospek.length > 0 ? (
                    <ul className="space-y-4">
                      {prospek.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 italic">Data prospek karir belum tersedia.</p>
                  )}
                </div>
              </div>

              {/* Fasilitas */}
              {fasilitas.length > 0 && (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Monitor className="text-primary-600" size={24} />
                    Fasilitas Penunjang
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fasilitas.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <CheckCircle size={16} className="text-primary-500" />
                        <span className="text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Informasi Pendaftaran</h3>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  Tertarik dengan jurusan {data.title || data.name}? Segera daftarkan dirimu dan jadilah bagian dari kami.
                </p>
                <Link 
                  href="/ppdb" 
                  className="block w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-center font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-1"
                >
                  Daftar Sekarang
                </Link>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Jurusan Lainnya</h4>
                  <ul className="space-y-3">
                    {[
                      { name: 'Rekayasa Perangkat Lunak', slug: 'rpl' },
                      { name: 'Desain Komunikasi Visual', slug: 'dkv' },
                      { name: 'Usaha Layanan Wisata', slug: 'ulw' },
                      { name: 'Kuliner', slug: 'kuliner' },
                      { name: 'Perhotelan', slug: 'perhotelan' }
                    ]
                      .filter(j => j.slug !== (data.slug || '').toLowerCase())
                      .map((j, idx) => (
                        <li key={idx}>
                          <Link 
                            href={`/jurusan/${j.slug}`} 
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary-600 transition-all group border border-transparent hover:border-slate-100"
                          >
                            <span className="text-sm font-medium">{j.name}</span>
                            <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}