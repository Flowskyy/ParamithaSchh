import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getSekolahInfo, upsertSekolahInfo } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Save, Target, List } from 'lucide-react';

function VisiMisiAdmin() {
  const [info, setInfo] = useState({
    vision: '',
    mission: [] // Array of strings
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const schoolInfo = await getSekolahInfo();
      if (schoolInfo) {
        setInfo({
          ...schoolInfo,
          mission: Array.isArray(schoolInfo.mission) ? schoolInfo.mission : (schoolInfo.mission ? [schoolInfo.mission] : [])
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

    const { error } = await upsertSekolahInfo(info);

    if (error) {
      console.error(error);
      showToast.error('Failed to update settings', toastId);
    } else {
      showToast.success('Settings updated!', toastId);
    }
    setSaving(false);
  };

  const addMission = () => {
    setInfo(prev => ({ ...prev, mission: [...prev.mission, ''] }));
  };

  const updateMission = (index, value) => {
    const newMission = [...info.mission];
    newMission[index] = value;
    setInfo(prev => ({ ...prev, mission: newMission }));
  };

  const removeMission = (index) => {
    const newMission = info.mission.filter((_, i) => i !== index);
    setInfo(prev => ({ ...prev, mission: newMission }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visi & Misi</h1>
          <p className="text-slate-500">Manage school vision and mission statements</p>
        </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">
              Read Only (Disabled)
            </span>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm opacity-75 pointer-events-none select-none grayscale-[0.5]">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
            <Target size={20} className="text-primary-600" /> Visi (Vision)
          </h2>
          <div className="space-y-2">
            <textarea 
              rows="4"
              value={info.vision || ''}
              readOnly
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 cursor-not-allowed"
            />
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm opacity-75 pointer-events-none select-none grayscale-[0.5]">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
            <List size={20} className="text-primary-600" /> Misi (Mission)
          </h2>
          
          <div className="space-y-4">
            {info.mission.map((item, index) => (
              <div key={index} className="flex gap-2">
                <span className="py-3 px-2 font-bold text-slate-400">{index + 1}.</span>
                <input 
                  type="text" 
                  value={item}
                  readOnly
                  disabled
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(VisiMisiAdmin);
