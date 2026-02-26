import { motion } from 'framer-motion';
import SmartImage from '../SmartImage';
import WaveSeparator from '../WaveSeparator';

const Section = ({ children, className, id }) => (
  <section id={id} className={`relative py-20 ${className}`}>
    {children}
  </section>
);

export default function AlumniSection({ alumni }) {
  const alumniList = alumni || [];

  return (
    <Section className="bg-[#F0F0FF] pb-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#C0161C] font-bold tracking-widest uppercase mb-2">Jejak Sukses</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Alumni Berprestasi</h3>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center">
          {alumniList.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 max-w-[280px] mx-auto w-full"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <SmartImage 
                  src={item.foto_url || `https://ui-avatars.com/api/?name=${item.nama}&background=random`} 
                  alt={item.nama}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-4 relative">
                {/* Jurusan Badge */}
                <div className="absolute -top-3 right-4 bg-[#F5C400] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  {item.angkatan ? `Angkatan ${item.angkatan}` : 'Alumni'}
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">{item.nama}</h4>
                <p className="text-[#1E1E8F] text-xs font-medium mb-3 line-clamp-1">{item.jurusan}</p>
                
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Karir Saat Ini</p>
                  <p className="font-bold text-slate-800 text-xs line-clamp-1">{item.perusahaan}</p>
                  <p className="text-slate-600 text-xs line-clamp-1">{item.jabatan || item.posisi}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <WaveSeparator position="bottom" color="#ffffff" height="100px" />
    </Section>
  );
}
