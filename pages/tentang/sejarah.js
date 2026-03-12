
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Flag, Building, Award, TrendingUp, Star, Globe, CheckCircle, Calendar as CalendarIcon } from 'lucide-react'
import Layout from '../../components/Layout'
import { getSekolahInfo, getSejarah } from '../../services/api'

const iconMap = {
  Flag, Building, Award, TrendingUp, Star, Globe, CheckCircle, Calendar: CalendarIcon
};

export default function SejarahPage({ sekolahInfo, sejarahList }) {
  const info = sekolahInfo || {}
  const milestones = sejarahList || []

  return (
    <Layout 
      sekolahInfo={info}
      title="Sejarah Perjalanan — SMK Paramitha 2 Jakarta"
      description="Pelajari sejarah dan perjalanan panjang SMK Paramitha 2 Jakarta dalam mencetak generasi profesional dan siap kerja sejak awal berdiri."
      keywords="Sejarah SMK Paramitha 2, Asal usul SMK Paramitha, Milestones SMK Paramitha"
    >
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#080810] text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C0161C]/90 to-[#1E1E8F]/90 z-0" />
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-20 mix-blend-overlay z-0" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Sejarah Perjalanan Kami
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto whitespace-pre-wrap"
          >
            {info.history || "Belum ada sejarah."}
          </motion.p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {milestones.length > 0 ? (
              milestones.map((item, index) => (
                <TimelineItem key={item.id || index} item={item} index={index} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 italic">Belum ada data sejarah.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

function TimelineItem({ item, index }) {
  const isEven = index % 2 === 0
  const IconComponent = iconMap[item.icon] || Flag;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="w-full md:w-5/12" />
      
      <div className="z-10 flex items-center justify-center w-12 h-12 bg-[#C0161C] rounded-full shadow-lg border-4 border-white mb-6 md:mb-0">
        <IconComponent size={20} className="text-white" />
      </div>
      
      <div className={`w-full md:w-5/12 bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#C0161C] hover:shadow-xl transition-shadow duration-300 ${isEven ? 'text-right' : 'text-left'}`}>
        <span className="text-5xl font-bold text-gray-100 absolute top-4 right-8 select-none pointer-events-none -z-10 opacity-50">
          {item.year}
        </span>
        <h3 className="text-2xl font-bold text-[#1E1E8F] mb-2">{item.title}</h3>
        <div className="text-[#C0161C] font-bold text-xl mb-4">{item.year}</div>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

export async function getServerSideProps() {
  try {
    const [sekolahInfo, sejarahList] = await Promise.all([
      getSekolahInfo(),
      getSejarah()
    ]);
    
    return { 
      props: { 
        sekolahInfo: sekolahInfo || {},
        sejarahList: sejarahList || []
      } 
    }
  } catch (err) {
    console.error(err);
    return { props: { sekolahInfo: {}, sejarahList: [] } }
  }
}
