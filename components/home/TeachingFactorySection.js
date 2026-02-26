import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import WaveSeparator from '../WaveSeparator';

const Section = ({ children, className, id }) => (
  <section id={id} className={`relative py-20 ${className}`}>
    {children}
  </section>
);

export default function TeachingFactorySection() {
  return (
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
  );
}
