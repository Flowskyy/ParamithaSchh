import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSekolahInfo, upsertSekolahInfo } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import { toastSuccess, toastError } from '../../utils/toast';

const initialState = {
  name: '',
  phone: '',
  email: '',
  address: '',
  facebook: '',
  instagram: '',
  youtube: '',
  tiktok: '',
  wa_ppdb: '',
  wa_kontak: '',
  kepsek_name: '',
  kepsek_photo: '',
  kepsek_message: '',
  map_url: '',
  vision: '',
  mission: '',
  history: '',
  motto: '',
  mars_lyrics: []
};

export default function SekolahInfoPage() {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await getSekolahInfo();
      if (result) {
        setData({
          ...initialState,
          ...result,
          mission: Array.isArray(result.mission) ? result.mission.join('\n') : result.mission || ''
        });
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...data,
      mission: data.mission,
      history: data.history,
      mars_lyrics: Array.isArray(data.mars_lyrics) ? data.mars_lyrics : data.mars_lyrics || []
    };

    const response = await upsertSekolahInfo(payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan pengaturan sekolah.');
    } else {
      toastSuccess('Sekolah info berhasil disimpan.');
    }
  };

  return (
    <AdminLayout title="Sekolah Info">
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Informasi Umum</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              { label: 'Nama Sekolah', name: 'name' },
              { label: 'Telepon', name: 'phone' },
              { label: 'Email', name: 'email' },
              { label: 'Alamat', name: 'address' },
              { label: 'Google Maps URL', name: 'map_url' },
              { label: 'Facebook', name: 'facebook' },
              { label: 'Instagram', name: 'instagram' },
              { label: 'YouTube', name: 'youtube' },
              { label: 'TikTok', name: 'tiktok' },
              { label: 'WhatsApp PPDB', name: 'wa_ppdb' },
              { label: 'WhatsApp Kontak', name: 'wa_kontak' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{field.label}</label>
                <input
                  name={field.name}
                  value={data[field.name] || ''}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Kepala Sekolah</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nama Kepala Sekolah</label>
              <input
                name="kepsek_name"
                value={data.kepsek_name || ''}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Foto Kepala Sekolah</label>
              <ImageUploader
                currentImage={data.kepsek_photo}
                onUploadComplete={(url) => setData((prev) => ({ ...prev, kepsek_photo: url }))}
                aspectRatio={4 / 5}
                bucket="media"
                folder="kepsek"
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-slate-700">Pesan Kepala Sekolah</label>
            <textarea
              name="kepsek_message"
              value={data.kepsek_message || ''}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
            />
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Konten Sekolah</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Vision</label>
              <textarea
                name="vision"
                value={data.vision || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Mission</label>
              <textarea
                name="mission"
                value={data.mission || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">History</label>
              <textarea
                name="history"
                value={data.history || ''}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Motto</label>
              <textarea
                name="motto"
                value={data.motto || ''}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Mars Lyrics (JSON Array)</label>
              <textarea
                name="mars_lyrics"
                value={JSON.stringify(data.mars_lyrics || [], null, 2)}
                onChange={(e) => setData((prev) => ({ ...prev, mars_lyrics: e.target.value }))}
                rows={6}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-mono text-sm focus:border-primary-500 focus:ring-primary-100 focus:outline-none"
              />
              <p className="text-xs text-slate-500">Format JSON: [{'{'}&quot;verse&quot;:1,&quot;text&quot;:[&quot;line1&quot;,...]{'}'}]</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-primary-600 px-6 py-3 text-white font-semibold transition hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
