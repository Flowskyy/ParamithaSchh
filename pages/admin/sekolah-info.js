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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Informasi Sekolah</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola informasi umum dan kontak sekolah</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/7 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Informasi Umum</h2>
          <div className="grid gap-5 lg:grid-cols-2">
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
              <div key={field.name}>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">{field.label}</label>
                <input
                  name={field.name}
                  value={data[field.name] || ''}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/7 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Kepala Sekolah</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nama Kepala Sekolah</label>
              <input
                name="kepsek_name"
                value={data.kepsek_name || ''}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Foto Kepala Sekolah</label>
              <ImageUploader
                currentImage={data.kepsek_photo}
                onUploadComplete={(url) => setData((prev) => ({ ...prev, kepsek_photo: url }))}
                aspectRatio={4 / 5}
                bucket="media"
                folder="kepsek"
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Pesan Kepala Sekolah</label>
            <textarea
              name="kepsek_message"
              value={data.kepsek_message || ''}
              onChange={handleChange}
              rows={6}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/7 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Konten Sekolah</h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Vision</label>
              <textarea
                name="vision"
                value={data.vision || ''}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Mission</label>
              <textarea
                name="mission"
                value={data.mission || ''}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">History</label>
              <textarea
                name="history"
                value={data.history || ''}
                onChange={handleChange}
                rows={6}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Motto</label>
              <textarea
                name="motto"
                value={data.motto || ''}
                onChange={handleChange}
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Mars Lyrics (JSON Array)</label>
              <textarea
                name="mars_lyrics"
                value={JSON.stringify(data.mars_lyrics || [], null, 2)}
                onChange={(e) => setData((prev) => ({ ...prev, mars_lyrics: e.target.value }))}
                rows={6}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">Format JSON: [{'{'}&quot;verse&quot;:1,&quot;text&quot;:[&quot;line1&quot;,...]{'}'}]</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
