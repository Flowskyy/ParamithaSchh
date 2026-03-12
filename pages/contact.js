import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Loader2, Instagram, Youtube, Facebook } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Using direct toast as per common pattern, or utils if preferred. The prompt mentioned toastSuccess.
import { getSekolahInfo } from '../services/api';
import { fallbackSekolahInfo } from '../utils/fallbackData';
import { showToast } from '../utils/toast';

// TikTok Icon Component (Outlined to match Lucide)
const TikTokIcon = ({ size = 20, className = "" }) => (
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

export default function ContactPage({ sekolahInfo }) {
  const [info, setInfo] = useState(sekolahInfo || fallbackSekolahInfo);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update info if props change
  useEffect(() => {
    if (sekolahInfo) setInfo(sekolahInfo);
  }, [sekolahInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = showToast.loading('Menyiapkan pesan WhatsApp...');

    try {
      // Use wa_kontak from API data, fallback to fallbackSekolahInfo
      const waNumber = info.wa_kontak || fallbackSekolahInfo.wa_kontak;
      const cleanNumber = waNumber.replace(/\D/g, '');
      const finalNumber = cleanNumber;

      const message = `*PESAN BARU - HUBUNGI KAMI*%0A%0A` +
        `*Nama:* ${formData.name}%0A` +
        `*Email:* ${formData.email}%0A` +
        `*WhatsApp:* ${formData.phone}%0A` +
        `*Subjek:* ${formData.subject}%0A` +
        `*Pesan:* ${formData.message}%0A%0A` +
        `_Pesan dikirim dari website SMK Paramitha 2 Jakarta._`;

      showToast.success('Mengarahkan ke WhatsApp...', toastId);
      
      setTimeout(() => {
        window.open(`https://wa.me/${finalNumber}?text=${message}`, '_blank');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      showToast.error('Gagal membuka WhatsApp', toastId);
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: 'Instagram', url: info.instagram || '#', icon: Instagram },
    { name: 'YouTube', url: info.youtube || '#', icon: Youtube },
    { name: 'Facebook', url: info.facebook || '#', icon: Facebook },
    { name: 'TikTok', url: info.tiktok || '#', icon: TikTokIcon },
  ];

  return (
    <Layout 
      title="Hubungi Kami — SMK Paramitha 2 Jakarta"
      description="Hubungi SMK Paramitha 2 Jakarta untuk informasi pendaftaran PPDB, kerjasama industri, atau pertanyaan umum."
      keywords="Kontak SMK Paramitha 2, Lokasi SMK Paramitha 2, Alamat SMK Jakarta Timur"
    >
      <div className="bg-[#F8F9FF] min-h-screen" data-section="contact/root" aria-label="Contact Page Root">

      <section className="relative py-24 bg-gradient-to-r from-[#C0161C] to-[#1E1E8F] overflow-hidden" data-section="contact/hero" aria-label="Contact Hero">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="flex justify-center items-center text-sm text-white/80 mb-4 space-x-2">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span>&gt;</span>
              <span className="text-white font-semibold">Hubungi Kami</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-sans">
              Hubungi Kami
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light">
              Punya pertanyaan? Kami siap membantu kamu.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F8F8FF]" data-section="contact/content" aria-label="Contact Content">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#1E1E8F] text-white p-8 md:p-12 rounded-2xl shadow-xl h-full flex flex-col justify-between relative overflow-hidden"
              data-section="contact/info-card"
              aria-label="Contact Info Card"
            >
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              
              <div>
                <h2 className="text-3xl font-bold mb-8">Informasi Kontak</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-full text-[#F5C400]">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Alamat</h3>
                      <p className="text-white/80 leading-relaxed">
                        {info.address || fallbackSekolahInfo.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-full text-[#F5C400]">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Telepon</h3>
                      <p className="text-white/80">
                        {info.phone || fallbackSekolahInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-full text-[#F5C400]">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <p className="text-white/80">
                        {info.email || fallbackSekolahInfo.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-full text-[#F5C400]">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Jam Operasional</h3>
                      <p className="text-white/80">
                        Senin - Jumat: 07:00 - 16:00<br />
                        Sabtu: 08:00 - 12:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-semibold text-lg mb-4">Ikuti Kami</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#F5C400] text-[#1E1E8F] flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                      aria-label={social.name}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-100"
              data-section="contact/form-card"
              aria-label="Contact Form Card"
            >
              <h2 className="text-3xl font-bold text-[#0A0A1A] mb-2">Kirim Pesan</h2>
              <p className="text-[#6B7280] mb-8">Silakan isi formulir di bawah ini.</p>

              <form onSubmit={handleSubmit} className="space-y-6" data-section="contact/form" aria-label="Contact Form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0A0A1A]">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0A0A1A]">Nomor HP</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                      placeholder="0812..."
                    />
                  </div>
                </div>

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
                  <label className="text-sm font-medium text-[#0A0A1A]">Subjek</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all"
                    placeholder="Judul pesan"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0A0A1A]">Pesan</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="input-field w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C0161C] focus:ring-1 focus:ring-[#C0161C] outline-none transition-all resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C0161C] text-white font-bold py-4 rounded-xl hover:bg-[#A01217] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-red-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Pesan
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-section="contact/maps" aria-label="Contact Maps">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C0161C] to-[#1E1E8F] bg-clip-text text-transparent inline-block">
                Temukan Kami
              </h2>
            </div>
            
            <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <iframe
                src={info.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521160902486!2d106.9308!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698bd5e7a5623b%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNTUnNTIuOSJF!5e0!3m2!1sid!2sid!4v1"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#C0161C] to-[#1E1E8F] text-white text-center" data-section="contact/cta" aria-label="Contact CTA PPDB">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ada Pertanyaan Seputar PPDB?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Hubungi kami langsung via WhatsApp untuk info lebih lanjut mengenai pendaftaran dan persyaratan.
            </p>
            
            <a
              href={`https://wa.me/${info.wa_ppdb || fallbackSekolahInfo.wa_ppdb}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold px-8 py-4 rounded-full hover:bg-[#20bd5a] transition-all transform hover:scale-105 shadow-xl"
              data-section="contact/cta-link"
              aria-label="WhatsApp PPDB Link"
            >
              <WhatsAppIcon size={24} />
              Chat WhatsApp Sekarang
            </a>
          </motion.div>
        </div>
      </section>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo();
    return { props: { sekolahInfo: sekolahInfo || null } };
  } catch (error) {
    console.error("Error fetching sekolah info:", error);
    return { props: { sekolahInfo: null } };
  }
}
