import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, CheckCircle, Briefcase, BookOpen, 
  Users, Star, ChevronRight, Phone, Calendar 
} from 'lucide-react'
import SmartImage from './SmartImage'
import Layout from './Layout'

export default function JurusanDetail({ jurusan }) {
  if (!jurusan) return null

  // Fallback images for gallery since data might not have it
  const galleryImages = [
    `https://placehold.co/800x600/png?text=Kegiatan+${jurusan.slug}+1`,
    `https://placehold.co/800x600/png?text=Kegiatan+${jurusan.slug}+2`,
    `https://placehold.co/800x600/png?text=Kegiatan+${jurusan.slug}+3`,
    `https://placehold.co/800x600/png?text=Kegiatan+${jurusan.slug}+4`,
    `https://placehold.co/800x600/png?text=Kegiatan+${jurusan.slug}+5`,
    `https://placehold.co/800x600/png?text=Kegiatan+${jurusan.slug}+6`,
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <SmartImage
          src={jurusan.image_url || '/images/Carousel.png'}
          alt={jurusan.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#C0161C]/90 to-[#1E1E8F]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4 text-sm font-medium tracking-wider">
              PROGRAM KEAHLIAN
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6">
              {jurusan.title}
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/90 max-w-3xl mx-auto mb-8">
              {jurusan.short_desc}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href="/ppdb" className="px-8 py-3 bg-[#F5C400] text-[#1E1E8F] font-bold rounded-full hover:bg-[#ffe066] transition-colors shadow-lg">
                Daftar Sekarang
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#C0161C] transition-colors">
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-[#C0161C]">Beranda</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link href="/jurusan" className="hover:text-[#C0161C]">Jurusan</Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-[#1E1E8F] font-medium">{jurusan.title}</span>
          </div>
        </div>
      </div>

      {/* Tentang Jurusan */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-3xl font-bold text-[#1E1E8F] mb-6">Tentang Jurusan</h2>
              <div className="prose prose-lg text-gray-600 mb-8">
                <p>{jurusan.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <HighlightCard icon={Users} label="Industri Partner" value="50+" />
                <HighlightCard icon={Star} label="Akreditasi" value="A" />
                <HighlightCard icon={Briefcase} label="Serapan Kerja" value="95%" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <SmartImage 
                  src={jurusan.image_url} 
                  alt={jurusan.title}
                  width={800} 
                  height={600}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#C0161C] rounded-full opacity-20 blur-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#1E1E8F] rounded-full opacity-20 blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kompetensi Keahlian (Kurikulum) */}
      <section className="py-20 bg-[#F8F8FF]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1E8F] mb-4">Kompetensi Keahlian</h2>
            <p className="text-gray-600">Apa saja yang akan dipelajari siswa?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jurusan.kurikulum?.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border-l-4 border-[#C0161C] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#C0161C] shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <p className="text-gray-800 font-medium">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prospek Karir */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1E8F] mb-4">Prospek Karir</h2>
            <p className="text-gray-600">Peluang kerja setelah lulus</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {jurusan.prospek?.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-50 p-6 rounded-xl text-center hover:bg-[#1E1E8F] hover:text-white transition-colors group cursor-default"
              >
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center text-[#1E1E8F] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Briefcase size={24} />
                </div>
                <h3 className="font-bold text-sm md:text-base">{item}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section className="py-20 bg-[#080810] text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
              <h2 className="text-3xl font-bold text-[#F5C400] mb-6">Fasilitas Penunjang</h2>
              <p className="text-gray-400 mb-8">
                Didukung peralatan lengkap standar industri untuk memastikan siswa siap kerja.
              </p>
              <div className="space-y-4">
                {jurusan.fasilitas?.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-[#C0161C]" size={20} />
                    <span className="text-gray-200">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-48 relative">
                    <SmartImage src="https://placehold.co/600x400/png?text=Fasilitas+1" alt="Fasilitas" fill className="object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-64 relative">
                    <SmartImage src="https://placehold.co/600x400/png?text=Fasilitas+2" alt="Fasilitas" fill className="object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden h-64 relative">
                    <SmartImage src="https://placehold.co/600x400/png?text=Fasilitas+3" alt="Fasilitas" fill className="object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-48 relative">
                    <SmartImage src="https://placehold.co/600x400/png?text=Fasilitas+4" alt="Fasilitas" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri Kegiatan */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1E8F] mb-4">Galeri Kegiatan</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <SmartImage 
                  src={src} 
                  alt={`Gallery ${idx}`} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <ArrowRight size={20} className="-rotate-45" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#C0161C] text-white text-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Tertarik dengan Jurusan Ini?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Segera daftarkan dirimu dan jadilah bagian dari keluarga besar SMK Paramitha 2.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/ppdb" className="px-8 py-4 bg-white text-[#C0161C] font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg w-full sm:w-auto">
                Daftar Sekarang
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-[#1E1E8F] text-white font-bold rounded-full hover:bg-[#151570] transition-colors shadow-lg w-full sm:w-auto">
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}

function HighlightCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#F8F8FF] p-4 rounded-xl flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#C0161C] shadow-sm">
        <Icon size={24} />
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg font-bold text-[#1E1E8F]">{value}</div>
      </div>
    </div>
  )
}
