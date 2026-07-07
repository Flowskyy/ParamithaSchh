import { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminLayout from '../../components/AdminLayout';
import { getMitra, createMitra, updateMitra, deleteMitra } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import { toastSuccess, toastError } from '../../utils/toast';

const emptyMitra = {
  id: null,
  logo_url: ''
};

export default function MitraPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyMitra);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getMitra();
    setItems(data || []);
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
    
    const payload = {
      logo_url: form.logo_url || ''
    };

    const response = form.id 
      ? await updateMitra(form.id, payload)
      : await createMitra(payload);
    
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan mitra.');
      return;
    }
    toastSuccess('Mitra berhasil disimpan.');
    setForm(emptyMitra);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      logo_url: item.logo_url || ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus mitra ini?')) return;
    const response = await deleteMitra(id);
    if (response.error) {
      toastError('Gagal menghapus mitra.');
      return;
    }
    toastSuccess('Mitra berhasil dihapus.');
    load();
  };

  const handleReset = () => setForm(emptyMitra);

  return (
    <AdminLayout title="Mitra Perusahaan">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Mitra Perusahaan</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola mitra industri sekolah</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Daftar Mitra</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.length === 0 && (
                <div className="col-span-3 bg-[#F8F8FF] rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="text-slate-500">Belum ada data mitra.</p>
                </div>
              )}
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 overflow-hidden hover:border-[#C0161C] transition-colors">
                  <div className="aspect-square bg-slate-50 p-4 flex items-center justify-center">
                    {item.logo_url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.logo_url}
                          alt={item.nama}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl font-bold">
                        {item.nama?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white flex items-center justify-between">
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => handleEdit(item)} className="flex-1 bg-white text-slate-700 font-medium text-sm px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="bg-white text-red-600 font-medium text-sm px-3 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black/7 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Tambah / Edit Mitra</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Logo Perusahaan</label>
                <ImageUploader
                  currentImage={form.logo_url}
                  onUploadComplete={(url) => setForm((prev) => ({ ...prev, logo_url: url }))}
                  aspectRatio={1 / 1}
                  bucket="media"
                  folder="mitra"
                />
              </div>
              <div className="flex justify-between gap-3">
                <button type="button" onClick={handleReset} className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
                <button type="submit" disabled={loading} className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60">{loading ? 'Menyimpan...' : form.id ? 'Update Mitra' : 'Tambah Mitra'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
