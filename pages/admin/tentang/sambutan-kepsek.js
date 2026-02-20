import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getSekolahInfo, upsertSekolahInfo } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Save, User } from 'lucide-react';
import SmartImage from '../../../components/SmartImage';
import ImageUploader from '../../../components/ImageUploader';

function SambutanAdmin() {
  const [info, setInfo] = useState({
    kepsek_name: '',
    kepsek_photo: '',
    kepsek_message: '',
    kepsek_greeting: '',
    kepsek_message_body: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const schoolInfo = await getSekolahInfo();
      if (schoolInfo) {
        const parts = (schoolInfo.kepsek_message || '').split('|||');
        let greeting = '';
        let body = '';
        
        if (parts.length > 1) {
            greeting = parts[0];
            body = parts.slice(1).join('|||');
        } else {
            // No delimiter. Use default if empty, or assume body if not.
            greeting = "Assalamu'alaikum Warahmatullahi Wabarakatuh. Salam sejahtera bagi kita semua.";
            body = parts[0];
        }

        setInfo({
          ...schoolInfo,
          kepsek_greeting: greeting,
          kepsek_message_body: body
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = showToast.loading('Saving changes...');

    // Prepare payload
    const payload = { ...info };
    payload.kepsek_message = `${payload.kepsek_greeting}|||${payload.kepsek_message_body}`;
    
    // Remove temporary fields to avoid Supabase errors
    delete payload.kepsek_greeting;
    delete payload.kepsek_message_body;

    const { error } = await upsertSekolahInfo(payload);

    if (error) {
      console.error(error);
      showToast.error('Failed to update settings', toastId);
    } else {
      showToast.success('Settings updated!', toastId);
    }
    setSaving(false);
  };

  const useDefaultKepsekPhoto = () => {
    setInfo(prev => ({ ...prev, kepsek_photo: '/images/Kepsek.JPG' }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sambutan Kepala Sekolah</h1>
          <p className="text-slate-500">Manage principal&apos;s welcome message and profile</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/30 transform hover:-translate-y-0.5"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <User size={20} className="text-primary-600" /> Principal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="text-slate-700 text-sm font-bold">Salam Pembuka</label>
                <input 
                  type="text"
                  value={info.kepsek_greeting || ''}
                  onChange={(e) => setInfo({...info, kepsek_greeting: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all mb-4"
                  placeholder="e.g. Assalamu'alaikum Warahmatullahi Wabarakatuh"
                />

                <label className="text-slate-700 text-sm font-bold">Isi Sambutan</label>
                <textarea 
                  rows="8"
                  value={info.kepsek_message_body || ''}
                  onChange={(e) => setInfo({...info, kepsek_message_body: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="Isi pesan sambutan kepala sekolah..."
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="text-slate-900 font-bold mb-4">Preview</h3>
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
            <div className="mt-4 text-sm text-slate-600 line-clamp-6 italic">
                <span className="block font-semibold mb-2">&quot;{info.kepsek_greeting}&quot;</span>
                &quot;{info.kepsek_message_body || 'Message...'}&quot;
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(SambutanAdmin);
