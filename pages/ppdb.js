import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Section from '../components/Section';
import SmartImage from '../components/SmartImage';
import { CheckCircle, Calendar, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSekolahInfo } from '../services/api';

export default function PPDB({ sekolahInfo }) {
  const [formData, setFormData] = useState({
    nama: '',
    nisn: '',
    asal_sekolah: '',
    email: '',
    whatsapp: '',
    jurusan: 'Rekayasa Perangkat Lunak'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `Halo Admin PPDB SMK Paramitha 2 Jakarta,
Saya ingin mendaftar dengan data berikut:

Nama: ${formData.nama}
NISN: ${formData.nisn}
Asal Sekolah: ${formData.asal_sekolah}
Email: ${formData.email}
No. WhatsApp: ${formData.whatsapp}
Pilihan Jurusan: ${formData.jurusan}

Mohon informasi lebih lanjut. Terima kasih.`;

    // Ganti nomor WA berikut dengan nomor admin yang sesuai
    const adminPhone = '6289652885966'; // Contoh nomor, silakan diganti
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Layout title="PPDB Online - SMK Paramitha 2 Jakarta">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <SmartImage
            src="https://placehold.co/1920x1080/png?text=PPDB"
            alt="PPDB SMK Paramitha 2 Jakarta"
            fill
            className="opacity-30 w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase mb-4 block">Penerimaan Peserta Didik Baru</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Bergabunglah Bersama Kami</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Siapkan masa depan gemilang dengan pendidikan vokasi berkualitas di SMK Paramitha 2 Jakarta.
            </p>
            <div className="mt-8">
              <Link href="#form-daftar" className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-1">
                Daftar Sekarang
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Section className="bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Pendaftaran */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Calendar className="text-primary-500" /> Jadwal Pendaftaran
              </h3>
              <div className="space-y-6 relative">
                <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-slate-200"></div>
                
                {[
                  { title: "Gelombang 1", date: "Januari - Maret 2026", status: "Sedang Berlangsung" },
                  { title: "Gelombang 2", date: "April - Juni 2026", status: "Akan Datang" },
                  { title: "Gelombang 3", date: "Juli 2026", status: "Akan Datang" },
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-12">
                    <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full border-4 border-white shadow-sm ${
                      item.status === 'Sedang Berlangsung' ? 'bg-primary-500 animate-pulse' : 'bg-slate-200'
                    }`}></div>
                    <h4 className="text-slate-900 font-bold">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.date}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                      item.status === 'Sedang Berlangsung' ? 'bg-primary-500/10 text-primary-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <FileText className="text-primary-500" /> Persyaratan Berkas
              </h3>
              <ul className="space-y-3">
                {[
                  "Fotocopy Ijazah SMP/MTs (legalisir)",
                  "Fotocopy Kartu Keluarga (KK)",
                  "Fotocopy Akta Kelahiran",
                  "Pas Foto 3x4 (4 lembar)",
                  "Fotocopy KTP Orang Tua"
                ].map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle size={18} className="text-green-500 shrink-0 mt-1" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form Pendaftaran */}
          <div id="form-daftar" className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-lg sticky top-24">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Formulir Pendaftaran</h3>
            <p className="text-slate-500 mb-8 text-sm">Isi data diri anda dengan benar untuk melakukan pendaftaran online.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" 
                    placeholder="Nama Sesuai Ijazah" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">NISN</label>
                  <input 
                    type="text" 
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" 
                    placeholder="Nomor Induk Siswa Nasional" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Asal Sekolah</label>
                <input 
                  type="text" 
                  name="asal_sekolah"
                  value={formData.asal_sekolah}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" 
                  placeholder="Nama SMP/MTs Asal" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" 
                    placeholder="email@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">No. WhatsApp</label>
                  <input 
                    type="tel" 
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all" 
                    placeholder="08xxxxxxxxxx" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Pilihan Jurusan</label>
                <select 
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all appearance-none"
                >
                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="Usaha Layanan Wisata">Usaha Layanan Wisata (ULW)</option>
                  <option value="Perhotelan">Perhotelan</option>
                  <option value="Desain Komunikasi Visual">Desain Komunikasi Visual (DKV)</option>
                  <option value="Kuliner">Kuliner</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-1 mt-6"
              >
                Kirim Pendaftaran
              </button>
            </form>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo();
    
    if (!sekolahInfo) {
      console.log('DEBUG: Sekolah Info is empty from Supabase (ppdb page)');
    }

    return { props: { sekolahInfo: sekolahInfo || null } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    console.log('DEBUG: Error fetching sekolah info (ppdb page)');
    return { props: { sekolahInfo: null } };
  }
}
