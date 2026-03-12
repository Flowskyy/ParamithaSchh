import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getHero, saveHero, getSekolahInfo, upsertSekolahInfo } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Save, Upload, Info, User } from 'lucide-react';
import SmartImage from '../../../components/SmartImage';
import ImageUploader from '../../../components/ImageUploader';
import toast from 'react-hot-toast';

function HeroAdmin() {
  const [data, setData] = useState({
    title: '',
    subtitle: '',
    image_url: ''
  });
  const [info, setInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    map_url: '',
    wa_ppdb: '',
    wa_kontak: '',
    kepsek_name: '',
    kepsek_photo: '',
    kepsek_message: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [hero, schoolInfo] = await Promise.all([
        getHero(),
        getSekolahInfo()
      ]);
      
      if (hero) setData(hero);
      if (schoolInfo) setInfo(schoolInfo);
      
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const [resHero, resInfo] = await Promise.all([
      saveHero(data),
      upsertSekolahInfo(info)
    ]);

    if (resHero.error || resInfo.error) {
      console.error(resHero.error || resInfo.error);
      const msg = resHero.error?.message || resInfo.error?.message || 'Failed to update settings';
      showToast.error(msg);
    } else {
      showToast.success('All settings updated!');
      // Refresh data
      const [hero, schoolInfo] = await Promise.all([
        getHero(),
        getSekolahInfo()
      ]);
      if (hero) setData(hero);
      if (schoolInfo) setInfo(schoolInfo);
    }
    setSaving(false);
  };

  const useDefaultKepsekPhoto = () => {
    setInfo(prev => ({ ...prev, kepsek_photo: '/images/Kepsek.JPG' }));
  };

  // Pattern WAJIB: Upload Hero Image
  // Replaced with ImageUploader component

  // Pattern WAJIB: Upload Kepsek Photo
  // Replaced with ImageUploader component

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8" data-section="admin-beranda-hero/header" aria-label="Beranda Hero Header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">General Settings</h1>
          <p className="text-slate-500">Manage hero section and school information</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/30 transform hover:-translate-y-0.5"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-section="admin-beranda-hero/grid" aria-label="Beranda Hero Grid">
        <div className="lg:col-span-2 space-y-8" data-section="admin-beranda-hero/left-column" aria-label="Kolom Kiri">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-section="admin-beranda-hero/hero-section" aria-label="Hero Section">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <Upload size={20} className="text-primary-600" /> Hero Section
            </h2>
            <div className="space-y-6" data-section="admin-beranda-hero/hero-fields" aria-label="Hero Fields">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Main Title</label>
                <input 
                  type="text" 
                  value={data.title}
                  onChange={(e) => setData({...data, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="Welcome to..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Subtitle</label>
                <textarea 
                  rows="3"
                  value={data.subtitle}
                  onChange={(e) => setData({...data, subtitle: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="Short description..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold mb-2 block">Background Image</label>
                <ImageUploader 
                  currentImage={data.image_url} 
                  onUploadComplete={(url) => setData({...data, image_url: url})} 
                  aspectRatio={16/9} 
                  bucket="hero" 
                  folder="backgrounds" 
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-section="admin-beranda-hero/school-info" aria-label="School Information">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <Info size={20} className="text-primary-600" /> School Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-section="admin-beranda-hero/school-fields" aria-label="School Fields">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">School Name</label>
                <input 
                  type="text" 
                  value={info.name || ''}
                  onChange={(e) => setInfo({...info, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Phone</label>
                <input 
                  type="text" 
                  value={info.phone || ''}
                  onChange={(e) => setInfo({...info, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Email</label>
                <input 
                  type="email" 
                  value={info.email || ''}
                  onChange={(e) => setInfo({...info, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Address</label>
                <input 
                  type="text" 
                  value={info.address || ''}
                  onChange={(e) => setInfo({...info, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-slate-700 text-sm font-bold">Google Maps Embed URL</label>
                <input 
                  type="text" 
                  value={info.map_url || ''}
                  onChange={(e) => setInfo({...info, map_url: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold text-green-600">WhatsApp PPDB</label>
                <input 
                  type="text" 
                  value={info.wa_ppdb || ''}
                  onChange={(e) => setInfo({...info, wa_ppdb: e.target.value})}
                  className="w-full bg-slate-50 border border-green-200 rounded-lg p-3 text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                  placeholder="085183092819"
                />
                <p className="text-[10px] text-slate-400 italic">Nomor untuk menerima pendaftaran PPDB online</p>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold text-green-600">WhatsApp Hubungi Kami</label>
                <input 
                  type="text" 
                  value={info.wa_kontak || ''}
                  onChange={(e) => setInfo({...info, wa_kontak: e.target.value})}
                  className="w-full bg-slate-50 border border-green-200 rounded-lg p-3 text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                  placeholder="085183092819"
                />
                <p className="text-[10px] text-slate-400 italic">Nomor untuk menerima pesan dari halaman kontak</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" data-section="admin-beranda-hero/principal-info" aria-label="Principal Information">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <User size={20} className="text-primary-600" /> Principal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-section="admin-beranda-hero/principal-fields" aria-label="Principal Fields">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Principal Name</label>
                <input 
                  type="text" 
                  value={info.kepsek_name || ''}
                  onChange={(e) => setInfo({...info, kepsek_name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="e.g. Dra. Hj. Siti Aminah"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold mb-2 block">Principal Photo</label>
                <ImageUploader 
                  currentImage={info.kepsek_photo} 
                  onUploadComplete={(url) => setInfo({...info, kepsek_photo: url})} 
                  aspectRatio={3/4} 
                  bucket="hero" 
                  folder="kepsek" 
                />
                
                <div className="flex justify-center mt-2">
                  <button 
                    type="button"
                    onClick={useDefaultKepsekPhoto}
                    className="text-primary-600 text-xs font-bold hover:underline"
                  >
                    Use Default Photo
                  </button>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-slate-700 text-sm font-bold">Welcome Message</label>
                <textarea 
                  rows="4"
                  value={info.kepsek_message || ''}
                  onChange={(e) => setInfo({...info, kepsek_message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="Message from the Principal..."
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8" data-section="admin-beranda-hero/right-column" aria-label="Kolom Kanan">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6" data-section="admin-beranda-hero/preview-card" aria-label="Preview Card">
            <h3 className="text-slate-900 font-bold mb-4">Hero Preview</h3>
            <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-4 group">
              {data.image_url ? (
                <SmartImage src={data.image_url} alt="Hero Preview" fill style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                <h4 className="text-white font-bold text-lg line-clamp-1">{data.title || 'Title'}</h4>
                <p className="text-white/80 text-xs line-clamp-2">{data.subtitle || 'Subtitle'}</p>
              </div>
            </div>

            <h3 className="text-slate-900 font-bold mb-4 pt-4 border-t border-slate-100">Principal Preview</h3>
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
                 {info.kepsek_photo ? (
                   <SmartImage src={info.kepsek_photo} fill style={{ objectFit: 'cover' }} />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={24} /></div>
                 )}
               </div>
               <div>
                 <p className="font-bold text-slate-900 text-sm">{info.kepsek_name || 'Name'}</p>
                 <p className="text-xs text-slate-500">Principal</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(HeroAdmin);
