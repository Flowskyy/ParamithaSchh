import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { CheckCircle, ClipboardList, Loader2 } from 'lucide-react';
import { getSekolahInfo, createPendaftar, getJadwalPPDB, getPersyaratanPPDB, getJurusan } from '../services/api';
import { showToast } from '../utils/toast';

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function PPDB({ sekolahInfo, jadwalInfo, persyaratanInfo, jurusanList }) {
  const [formData, setFormData] = useState({
    nama: '',
    nisn: '',
    asal_sekolah: '',
    email: '',
    whatsapp: '',
    jurusan: 'RPL',
    pesan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown Timer Logic
  useEffect(() => {
    const targetDate = new Date('2026-03-31T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Use fetched jurusan data or fallback
  const jurusanOptions = jurusanList && jurusanList.length > 0 
    ? jurusanList.map(j => j.slug.toUpperCase()) 
    : ["RPL", "TKJ", "MM", "AK", "PH"]; // Fallback codes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate loading/toast
    const toastId = showToast.loading('Menyiapkan pesan WhatsApp...');

    try {
      // 1. Simpan ke Database (Opsional, tapi bagus untuk backup)
      const payload = {
        ...formData,
        created_at: new Date().toISOString()
      };
      await createPendaftar(payload);

      // 2. Redirect ke WhatsApp
      const waNumber = '6282124706301';
      const cleanNumber = waNumber.replace(/\D/g, '');
      const finalNumber = cleanNumber;

      const message = `*PENDAFTARAN PPDB ONLINE - SMK PARAMITHA 2*%0A%0A` +
        `*Nama:* ${formData.nama}%0A` +
        `*NISN:* ${formData.nisn}%0A` +
        `*Asal Sekolah:* ${formData.asal_sekolah}%0A` +
        `*Email:* ${formData.email}%0A` +
        `*WhatsApp:* ${formData.whatsapp}%0A` +
        `*Jurusan Pilihan:* ${formData.jurusan}%0A` +
        `*Pesan:* ${formData.pesan || '-'}%0A%0A` +
        `_Mohon informasi selanjutnya terkait pendaftaran ini. Terima kasih._`;

      showToast.success('Mengarahkan ke WhatsApp...', toastId);
      
      // Small delay before redirect
      setTimeout(() => {
        window.open(`https://wa.me/${finalNumber}?text=${message}`, '_blank');
        setIsSubmitting(false);
      }, 1000);

    } catch (err) {
      showToast.error('Terjadi kesalahan sistem.', toastId);
      console.error("System Error:", err);
      setIsSubmitting(false);
    }
  };

  // Fallback data if the API returns empty
  const jadwal = jadwalInfo?.length > 0 ? jadwalInfo : [
    { title: "Gelombang 1", date: "Januari - Maret 2026", status: "Sedang Berlangsung" },
    { title: "Gelombang 2", date: "April - Juni 2026", status: "Akan Datang" },
    { title: "Gelombang 3", date: "Juli 2026", status: "Akan Datang" },
  ];

  const persyaratan = persyaratanInfo?.length > 0 ? persyaratanInfo.map(p => p.deskripsi) : [
    "Fotocopy Ijazah SMP/MTs (legalisir)",
    "Fotocopy Kartu Keluarga (KK)",
    "Fotocopy Akta Kelahiran",
    "Pas Foto 3x4 (4 lembar)",
    "Fotocopy KTP Orang Tua"
  ];



  return (
    <Layout 
      title="Pendaftaran PPDB 2026 — SMK Paramitha 2 Jakarta"
      description="Daftar PPDB SMK Paramitha 2 Jakarta tahun ajaran 2026/2027. Pilih jurusan impianmu: RPL, DKV, Perhotelan, Kuliner, dan ULW. Proses mudah via WhatsApp!"
      keywords="PPDB SMK 2026, Pendaftaran SMK Jakarta, Jurusan RPL Jakarta, Beasiswa SMK Jakarta"
    >
      {/* 1. Hero Section */}
      <section className="relative min-h-screen md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-[url('/assets/images/Carousel.png')] bg-cover bg-center"
            style={{ filter: 'brightness(0.5)' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(192,22,28,0.75)] to-[rgba(30,30,143,0.85)] mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Breadcrumb */}
            <nav className="flex justify-center items-center text-sm text-white/80 mb-6 space-x-2">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span>&gt;</span>
              <span className="text-white font-semibold">PPDB Online</span>
            </nav>

            {/* Badge */}
            <span className="inline-block px-4 py-2 bg-[#F5C400] text-[#1E1E8F] font-bold rounded-full text-sm mb-6 shadow-lg shadow-yellow-500/20">
              PPDB 2025/2026
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Bergabunglah Bersama<br/>Generasi Juara
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light">
              Daftarkan dirimu sekarang di SMK Paramitha 2 Jakarta
            </p>

            {/* Countdown Timer */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {['Hari', 'Jam', 'Menit', 'Detik'].map((label, idx) => {
                const values = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds];
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F5C400] rounded-xl flex items-center justify-center text-[#1E1E8F] text-3xl md:text-4xl font-bold shadow-lg border-2 border-[#1E1E8F]/20">
                      {String(values[idx]).padStart(2, '0')}
                    </div>
                    <span className="text-white text-sm mt-2 font-medium uppercase tracking-wider">{label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Section Jadwal Pendaftaran */}
      <section className="py-20 bg-[#F8F8FF]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1E1E8F] mb-4">Jadwal Pendaftaran</h2>
            <div className="w-20 h-1 bg-[#C0161C] mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jadwal.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`bg-white rounded-2xl p-6 shadow-lg border-t-4 h-full flex flex-col justify-between ${
                  item.status === 'Sedang Berlangsung' 
                    ? 'border-[#C0161C] shadow-red-100' 
                    : item.status === 'Akan Datang' && item.title.includes('2') 
                      ? 'border-[#1E1E8F]' 
                      : 'border-slate-400'
                }`}
              >
                <div>
                  <h3 className="text-xl font-bold text-[#0A0A1A] mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] mb-4">{item.date}</p>
                </div>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    item.status === 'Sedang Berlangsung' 
                      ? 'bg-red-100 text-[#C0161C] animate-pulse' 
                      : item.status === 'Akan Datang' && item.title.includes('2') 
                        ? 'bg-indigo-100 text-[#1E1E8F]' 
                        : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Section Persyaratan Berkas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* List Requirements */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[#1E1E8F] mb-8">Persyaratan Berkas</h2>
              <ul className="space-y-4">
                {persyaratan.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F8F8FF] transition-colors border border-transparent hover:border-slate-100">
                    <CheckCircle className="text-[#F5C400] shrink-0 mt-0.5" size={24} />
                    <span className="text-[#0A0A1A] font-medium">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Decorative Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#1E1E8F] rounded-3xl p-10 text-white text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-[#F5C400] rounded-full flex items-center justify-center mx-auto mb-6 text-[#1E1E8F] shadow-lg">
                  <ClipboardList size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Siapkan Berkas</h3>
                <p className="text-white/80">
                  Pastikan semua dokumen sudah lengkap sebelum melakukan pendaftaran online maupun offline.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Section Formulir Pendaftaran */}
      <section className="py-20 bg-[#F8F8FF]" id="form-daftar">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-1 bg-gradient-to-r from-[#C0161C] via-[#1E1E8F] to-[#C0161C]"></div>
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#0A0A1A] mb-2">Formulir Pendaftaran</h2>
                <p className="text-[#6B7280]">Isi data diri Anda dengan lengkap dan benar.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A0A1A]">Nama Lengkap</label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                        placeholder="Sesuai Ijazah"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A0A1A]">NISN</label>
                      <input
                        type="text"
                        name="nisn"
                        value={formData.nisn}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                        placeholder="Nomor Induk Siswa Nasional"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A0A1A]">Asal Sekolah</label>
                      <input
                        type="text"
                        name="asal_sekolah"
                        value={formData.asal_sekolah}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                        placeholder="Nama SMP/MTs Asal"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A0A1A]">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A0A1A]">No. WhatsApp</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        required
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                        placeholder="0812..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#0A0A1A]">Pilihan Jurusan</label>
                      <select
                        name="jurusan"
                        value={formData.jurusan}
                        onChange={handleChange}
                        className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                      >
                        {jurusanOptions.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Full Width */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0A0A1A]">Pesan / Pertanyaan (Opsional)</label>
                  <textarea
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    rows="4"
                    className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all resize-none"
                    placeholder="Ada pertanyaan tambahan?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C0161C] text-white font-bold py-4 rounded-xl hover:bg-[#A01217] transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Mengirim Pendaftaran...
                    </>
                  ) : (
                    "Kirim Pendaftaran"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Section CTA WhatsApp */}
      <section className="py-20 bg-gradient-to-r from-[#C0161C] to-[#1E1E8F] text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Butuh Bantuan Pendaftaran?
            </h2>
            <a
              href="https://wa.me/6282124706301"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold px-8 py-4 rounded-full hover:bg-[#20bd5a] transition-all transform hover:scale-105 shadow-xl"
            >
              <WhatsAppIcon size={24} />
              Chat WhatsApp Sekarang
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [sekolahInfo, jadwalInfo, persyaratanInfo, jurusanList] = await Promise.all([
      getSekolahInfo(),
      getJadwalPPDB(),
      getPersyaratanPPDB(),
      getJurusan()
    ]);
    
    return { 
      props: { 
        sekolahInfo: sekolahInfo || null,
        jadwalInfo: jadwalInfo || [],
        persyaratanInfo: persyaratanInfo || [],
        jurusanList: jurusanList || []
      } 
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { 
      props: { 
        sekolahInfo: null, 
        jadwalInfo: [], 
        persyaratanInfo: [],
        jurusanList: [] 
      } 
    };
  }
}
