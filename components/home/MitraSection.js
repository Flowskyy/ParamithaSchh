import { motion } from 'framer-motion';
import SmartImage from '../SmartImage';

const Section = ({ children, className, id }) => (
  <section id={id} className={`relative py-20 ${className}`}>
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
        staggerChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <Section className="bg-white pb-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#1E1E8F] font-bold tracking-widest uppercase mb-2">Partner & Kerjasama</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Mitra Industri Kami</h3>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center"
        >
          {mitraList.map((item) => (
            <motion.div 
              key={item.id} 
              variants={fadeInUp}
              className="relative aspect-video grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 group"
            >
              <SmartImage 
                src={item.logo_url} 
                alt={item.nama}
                fill
                className="object-contain"
              />
              <div className="absolute -bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold text-slate-600">{item.nama}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
