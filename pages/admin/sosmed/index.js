import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import withAdmin from '@/utils/withAdmin';
import { getSekolahInfo, upsertSekolahInfo } from '@/services/api';
import { showToast } from '@/utils/toast';
import { Save, Share2, Facebook, Instagram, Youtube, Video } from 'lucide-react';

function SosmedPage() {
  const [info, setInfo] = useState({
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getSekolahInfo();
      if (data) {
        setInfo({
          ...data, // Keep other fields to avoid overwriting with null/empty if upsert is partial (though upsert usually merges or replaces. upsertSekolahInfo does update if id exists)
          // Actually upsertSekolahInfo in api.js handles update if id exists. 
          // But we need to make sure we don't lose other fields if we only send these.
          // The API helper: 
          // export async function upsertSekolahInfo(payload) {
          //   if (payload.id) return handleMutation(supabase.from('sekolah_info').update(payload).eq('id', payload.id));
          //   return handleMutation(supabase.from('sekolah_info').insert(payload));
          // }
          // So we need to send the FULL object or at least ID.
          // Best practice: fetch full object, update specific fields, send back.
        });
        // We only want to edit sosmed fields here, but state should hold everything or we need to be careful.
        // Let's store full data in state.
        setInfo(data); 
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Ensure we have an ID if it exists (it should be in info from loadData)
    const { error } = await upsertSekolahInfo(info);

    if (error) {
      console.error(error);
      showToast.error('Failed to update social media links');
    } else {
      showToast.success('Social media links updated!');
    }
    setSaving(false);
  };

  const handleChange = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8" data-section="admin-sosmed/header" aria-label="Admin Sosmed Header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Social Media</h1>
          <p className="text-slate-500">Manage links to your social media profiles</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/30 transform hover:-translate-y-0.5"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl" data-section="admin-sosmed/card" aria-label="Sosmed Card">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
          <Share2 size={20} className="text-primary-600" /> Social Media Links
        </h2>
        
        <div className="space-y-6" data-section="admin-sosmed/form-fields" aria-label="Form Sosmed">
          {/* Facebook */}
          <div className="space-y-2">
            <label className="text-slate-700 text-sm font-bold flex items-center gap-2">
              <Facebook size={16} className="text-blue-600" /> Facebook URL
            </label>
            <input 
              type="text" 
              value={info.facebook || ''}
              onChange={(e) => handleChange('facebook', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              placeholder="https://facebook.com/..."
            />
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <label className="text-slate-700 text-sm font-bold flex items-center gap-2">
              <Instagram size={16} className="text-pink-600" /> Instagram URL
            </label>
            <input 
              type="text" 
              value={info.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              placeholder="https://instagram.com/..."
            />
          </div>

          {/* YouTube */}
          <div className="space-y-2">
            <label className="text-slate-700 text-sm font-bold flex items-center gap-2">
              <Youtube size={16} className="text-red-600" /> YouTube URL
            </label>
            <input 
              type="text" 
              value={info.youtube || ''}
              onChange={(e) => handleChange('youtube', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              placeholder="https://youtube.com/..."
            />
          </div>

          {/* TikTok */}
          <div className="space-y-2">
            <label className="text-slate-700 text-sm font-bold flex items-center gap-2">
              <Video size={16} className="text-black" /> TikTok URL
            </label>
            <input 
              type="text" 
              value={info.tiktok || ''}
              onChange={(e) => handleChange('tiktok', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(SosmedPage);
