import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import SmartImage from '../SmartImage';
import WaveSeparator from '../WaveSeparator';

const Section = ({ children, className, id }) => (
  <section id={id} className={`relative py-20 ${className}`}>
    {children}
  </section>
);

export default function SambutanSection({ info }) {
  const shortMessage = info.kepsek_message 
    ? info.kepsek_message.substring(0, 150) + (info.kepsek_message.length > 150 ? '...' : '')
    : "Belum ada sambutan.";

  return (
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
                &quot;{shortMessage}&quot;
              </p>
            </div>

            <Link href="/tentang/sambutan-kepsek" className="inline-flex items-center gap-2 text-[#1E1E8F] font-bold hover:text-[#C0161C] transition-colors group">
              Baca Selengkapnya
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
      <WaveSeparator position="bottom" color="#FFF8F8" height="100px" />
    </Section>
  );
}
