import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getHero, upsertHero } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';

export default function HeroPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    badge: '',
    cta_text: '',
    cta_url: '',
    cta2_text: '',
    cta2_url: '',
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getHero();
    if (data) {
      setForm({
        title: data.title || '',
        description: data.description || '',
        badge: data.badge || '',
        cta_text: data.cta_text || '',
        cta_url: data.cta_url || '',
        cta2_text: data.cta2_text || '',
        cta2_url: data.cta2_url || '',
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
    const response = await upsertHero(form);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan hero section.');
      return;
    }
    toastSuccess('Hero section berhasil disimpan.');
  };

  const handleReset = () => {
    load();
  };

  return (
    <AdminLayout title="Hero Section">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Hero Section</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola tampilan hero section di beranda</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Badge Text</label>
              <input
                name="badge"
                value={form.badge}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Contoh: Selamat Datang di SMK Paramitha 2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Judul Utama (Title)</label>
              <textarea
                name="title"
                value={form.title}
                onChange={handleChange}
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Contoh: Masa Depan Dimulai Di Sini"
              />
              <p className="text-xs text-slate-400 mt-1">Mendukung HTML untuk highlighting (contoh: &lt;span class=&quot;text-[#F5C400]&quot;&gt;teks&lt;/span&gt;)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Deskripsi</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Contoh: Mencetak generasi unggul, kompeten, dan berkarakter siap kerja di era industri 4.0 dengan fasilitas modern dan kurikulum terintegrasi."
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">CTA Button 1 Text</label>
                <input
                  name="cta_text"
                  value={form.cta_text}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: Daftar Sekarang"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">CTA Button 1 URL</label>
                <input
                  name="cta_url"
                  value={form.cta_url}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: /ppdb"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">CTA Button 2 Text</label>
                <input
                  name="cta2_text"
                  value={form.cta2_text}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: Jelajahi Jurusan"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">CTA Button 2 URL</label>
                <input
                  name="cta2_url"
                  value={form.cta2_url}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: /jurusan"
                />
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <button type="button" onClick={handleReset} className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
              <button type="submit" disabled={loading} className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60">{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </div>

        <div className="bg-[#1E1E8F] rounded-xl border border-black/7 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Preview</h3>
          <div className="bg-slate-900 rounded-lg p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E1E8F]/85 to-[#C0161C]/75" />
            <div className="relative z-10">
              {form.badge && (
                <span className="inline-block py-2 px-4 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm mb-6 text-sm md:text-base font-semibold tracking-wider uppercase text-[#F5C400]">
                  {form.badge}
                </span>
              )}
              {form.title && (
                <h1 
                  className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white"
                  dangerouslySetInnerHTML={{ __html: form.title }}
                />
              )}
              {form.description && (
                <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                  {form.description}
                </p>
              )}
              {form.cta_text && form.cta_url && (
                <div className="inline-block">
                  <span className="px-8 py-4 bg-[#C0161C] text-white rounded-full font-bold text-lg">
                    {form.cta_text}
                  </span>
                </div>
              )}
              {form.cta2_text && form.cta2_url && (
                <div className="inline-block ml-3">
                  <span className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg">
                    {form.cta2_text}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
