import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Section from '../components/Section';
import SmartImage from '../components/SmartImage';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { getSekolahInfo } from '../services/api';
import { fallbackSekolahInfo } from '../utils/fallbackData';

export default function Contact({ sekolahInfo }) {
  const [info, setInfo] = useState(sekolahInfo || fallbackSekolahInfo);

  // Update info if props change (though usually static)
  useEffect(() => {
    if (sekolahInfo) setInfo(sekolahInfo);
  }, [sekolahInfo]);

  return (
    <Layout title="Hubungi Kami - SMK Paramitha Jakarta">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <SmartImage
            src="https://placehold.co/1920x1080/png?text=Contact+Us"
            alt="Contact Us"
            fill
            className="opacity-30 w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase mb-4 block">Get In Touch</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Hubungi Kami
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Punya pertanyaan seputar PPDB atau informasi sekolah? Jangan ragu untuk menghubungi kami.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="py-20 bg-surface -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Alamat Sekolah</h3>
                <p className="text-slate-600">
                  {info.address}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                  <Phone size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Telepon & Email</h3>
                <p className="text-slate-600 mb-1">{info.phone}</p>
                <p className="text-slate-600">{info.email}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Jam Operasional</h3>
                <p className="text-slate-600">
                  Senin - Jumat: 07:00 - 16:00<br/>
                  Sabtu: 08:00 - 12:00
                </p>
              </motion.div>
            </div>

            {/* Map */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm h-[500px]"
            >
              <iframe 
                src={info.map_url} 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '1rem' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo();
    
    if (!sekolahInfo) {
      console.log('DEBUG: Sekolah Info is empty from Supabase (contact page)');
    }

    return { props: { sekolahInfo: sekolahInfo || null } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    console.log('DEBUG: Error fetching sekolah info (contact page)');
    return { props: { sekolahInfo: null } };
  }
}
