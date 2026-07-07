import { useEffect, useState } from 'react';
import Image from 'next/image';
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
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Galeri</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola postingan galeri sekolah</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Feed Galeri</h2>
            <div className="space-y-3">
              {items.length === 0 && (
                <div className="bg-[#F8F8FF] rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="text-slate-500">Belum ada posting galeri.</p>
                </div>
              )}
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 overflow-hidden hover:border-[#C0161C] transition-colors shadow-sm hover:shadow-md">
                  {item.image_url && (
                    <div className="relative h-52 w-full">
                      <Image
                        src={item.image_url}
                        alt={item.title || 'Galeri'}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 bg-slate-50">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{item.caption}</p>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => handleEdit(item)} type="button" className="bg-white text-slate-700 font-medium text-sm px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(item.id)} type="button" className="bg-white text-red-600 font-medium text-sm px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black/7 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Tambah / Edit Post Galeri</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Judul</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Caption</label>
                <textarea name="caption" value={form.caption} onChange={handleChange} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Gambar</label>
                <ImageUploader
                  currentImage={form.image_url}
                  onUploadComplete={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
                  bucket="media"
                  folder="galeri"
                />
              </div>
              <button disabled={loading} type="submit" className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60">
                {loading ? 'Menyimpan...' : form.id ? 'Update Post' : 'Tambah Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
