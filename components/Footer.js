import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { getSekolahInfo } from '../services/api';

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

  useEffect(() => {
    async function fetchData() {
      const data = await getSekolahInfo();
      if (data) setInfo(prev => ({ ...prev, ...data }));
    }
    fetchData();
  }, []);

  return (
    <footer className="bg-[#F8F8FF] text-slate-600 relative overflow-hidden">
      {/* Top Border Gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1E1E8F] to-[#C0161C]" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                 <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" sizes="48px" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 leading-tight">
                SMK Paramitha 2
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm">
              Mewujudkan lulusan yang kompeten, berkarakter, dan siap bersaing di dunia industri global.
            </p>
            <div className="flex gap-3">
              <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#C0161C] flex items-center justify-center text-white hover:bg-[#F5C400] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                <Instagram size={18} />
              </a>
              <a href={info.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#C0161C] flex items-center justify-center text-white hover:bg-[#F5C400] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                <Youtube size={18} />
              </a>
              <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#C0161C] flex items-center justify-center text-white hover:bg-[#F5C400] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                <Facebook size={18} />
              </a>
              <a href={info.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#C0161C] flex items-center justify-center text-white hover:bg-[#F5C400] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-900">Tautan Cepat</h3>
            <ul className="space-y-3">
              {[
                { name: 'Profil Sekolah', url: '/tentang/sejarah' },
                { name: 'Visi & Misi', url: '/tentang/visi-misi' },
                { name: 'Info PPDB', url: '/ppdb' },
                { name: 'Hubungi Kami', url: '/contact' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.url} className="text-slate-600 hover:text-[#C0161C] transition-colors flex items-center gap-2 group text-sm">
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-[#C0161C] transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Jurusan */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-900">Program Keahlian</h3>
            <ul className="space-y-3">
              {[
                { name: 'Rekayasa Perangkat Lunak', url: '/jurusan/rpl' },
                { name: 'Desain Komunikasi Visual', url: '/jurusan/dkv' },
                { name: 'Perhotelan', url: '/jurusan/perhotelan' },
                { name: 'Kuliner', url: '/jurusan/kuliner' },
                { name: 'Usaha Layanan Wisata', url: '/jurusan/ulw' },
                { name: 'Manajemen Logistik', url: '/jurusan/manajemen-logistik' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.url} className="text-slate-600 hover:text-[#C0161C] transition-colors flex items-center gap-2 group text-sm">
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-[#C0161C] transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-900">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="text-[#C0161C] shrink-0 mt-1" size={18} />
                <span className="leading-relaxed">{info.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="text-[#C0161C] shrink-0" size={18} />
                <span>{info.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="text-[#C0161C] shrink-0" size={18} />
                <span>{info.email}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="w-full bg-[#1E1E8F] py-4 px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-white font-medium text-sm">
          <p>© {new Date().getFullYear()} SMK Paramitha 2 Jakarta. All rights reserved.</p>
          <p>Developed by RPL Students SMK Paramitha 2</p>
        </div>
      </div>
    </footer>
  );
}
