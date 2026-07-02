import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getMottoMars, upsertMottoMars } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';

export default function MottoMarsAdminPage() {
  const [data, setData] = useState({ pink_values: [], jitu_values: [], mars_lyrics: [], id: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await getMottoMars();
      setData({
        id: result?.id || null,
        pink_values: result?.pink_values || [],
        jitu_values: result?.jitu_values || [],
        mars_lyrics: result?.mars_lyrics || []
      });
    }
    load();
  }, []);

  const setJsonField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await upsertMottoMars(data);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan nilai dan mars.');
    } else {
      toastSuccess('Nilai dan Mars berhasil disimpan.');
    }
  };

  return (
    <AdminLayout title="Motto & Mars">
      <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <section className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Pink Values (JSON)</label>
            <textarea
              rows={8}
              value={JSON.stringify(data.pink_values || [], null, 2)}
              onChange={(e) => setJsonField('pink_values', e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-mono text-sm focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
            />
            <p className="text-xs text-slate-500">Gunakan format array JSON berisi object {`{ char, title, desc }`}.</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Jitu Values (JSON)</label>
            <textarea
              rows={8}
              value={JSON.stringify(data.jitu_values || [], null, 2)}
              onChange={(e) => setJsonField('jitu_values', e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-mono text-sm focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
            />
            <p className="text-xs text-slate-500">Gunakan format array JSON berisi object {`{ char, title, desc }`}.</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Mars Lyrics (JSON)</label>
            <textarea
              rows={8}
              value={JSON.stringify(data.mars_lyrics || [], null, 2)}
              onChange={(e) => setJsonField('mars_lyrics', e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-mono text-sm focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
            />
            <p className="text-xs text-slate-500">Gunakan format array JSON berisi object {`{ verse, text }`}.</p>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-primary-600 px-6 py-3 text-white font-semibold transition hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan Motto & Mars'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
