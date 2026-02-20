import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Globe, ChevronRight } from 'lucide-react';
import { getSekolahInfo } from '../services/api';

export default function Footer() {
  const [info, setInfo] = useState({
    name: 'SMK Paramitha 2 Jakarta',
    phone: '021-8650377 | 021-8651435',
    email: 'smkparamitha2@gmail.com',
    address: 'Jl. Komp. DDN Jl. Raya Kalimalang No. 68 I2, Pondok Kelapa, Kec. Duren Sawit, Kota Jakarta Timur, 13450',
    facebook: '#',
    instagram: 'https://www.instagram.com/smkparamithajakartaofficial/',
    youtube: '#'
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getSekolahInfo();
      if (data) setInfo(data);
    }
    fetchData();
  }, []);

  return (
    <footer className="bg-[#0A0A1A] text-slate-300 border-t border-slate-900 pt-20 pb-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-800">
                 <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" sizes="48px" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white leading-tight">
                {info.name}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Mewujudkan lulusan yang kompeten, berkarakter, dan siap bersaing di dunia industri global.
            </p>
            <div className="flex gap-3">
              {info.facebook && (
                <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                  <Facebook size={18} />
                </a>
              )}
              {info.instagram && (
                <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300">
                  <Instagram size={18} />
                </a>
              )}
              {info.youtube && (
                <a href={info.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300">
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Tautan Cepat</h3>
            <ul className="space-y-3">
              {[
                { name: 'Profil Sekolah', url: '/tentang/sejarah' },
                { name: 'Visi & Misi', url: '/tentang/visi-misi' },
                { name: 'Info PPDB', url: '/ppdb' },
                { name: 'Hubungi Kami', url: '/contact' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.url} className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm">
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-primary-500 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Jurusan */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Program Keahlian</h3>
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
                  <Link href={item.url} className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm">
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-primary-500 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="text-primary-500 shrink-0 mt-1" size={18} />
                <span className="text-sm leading-relaxed">{info.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="text-primary-500 shrink-0" size={18} />
                <span className="text-sm">{info.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="text-primary-500 shrink-0" size={18} />
                <span className="text-sm">{info.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} SMK Paramitha 2 Jakarta. Developed with ❤️ by Students.
          </p>
          <div className="flex gap-6 text-xs text-slate-500 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}