import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Target, User, Building, Image, Music, ArrowRight } from 'lucide-react'
import Layout from '../../components/Layout'
import { getSekolahInfo } from '../../services/api'

export default function TentangPage({ sekolahInfo }) {
  const info = sekolahInfo || {}

  const menuItems = [
    {
      title: 'Sejarah Sekolah',
      desc: 'Perjalanan panjang SMK Paramitha 2 mencetak generasi unggul sejak berdiri.',
      icon: BookOpen,
      href: '/tentang/sejarah',
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Visi & Misi',
      desc: 'Cita-cita luhur dan langkah strategis kami dalam pendidikan vokasi.',
      icon: Target,
      href: '/tentang/visi-misi',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Sambutan Kepala Sekolah',
      desc: 'Pesan hangat dan motivasi dari pimpinan sekolah untuk seluruh civitas.',
      icon: User,
      href: '/tentang/sambutan-kepsek',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Fasilitas',
      desc: 'Sarana prasarana lengkap penunjang kegiatan belajar mengajar modern.',
      icon: Building,
      href: '/tentang/fasilitas',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Galeri Kegiatan',
      desc: 'Dokumentasi visual aktivitas akademik dan non-akademik siswa.',
      icon: Image,
      href: '/tentang/galeri',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Motto & Mars',
      desc: 'Nilai-nilai PINK JITU dan semangat kebanggaan almamater.',
      icon: Music,
      href: '/tentang/motto-mars',
      color: 'bg-pink-100 text-pink-600',
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <Layout 
      title="Tentang Kami — SMK Paramitha 2 Jakarta"
      description="Profil lengkap SMK Paramitha 2 Jakarta: Sejarah, Visi Misi, Fasilitas modern, dan keunggulan pendidikan vokasi berbasis industri."
      keywords="Profil SMK Paramitha 2, Visi Misi SMK, Fasilitas SMK Jakarta, Sejarah SMK Paramitha"
    >
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-[#C0161C] to-[#1E1E8F] text-white" data-section="about/hero" aria-label="Tentang Hero">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Tentang SMK Paramitha 2
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto text-white/90"
          >
            Mengenal lebih dekat institusi pendidikan yang berkomitmen mencetak generasi profesional, berkarakter, dan siap kerja.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-[#F8F8FF]" data-section="about/menu" aria-label="Menu Tentang">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-section="about/menu-grid"
            aria-label="Grid Menu Tentang"
          >
            {menuItems.map((menu, index) => (
              <motion.div key={index} variants={item} data-section="about/menu-item" aria-label={`Menu ${menu.title}`}>
                <Link href={menu.href} className="group block h-full">
                  <div className="bg-white rounded-2xl p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 border border-transparent group-hover:border-[#C0161C]/20 relative overflow-hidden">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${menu.color} transition-transform group-hover:scale-110`}>
                      <menu.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#C0161C] transition-colors">
                      {menu.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {menu.desc}
                    </p>
                    <div className="flex items-center text-[#C0161C] font-semibold group-hover:translate-x-2 transition-transform">
                      Selengkapnya <ArrowRight size={18} className="ml-2" />
                    </div>
                    
                    {/* Decorative Blob */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-50 rounded-full group-hover:bg-[#C0161C]/5 transition-colors z-0" />
                  </div>
                </Link>
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
    const sekolahInfo = await getSekolahInfo()
    return { props: { sekolahInfo: sekolahInfo || {} } }
  } catch {
    return { props: { sekolahInfo: {} } }
  }
}
