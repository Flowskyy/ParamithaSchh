import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSekolahInfo, upsertSekolahInfo } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import ImageUploader from '../../components/ImageUploader';

export default function SambutanPage() {
  const [kepsekName, setKepsekName] = useState('');
  const [kepsekMessage, setKepsekMessage] = useState('');
  const [kepsekPhoto, setKepsekPhoto] = useState('');
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const sekolah = await getSekolahInfo();
      if (sekolah) {
        setId(sekolah.id || null);
        setKepsekName(sekolah.kepsek_name || '');
        setKepsekMessage(sekolah.kepsek_message || '');
        setKepsekPhoto(sekolah.kepsek_photo || '');
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { 
      id, 
      kepsek_name: kepsekName, 
      kepsek_message: kepsekMessage, 
      kepsek_photo: kepsekPhoto 
    };
    const response = await upsertSekolahInfo(payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan sambutan kepala sekolah.');
    } else {
      toastSuccess('Sambutan kepala sekolah berhasil disimpan.');
    }
  };

  return (
    <AdminLayout title="Sambutan Kepala Sekolah">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Sambutan Kepala Sekolah</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola sambutan kepala sekolah yang tampil di beranda</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={kepsekName}
                onChange={(e) => setKepsekName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Masukkan nama kepala sekolah..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Foto Kepala Sekolah</label>
              <ImageUploader
                currentImage={kepsekPhoto}
                onUploadComplete={setKepsekPhoto}
                aspectRatio={3/4}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Pesan Sambutan</label>
              <textarea
                value={kepsekMessage}
                onChange={(e) => setKepsekMessage(e.target.value)}
                rows={8}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Masukkan pesan sambutan kepala sekolah..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60 shadow-lg shadow-red-100"
          >
            {loading ? 'Menyimpan...' : 'Simpan Sambutan'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
