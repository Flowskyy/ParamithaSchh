import Layout from '../../components/Layout';
import Section from '../../components/Section';
import SmartImage from '../../components/SmartImage';
import { getFasilitas, getSekolahInfo } from '../../services/api';
import { fallbackFasilitas } from '../../utils/fallbackData';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Fasilitas({ sekolahInfo, fasilitasData }) {
  const [items, setItems] = useState(fasilitasData || fallbackFasilitas);
  
  // Update state if props change (unlikely with SSR but good practice)
  useEffect(() => {
    if (fasilitasData && fasilitasData.length > 0) setItems(fasilitasData);
  }, [fasilitasData]);

  return (
    <Layout title="Fasilitas - SMK Paramitha 2 Jakarta">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <SmartImage
          src="https://placehold.co/1920x1080/png?text=Fasilitas"
          alt="Fasilitas Sekolah"
          fill
          className="opacity-40 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase mb-4 block">Sarana & Prasarana</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Fasilitas Sekolah</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Menunjang kegiatan belajar mengajar dengan fasilitas modern dan lengkap.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="h-72 relative overflow-hidden">
                <SmartImage 
                  src={item.image_url} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary-600/90 text-white text-xs font-bold backdrop-blur-sm shadow-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    Fasilitas Unggulan
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col relative bg-white">
                <div className="absolute -top-10 right-8 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-12 transition-transform duration-300">
                   <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                   </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors pt-2">{item.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed flex-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </Layout>

  );
}

export async function getServerSideProps() {
  try {
    const [sekolahInfo, fasilitasData] = await Promise.all([
      getSekolahInfo(),
      getFasilitas()
    ]);
    
    // Debugging
    if (!fasilitasData || fasilitasData.length === 0) {
      console.log('DEBUG: Fasilitas data is empty from Supabase, using fallback');
    }

    return { 
      props: { 
        sekolahInfo: sekolahInfo || null,
        fasilitasData: fasilitasData && fasilitasData.length > 0 ? fasilitasData : fallbackFasilitas
      } 
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    console.log('DEBUG: Error fetching fasilitas, using fallback');
    return { 
      props: { 
        sekolahInfo: null,
        fasilitasData: fallbackFasilitas
      } 
    };
  }
}
