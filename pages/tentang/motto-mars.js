import Layout from '../../components/Layout';
import Section from '../../components/Section';
import SmartImage from '../../components/SmartImage';
import { Music, Award, Quote, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MottoMars() {
  return (
    <Layout title="Motto & Mars - SMK Paramitha 2 Jakarta">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <SmartImage
          src="https://placehold.co/1920x1080/png?text=Motto+Mars"
          alt="Motto Mars"
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
            <span className="text-primary-400 font-bold tracking-widest uppercase mb-4 block">Semangat & Identitas</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Motto & Mars</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Nilai-nilai luhur yang menjadi nafas pergerakan kami setiap hari.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Motto Section */}
      <Section className="bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
           <div className="absolute top-10 right-10 w-64 h-64 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
           <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
          >
             <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl rotate-3 shadow-lg flex items-center justify-center text-white mb-8 transform hover:rotate-6 transition-transform duration-300">
               <Award size={48} />
             </div>
             
             <h2 className="text-4xl font-bold text-slate-900 mb-8">Motto Sekolah</h2>
             
             <div className="relative py-12 px-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl">
               <Quote className="absolute top-4 left-4 text-primary-200 w-12 h-12 transform -scale-x-100" />
              <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 tracking-tight leading-tight mb-4">
                &quot;PINK JITU&quot;
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-left max-w-2xl mx-auto">
                 <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100">
                   <h4 className="font-bold text-pink-600 text-xl mb-3">PINK</h4>
                   <ul className="space-y-2 text-slate-700">
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-400"></div>Profesional</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-400"></div>Inovatif</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-400"></div>Nasionalis</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-400"></div>Kompeten</li>
                   </ul>
                 </div>
                 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                   <h4 className="font-bold text-blue-600 text-xl mb-3">JITU</h4>
                   <ul className="space-y-2 text-slate-700">
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div>Jujur</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div>Iman</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div>Tangguh</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div>Unggul</li>
                   </ul>
                 </div>
               </div>

               <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-8 font-medium italic">
                 Nilai-nilai utama yang membentuk karakter setiap lulusan SMK Paramitha Jakarta.
               </p>
               <Quote className="absolute bottom-4 right-4 text-primary-200 w-12 h-12" />
             </div>
          </motion.div>
        </div>
      </Section>

      {/* Mars Section */}
      <Section className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src="https://placehold.co/1920x1080/png?text=Mars+Sekolah"
            alt="Background Music"
            fill
            className="opacity-10 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary-400 font-bold tracking-wider text-sm mb-2 block">LAGU KEBANGGAAN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Mars Paramitha</h2>
          </div>

          <div className="flex justify-center items-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl max-w-3xl w-full"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center animate-pulse">
                   <Music size={24} className="text-white" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white">Lirik Mars</h3>
                   <p className="text-slate-400 text-sm">Ciptaan: Yayasan Paramitha</p>
                 </div>
              </div>

              <div className="space-y-6 text-lg leading-relaxed font-medium text-slate-300">
                <p>
                  Kami Para Putra-Putri Siswa Paramitha<br/>
                  Pewaris Penerus Cita Pembangunan Negara<br/>
                  Kami Semua Berusaha Tuk Mencapai Cita-Cita<br/>
                  Giat Belajar Bekerja Berjuang Bersama Gembira
                </p>
                <p>
                  Sekolah Menengah Industri Pariwisata<br/>
                  Serta Teknologi Informatika<br/>
                  Dibina Dididik Jiwa Raganya<br/>
                  Agar Berguna Tuk Nusa Bangsa
                </p>
                <p>
                  Dunia Usaha Kita Memanggil Kita Semua<br/>
                  Marilah Giat Belajar<br/>
                  Jayalah Paramitha Kita<br/>
                  Marilah Giat Belajar<br/>
                  Jayalah Paramitha Kita
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
