import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getGaleri, saveGaleri, deleteGaleri } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import { toastSuccess, toastError } from '../../utils/toast';

export default function GaleriPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', caption: '', image_url: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => setItems(await getGaleri() || []);
  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (entry) => setForm({ id: entry.id, title: entry.title || '', caption: entry.caption || '', image_url: entry.image_url || '' });
  const handleReset = () => setForm({ id: null, title: '', caption: '', image_url: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { title: form.title, caption: form.caption, image_url: form.image_url };
    const response = await saveGaleri(form.id ? { id: form.id, ...payload } : payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan galeri.');
      return;
    }
    toastSuccess('Post galeri berhasil disimpan.');
    handleReset();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus post galeri ini?')) return;
    const response = await deleteGaleri(id);
    if (response.error) {
      toastError('Gagal menghapus post galeri.');
      return;
    }
    toastSuccess('Post galeri dihapus.');
    load();
  };

  return (
    <AdminLayout title="Galeri">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Feed Galeri</h2>
          <div className="grid gap-4">
            {items.length === 0 && <p className="text-slate-500">Belum ada posting galeri.</p>}
            {items.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                {item.image_url && <img src={item.image_url} alt={item.title || 'Galeri'} className="h-52 w-full object-cover" />}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 text-sm mt-2">{item.caption}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleEdit(item)} type="button" className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                    <button onClick={() => handleDelete(item.id)} type="button" className="rounded-full border border-rose-300 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Hapus</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah / Edit Post Galeri</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Judul</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Caption</label>
              <textarea name="caption" value={form.caption} onChange={handleChange} rows={3} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Gambar</label>
              <ImageUploader
                currentImage={form.image_url}
                onUploadComplete={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
                bucket="media"
                folder="galeri"
              />
            </div>
            <button disabled={loading} type="submit" className="rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold hover:bg-primary-700 disabled:opacity-60">
              {loading ? 'Menyimpan...' : form.id ? 'Update Post' : 'Tambah Post'}
            </button>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
