import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getProyekPkk, upsertProyekPkk } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { X, Plus } from 'lucide-react';

const emptyProyek = {
  title: 'Proyek PKK Paramitha 2',
  subtitle: 'Paramitha Tour & Travel',
  description: 'Unit produksi SMK Paramitha 2 yang bergerak di bidang layanan perjalanan wisata. Dikelola langsung oleh siswa dengan standar industri profesional.',
  services: ['Ticketing Pesawat & Kereta', 'Paket Wisata Domestik', 'Pengurusan Dokumen Perjalanan'],
  website_url: 'https://paramithatourandtravel.vercel.app/'
};

export default function ProyekPkkPage() {
  const [form, setForm] = useState(emptyProyek);
  const [loading, setLoading] = useState(false);
  const [serviceInput, setServiceInput] = useState('');

  const load = async () => {
    const data = await getProyekPkk();
    if (data) {
      setForm({
        title: data.title || emptyProyek.title,
        subtitle: data.subtitle || emptyProyek.subtitle,
        description: data.description || emptyProyek.description,
        services: data.services || emptyProyek.services,
        website_url: data.website_url || emptyProyek.website_url,
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

  const handleAddService = () => {
    if (!serviceInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      services: [...(prev.services || []), serviceInput.trim()]
    }));
    setServiceInput('');
  };

  const handleRemoveService = (index) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await upsertProyekPkk(form);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan proyek PKK.');
      return;
    }
    toastSuccess('Proyek PKK berhasil disimpan.');
  };

  const handleReset = () => {
    setForm(emptyProyek);
  };

  return (
    <AdminLayout title="Proyek PKK">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Proyek PKK Paramitha 2</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola tampilan section Proyek PKK di beranda</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/7 p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Judul Section</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Subjudul (Nama Proyek)</label>
              <input
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Contoh: Paramitha Tour & Travel"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Deskripsi</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Layanan</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                    placeholder="Tambah layanan..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="bg-[#C0161C] text-white px-4 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.services || []).map((service, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm">
                      {service}
                      <button type="button" onClick={() => handleRemoveService(idx)} className="hover:text-red-600">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">URL Website</label>
              <input
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-between gap-3">
              <button type="button" onClick={handleReset} className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
              <button type="submit" disabled={loading} className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60">{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </div>

        <div className="bg-[#1E1E8F] rounded-xl border border-black/7 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Preview</h3>
          <div className="bg-[#FFF8F8] rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-[#1E1E8F] font-bold tracking-widest uppercase mb-2 text-sm">{form.title}</h2>
              <h3 className="text-2xl font-normal text-slate-900">
                {form.subtitle}
              </h3>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed max-w-2xl">
              {form.description}
            </p>
            <ul className="space-y-2 mb-6">
              {(form.services || []).map((service, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700 text-sm">
                  <div className="w-2 h-2 rounded-full bg-[#F5C400]" /> {service}
                </li>
              ))}
            </ul>
            {form.website_url && (
              <a 
                href={form.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py- bg-[#1E1E8F] text-white rounded-lg font-semibold text-sm inline-block"
              >
                Kunjungi Website
              </a>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
