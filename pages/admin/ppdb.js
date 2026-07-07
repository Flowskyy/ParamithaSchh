import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSekolahInfo, upsertSekolahInfo } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { Calendar, Phone, Link as LinkIcon, ArrowRight } from 'lucide-react';

export default function PPDBAdminPage() {
  const [form, setForm] = useState({
    id: null,
    ppdb_badge: '',
    ppdb_hero_title: '',
    ppdb_hero_description: '',
    wa_ppdb: ''
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const sekolah = await getSekolahInfo();
    if (sekolah) {
      setForm({
        id: sekolah.id || null,
        ppdb_badge: sekolah.ppdb_badge || '',
        ppdb_hero_title: sekolah.ppdb_hero_title || '',
        ppdb_hero_description: sekolah.ppdb_hero_description || '',
        wa_ppdb: sekolah.wa_ppdb || ''
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
    const response = await upsertSekolahInfo(form);
    setLoading(false);
    if (response.error) {
      console.error('Save error:', response.error);
      toastError('Gagal menyimpan pengaturan PPDB.');
      return;
    }
    toastSuccess('Pengaturan PPDB berhasil disimpan.');
  };

  return (
    <AdminLayout title="PPDB">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">PPDB</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola pengaturan Penerimaan Peserta Didik Baru</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/admin/ppdb/jadwal"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#C0161C] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E1E8F]/10 flex items-center justify-center text-[#1E1E8F] group-hover:bg-[#1E1E8F] group-hover:text-white transition-colors">
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Jadwal Pendaftaran</h3>
                <p className="text-sm text-slate-500 mt-1">Kelola jadwal pendaftaran</p>
              </div>
              <ArrowRight size={20} className="text-slate-400 group-hover:text-[#C0161C] transition-colors" />
            </div>
          </a>
          <a
            href="/admin/ppdb/persyaratan"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#C0161C] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C0161C]/10 flex items-center justify-center text-[#C0161C] group-hover:bg-[#C0161C] group-hover:text-white transition-colors">
                <LinkIcon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Persyaratan Berkas</h3>
                <p className="text-sm text-slate-500 mt-1">Kelola persyaratan pendaftaran</p>
              </div>
              <ArrowRight size={20} className="text-slate-400 group-hover:text-[#C0161C] transition-colors" />
            </div>
          </a>
        </div>

        {/* Main Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Pengaturan Utama</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Badge PPDB</label>
              <input
                name="ppdb_badge"
                value={form.ppdb_badge}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Contoh: PPDB 2025/2026"
              />
              <p className="text-xs text-slate-500 mt-1">Teks badge yang muncul di halaman PPDB</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Judul Hero Section</label>
              <input
                name="ppdb_hero_title"
                value={form.ppdb_hero_title}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Contoh: Bergabunglah Bersama Kami"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Deskripsi Hero Section</label>
              <textarea
                name="ppdb_hero_description"
                value={form.ppdb_hero_description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none resize-none"
                placeholder="Deskripsi singkat tentang PPDB"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nomor WhatsApp Penerima Formulir</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="wa_ppdb"
                  value={form.wa_ppdb}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: 6281234567890"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Nomor WhatsApp yang akan menerima formulir pendaftaran (tanpa + atau 0 di depan)</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60 shadow-lg shadow-red-100"
              >
                {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
