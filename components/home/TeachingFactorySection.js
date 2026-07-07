import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProyekPkk } from '../../services/api';
import WaveSeparator from '../WaveSeparator';

const Section = ({ children, className, id }) => (
  <section id={id} className={`relative py-20 w-full ${className}`}>
    {children}
  </section>
);

export default function TeachingFactorySection() {
  const [data, setData] = useState({
    title: 'Proyek PKK Paramitha 2',
    subtitle: 'Paramitha Tour & Travel',
    description: 'Unit produksi SMK Paramitha 2 yang bergerak di bidang layanan perjalanan wisata. Dikelola langsung oleh siswa dengan standar industri profesional.',
    services: ['Ticketing Pesawat & Kereta', 'Paket Wisata Domestik', 'Pengurusan Dokumen Perjalanan'],
    website_url: 'https://paramithatourandtravel.vercel.app/'
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getProyekPkk();
        if (result) {
          setData({
            title: result.title || data.title,
            subtitle: result.subtitle || data.subtitle,
            description: result.description || data.description,
            services: result.services || data.services,
            website_url: result.website_url || data.website_url,
          });
        }
      } catch (err) {
        console.error('Error fetching proyek PKK data:', err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full bg-[#FFF8F8]">
      <section className="relative py-20 w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-[#1E1E8F] font-bold tracking-widest uppercase mb-2">{data.title}</h2>
            <h3 className="text-3xl md:text-4xl font-normal text-slate-900" style={{ fontFamily: '"Belleza", sans-serif' }}>
              {data.subtitle}
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
                {data.description}
              </p>
              <ul className="space-y-3 mb-8">
                {(data.services || []).map((service, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-[#F5C400]" /> {service}
                  </li>
                ))}
              </ul>
              {data.website_url && (
                <a 
                  href={data.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#1E1E8F] text-white rounded-lg font-semibold hover:bg-[#151560] transition-colors inline-flex items-center gap-2"
                >
                  Kunjungi Website <ArrowRight size={18} />
                </a>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-2/3 h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
            >
              {data.website_url && (
                <iframe 
                  src={data.website_url} 
                  className="w-full h-full border-0"
                  title="Paramitha Tour and Travel"
                  loading="lazy"
                />
              )}
            </motion.div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
