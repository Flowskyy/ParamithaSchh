import Layout from '../../components/Layout';
import Section from '../../components/Section';
import SmartImage from '../../components/SmartImage';
import { getGaleri, getSekolahInfo } from '../../services/api';
import { fallbackGaleri } from '../../utils/fallbackData';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Galeri({ sekolahInfo, galeriData }) {
  const [items, setItems] = useState(galeriData || fallbackGaleri);
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    if (galeriData && galeriData.length > 0) setItems(galeriData);
  }, [galeriData]);

  const categories = ['Semua', ...new Set(items.map(i => i.category))];
  const filteredItems = activeTab === 'Semua' ? items : items.filter(i => i.category === activeTab);

  return (
    <Layout title="Galeri - SMK Paramitha 2 Jakarta">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <SmartImage
          src="https://placehold.co/1920x1080/png?text=Galeri+Kegiatan"
          alt="Galeri Kegiatan"
          fill
          className="opacity-30 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase mb-4 block">Dokumentasi</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Galeri Kegiatan</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Momen-momen berharga dan prestasi siswa-siswi SMK Paramitha 2 Jakarta.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="bg-slate-50 min-h-screen">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all border duration-300 ${
                activeTab === cat 
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/30 scale-105' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:scale-105'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 px-4">
          {filteredItems.map((item, idx) => (
            <motion.div 
              key={item.id} 
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="break-inside-avoid rounded-3xl overflow-hidden relative group shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-slate-900"
            >
              <div className="relative overflow-hidden">
                <SmartImage 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60" 
                  width={600} 
                  height={400} 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                     </svg>
                   </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-300 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0">
                  <span className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">{item.category}</span>
                  <h3 className="text-white font-bold text-xl mb-1 leading-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">{item.title}</h3>
                  <div className="w-12 h-1 bg-primary-500 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left delay-300"></div>
                </div>
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
    const [sekolahInfo, galeriData] = await Promise.all([
      getSekolahInfo(),
      getGaleri()
    ]);

    // Debugging
    if (!galeriData || galeriData.length === 0) {
      console.log('DEBUG: Galeri data is empty from Supabase, using fallback');
    }

    return { 
      props: { 
        sekolahInfo: sekolahInfo || null,
        galeriData: galeriData && galeriData.length > 0 ? galeriData : fallbackGaleri
      } 
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    console.log('DEBUG: Error fetching galeri, using fallback');
    return { 
      props: { 
        sekolahInfo: null,
        galeriData: fallbackGaleri
      } 
    };
  }
}
