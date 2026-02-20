import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getSekolahInfo, upsertSekolahInfo } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Save, ExternalLink } from 'lucide-react';

function CTAAdmin() {
  const [info, setInfo] = useState({
    cta_title: '',
    cta_description: '',
    cta_link: '',
    cta_button_text: ''
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
          <h1 className="text-2xl font-bold text-slate-900">Call To Action (CTA)</h1>
          <p className="text-slate-500">Manage the CTA section content usually at the bottom of the home page</p>
        </div>
        <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">
              Read Only (Disabled)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm opacity-75 pointer-events-none select-none grayscale-[0.5]">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <ExternalLink size={20} className="text-primary-600" /> CTA Content
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">CTA Title</label>
                <input 
                  type="text" 
                  value={info.cta_title || ''}
                  readOnly
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-bold">CTA Description</label>
                <textarea 
                  rows="4"
                  value={info.cta_description || ''}
                  readOnly
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-700 text-sm font-bold">Button Text</label>
                    <input 
                      type="text" 
                      value={info.cta_button_text || ''}
                      readOnly
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-700 text-sm font-bold">Link URL</label>
                    <input 
                      type="text" 
                      value={info.cta_link || ''}
                      readOnly
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                    />
                  </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
                <h3 className="text-slate-900 font-bold mb-4">Preview (Approximate)</h3>
                <div className="bg-primary-600 text-white p-8 rounded-xl text-center space-y-4">
                    <h2 className="text-2xl font-bold">{info.cta_title || 'CTA Title'}</h2>
                    <p className="text-primary-100">{info.cta_description || 'Description here...'}</p>
                    <button className="px-6 py-2 bg-white text-primary-600 font-bold rounded-full">
                        {info.cta_button_text || 'Button'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(CTAAdmin);
