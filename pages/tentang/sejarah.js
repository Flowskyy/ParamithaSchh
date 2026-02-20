import Head from 'next/head'
import { motion } from 'framer-motion'
import { Calendar, Award, CheckCircle, TrendingUp, Flag } from 'lucide-react'
import Layout from '../../components/Layout'
import { getSekolahInfo } from '../../services/api'
import { fallbackSekolahInfo } from '../../utils/fallbackData'

export default function SejarahPage({ sekolahInfo }) {
  const info = sekolahInfo || fallbackSekolahInfo

  const milestones = [
    {
      year: '1985',
      title: 'Awal Berdiri',
      desc: 'Yayasan Pendidikan Paramitha didirikan dengan semangat mencerdaskan kehidupan bangsa melalui pendidikan vokasi yang berkualitas.',
      icon: Flag
    },
    {
      year: '1990',
      title: 'Gedung Pertama',
      desc: 'Pembangunan gedung pertama di lokasi strategis Jakarta Timur, memulai penerimaan siswa angkatan pertama.',
      icon: Building
    },
    {
      year: '2005',
      title: 'Akreditasi A',
      desc: 'Meraih predikat Akreditasi A untuk semua program keahlian, membuktikan komitmen terhadap standar mutu pendidikan.',
      icon: Award
    },
    {
      year: '2018',
      title: 'Revitalisasi SMK',
      desc: 'Terpilih sebagai salah satu sekolah rujukan nasional dengan fasilitas modern standar industri.',
      icon: TrendingUp
    },
    {
      year: '2021',
      title: 'SMK Pusat Keunggulan',
      desc: 'Ditetapkan sebagai SMK Pusat Keunggulan (Center of Excellence) oleh Kemendikbudristek.',
      icon: Star
    },
    {
      year: '2024',
      title: 'Transformasi Digital',
      desc: 'Implementasi penuh sistem pembelajaran berbasis digital dan kerjasama internasional.',
      icon: Globe
    }
  ]

  // Icons mapping for dynamic usage if needed, or just import directly
  // Using direct imports for simplicity in the array above

  return (
    <Layout>
      <Head>
        <title>Sejarah — SMK Paramitha 2</title>
        <meta name="description" content="Sejarah perjalanan SMK Paramitha 2 dari masa ke masa menjadi sekolah unggulan." />
      </Head>

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
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Dedikasi puluhan tahun dalam membentuk karakter dan kompetensi generasi muda Indonesia.
          </motion.p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {milestones.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-[#F8F8FF]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard 
              number="35+" 
              label="Tahun Pengalaman" 
              desc="Mengabdi di dunia pendidikan vokasi" 
              delay={0}
            />
            <StatCard 
              number="A" 
              label="Terakreditasi Unggul" 
              desc="Standar mutu pendidikan nasional" 
              delay={0.2}
            />
            <StatCard 
              number="PK" 
              label="Pusat Keunggulan" 
              desc="SMK Center of Excellence" 
              delay={0.4}
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}

function TimelineItem({ item, index }) {
  const isEven = index % 2 === 0
  
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
        <item.icon size={20} className="text-white" />
      </div>
      
      <div className={`w-full md:w-5/12 bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#C0161C] hover:shadow-xl transition-shadow duration-300 ${isEven ? 'text-right' : 'text-left'}`}>
        <span className="text-5xl font-bold text-gray-100 absolute top-4 right-8 select-none pointer-events-none -z-10 opacity-50">
          {item.year}
        </span>
        <h3 className="text-2xl font-bold text-[#1E1E8F] mb-2">{item.title}</h3>
        <div className="text-[#C0161C] font-bold text-xl mb-4">{item.year}</div>
        <p className="text-gray-600 leading-relaxed">
          {item.desc}
        </p>
      </div>
    </motion.div>
  )
}

function StatCard({ number, label, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="text-5xl font-bold text-[#C0161C] mb-2">{number}</div>
      <div className="text-xl font-bold text-[#1E1E8F] mb-2">{label}</div>
      <p className="text-gray-500">{desc}</p>
    </motion.div>
  )
}

// Helper icons
import { Building, Star, Globe } from 'lucide-react'

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo()
    return { props: { sekolahInfo: sekolahInfo || null } }
  } catch {
    return { props: { sekolahInfo: null } }
  }
}
