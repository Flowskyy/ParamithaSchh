import React from 'react';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import { getJurusan } from '../../services/api';
import Link from 'next/link';
import SmartImage from '../../components/SmartImage';
import { Palette, Hotel, ChefHat, Plane, Code, Package, ArrowRight, BookOpen } from 'lucide-react';

const iconMap = {
  Palette,
  Hotel,
  ChefHat,
  Plane,
  Code,
  Package
};

export async function getServerSideProps() {
  const data = await getJurusan();
  // Use empty array if data is empty or error
  const jurusanList = data && data.length > 0 ? data : [];

  return {
    props: {
      jurusanList,
    },
  };
}

export default function JurusanIndex({ jurusanList }) {
  return (
    <Layout title="Kompetensi Keahlian | SMK Paramitha 2 Jakarta">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#1E1E8F]">
        <div className="absolute inset-0 opacity-20">
          <SmartImage
            src="/images/Carousel.png"
            alt="Jurusan Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1E8F]/80 to-[#1E1E8F]/90" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kompetensi Keahlian</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Pilihan jurusan unggulan yang siap mengantarkanmu menuju masa depan gemilang dengan keterampilan sesuai kebutuhan industri.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jurusan Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jurusanList.map((jurusan, index) => {
              const Icon = iconMap[jurusan.icon] || BookOpen;
              
              return (
                <motion.div
                  key={jurusan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <SmartImage
                      src={jurusan.image_url}
                      alt={jurusan.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <Icon size={24} />
                      </div>
                      <span className="font-semibold text-lg">{jurusan.singkatan || jurusan.slug.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-[#1E1E8F] mb-3 group-hover:text-[#C0161C] transition-colors">
                      {jurusan.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                      {jurusan.short_desc}
                    </p>
                    
                    <Link 
                      href={`/jurusan/${jurusan.slug}`}
                      className="inline-flex items-center gap-2 text-[#C0161C] font-semibold hover:gap-3 transition-all"
                    >
                      Selengkapnya <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1E1E8F] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Masih Bingung Memilih Jurusan?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Konsultasikan minat dan bakatmu dengan tim kami. Kami siap membantu menemukan jurusan yang paling tepat untuk masa depanmu.
            </p>
            <Link 
              href="/kontak"
              className="inline-block px-8 py-4 bg-[#C0161C] hover:bg-[#a01217] text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Hubungi Kami
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
