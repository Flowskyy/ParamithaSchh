import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getHomepageSections, updateHomepageSectionOrder, setDefaultHomepageSections } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getHomepageSections();
    setSections(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleActive = (id, currentStatus) => {
    const newSections = sections.map(section =>
      section.id === id ? { ...section, is_active: !currentStatus } : section
    );
    setSections(newSections);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newSections = [...sections];
    const [reorderedItem] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedItem);

    setSections(newSections);
  };

  const handleSave = async () => {
    setLoading(true);
    const updates = sections.map((section, index) => ({
      id: section.id,
      order_index: index,
      is_active: section.is_active
    }));
    
    const response = await updateHomepageSectionOrder(updates);
    setLoading(false);
    
    if (response.error) {
      toastError('Gagal menyimpan urutan section.');
    } else {
      toastSuccess('Urutan section berhasil disimpan.');
      load();
    }
  };

  const handleReset = () => {
    load();
  };

  const handleSetDefault = async () => {
    if (!confirm('Set urutan section ke default? Ini akan menempatkan alumni di tengah setelah jurusan.')) return;
    setLoading(true);
    const response = await setDefaultHomepageSections();
    setLoading(false);
    if (response.error) {
      toastError('Gagal set default sections.');
    } else {
      toastSuccess('Default sections berhasil diset.');
      load();
    }
  };

  return (
    <AdminLayout title="Homepage Sections">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Homepage Sections</h1>
            <p className="text-sm text-slate-500 mt-1">Atur urutan dan tampilan section homepage</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSetDefault}
              disabled={loading}
              className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              Set Default
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : 'Simpan Urutan'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/7 p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {sections.length === 0 && (
                    <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
                      <p className="text-slate-500">Belum ada section.</p>
                    </div>
                  )}
                  {sections.map((section, index) => {
                    const isLocked = section.id === 'hero';
                    return (
                      <Draggable key={section.id} draggableId={section.id} index={index} isDragDisabled={isLocked}>
                        {(provided, snapshot) => (
                          <article
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`rounded-xl border p-4 transition ${
                              section.is_active 
                                ? 'border-[#C0161C] bg-slate-50' 
                                : 'border-slate-200 bg-slate-50 opacity-60'
                            } ${snapshot.isDragging ? 'shadow-lg' : ''} ${isLocked ? 'opacity-75' : ''}`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 flex-1">
                                <div {...provided.dragHandleProps} className={`${isLocked ? 'cursor-not-allowed text-slate-300' : 'cursor-grab text-slate-400 hover:text-slate-600'}`}>
                                  <GripVertical size={20} />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                      section.is_active ? 'bg-[#1E1E8F] text-white' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                      {index + 1}
                                    </span>
                                    <h3 className="font-semibold text-slate-900">{section.label}</h3>
                                    {isLocked && (
                                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                        Terkunci
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-500 text-sm mt-1">Component: {section.component}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={section.is_active}
                                    onChange={() => handleToggleActive(section.id, section.is_active)}
                                    disabled={isLocked}
                                    className="h-4 w-4 rounded border-slate-200 text-[#C0161C] focus:ring-[#C0161C] disabled:opacity-50"
                                  />
                                  <span className="text-sm text-slate-700">Aktif</span>
                                </label>
                              </div>
                            </div>
                          </article>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="bg-[#1E1E8F] rounded-xl border border-black/7 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Informasi</h3>
          <ul className="text-white/80 text-sm space-y-2">
            <li>• Drag & drop untuk mengubah urutan section</li>
            <li>• Centang "Aktif" untuk menampilkan section di homepage</li>
            <li>• Klik "Simpan Urutan" untuk menyimpan perubahan</li>
            <li>• Section yang tidak aktif tidak akan ditampilkan di homepage</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
