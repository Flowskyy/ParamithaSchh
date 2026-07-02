import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSekolahInfo, upsertSekolahInfo } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';

export default function VisiMisiPage() {
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const sekolah = await getSekolahInfo();
      if (sekolah) {
        setId(sekolah.id || null);
        setVision(sekolah.vision || '');
        setMission(Array.isArray(sekolah.mission) ? sekolah.mission.join('\n') : sekolah.mission || '');
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { id, vision, mission };
    const response = await upsertSekolahInfo(payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan visi dan misi.');
    } else {
      toastSuccess('Visi dan misi berhasil disimpan.');
    }
  };

  return (
    <AdminLayout title="Visi & Misi">
      <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Vision</label>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Mission</label>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-primary-600 px-6 py-3 text-white font-semibold transition hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan Visi & Misi'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
