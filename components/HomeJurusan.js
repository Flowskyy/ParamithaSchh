import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Code, Globe, Coffee, Briefcase, Truck, Monitor } from 'lucide-react';
import Section from './Section';
import WaveSeparator from './WaveSeparator';

// Map icons based on slug or id
const getIcon = (slug) => {
  switch (slug) {
    case 'rpl': return <Code size={32} />;
    case 'ulw': return <Globe size={32} />;
    case 'perhotelan': return <Briefcase size={32} />;
    case 'kuliner': return <Coffee size={32} />;
    case 'dkv': return <Monitor size={32} />;
    case 'manajemen-logistik': return <Truck size={32} />;
    case 'tkj': return <Monitor size={32} />;
    default: return <BookOpen size={32} />;
  }
};

export default function HomeJurusan({ jurusanList }) {
  const activeJurusan = Array.isArray(jurusanList) ? jurusanList : [];

  if (activeJurusan.length === 0) {
    return (
      <Section className="bg-[#FFF8F8]" title="Program Keahlian" subtitle="Pilihan Kompetensi Keahlian">
        <div className="text-center py-12 px-4">
          <p className="text-slate-500 text-lg">Belum ada jurusan yang tersedia saat ini.</p>
        </div>
      </Section>
    );
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full bg-[#F0F9FF]">
      <section className="relative py-20 w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Keahlian</h2>
            <p className="text-lg text-slate-500">Pilihan Kompetensi Keahlian</p>
          </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid gap-6 md:gap-8 ${
            activeJurusan.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : activeJurusan.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
              : 'md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {activeJurusan.map((jurusan) => (
            <motion.div key={jurusan.id} variants={fadeInUp}>
              <Link href={`/jurusan/${jurusan.slug}`} className="block h-full group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-slate-100 group-hover:-translate-y-2">
                  
                  {/* Header with dynamic color */}
                  <div 
                    className="h-24 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: jurusan.warna_primer || '#1E1E8F' }}
                  >
                    <div className="text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      {getIcon(jurusan.slug)}
                    </div>
                    
                    {/* Decorative circle */}
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-wider"
                      >
                        {jurusan.singkatan}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#C0161C] transition-colors">
                      {jurusan.name}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                      {jurusan.description || jurusan.deskripsi}
                    </p>

                    <div className="flex items-center text-[#1E1E8F] font-bold text-sm group-hover:gap-2 transition-all">
                      Lihat Detail <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      </section>
      
    </div>
  );
}
