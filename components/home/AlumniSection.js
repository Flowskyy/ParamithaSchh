import { motion } from 'framer-motion';
import SmartImage from '../SmartImage';
import WaveSeparator from '../WaveSeparator';

const Section = ({ children, className, id }) => (
  <section id={id} className={`relative py-20 w-full ${className}`}>
    {children}
  </section>
);

export default function AlumniSection({ alumni }) {
  const alumniList = alumni || [];

  return (
    <div className="w-full bg-[#F0F0FF]">
      <section className="relative py-20 w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-[#C0161C] font-bold tracking-widest uppercase mb-2">Jejak Sukses</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Alumni Berprestasi</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-6 max-w-7xl mx-auto">
          {alumniList.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 w-[calc(25%-9px)] sm:w-[calc(50%-6px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] max-w-[280px]"
            >
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <SmartImage
                  src={item.foto_url || `https://ui-avatars.com/api/?name=${item.nama}&background=random`}
                  alt={item.nama}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-2 md:p-4 relative text-center">
                {/* Jurusan Badge */}
                <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-[#F5C400] text-slate-900 text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full shadow-md">
                  {item.tahun_lulus ? `Lulusan ${item.tahun_lulus}` : 'Alumni'}
                </div>

                <h4 className="text-[10px] md:text-base font-bold text-slate-900 mb-0.5 md:mb-1 line-clamp-1">{item.nama}</h4>
                <p className="text-[#1E1E8F] text-[8px] md:text-xs font-medium mb-1.5 md:mb-3 line-clamp-1">{item.jurusan}</p>

                <div className="pt-1.5 md:pt-3 border-t border-slate-100">
                  <p className="text-[8px] md:text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Karir Saat Ini</p>
                  <p className="font-bold text-slate-800 text-[8px] md:text-xs line-clamp-1">{item.tempat_kerja}</p>
                  <p className="text-slate-600 text-[8px] md:text-xs line-clamp-1">{item.jabatan}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </section>
      
    </div>
  );
}
