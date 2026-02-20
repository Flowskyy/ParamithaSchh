import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { getSekolahInfo, getJurusan } from '../services/api';

// TikTok Icon Component (Inline SVG)
const TikTokIcon = ({ size = 18, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const [info, setInfo] = useState({
    name: 'SMK Paramitha 2 Jakarta',
    phone: '021-8650377 | 021-8651435',
    email: 'smkparamitha2@gmail.com',
    address: 'Jl. Komp. DDN Jl. Raya Kalimalang No. 68 I2, Pondok Kelapa, Kec. Duren Sawit, Kota Jakarta Timur, 13450',
    facebook: 'https://facebook.com/smkparamitha2',
    instagram: 'https://instagram.com/smkparamitha2',
    youtube: 'https://youtube.com/@smkparamitha2',
    tiktok: 'https://tiktok.com/@smkparamitha2'
  });
  const [jurusanList, setJurusanList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getSekolahInfo();
      if (data) setInfo(prev => ({ ...prev, ...data }));

      const jur = await getJurusan();
      if (jur) setJurusanList(jur);
    }
    fetchData();

    const handleDbChange = () => {
      console.log('Refreshing Footer data...');
      fetchData();
    };
    window.addEventListener('db-change', handleDbChange);

    return () => {
      window.removeEventListener('db-change', handleDbChange);
    };
  }, []);

  return (
    <footer className="bg-[#F8F8FF] text-slate-600 relative overflow-hidden">
      
      <div className="container mx-auto px-6 pt-20 pb-8 lg:pt-32 lg:pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 xl:gap-24 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                 <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain" sizes="64px" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900 leading-tight">
                SMK Paramitha 2
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-base">
              Mewujudkan lulusan yang kompeten, berkarakter, dan siap bersaing di dunia industri global.
            </p>
            <div className="flex gap-4">
              <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 min-w-[3rem] min-h-[3rem] shrink-0 rounded-full bg-[#C0161C] flex items-center justify-center text-white hover:bg-[#F5C400] hover:-translate-y-1 transition-all duration-300 shadow-md">
                <Instagram size={20} />
              </a>
              <a href={info.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 min-w-[3rem] min-h-[3rem] shrink-0 rounded-full bg-[#C0161C] flex items-center justify-center text-white hover:bg-[#F5C400] hover:-translate-y-1 transition-all duration-300 shadow-md">
                <Youtube size={20} />
              </a>
              <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 min-w-[3rem] min-h-[3rem] shrink-0 rounded-full bg-[#C0161C] flex items-center justify-center text-white hover:bg-[#F5C400] hover:-translate-y-1 transition-all duration-300 shadow-md">
                <Facebook size={20} />
              </a>
              <a href={info.tiktok} target="_blank" rel="noopener noreferrer" className="w-12 h-12 min-w-[3rem] min-h-[3rem] shrink-0 rounded-full bg-[#C0161C] flex items-center justify-center text-white hover:bg-[#F5C400] hover:-translate-y-1 transition-all duration-300 shadow-md">
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="font-bold text-xl mb-8 text-slate-900 relative inline-block">
              Tautan Cepat
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#F5C400] rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Profil Sekolah', url: '/tentang/sejarah' },
                { name: 'Visi & Misi', url: '/tentang/visi-misi' },
                { name: 'Info PPDB', url: '/ppdb' },
                { name: 'Hubungi Kami', url: '/contact' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.url} className="text-slate-600 hover:text-[#C0161C] transition-colors flex items-center gap-3 group text-base font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#C0161C] transition-colors"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Jurusan */}
          <div>
            <h3 className="font-bold text-xl mb-8 text-slate-900 relative inline-block">
              Program Keahlian
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#1E1E8F] rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {jurusanList.length > 0 ? (
                jurusanList.map((item, idx) => (
                  <li key={idx}>
                    <Link href={`/jurusan/${item.slug}`} className="text-slate-600 hover:text-[#C0161C] transition-colors flex items-center gap-3 group text-base font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#C0161C] transition-colors"></span>
                      {item.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-400">Loading jurusan...</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xl mb-8 text-slate-900 relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#C0161C] rounded-full"></span>
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-base group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#C0161C] group-hover:bg-[#C0161C] group-hover:text-white transition-colors border border-slate-100 shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="leading-relaxed text-slate-600">{info.address}</span>
              </li>
              <li className="flex items-center gap-4 text-base group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#C0161C] group-hover:bg-[#C0161C] group-hover:text-white transition-colors border border-slate-100 shrink-0">
                  <Phone size={20} />
                </div>
                <span className="text-slate-600 font-medium">{info.phone}</span>
              </li>
              <li className="flex items-center gap-4 text-base group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#C0161C] group-hover:bg-[#C0161C] group-hover:text-white transition-colors border border-slate-100 shrink-0">
                  <Mail size={20} />
                </div>
                <span className="text-slate-600 font-medium">{info.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Merged Copyright Section */}
        <div className="pt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-base font-medium">
            <p>© {new Date().getFullYear()} SMK Paramitha 2 Jakarta. All rights reserved.</p>
            <p className="flex items-center gap-3">
              Developed by <span className="text-[#1E1E8F] font-bold text-lg">RPL Students</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
