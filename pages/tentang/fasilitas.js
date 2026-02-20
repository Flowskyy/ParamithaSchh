import { useState } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import Layout from '../../components/Layout'
import SmartImage from '../../components/SmartImage'
import { getFasilitas, getSekolahInfo } from '../../services/api'
import { fallbackFasilitas, fallbackSekolahInfo } from '../../utils/fallbackData'

export default function FasilitasPage({ fasilitas, sekolahInfo }) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['Semua', 'Akademik', 'Olahraga', 'Seni', 'Umum']

  // Enrich data with categories if missing (simple logic based on title)
  const enrichedFasilitas = (fasilitas || []).map(item => {
    if (item.category) return item
    const title = item.title.toLowerCase()
    let category = 'Umum'
    if (title.includes('lab') || title.includes('kelas') || title.includes('perpustakaan')) category = 'Akademik'
    else if (title.includes('lapangan') || title.includes('gym') || title.includes('basket')) category = 'Olahraga'
    else if (title.includes('musik') || title.includes('tari') || title.includes('seni')) category = 'Seni'
    return { ...item, category }
  })

  const filteredFasilitas = enrichedFasilitas.filter(item => {
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Layout>
      <Head>
        <title>Fasilitas — SMK Paramitha 2</title>
        <meta name="description" content="Fasilitas lengkap penunjang kegiatan belajar mengajar di SMK Paramitha 2 Jakarta." />
      </Head>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-[#080810] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1E8F]/80 to-[#C0161C]/80 z-0" />
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-20 mix-blend-overlay z-0" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Fasilitas Sekolah
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Sarana dan prasarana modern standar industri untuk mendukung pengembangan kompetensi siswa.
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#C0161C] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari fasilitas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </section>

      {/* Grid Masonry Section */}
      <section className="py-12 bg-[#F8F8FF] min-h-screen">
        <div className="container mx-auto px-6">
          
          {filteredFasilitas.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Filter size={48} className="mx-auto mb-4 opacity-20" />
              <p>Tidak ada fasilitas yang ditemukan.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredFasilitas.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-2xl shadow-md bg-white aspect-[4/3] cursor-pointer"
                  >
                    <SmartImage 
                      src={item.image_url} 
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-[#F5C400] text-xs font-bold uppercase tracking-wider mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.category}
                      </span>
                      <h3 className="text-white text-xl font-bold mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                        {item.description}
                      </p>
                    </div>

                    {/* Default Label (Mobile friendly) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 md:hidden">
                      <h3 className="text-gray-900 font-bold text-sm">{item.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const [fasilitas, sekolahInfo] = await Promise.all([
      getFasilitas(),
      getSekolahInfo()
    ])

    return { 
      props: { 
        fasilitas: fasilitas?.length ? fasilitas : fallbackFasilitas,
        sekolahInfo: sekolahInfo || fallbackSekolahInfo
      } 
    }
  } catch {
    return { 
      props: { 
        fasilitas: fallbackFasilitas,
        sekolahInfo: fallbackSekolahInfo 
      } 
    }
  }
}
