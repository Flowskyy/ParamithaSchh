import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getSekolahInfo, upsertSekolahInfo } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Save, Phone, Mail, MapPin, MessageCircle, Instagram, Youtube, Facebook } from 'lucide-react';
import { fallbackSekolahInfo } from '../../utils/fallbackData';

// TikTok Icon Component
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

function HubungiKamiAdmin() {
  const [info, setInfo] = useState(fallbackSekolahInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const schoolInfo = await getSekolahInfo();
      if (schoolInfo) {
        setInfo({ ...fallbackSekolahInfo, ...schoolInfo });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = showToast.loading('Menyimpan perubahan...');

    const { error } = await upsertSekolahInfo(info);

    if (error) {
      console.error(error);
      showToast.error('Gagal menyimpan perubahan', toastId);
    } else {
      showToast.success('Berhasil disimpan!', toastId);
    }
    setSaving(false);
  };

  const handleChange = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E1E8F]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8" data-section="admin-contact/header" aria-label="Admin Contact Header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hubungi Kami</h1>
          <p className="text-slate-500">Kelola informasi kontak yang tampil di halaman publik</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/30 transform hover:-translate-y-0.5"
        >
          <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-section="admin-contact/grid" aria-label="Admin Contact Grid">
        {/* Contact Information */}
        <div className="space-y-8" data-section="admin-contact/left-column" aria-label="Contact Information Column">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-section="admin-contact/contact-info" aria-label="Informasi Kontak">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <Phone size={20} className="text-primary-600" /> Informasi Kontak
            </h2>
            
            <div className="space-y-4" data-section="admin-contact/contact-fields" aria-label="Form Fields Kontak">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Nama Sekolah</label>
                <input 
                  type="text" 
                  value={info.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="SMK Paramitha 2 Jakarta"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Telepon</label>
                <input 
                  type="text" 
                  value={info.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="021-8650377"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Email</label>
                <input 
                  type="email" 
                  value={info.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="smkparamitha2@gmail.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Alamat</label>
                <textarea 
                  rows="3"
                  value={info.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="Jl. Raya Kalimalang No. 68 I2..."
                />
              </div>
            </div>
          </section>

          {/* WhatsApp Settings */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-section="admin-contact/whatsapp" aria-label="Pengaturan WhatsApp">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <MessageCircle size={20} className="text-green-600" /> WhatsApp
            </h2>
            
            <div className="space-y-4" data-section="admin-contact/whatsapp-fields" aria-label="Form Fields WhatsApp">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold text-green-600">WhatsApp PPDB</label>
                <input 
                  type="text" 
                  value={info.wa_ppdb || ''}
                  onChange={(e) => handleChange('wa_ppdb', e.target.value)}
                  className="w-full bg-green-50 border border-green-200 rounded-lg p-3 text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                  placeholder="6282124706301"
                />
                <p className="text-xs text-slate-500">Nomor WhatsApp untuk penerimaan siswa baru</p>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold text-green-600">WhatsApp Hubungi Kami</label>
                <input 
                  type="text" 
                  value={info.wa_kontak || ''}
                  onChange={(e) => handleChange('wa_kontak', e.target.value)}
                  className="w-full bg-green-50 border border-green-200 rounded-lg p-3 text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                  placeholder="6282124706301"
                />
                <p className="text-xs text-slate-500">Nomor WhatsApp untuk pesan dari halaman kontak</p>
              </div>
            </div>
          </section>
        </div>

        {/* Social Media & Maps */}
        <div className="space-y-8" data-section="admin-contact/right-column" aria-label="Sosial Media dan Peta">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-section="admin-contact/maps" aria-label="Lokasi dan Peta">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <MapPin size={20} className="text-primary-600" /> Lokasi & Peta
            </h2>
            
            <div className="space-y-4" data-section="admin-contact/map-fields" aria-label="Form Fields Peta">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Google Maps Embed URL</label>
                <input 
                  type="text" 
                  value={info.map_url || ''}
                  onChange={(e) => handleChange('map_url', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="https://www.google.com/maps/embed?..."
                />
                <p className="text-xs text-slate-500">Google Maps → Share → Embed a map → Copy HTML → Extract src URL</p>
              </div>
              
              {info.map_url && (
                <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 aspect-video">
                  <iframe 
                    src={info.map_url} 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen="" 
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-section="admin-contact/social" aria-label="Sosial Media">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <span className="text-primary-600">Sosial Media</span>
            </h2>
            
            <div className="space-y-4" data-section="admin-contact/social-fields" aria-label="Form Fields Sosial Media">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold flex items-center gap-2">
                  <Facebook size={16} className="text-blue-600" /> Facebook
                </label>
                <input 
                  type="text" 
                  value={info.facebook || ''}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="https://facebook.com/smkparamitha2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold flex items-center gap-2">
                  <Instagram size={16} className="text-pink-600" /> Instagram
                </label>
                <input 
                  type="text" 
                  value={info.instagram || ''}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="https://instagram.com/smkparamitha2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold flex items-center gap-2">
                  <Youtube size={16} className="text-red-600" /> YouTube
                </label>
                <input 
                  type="text" 
                  value={info.youtube || ''}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="https://youtube.com/@smkparamitha2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold flex items-center gap-2">
                  <TikTokIcon size={16} className="text-black" /> TikTok
                </label>
                <input 
                  type="text" 
                  value={info.tiktok || ''}
                  onChange={(e) => handleChange('tiktok', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="https://tiktok.com/@smkparamitha2"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(HubungiKamiAdmin);

