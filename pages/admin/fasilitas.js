import { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminLayout from '../../components/AdminLayout';
import { getFasilitas, saveFasilitas, deleteFasilitas } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import { toastSuccess, toastError } from '../../utils/toast';

export default function FasilitasPage() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', description: '', photo_url: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => setEntries(await getFasilitas() || []);
  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (entry) => setForm({ id: entry.id, title: entry.title || '', description: entry.description || '', photo_url: entry.photo_url || '' });
  const handleReset = () => setForm({ id: null, title: '', description: '', photo_url: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { title: form.title, description: form.description, photo_url: form.photo_url };
    const response = await saveFasilitas(form.id ? { id: form.id, ...payload } : payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan fasilitas.');
      return;
    }
    toastSuccess('Fasilitas berhasil disimpan.');
    handleReset();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus fasilitas ini?')) return;
    const response = await deleteFasilitas(id);
    if (response.error) {
      toastError('Gagal menghapus fasilitas.');
      return;
    }
    toastSuccess('Fasilitas berhasil dihapus.');
    load();
  };

  return (
    <AdminLayout title="Fasilitas">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Fasilitas</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola fasilitas sekolah</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Daftar Fasilitas</h2>
            <div className="space-y-3">
              {entries.length === 0 && (
                <div className="bg-[#F8F8FF] rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="text-slate-500">Belum ada fasilitas.</p>
                </div>
              )}
              {entries.map((entry) => (
                <article key={entry.id} className="rounded-xl border border-slate-200 p-4 hover:border-[#C0161C] transition-colors shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-4">
                    {entry.photo_url ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                        <Image
                          src={entry.photo_url}
                          alt={entry.title}
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : <div className="h-20 w-20 rounded-xl bg-slate-100" />}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{entry.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(entry)} className="bg-white text-slate-700 font-medium text-sm px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(entry.id)} className="bg-white text-red-600 font-medium text-sm px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black/7 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Tambah / Edit Fasilitas</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Judul</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Foto Fasilitas</label>
                <ImageUploader
                  currentImage={form.photo_url}
                  onUploadComplete={(url) => setForm((prev) => ({ ...prev, photo_url: url }))}
                  bucket="media"
                  folder="fasilitas"
                />
              </div>
              <button disabled={loading} type="submit" className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60">
                {loading ? 'Menyimpan...' : form.id ? 'Update Fasilitas' : 'Tambah Fasilitas'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
