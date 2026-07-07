import { motion } from 'framer-motion';
import SmartImage from '../SmartImage';
import WaveSeparator from '../WaveSeparator';

const Section = ({ children, className, id }) => (
  <section id={id} className={`relative py-20 w-full ${className}`}>
    {children}
  </section>
);

export default function MitraSection({ mitra }) {
  const mitraList = mitra || [];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="w-full bg-[#F8F8FF]">
      <section className="relative py-20 w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E8F] mb-4">Mitra Industri Kami</h2>
            <div className="w-20 h-1 bg-[#C0161C] mx-auto rounded-full"></div>
            <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
              Bekerjasama dengan berbagai perusahaan ternama untuk mencetak lulusan siap kerja
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto"
          >
            {mitraList.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#C0161C]/20 group w-[calc(50%-16px)] md:w-[calc(33.333%-21.333px)] lg:w-[calc(25%-24px)]"
              >
                <div className="relative aspect-square flex items-center justify-center">
                  <SmartImage
                    src={item.logo_url}
                    alt={item.nama}
                    fill
                    className="object-contain transition-all duration-300"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h4 className="text-sm font-semibold text-slate-700 group-hover:text-[#C0161C] transition-colors">
                    {item.nama}
                  </h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
