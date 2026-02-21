import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { getJurusan, getSekolahInfo } from '../../services/api'
import { fallbackJurusan, fallbackSekolahInfo } from '../../utils/fallbackData'
import Layout from '../../components/Layout'

export default function JurusanList({ jurusanList, sekolahInfo }) {
  const info = sekolahInfo || fallbackSekolahInfo
  // Filter active jurusan from fallback if jurusanList is null/undefined
  const jurusans = jurusanList?.length > 0 ? jurusanList : fallbackJurusan.filter(j => j.aktif)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <Layout sekolahInfo={info}>
      <Head>
        <title>Program Keahlian — SMK Paramitha 2</title>
        <meta name="description" content="Pilihan program keahlian unggulan di SMK Paramitha 2 Jakarta." />
      </Head>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #C0161C 0%, #1E1E8F 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Program Keahlian Kami
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Siapkan masa depan gemilang dengan kompetensi keahlian yang sesuai dengan minat dan bakatmu.
          </motion.p>
        </div>
      </section>

      {/* Jurusan Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {jurusans.map((jurusan) => (
              <motion.div
                key={jurusan.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl overflow-hidden relative group shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                style={{
                  background: `linear-gradient(135deg, ${jurusan.warna_primer} 0%, ${jurusan.warna_sekunder} 100%)`,
                  boxShadow: `0 10px 30px -10px ${jurusan.warna_primer}80`
                }}
              >
                {/* Badge Singkatan */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <span className="text-xl font-bold text-white tracking-wider">
                    {jurusan.singkatan}
                  </span>
                </div>

                <div className="p-8 flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 pr-16 leading-tight">
                      {jurusan.name}
                    </h2>
                    <p className="text-white/80 line-clamp-3 mb-8 leading-relaxed">
                      {jurusan.deskripsi}
                    </p>
                  </div>
                  
                  <div>
                    <Link 
                      href={`/jurusan/${jurusan.slug}`}
                      className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-full text-white font-semibold hover:bg-white hover:text-gray-900 transition-all group-hover:border-white w-full justify-center sm:w-auto"
                    >
                      Selengkapnya
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Decorative Overlay */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const [jurusanList, sekolahInfo] = await Promise.all([
      getJurusan(), // Fetches only active jurusan based on updated api.js
      getSekolahInfo()
    ])
    return { props: { 
      jurusanList: jurusanList || null, 
      sekolahInfo: sekolahInfo || null 
    } }
  } catch {
    return { props: { 
      jurusanList: null, 
      sekolahInfo: null 
    } }
  }
}
