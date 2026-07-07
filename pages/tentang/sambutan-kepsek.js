import Head from 'next/head';
import Layout from '../../components/Layout';
import SmartImage from '../../components/SmartImage';
import { getSekolahInfo } from '../../services/api';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function SambutanKepsek({ sekolahInfo }) {
  const info = sekolahInfo || {};
  
  // Split kepsek_message into greeting and body
  // Format: "Greeting|||Body"
  const [greeting, ...messageParts] = (info.kepsek_message || '').split('|||');
  const message = messageParts.join('|||'); // Rejoin in case there are multiple delimiters (unlikely)
  
  // Fallback if no delimiter found (legacy data)
  const finalGreeting = message ? greeting : "Assalamu'alaikum Warahmatullahi Wabarakatuh. Salam sejahtera bagi kita semua.";
  const finalMessage = message ? message : (greeting || '');

  return (
    <Layout 
      sekolahInfo={sekolahInfo}
      title={`Sambutan Kepala Sekolah — SMK Paramitha 2 Jakarta`}
      description={`Baca pesan hangat dari Kepala Sekolah SMK Paramitha 2 Jakarta, ${info.kepsek_name || 'Kepala Sekolah'}. Visi kepemimpinan untuk masa depan siswa.`}
      keywords="Sambutan Kepsek, Kepala Sekolah SMK Paramitha 2, Pesan Pendidikan SMK"
    >
      {/* Hero Header */}
      <section className="relative py-20 bg-[#1E1E8F] text-white overflow-hidden" data-section="welcome/hero" aria-label="Sambutan Hero">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C0161C] rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Sambutan Kepala Sekolah
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            className="h-1 bg-[#F5C400] mx-auto rounded-full"
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white relative" data-section="welcome/content" aria-label="Konten Sambutan">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
              
              {/* Left Column: Photo Card */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/3 flex-shrink-0 lg:sticky top-28"
                data-section="welcome/photo-card"
              >
                <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 relative">
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100">
                    <SmartImage
                      src={info.kepsek_photo || '/images/Kepsek.JPG'}
                      alt={info.kepsek_name || 'Kepala Sekolah'}
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                      className="hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="mt-6 text-center pb-2">
                    <h3 className="text-2xl font-bold text-[#1E1E8F] mb-1 font-serif">
                      {info.kepsek_name || 'Ibu Dwi Elvride Sintia, S.S.'}
                    </h3>
                    <p className="text-[#C0161C] font-bold uppercase tracking-wider text-sm">
                      Kepala Sekolah
                    </p>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute -top-3 -left-3 w-12 h-12 border-t-4 border-l-4 border-[#F5C400] rounded-tl-xl" />
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-4 border-r-4 border-[#1E1E8F] rounded-br-xl" />
                </div>
              </motion.div>

              {/* Right Column: Text Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-2/3"
                data-section="welcome/message"
              >
                <div className="prose prose-lg prose-slate max-w-none">
                  <div className="space-y-6 text-slate-600 leading-relaxed text-justify">
                    {finalMessage ? (
                      <div className="whitespace-pre-wrap">{finalMessage}</div>
                    ) : (
                      <p className="text-slate-400 italic">Belum ada sambutan kepala sekolah.</p>
                    )}
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                    <div className="text-center">
                      <div className="text-3xl font-serif text-[#1E1E8F] italic mb-2 opacity-80 sign-font">
                        {info.kepsek_name || 'Dwi Elvride Sintia, S.S.'}
                      </div>
                      <div className="text-sm text-slate-400 uppercase tracking-widest">
                        Kepala Sekolah
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo();
    return {
      props: {
        sekolahInfo: sekolahInfo || null
      }
    };
  } catch (error) {
    console.error("Error fetching sekolah info:", error);
    return {
      props: {
        sekolahInfo: null
      }
    };
  }
}
