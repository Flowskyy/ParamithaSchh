import Head from 'next/head'
import { motion } from 'framer-motion'
import { Music, Mic2, PlayCircle } from 'lucide-react'
import Layout from '../../components/Layout'
import { getSekolahInfo } from '../../services/api'
import { fallbackSekolahInfo } from '../../utils/fallbackData'

export default function MottoMarsPage({ sekolahInfo }) {
  const pink = [
    { char: 'P', title: 'Profesional', desc: 'Memiliki kompetensi dan keahlian tinggi dalam bidangnya.' },
    { char: 'I', title: 'Inovatif', desc: 'Selalu menciptakan pembaruan dan solusi kreatif.' },
    { char: 'N', title: 'Nasionalis', desc: 'Menunjung tinggi nilai-nilai kebangsaan dan cinta tanah air.' },
    { char: 'K', title: 'Kompeten', desc: 'Mampu bersaing dan menyelesaikan tugas dengan sangat baik.' },
  ]

  const jitu = [
    { char: 'J', title: 'Jujur', desc: 'Berintegritas, transparan, dan dapat dipercaya dalam tindakan.' },
    { char: 'I', title: 'Iman', desc: 'Berlandaskan ketakwaan kepada Tuhan Yang Maha Esa.' },
    { char: 'T', title: 'Tangguh', desc: 'Kuat mental, pantang menyerah, dan siap menghadapi tantangan.' },
    { char: 'U', title: 'Unggul', desc: 'Selalu berusaha menjadi yang terbaik dan berprestasi.' },
  ]

  const marsLyrics = [
    {
      verse: 1,
      text: [
        "Singsingkan lengan bajumu",
        "Tataplah masa depanmu",
        "SMK Paramitha 2",
        "Wadah insan cendekia"
      ]
    },
    {
      verse: 2,
      text: [
        "Berlandaskan iman dan taqwa",
        "Berakhlak mulia utama",
        "Menguasai teknologi",
        "Siap membangun negeri"
      ]
    },
    {
      verse: "Reff",
      text: [
        "Maju terus pantang mundur",
        "Raih prestasi yang luhur",
        "SMK Paramitha 2",
        "Jayalah s'lama-lamanya"
      ]
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <Layout>
      <Head>
        <title>Motto & Mars — SMK Paramitha 2</title>
        <meta name="description" content="Nilai-nilai PINK JITU dan Mars kebanggaan SMK Paramitha 2 Jakarta." />
      </Head>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#1E1E8F] to-[#C0161C] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>
        
        {/* Animated Background Shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-[100vw] h-[100vw] bg-white/5 rounded-full blur-[100px]"
        />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-bold mb-6 tracking-tight"
          >
            PINK JITU
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-light text-white/80 max-w-3xl mx-auto"
          >
            Fondasi karakter insan SMK Paramitha 2 dalam menyongsong masa depan gemilang.
          </motion.p>
        </div>
      </section>

      {/* PINK JITU Section */}
      <section className="py-20 bg-[#F8F8FF]">
        <div className="container mx-auto px-6">
          
          {/* PINK ROW */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          >
            {pink.map((val, idx) => (
              <motion.div key={idx} variants={item}>
                <ValueCard val={val} />
              </motion.div>
            ))}
          </motion.div>

          {/* JITU ROW */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {jitu.map((val, idx) => (
              <motion.div key={idx} variants={item}>
                <ValueCard val={val} />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Mars Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#F8F8FF] to-white"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C0161C] text-white rounded-full mb-6 shadow-lg">
              <Music size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E8F] mb-4">Mars SMK Paramitha 2</h2>
            <p className="text-gray-500 italic">Cipt. Yayasan Pendidikan Paramitha</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {marsLyrics.map((block, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-none border border-[#F5C400]/30 shadow-sm hover:shadow-xl transition-shadow duration-500 relative"
              >
                <div className="absolute -top-4 -left-4 text-6xl font-serif text-[#F5C400]/20 pointer-events-none">
                  {block.verse}
                </div>
                <div className="space-y-2 text-center">
                  {block.text.map((line, i) => (
                    <p key={i} className="text-gray-700 font-medium text-lg leading-relaxed font-serif">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="w-8 h-1 bg-[#C0161C] mx-auto mt-6 rounded-full opacity-50"></div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-[#1E1E8F] text-white rounded-full hover:bg-[#151570] transition-colors shadow-lg group">
              <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
              Putar Mars
            </button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function ValueCard({ val }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full border-t-4 border-[#F5C400] group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F5C400]/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
      
      <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#F5C400] to-[#C0161C] mb-4">
        {val.char}
      </div>
      <h3 className="text-2xl font-bold text-[#1E1E8F] mb-3 group-hover:text-[#C0161C] transition-colors">
        {val.title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {val.desc}
      </p>
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo()
    return { props: { sekolahInfo: sekolahInfo || null } }
  } catch {
    return { props: { sekolahInfo: null } }
  }
}
