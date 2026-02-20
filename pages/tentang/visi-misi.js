import Head from 'next/head'
import { motion } from 'framer-motion'
import { Target, CheckCircle, Heart, Shield, Zap, Users, Star, Award } from 'lucide-react'
import Layout from '../../components/Layout'
import { getSekolahInfo } from '../../services/api'
import { fallbackSekolahInfo } from '../../utils/fallbackData'

export default function VisiMisiPage({ sekolahInfo }) {
  const info = sekolahInfo || fallbackSekolahInfo

  const misiList = [
    {
      icon: Users,
      text: "Menyelenggarakan pendidikan vokasi yang berkualitas dan relevan dengan kebutuhan industri."
    },
    {
      icon: Shield,
      text: "Membentuk karakter siswa yang berakhlak mulia, disiplin, dan bertanggung jawab."
    },
    {
      icon: Zap,
      text: "Mengembangkan potensi siswa melalui kegiatan ekstrakurikuler dan pengembangan diri."
    },
    {
      icon: Globe,
      text: "Membangun kemitraan strategis dengan dunia usaha dan dunia industri (DUDI) berskala internasional."
    },
    {
      icon: Star,
      text: "Mewujudkan sekolah sebagai pusat keunggulan yang inovatif dan berdaya saing global."
    },
    {
      icon: Heart,
      text: "Menciptakan lingkungan belajar yang kondusif, inklusif, dan menyenangkan."
    }
  ]

  const values = [
    { char: 'P', title: 'Profesional', desc: 'Bekerja dengan kompetensi tinggi.' },
    { char: 'I', title: 'Inovatif', desc: 'Selalu mencari solusi baru.' },
    { char: 'N', title: 'Nasionalis', desc: 'Cinta tanah air dan bangsa.' },
    { char: 'K', title: 'Kompeten', desc: 'Ahli di bidangnya.' },
    { char: 'J', title: 'Jujur', desc: 'Berintegritas dalam tindakan.' },
    { char: 'I', title: 'Iman', desc: 'Berlandaskan nilai religius.' },
    { char: 'T', title: 'Tangguh', desc: 'Pantang menyerah menghadapi tantangan.' },
    { char: 'U', title: 'Unggul', desc: 'Selalu menjadi yang terbaik.' },
  ]

  return (
    <Layout>
      <Head>
        <title>Visi & Misi — SMK Paramitha 2</title>
        <meta name="description" content="Visi, Misi, dan Nilai-nilai luhur SMK Paramitha 2 Jakarta." />
      </Head>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-white text-center">
        <div className="container mx-auto px-6">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-3 rounded-full bg-red-100 text-[#C0161C] font-semibold text-sm mb-4"
          >
            FILOSOFI KAMI
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-[#1E1E8F] mb-6"
          >
            Visi & Misi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Arah dan tujuan kami dalam mencetak generasi penerus bangsa yang berkualitas.
          </motion.p>
        </div>
      </section>

      {/* Visi Section */}
      <section className="py-20 bg-[#1E1E8F] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0161C] rounded-full filter blur-[100px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F5C400] rounded-full filter blur-[100px] opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[#F5C400] mb-8 tracking-widest">VISI</h2>
              <p className="text-3xl md:text-5xl font-bold leading-tight">
                &quot;Menjadi SMK Pusat Keunggulan yang Menghasilkan Tamatan Berkarakter Profil Pelajar Pancasila, Kompeten, Wirausaha, dan Berdaya Saing Global.&quot;
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Misi Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1E8F] mb-4">Misi Sekolah</h2>
            <div className="w-20 h-1 bg-[#C0161C] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {misiList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#F8F8FF] p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#1E1E8F]/10 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-[#C0161C] group-hover:bg-[#C0161C] group-hover:text-white transition-colors">
                  <item.icon size={24} />
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F8F8FF]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1E8F] mb-4">Nilai-Nilai Utama</h2>
            <p className="text-gray-600">PINK JITU sebagai landasan karakter seluruh warga sekolah</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((val, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md text-center border border-gray-100"
              >
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#1E1E8F] to-[#C0161C] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                  {val.char}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{val.title}</h3>
                <p className="text-xs text-gray-500">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

// Helper icon import
import { Globe } from 'lucide-react'

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo()
    return { props: { sekolahInfo: sekolahInfo || null } }
  } catch {
    return { props: { sekolahInfo: null } }
  }
}
