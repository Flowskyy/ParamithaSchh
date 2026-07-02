import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getJurusanAll, saveJurusan, deleteJurusan, toggleJurusanAktif, updateJurusanOrderBatch } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';

const emptyJurusan = {
  id: null,
  name: '',
  slug: '',
  singkatan: '',
  warna_primer: '#1E1E8F',
  warna_sekunder: '#3B82F6',
  short_desc: '',
  deskripsi: '',
  aktif: true,
  order_index: 0,
  image_url: '',
  gallery: [],
  materi: [],
  activities: []
};

export default function JurusanAdminPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyJurusan);
  const [loading, setLoading] = useState(false);

  const load = async () => setItems(await getJurusanAll() || []);
  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, aktif: !!form.aktif };
    const response = await saveJurusan(payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan jurusan.');
      return;
    }
    toastSuccess('Jurusan berhasil disimpan.');
    setForm(emptyJurusan);
    load();
  };

  const handleEdit = (item) => setForm({ ...item, aktiv: item.aktif });
  const handleDelete = async (id) => {
    if (!confirm('Hapus jurusan ini?')) return;
    const response = await deleteJurusan(id);
    if (response.error) {
      toastError('Gagal menghapus jurusan.');
      return;
    }
    toastSuccess('Jurusan berhasil dihapus.');
    load();
  };

  const handleToggleActive = async (item) => {
    const response = await toggleJurusanAktif(item.id, !item.aktif);
    if (response.error) {
      toastError('Gagal memperbarui status aktif.');
      return;
    }
    load();
  };

  const handleOrderSave = async () => {
    setLoading(true);
    const updates = items.map((item, index) => ({ id: item.id, order_index: index }));
    const response = await updateJurusanOrderBatch(updates);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan urutan jurusan.');
      return;
    }
    toastSuccess('Urutan jurusan berhasil disimpan.');
    load();
  };

  return (
    <AdminLayout title="Kelola Jurusan">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Daftar Jurusan</h2>
              <p className="text-slate-500 text-sm">Kelola status, urutan, dan detail program.</p>
            </div>
            <button
              type="button"
              onClick={handleOrderSave}
              disabled={loading}
              className="rounded-2xl bg-primary-600 px-4 py-2 text-white text-sm hover:bg-primary-700 disabled:opacity-60"
            >
              Simpan Urutan
            </button>
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 p-4 hover:border-primary-500 transition">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-slate-500 text-sm">{item.slug}</p>
                    <p className="text-slate-500 text-sm">Order: {item.order_index ?? '-'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleEdit(item)} className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                    <button type="button" onClick={() => handleToggleActive(item)} className={`rounded-full px-4 py-2 text-sm ${item.aktif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {item.aktif ? 'Aktif' : 'Nonaktif'}
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="rounded-full border border-rose-300 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Hapus</button>
                  </div>
                </div>
              </article>
            ))}
            {items.length === 0 && <p className="text-slate-500">Belum ada data jurusan.</p>}
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah / Edit Jurusan</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Nama Jurusan</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Singkatan</label>
                <input name="singkatan" value={form.singkatan} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Order Index</label>
                <input name="order_index" type="number" value={form.order_index} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Deskripsi Singkat</label>
              <textarea name="short_desc" value={form.short_desc} onChange={handleChange} rows={3} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Deskripsi Lengkap</label>
              <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows={4} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div className="flex items-center gap-3">
              <input id="aktif" type="checkbox" name="aktif" checked={!!form.aktif} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="aktif" className="text-sm text-slate-700">Aktifkan jurusan</label>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setForm(emptyJurusan)} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="submit" disabled={loading} className="rounded-2xl bg-primary-600 px-5 py-3 text-sm text-white font-semibold hover:bg-primary-700 disabled:opacity-60">{loading ? 'Menyimpan...' : form.id ? 'Update Jurusan' : 'Tambah Jurusan'}</button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
