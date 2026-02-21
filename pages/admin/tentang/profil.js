import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getSekolahInfo, upsertSekolahInfo } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Save, Info, MapPin, Share2 } from 'lucide-react';

function ProfilSekolahAdmin() {
  const [info, setInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    map_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const schoolInfo = await getSekolahInfo();
      if (schoolInfo) setInfo(schoolInfo);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = showToast.loading('Saving changes...');

    const { error } = await upsertSekolahInfo(info);

    if (error) {
      console.error(error);
      showToast.error('Failed to update settings', toastId);
    } else {
      showToast.success('Settings updated!', toastId);
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profil Sekolah</h1>
          <p className="text-slate-500">Manage school basic information and contact details</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/30 transform hover:-translate-y-0.5"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <Info size={20} className="text-primary-600" /> Basic Information
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">School Name</label>
                <input 
                  type="text" 
                  value={info.name || ''}
                  onChange={(e) => setInfo({...info, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">Address</label>
                <textarea 
                  rows="3"
                  value={info.address || ''}
                  onChange={(e) => setInfo({...info, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                />
              </div>
            </div>
          </section>

        </div>

        <div className="space-y-8">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                <MapPin size={20} className="text-primary-600" /> Location
                </h2>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-slate-700 text-sm font-bold">Google Maps Embed URL</label>
                        <input 
                        type="text" 
                        value={info.map_url || ''}
                        onChange={(e) => setInfo({...info, map_url: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                        placeholder="https://www.google.com/maps/embed?..."
                        />
                        <p className="text-xs text-slate-500">Go to Google Maps -&gt; Share -&gt; Embed a map -&gt; Copy HTML -&gt; Extract src URL</p>
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
                            ></iframe>
                        </div>
                    )}
                </div>
            </section>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(ProfilSekolahAdmin);
