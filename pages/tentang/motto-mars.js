import Head from 'next/head'
import { motion } from 'framer-motion'
import { Play, Music } from 'lucide-react'
import Layout from '../../components/Layout'
import { getMottoMars, getSekolahInfo } from '../../services/api'
import { useState, useRef } from 'react'

export default function MottoMarsPage({ mottoMars, sekolahInfo }) {
  const dbData = mottoMars || {}
  const pink = (dbData.pink_values && dbData.pink_values.length > 0) ? dbData.pink_values : []
  const jitu = (dbData.jitu_values && dbData.jitu_values.length > 0) ? dbData.jitu_values : []
  const marsLyrics = (dbData.mars_lyrics && dbData.mars_lyrics.length > 0) ? dbData.mars_lyrics : []
  
  // Combine all values for the grid, but we might want to keep them visually distinct rows as per image
  // Image shows PINK in one row, JITU in another.
  
  // Mars Audio Logic
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Helper for cards
  const Card = ({ item, index, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay }}
      className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-slate-100 relative overflow-hidden group min-h-[220px]"
    >
      {/* Decorative gradient circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-full blur-xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-500 mb-2">
          {item.char}
        </h3>
        <h4 className="text-xl font-bold text-[#1E1E8F] mb-3">
          {item.title}
        </h4>
        <p className="text-slate-500 text-sm leading-relaxed">
          {item.desc}
        </p>
      </div>
    </motion.div>
  )

  return (
    <Layout 
      sekolahInfo={sekolahInfo}
      title="Motto & Mars — SMK Paramitha 2 Jakarta"
      description="Kenali nilai-nilai karakter PINK JITU dan semangat Mars SMK Paramitha 2 Jakarta. Membentuk kepribadian unggul dan profesional."
      keywords="Motto SMK Paramitha 2, Mars SMK Paramitha 2, PINK JITU, Karakter Siswa SMK"
    >
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#9e1c4c] to-[#C0161C] py-20 text-center px-4 relative overflow-hidden" data-section="motto/hero" aria-label="Motto Hero">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl lg:text-4xl font-medium text-white max-w-4xl mx-auto leading-relaxed"
        >
          Fondasi karakter insan SMK Paramitha 2 dalam menyongsong masa depan gemilang.
        </motion.h1>
      </div>

      {/* Cards Section */}
      <div className="bg-slate-50 py-20 px-4 md:px-8" data-section="motto/values" aria-label="Nilai PINK JITU">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* PINK Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-section="motto/pink-row">
            {pink.map((item, idx) => (
              <Card key={`pink-${idx}`} item={item} index={idx} delay={idx * 0.1} />
            ))}
          </div>

          {/* JITU Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-section="motto/jitu-row">
            {jitu.map((item, idx) => (
              <Card key={`jitu-${idx}`} item={item} index={idx} delay={0.4 + (idx * 0.1)} />
            ))}
          </div>
        </div>
      </div>

      {/* Mars Section */}
      <div className="bg-white py-20 px-4 relative" data-section="motto/mars" aria-label="Mars Sekolah">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#C0161C] rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Music size={32} />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-[#1E1E8F] mb-2">Mars SMK Paramitha 2</h2>
          <p className="text-slate-500 mb-12">Cipt. Yayasan Kolese Dharma Paramitha</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            {Array.isArray(marsLyrics) && marsLyrics.length > 0 ? (
              marsLyrics.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-8 border border-slate-100 rounded-2xl bg-slate-50/50"
                >
                  <div className="absolute top-4 left-4 text-6xl font-serif text-slate-100 font-bold select-none -z-10">
                    {item.verse || index + 1}
                  </div>
                  <div className="space-y-2 text-slate-700 font-medium">
                    {Array.isArray(item.text) ? (
                      item.text.map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))
                    ) : (
                      <p>{item.text || 'No lyrics available'}</p>
                    )}
                  </div>
                  <div className="w-8 h-1 bg-red-400 mx-auto mt-6 rounded-full"></div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-slate-500">
                <p>Belum ada lirik Mars yang tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const [mottoMars, sekolahInfo] = await Promise.all([
      getMottoMars(),
      getSekolahInfo()
    ])
    return { props: { mottoMars: mottoMars || {}, sekolahInfo: sekolahInfo || null } }
  } catch {
    return { props: { mottoMars: {}, sekolahInfo: null } }
  }
}
