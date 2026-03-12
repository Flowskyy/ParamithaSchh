import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import Layout from '../../components/Layout'
import SmartImage from '../../components/SmartImage'
import { getGaleri, getSekolahInfo } from '../../services/api'

export default function GaleriPage({ galeri, sekolahInfo }) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedImage, setSelectedImage] = useState(null)
  
  // Extract unique categories
  const categories = ['Semua', ...new Set(galeri.map(item => item.category).filter(Boolean))]

  const filteredGaleri = activeCategory === 'Semua' 
    ? galeri 
    : galeri.filter(item => item.category === activeCategory)

  // Lightbox navigation
  const handleNext = (e) => {
    e.stopPropagation()
    const currentIndex = filteredGaleri.findIndex(item => item.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % filteredGaleri.length
    setSelectedImage(filteredGaleri[nextIndex])
  }

  const handlePrev = (e) => {
    e.stopPropagation()
    const currentIndex = filteredGaleri.findIndex(item => item.id === selectedImage.id)
    const prevIndex = (currentIndex - 1 + filteredGaleri.length) % filteredGaleri.length
    setSelectedImage(filteredGaleri[prevIndex])
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return
      
      if (e.key === 'Escape') setSelectedImage(null)
      if (e.key === 'ArrowRight') {
        const currentIndex = filteredGaleri.findIndex(item => item.id === selectedImage.id)
        const nextIndex = (currentIndex + 1) % filteredGaleri.length
        setSelectedImage(filteredGaleri[nextIndex])
      }
      if (e.key === 'ArrowLeft') {
        const currentIndex = filteredGaleri.findIndex(item => item.id === selectedImage.id)
        const prevIndex = (currentIndex - 1 + filteredGaleri.length) % filteredGaleri.length
        setSelectedImage(filteredGaleri[prevIndex])
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, filteredGaleri])

  return (
    <Layout 
      sekolahInfo={sekolahInfo}
      title="Galeri Kegiatan — SMK Paramitha 2 Jakarta"
      description="Lihat dokumentasi foto kegiatan, prestasi, dan momen berharga siswa SMK Paramitha 2 Jakarta. Inspirasi pendidikan vokasi modern."
      keywords="Galeri SMK Paramitha 2, Foto Kegiatan SMK, Dokumentasi Sekolah, Prestasi Siswa SMK"
    >
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-[#080810] text-white" data-section="gallery/hero" aria-label="Galeri Hero">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E8F]/90 to-[#080810]/50 z-0" />
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-20 mix-blend-overlay z-0" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Galeri Kegiatan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Momen-momen berharga dalam perjalanan pendidikan dan pengembangan diri siswa.
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm" data-section="gallery/filters" aria-label="Galeri Filter">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2 justify-center md:justify-start" data-section="gallery/categories">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#1E1E8F] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Gallery Section */}
      <section className="py-12 bg-[#F8F8FF] min-h-screen" data-section="gallery/grid" aria-label="Galeri Grid">
        <div className="container mx-auto px-6">
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredGaleri.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 flex flex-col"
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Image: Portrait 4:5 */}
                  <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden group">
                    <SmartImage 
                      src={item.image_url} 
                      alt={item.title}
                      fill
                      className="transition-transform duration-500 group-hover:scale-110"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  
                  {/* Content - IG Style Clean */}
                  <div className="p-3">
                    <p className="text-sm text-slate-800 line-clamp-3">
                      <span className="font-bold mr-2">{item.title}</span>
                      {item.caption || <span className="italic text-slate-400">No caption</span>}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-wide">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50 p-2 bg-white/10 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors p-3 bg-white/10 rounded-full hidden md:block"
              onClick={handlePrev}
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors p-3 bg-white/10 rounded-full hidden md:block"
              onClick={handleNext}
            >
              <ChevronRight size={32} />
            </button>

            {/* Image Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[80vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-auto max-h-[70vh] rounded-lg overflow-hidden shadow-2xl">
                <SmartImage 
                  src={selectedImage.image_url} 
                  alt={selectedImage.title}
                  width={1200}
                  height={800}
                  className="w-full h-full object-contain bg-black"
                />
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="text-white text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-gray-400">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const [galeri, sekolahInfo] = await Promise.all([
      getGaleri(),
      getSekolahInfo()
    ])

    return { 
      props: { 
        galeri: galeri?.length ? galeri : [],
        sekolahInfo: sekolahInfo || {}
      } 
    }
  } catch {
    return { 
      props: { 
        galeri: [],
        sekolahInfo: {} 
      } 
    }
  }
}
