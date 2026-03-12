import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Code, Globe, Coffee, Briefcase, Truck, Monitor } from 'lucide-react';
import Section from './Section';

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
  const activeJurusan = jurusanList?.filter(j => j.aktif) || [];

  if (activeJurusan.length === 0) return null;

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
    <Section className="bg-slate-50" title="Program Keahlian" subtitle="Pilihan Kompetensi Keahlian">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4"
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

      <div className="mt-12 text-center">
        <Link 
          href="/jurusan" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E8F] text-white rounded-full font-bold hover:bg-[#151560] transition-all hover:shadow-lg"
        >
          Lihat Semua Jurusan <ArrowRight size={18} />
        </Link>
      </div>
    </Section>
  );
}
