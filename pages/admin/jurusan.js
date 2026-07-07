import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getJurusanAll, deleteJurusan, toggleJurusanAktif, updateJurusanOrderBatch } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { useRouter } from 'next/router';
import { Plus, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


export default function JurusanAdminPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => setItems(await getJurusanAll() || []);
  useEffect(() => { load(); }, []);











  const handleEdit = (id) => {
    router.push(`/admin/jurusan/${id}`);
  };

  const handleAddNew = () => {
    router.push('/admin/jurusan/new');
  };


  const handleToggleActive = async (item) => {
    const response = await toggleJurusanAktif(item.id, !item.aktif);
    if (response.error) {
      toastError(`Gagal memperbarui status aktif: ${response.error}`);
      return;
    }
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jurusan ini?')) return;
    const response = await deleteJurusan(id);
    if (response.error) {
      toastError(`Gagal menghapus jurusan: ${response.error}`);
      return;
    }
    toastSuccess('Jurusan berhasil dihapus.');
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);

    // Auto-save the new order
    const updates = newItems.map((item, index) => ({ id: item.id, order_index: index + 1 }));
    const response = await updateJurusanOrderBatch(updates);
    if (response.error) {
      toastError('Gagal menyimpan urutan jurusan.');
      load(); // Reload to restore original order
      return;
    }
    toastSuccess('Urutan jurusan berhasil diperbarui.');
  };

  return (
    <AdminLayout title="Kelola Jurusan">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Kelola Jurusan</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola program keahlian sekolah</p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors flex items-center gap-2 shadow-lg shadow-red-100"
          >
            <Plus size={18} /> Tambah Jurusan
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1E1E8F]">Daftar Jurusan</h2>
            <p className="text-sm text-slate-500">Drag & drop untuk mengatur urutan</p>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="jurusan-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <article
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`rounded-xl border p-4 transition-colors ${
                            snapshot.isDragging
                              ? 'border-[#C0161C] bg-slate-50 shadow-lg'
                              : 'border-slate-200 hover:border-[#C0161C] shadow-sm hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
                              >
                                <GripVertical size={20} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-[#1E1E8F]">{item.name}</h3>
                                <p className="text-slate-500 text-sm mt-1">{item.slug}</p>
                                <p className="text-slate-400 text-xs mt-1">Order: {item.order_index ?? '-'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => handleEdit(item.id)} className="bg-white text-slate-700 font-medium text-sm px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Edit</button>
                              <button type="button" onClick={() => handleToggleActive(item)} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${item.aktif ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                {item.aktif ? 'Aktif' : 'Nonaktif'}
                              </button>
                              <button type="button" onClick={() => handleDelete(item.id)} className="bg-white text-red-600 font-medium text-sm px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">Hapus</button>
                            </div>
                          </div>
                        </article>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {items.length === 0 && (
                    <div className="bg-[#F8F8FF] rounded-xl border border-dashed border-slate-300 p-12 text-center">
                      <p className="text-slate-500">Belum ada data jurusan.</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>


    </AdminLayout>
  );
}
