import Layout from '../../components/Layout';
import Section from '../../components/Section';
import SmartImage from '../../components/SmartImage';
import { Target, Compass, Award, Users, Globe, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisiMisi() {
  const missions = [
    { icon: <BookOpen size={24} />, text: "Mendidik dan membekali siswa mandiri, beriman dan bertaqwa kepada Tuhan Yang Maha Esa." },
    { icon: <Compass size={24} />, text: "Mendidik dan melatih keterampilan siswa di bidang usaha perjalanan wisata, multimedia, perhotelan dan kuliner." },
    { icon: <Globe size={24} />, text: "Mendidik dan melatih siswa mampu berkomunikasi dalam bahasa asing, terutama Bahasa Inggris." },
    { icon: <Target size={24} />, text: "Meningkatkan kemampuan berpikir kreatif dan inovatif di bidangnya." },
    { icon: <Users size={24} />, text: "Menyesuaikan kompetensi pendidik berdasarkan kebutuhan." },
    { icon: <Award size={24} />, text: "Menyempurnakan sarana dan prasarana." }
  ];

  return (
    <Layout title="Visi & Misi - SMK Paramitha 2 Jakarta">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <SmartImage
          src="https://placehold.co/1920x1080/png?text=Visi+Misi"
          alt="Visi Misi"
          fill
          className="opacity-40 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase mb-4 block">Arah & Tujuan</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Visi & Misi</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Landasan kokoh dalam mencetak generasi penerus bangsa yang berkualitas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Visi Section */}
      <Section className="bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>
            
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 mx-auto bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-8"
            >
              <Target size={48} />
            </motion.div>

            <h2 className="text-4xl font-bold text-slate-900 mb-8">Visi Sekolah</h2>
            
            <div className="relative">
              <QuoteIcon className="absolute -top-6 -left-4 text-primary-100 w-16 h-16 transform -scale-x-100" />
              <blockquote className="text-2xl md:text-3xl text-slate-800 font-serif italic leading-relaxed relative z-10">
                &quot;Berkarakter, Kompeten dan Mampu Bersaing di Era Masyarakat Global.&quot;
              </blockquote>
              <QuoteIcon className="absolute -bottom-6 -right-4 text-primary-100 w-16 h-16" />
            </div>
          </motion.div>
        </div>
      </Section>


      {/* Misi Section */}
      <Section className="bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-bold tracking-wider text-sm mb-2 block">STRATEGI KAMI</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Misi Sekolah</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {missions.map((misi, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:border-primary-200 transition-all group ${
                  idx === missions.length - 1 && missions.length % 2 !== 0 ? 'md:col-span-2 md:w-2/3 md:mx-auto' : ''
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {misi.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">Misi {idx + 1}</h3>
                    <p className="text-slate-600 leading-relaxed">{misi.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </Layout>
  );
}

function QuoteIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
    </svg>
  );
}

