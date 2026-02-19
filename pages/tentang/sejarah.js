import Layout from '../../components/Layout';
import Section from '../../components/Section';
import SmartImage from '../../components/SmartImage';
import { motion } from 'framer-motion';

export default function Sejarah() {
  const milestones = [
    { year: "1989", title: "Berdiri sebagai SMIP Paramitha", desc: "Awal mula perjalanan kami di dunia pendidikan pariwisata." },
    { year: "1990", title: "Status 'Disamakan'", desc: "Mendapat pengakuan kualitas pendidikan dan dipercaya menyelenggarakan EBTA." },
    { year: "2000", title: "Sertifikasi ISO 9001:2000", desc: "Komitmen terhadap manajemen mutu pendidikan bertaraf internasional." },
    { year: "2019", title: "SMK Paramitha 2 Jakarta", desc: "Transformasi dan ekspansi dengan membuka kompetensi keahlian baru." }
  ];

  return (
    <Layout title="Sejarah - SMK Paramitha 2 Jakarta">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <SmartImage
          src="https://placehold.co/1920x1080/png?text=Sejarah+Sekolah"
          alt="Sejarah Sekolah"
          fill
          className="opacity-40 w-full h-full object-cover"
          priority
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase mb-4 block">Perjalanan Kami</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Sejarah & Milestone</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Dedikasi lebih dari 30 tahun mencetak tenaga profesional yang kompeten dan berkarakter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg text-slate-600 leading-relaxed"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Awal Mula & Perkembangan</h2>
            <p className="mb-6">
              SMK Paramitha memiliki sejarah panjang dalam dunia pendidikan vokasi di Indonesia. Berdiri sejak tahun 1989 dengan nama awal <strong>SMIP PARAMITHA</strong>, sekolah ini telah mendedikasikan diri untuk mencetak tenaga profesional di bidang pariwisata dan teknologi.
            </p>
            <p className="mb-6">
              Pada bulan Januari 1990, SMIP Paramitha mendapatkan status &quot;Disamakan&quot;, sebuah pengakuan atas kualitas pendidikan yang diselenggarakan. Kepercayaan ini membawa sekolah kami menjadi pusat penyelenggaraan Evaluasi Belajar Tahap Akhir (EBTA) bagi berbagai sekolah pariwisata di wilayah Jakarta dan sekitarnya.
            </p>
            <p>
              Seiring berjalannya waktu, kami terus berinovasi menyesuaikan kebutuhan industri 4.0 dengan membuka kompetensi keahlian baru seperti Desain Komunikasi Visual (DKV), Rekayasa Perangkat Lunak (RPL), dan Kuliner.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <SmartImage
              src="https://placehold.co/800x600/png?text=Gedung+Sekolah"
              alt="Gedung Sekolah Lama"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
              <p className="text-white/90 italic">&quot;Gedung sekolah kami terus berkembang seiring dengan peningkatan kualitas pendidikan.&quot;</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Timeline Section */}
      <Section className="bg-slate-50">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-bold tracking-wider text-sm mb-2 block">MILESTONE</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Jejak Langkah Kami</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-slate-200 hidden md:block"></div>

          <div className="space-y-12">
            {milestones.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 w-full md:w-1/2 p-6 bg-white rounded-2xl shadow-lg border border-slate-100 hover:border-primary-200 transition-colors relative group">
                   <div className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-md z-10 ${idx % 2 === 0 ? '-left-[42px]' : '-right-[42px]'}`}></div>
                   <span className="text-4xl font-bold text-primary-100 absolute top-4 right-6 group-hover:text-primary-50 transition-colors">{item.year}</span>
                   <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">{item.title}</h3>
                   <p className="text-slate-600 relative z-10">{item.desc}</p>
                </div>
                <div className="w-8 md:w-0"></div> {/* Spacer for mobile */}
                <div className="flex-1 md:w-1/2 text-center md:text-left hidden md:block">
                  <span className="text-5xl font-bold text-slate-200">{item.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </Layout>
  );
}
