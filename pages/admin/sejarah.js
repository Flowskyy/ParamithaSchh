import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSejarah, createSejarah, updateSejarah, deleteSejarah, updateSejarahOrder } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { GripVertical, Plus } from 'lucide-react';

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

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;

    const newEntries = [...entries];
    const [draggedItem] = newEntries.splice(dragIndex, 1);
    newEntries.splice(dropIndex, 0, draggedItem);

    setEntries(newEntries);

    // Update order in database
    const updates = newEntries.map((entry, index) => ({
      id: entry.id,
      order_index: index
    }));

    const response = await updateSejarahOrder(updates);
    if (response.error) {
      toastError('Gagal mengupdate urutan.');
      loadEntries(); // Revert on error
    } else {
      toastSuccess('Urutan berhasil diupdate.');
    }
  };

  return (
    <AdminLayout title="Sejarah Sekolah">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Sejarah Sekolah</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola timeline sejarah sekolah</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Daftar Sejarah</h2>
            <div className="space-y-3">
              {entries.length === 0 && (
                <div className="bg-[#F8F8FF] rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="text-slate-500">Belum ada entri sejarah.</p>
                </div>
              )}
              {entries.map((entry, index) => (
                <article
                  key={entry.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="rounded-xl border border-slate-200 p-4 hover:border-[#C0161C] transition-colors cursor-move bg-white shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <GripVertical className="text-slate-400 mt-1 flex-shrink-0" size={20} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">{entry.year}</p>
                        <h3 className="font-semibold text-[#1E1E8F] mt-1">{entry.title}</h3>
                        <p className="text-slate-600 text-sm mt-2 line-clamp-2">{entry.content}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(entry)} className=" bg-white text-slate-700 font-medium text-sm px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(entry.id)} className="bg-white text-red-600 font-medium text-sm px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Tambah / Edit Entri</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Tahun</label>
                <input name="year" value={form.year} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Judul</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Deskripsi</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={5} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
              <div className="flex justify-between gap-3">
                <button type="button" onClick={handleReset} className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
                <button type="submit" disabled={loading} className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60 shadow-lg shadow-red-100">{loading ? 'Menyimpan...' : form.id ? 'Update Entri' : 'Tambah Entri'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
