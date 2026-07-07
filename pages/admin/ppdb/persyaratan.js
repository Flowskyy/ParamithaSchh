import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getPersyaratanPPDB, createPersyaratanPPDB, updatePersyaratanPPDB, deletePersyaratanPPDB } from '../../../services/api';
import { toastSuccess, toastError } from '../../../utils/toast';
import { GripVertical, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const emptyPersyaratan = {
  id: null,
  deskripsi: ''
};

export default function PersyaratanPPDBPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyPersyaratan);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const load = async () => {
    const data = await getPersyaratanPPDB();
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
      deskripsi: form.deskripsi,
      urutan: items.length
    };

    const response = form.id 
      ? await updatePersyaratanPPDB(form.id, payload)
      : await createPersyaratanPPDB(payload);
    
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan persyaratan.');
      return;
    }
    toastSuccess('Persyaratan berhasil disimpan.');
    setForm(emptyPersyaratan);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      deskripsi: item.deskripsi || ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus persyaratan ini?')) return;
    const response = await deletePersyaratanPPDB(id);
    if (response.error) {
      toastError('Gagal menghapus persyaratan.');
      return;
    }
    toastSuccess('Persyaratan berhasil dihapus.');
    load();
  };

  const handleReset = () => setForm(emptyPersyaratan);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newItems = [...items];
    const [reorderedItem] = newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, reorderedItem);

    // Update urutan for all items
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      urutan: index
    }));

    setItems(updatedItems);
    setDraggedItem(null);

    // Save new order to database
    for (const item of updatedItems) {
      await updatePersyaratanPPDB(item.id, { urutan: item.urutan });
    }
  };

  return (
    <AdminLayout title="Persyaratan PPDB">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Link href="/admin/ppdb" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#C0161C] transition-colors mb-4">
              <ArrowLeft size={16} />
              Kembali ke PPDB
            </Link>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Persyaratan PPDB</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola persyaratan penerimaan peserta didik baru</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Daftar Persyaratan</h2>
            <div className="space-y-3">
              {items.length === 0 && (
                <div className="bg-[#F8F8FF] rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="text-slate-500">Belum ada persyaratan.</p>
                </div>
              )}
              {items.sort((a, b) => (a.urutan || 0) - (b.urutan || 0)).map((item, index) => (
                <article
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`rounded-xl border border-slate-200 p-4 transition-colors shadow-sm hover:shadow-md cursor-move ${
                    draggedItem === index ? 'border-[#C0161C] bg-red-50' : 'hover:border-[#C0161C]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <GripVertical className="text-slate-400 mt-1" size={20} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1E1E8F]">{item.deskripsi}</h3>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(item)} className="bg-white text-slate-700 font-medium text-sm px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="bg-white text-red-600 font-medium text-sm px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Tambah / Edit Persyaratan</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Persyaratan</label>
                <textarea
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none resize-none"
                  placeholder="Contoh: Fotokopi Ijazah"
                />
              </div>
              <div className="flex justify-between gap-3">
                <button type="button" onClick={handleReset} className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
                <button type="submit" disabled={loading} className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60 shadow-lg shadow-red-100">{loading ? 'Menyimpan...' : form.id ? 'Update Persyaratan' : 'Tambah Persyaratan'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
