import { useEffect, useState } from 'react';
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
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Daftar Fasilitas</h2>
          <div className="space-y-4">
            {entries.length === 0 && <p className="text-slate-500">Belum ada fasilitas.</p>}
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-3xl border border-slate-200 p-4 hover:border-primary-500 transition">
                <div className="flex items-center gap-4">
                  {entry.photo_url ? <img src={entry.photo_url} alt={entry.title} className="h-20 w-20 rounded-3xl object-cover" /> : <div className="h-20 w-20 rounded-3xl bg-slate-100" />}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{entry.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => handleEdit(entry)} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                  <button type="button" onClick={() => handleDelete(entry.id)} className="rounded-full border border-rose-300 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Hapus</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah / Edit Fasilitas</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Judul</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Deskripsi</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Foto Fasilitas</label>
              <ImageUploader
                currentImage={form.photo_url}
                onUploadComplete={(url) => setForm((prev) => ({ ...prev, photo_url: url }))}
                bucket="media"
                folder="fasilitas"
              />
            </div>
            <button disabled={loading} type="submit" className="rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold hover:bg-primary-700 disabled:opacity-60">
              {loading ? 'Menyimpan...' : form.id ? 'Update Fasilitas' : 'Tambah Fasilitas'}
            </button>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
