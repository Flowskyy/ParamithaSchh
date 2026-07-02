import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSejarah, createSejarah, updateSejarah, deleteSejarah } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';

export default function SejarahPage() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ year: '', title: '', content: '', id: null });
  const [loading, setLoading] = useState(false);

  const loadEntries = async () => {
    const data = await getSejarah();
    setEntries(data || []);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (entry) => {
    setForm({ year: entry.year || '', title: entry.title || '', content: entry.content || '', id: entry.id });
  };

  const handleReset = () => {
    setForm({ year: '', title: '', content: '', id: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { year: form.year, title: form.title, content: form.content };

    const response = form.id ? await updateSejarah(form.id, payload) : await createSejarah(payload);
    setLoading(false);

    if (response.error) {
      toastError('Gagal menyimpan sejarah.');
      return;
    }

    toastSuccess('Sejarah berhasil disimpan.');
    handleReset();
    loadEntries();
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus entri sejarah ini?')) return;
    const response = await deleteSejarah(id);
    if (response.error) {
      toastError('Gagal menghapus entri.');
      return;
    }
    toastSuccess('Entri sejarah dihapus.');
    loadEntries();
  };

  return (
    <AdminLayout title="Sejarah Sekolah">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Daftar Sejarah</h2>
          <div className="space-y-2">
            {entries.length === 0 && <p className="text-slate-500">Belum ada entri sejarah.</p>}
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-3xl border border-slate-200 p-4 hover:border-primary-500 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{entry.year}</p>
                    <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleEdit(entry)} className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                    <button type="button" onClick={() => handleDelete(entry.id)} className="rounded-full border border-rose-300 px-3 py-1 text-sm text-rose-600 hover:bg-rose-50">Hapus</button>
                  </div>
                </div>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{entry.content}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah / Edit Entri</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Tahun</label>
              <input name="year" value={form.year} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Judul</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Deskripsi</label>
              <textarea name="content" value={form.content} onChange={handleChange} rows={5} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-100 focus:outline-none" />
            </div>
            <div className="flex justify-between gap-3">
              <button type="button" onClick={handleReset} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50">Reset</button>
              <button type="submit" disabled={loading} className="rounded-2xl bg-primary-600 px-5 py-3 text-sm text-white font-semibold hover:bg-primary-700 disabled:opacity-60">{loading ? 'Menyimpan...' : form.id ? 'Update Entri' : 'Tambah Entri'}</button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
