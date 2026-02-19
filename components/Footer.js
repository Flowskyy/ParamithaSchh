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
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm">
                 <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" sizes="40px" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                {info.name}
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm">
              Mewujudkan lulusan yang kompeten, berkarakter, dan siap bersaing di dunia industri global.
            </p>
            <div className="flex gap-4 pt-2">
              {info.facebook && (
                <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300">
                  <Facebook size={16} />
                </a>
              )}
              {info.instagram && (
                <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300">
                  <Instagram size={16} />
                </a>
              )}
              {info.youtube && (
                <a href={info.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300">
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-900">Tautan Cepat</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/tentang/sejarah" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Profil Sekolah
                </Link>
              </li>
              <li>
                <Link href="/jurusan/rpl" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Kompetensi Keahlian
                </Link>
              </li>
              <li>
                <Link href="/ppdb" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Info PPDB
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kompetensi Keahlian */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-900">Jurusan</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/jurusan/rpl" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Rekayasa Perangkat Lunak
                </Link>
              </li>
              <li>
                <Link href="/jurusan/dkv" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Desain Komunikasi Visual
                </Link>
              </li>
              <li>
                <Link href="/jurusan/perhotelan" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Perhotelan
                </Link>
              </li>
              <li>
                <Link href="/jurusan/kuliner" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Kuliner
                </Link>
              </li>
              <li>
                <Link href="/jurusan/ulw" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Usaha Layanan Wisata
                </Link>
              </li>
              <li>
                <Link href="/jurusan/manajemen-logistik" className="text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                  Manajemen Logistik
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-900">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500">
                <MapPin className="text-primary-600 shrink-0 mt-1" size={20} />
                <span>{info.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Phone className="text-primary-600 shrink-0" size={20} />
                <span>{info.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Mail className="text-primary-600 shrink-0" size={20} />
                <span>{info.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} SMK Paramitha 2 Jakarta. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
