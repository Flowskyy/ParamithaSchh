import { useState, useEffect } from 'react';
import Head from 'next/head';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Save, GripVertical, Check, X, RefreshCw, Layout } from 'lucide-react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getHomepageSections, updateHomepageSectionOrder } from '../../../services/api';
import { fallbackHomepageSections } from '../../../utils/fallbackData';
import { toastSuccess, toastError, toastLoading, toastDismiss } from '../../../utils/toast';

function AdminSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
    // A small delay to ensure dnd is ready (especially in React 18 StrictMode)
    const animationFrame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  async function fetchSections() {
    try {
      setLoading(true);
      const data = await getHomepageSections();
      
      if (data && data.length > 0) {
        const sorted = [...data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        setSections(sorted);
      } else {
        setSections(fallbackHomepageSections);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toastError('Gagal memuat data section');
      setSections(fallbackHomepageSections);
    } finally {
      setLoading(false);
    }
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }));

    setSections(updatedItems);
  };

  const toggleActive = (id) => {
    setSections(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, is_active: !item.is_active };
      }
      return item;
    }));
  };

  const saveOrder = async () => {
    setSaving(true);
    const toastId = toastLoading('Menyimpan urutan...');
    try {
      const updates = sections.map((item, index) => ({
        id: item.id,
        label: item.label,
        component: item.component,
        order_index: index,
        is_active: item.is_active
      }));

      const { error } = await updateHomepageSectionOrder(updates);
      if (error) throw error;

      toastDismiss(toastId);
      toastSuccess('Urutan section berhasil disimpan');
      fetchSections();
    } catch (error) {
      toastDismiss(toastId);
      toastError('Gagal menyimpan urutan');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    if (confirm('Reset urutan ke pengaturan awal? Perubahan yang belum disimpan akan hilang.')) {
      setSections(fallbackHomepageSections);
    }
  };

  if (loading && !sections.length) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin text-[#1E1E8F] mb-4">
            <RefreshCw size={40} />
          </div>
          <p className="text-slate-500 font-medium">Memuat data section...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Atur Section Beranda — Admin SMK Paramitha 2</title>
      </Head>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Layout className="text-[#1E1E8F]" />
            Atur Section Beranda
          </h1>
          <p className="text-slate-500 mt-1">Drag & Drop untuk mengubah urutan tampilan di halaman utama</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <RefreshCw size={18} />
            <span>Reset Default</span>
          </button>
          <button 
            onClick={saveOrder}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#1E1E8F] text-white rounded-xl hover:bg-[#151560] transition-all shadow-lg shadow-[#1E1E8F]/20 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl">
        {isReady ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="homepage-sections" type="SECTION">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-4 min-h-[100px]"
                >
                  {sections.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            flex items-center justify-between p-5 bg-white rounded-2xl border transition-all duration-200
                            ${snapshot.isDragging 
                              ? 'shadow-2xl ring-2 ring-[#1E1E8F] ring-offset-2 ring-offset-white z-50 bg-slate-50' 
                              : 'shadow-sm border-slate-100 hover:border-slate-300 hover:shadow-md'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              {...provided.dragHandleProps}
                              className="p-2 text-slate-400 hover:text-[#1E1E8F] cursor-grab active:cursor-grabbing hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <GripVertical size={24} />
                            </div>
                            <div>
                              <h3 className={`font-bold transition-colors ${item.is_active !== false ? 'text-slate-800' : 'text-slate-400'}`}>
                                {item.label}
                              </h3>
                              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{item.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleActive(item.id)}
                              className={`
                                flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                                ${item.is_active !== false 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200'}
                              `}
                            >
                              {item.is_active !== false ? (
                                <>
                                  <Check size={14} strokeWidth={3} />
                                  <span>AKTIF</span>
                                </>
                              ) : (
                                <>
                                  <X size={14} strokeWidth={3} />
                                  <span>NON-AKTIF</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="animate-pulse text-slate-300 mb-4">
              <GripVertical size={48} />
            </div>
            <p className="text-slate-400 font-medium">Menyiapkan editor urutan...</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 max-w-3xl">
        <h4 className="text-[#1E1E8F] font-bold mb-2 flex items-center gap-2">
          <RefreshCw size={18} />
          Tips Pengaturan
        </h4>
        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
          <li>Gunakan ikon grip di sebelah kiri untuk menggeser posisi section.</li>
          <li>Klik tombol status untuk menyembunyikan/menampilkan section di beranda.</li>
          <li>Jangan lupa klik <strong>Simpan Perubahan</strong> agar urutan baru muncul di website utama.</li>
        </ul>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminSections);
