import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSekolahInfo, upsertSekolahInfo } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';

export default function FooterPage() {
  const [form, setForm] = useState({
    description: '',
    instagram: '',
    youtube: '',
    facebook: '',
    tiktok: '',
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getSekolahInfo();
    if (data) {
      setForm({
        description: data.description || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        facebook: data.facebook || '',
        tiktok: data.tiktok || '',
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Get existing data and merge with form
    const existing = await getSekolahInfo();
    const payload = {
      ...(existing || {}),
      ...form,
    };
    
    const response = await upsertSekolahInfo(payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan footer.');
      return;
    }
    toastSuccess('Footer berhasil disimpan.');
  };

  const handleReset = () => {
    load();
  };

  return (
    <AdminLayout title="Footer">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Footer</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola tampilan footer website</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/7 p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Deskripsi Sekolah</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Deskripsi singkat tentang sekolah..."
              />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Social Media Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Instagram URL</label>
                  <input
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">YouTube URL</label>
                  <input
                    name="youtube"
                    value={form.youtube}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Facebook URL</label>
                  <input
                    name="facebook"
                    value={form.facebook}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">TikTok URL</label>
                  <input
                    name="tiktok"
                    value={form.tiktok}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                    placeholder="https://tiktok.com/..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Informasi</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Logo sekolah diambil dari /images/logo.jpg</li>
                <li>• Nama sekolah: SMK Paramitha 2 (hardcoded)</li>
                <li>• Tautan Cepat (Profil, Visi Misi, PPDB, Hubungi Kami) bersifat statis</li>
                <li>• Program Keahlian diambil dari data jurusan yang aktif</li>
                <li>• Hubungi Kami (alamat, telepon, email) diambil dari data sekolah info</li>
              </ul>
            </div>

            <div className="flex justify-between gap-3">
              <button type="button" onClick={handleReset} className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
              <button type="submit" disabled={loading} className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60">{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
