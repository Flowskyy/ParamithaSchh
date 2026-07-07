import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSekolahInfo, upsertSekolahInfo } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { Mail, Phone, MapPin, Clock, Save } from 'lucide-react';

export default function KontakAdminPage() {
  const [form, setForm] = useState({
    id: null,
    email: '',
    phone: '',
    wa_kontak: '',
    address: '',
    jam_operasional: ''
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const sekolah = await getSekolahInfo();
    if (sekolah) {
      setForm({
        id: sekolah.id || null,
        email: sekolah.email || '',
        phone: sekolah.phone || '',
        wa_kontak: sekolah.wa_kontak || '',
        address: sekolah.address || '',
        jam_operasional: sekolah.jam_operasional || ''
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
      toastError('Gagal menyimpan pengaturan kontak.');
      return;
    }
    toastSuccess('Pengaturan kontak berhasil disimpan.');
  };

  return (
    <AdminLayout title="Kontak">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Kontak</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola informasi kontak sekolah</p>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Informasi Kontak</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email Sekolah</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="contoh@smkparamitha.sch.id"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Email resmi sekolah untuk komunikasi umum</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Nomor Telepon</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                    placeholder="021-12345678"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Nomor telepon kantor sekolah</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">WhatsApp (Hubungi Kami)</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="wa_kontak"
                    type="tel"
                    value={form.wa_kontak}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                    placeholder="6281234567890"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Nomor WhatsApp untuk form hubungi kami (tanpa + atau 0 di depan)</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Alamat Lengkap</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-3 text-slate-400" />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none resize-none"
                  placeholder="Jl. Contoh No. 123, Jakarta"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Alamat fisik sekolah</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Jam Operasional</label>
              <div className="relative">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="jam_operasional"
                  value={form.jam_operasional}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Senin - Jumat: 07:00 - 16:00"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Jam operasional sekolah</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60 shadow-lg shadow-red-100 flex items-center gap-2"
              >
                <Save size={18} />
                {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
