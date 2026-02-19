import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Globe } from 'lucide-react';
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
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                 <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" sizes="48px" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 leading-tight">
                {info.name}
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm">
              Mewujudkan lulusan yang kompeten, berkarakter, dan siap bersaing di dunia industri global.
            </p>
            <div className="flex gap-3 pt-2">
              {info.facebook && (
                <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md">
                  <Facebook size={18} />
                </a>
              )}
              {info.instagram && (
                <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300 shadow-sm hover:shadow-md">
                  <Instagram size={18} />
                </a>
              )}
              {info.youtube && (
                <a href={info.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-md">
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Links Grid for Mobile/Desktop */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-slate-900 border-b border-slate-200 pb-2 inline-block">Tautan Cepat</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/tentang/sejarah" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50 group-hover:bg-primary-600 transition-colors"></span>
                      Profil Sekolah
                    </Link>
                  </li>
                  <li>
                    <Link href="/jurusan/rpl" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50 group-hover:bg-primary-600 transition-colors"></span>
                      Kompetensi Keahlian
                    </Link>
                  </li>
                  <li>
                    <Link href="/ppdb" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50 group-hover:bg-primary-600 transition-colors"></span>
                      Info PPDB
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50 group-hover:bg-primary-600 transition-colors"></span>
                      Hubungi Kami
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Jurusan */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-slate-900 border-b border-slate-200 pb-2 inline-block">Program Keahlian</h3>
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
                      <Link href={item.url} className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50 group-hover:bg-primary-600 transition-colors"></span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-slate-900 border-b border-slate-200 pb-2 inline-block">Kontak</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-500">
                    <MapPin className="text-primary-600 shrink-0 mt-1" size={20} />
                    <span className="text-sm leading-relaxed">{info.address}</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-500">
                    <Phone className="text-primary-600 shrink-0" size={20} />
                    <span className="text-sm">{info.phone}</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-500">
                    <Mail className="text-primary-600 shrink-0" size={20} />
                    <span className="text-sm">{info.email}</span>
                  </li>
                </ul>
              </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} SMK Paramitha 2 Jakarta. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
            <Link href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
