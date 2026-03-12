import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getMitra, createMitra, updateMitra, deleteMitra } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Plus, Trash, X, Save, Edit, GripVertical, Check, Ban, Building2 } from 'lucide-react';
import SmartImage from '../../../components/SmartImage';
import ImageUploader from '../../../components/ImageUploader';
import { Reorder } from 'framer-motion';

function MitraItem({ item, handleEdit, handleDelete }) {
  return (
    <Reorder.Item value={item} id={item.id} className="relative">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-primary-200 hover:shadow-md transition-all group mb-4 cursor-grab active:cursor-grabbing">
        <div className="text-slate-400 hover:text-primary-600 cursor-grab active:cursor-grabbing p-2">
          <GripVertical size={20} />
        </div>
        
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-50 p-2 border border-slate-100">
          <div className="relative w-full h-full">
            <SmartImage src={item.logo_url} fill style={{ objectFit: 'contain' }} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-slate-900 font-bold truncate">{item.nama}</h4>
          <a href={item.website} target="_blank" rel="noreferrer" className="text-primary-600 text-sm hover:underline truncate block">
            {item.website || '-'}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-2 py-1 rounded-md text-xs font-bold ${item.aktif ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {item.aktif ? 'Active' : 'Inactive'}
          </div>
          <button onClick={() => handleEdit(item)} className="p-2 text-[#4F8EF7] hover:bg-[#4F8EF7]/10 rounded-lg transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash size={18} />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

function MitraAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getMitra();
    if (data) {
      // Sort by order_index
      const sorted = data.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      setItems(sorted);
    }
    setLoading(false);
  }

  const handleCreate = () => {
    setEditing('new');
    setFormData({ 
      nama: '', 
      logo_url: '', 
      website: '',
      aktif: true,
      order_index: items.length + 1
    });
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setFormData(item);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editing === 'new') {
        result = await createMitra(formData);
      } else {
        result = await updateMitra(editing, formData);
      }
      
      if (result.error) throw result.error;
      
      showToast.success('Saved successfully');
      setEditing(null);
      loadData();
    } catch (error) {
      console.error(error);
      showToast.error(error.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this mitra?')) {
      const { error } = await deleteMitra(id);
      if (error) {
        showToast.error('Failed to delete');
        return;
      }
      showToast.success('Deleted successfully');
      loadData();
    }
  };

  const handleReorder = async (newOrder) => {
    setItems(newOrder);
    
    // Update order in DB
    // We only update if the order actually changed to avoid spamming API
    // For simplicity in this demo, we'll update all. In prod, optimize this.
    try {
      const updates = newOrder.map((item, index) => ({
        id: item.id,
        order_index: index
      }));
      
      // We would ideally have a bulk update endpoint.
      // For now, we'll just optimistically update UI.
      // Implementing real bulk update requires backend support or multiple requests.
      
      // Let's just update the changed items one by one for now (careful with rate limits)
      // A better way is to rely on client state for display and save order when user clicks "Save Order"
      // But for "Drag & Drop" UX, usually auto-save is expected.
      
      // For this MVP, we will not auto-save to DB on every drag to prevent rate limiting issues.
      // We can add a "Save Order" button or just save individually.
      // Let's assume we just update locally and have a manual save or simple loop.
      
      for (let i = 0; i < updates.length; i++) {
        await updateMitra(updates[i].id, { order_index: updates[i].order_index });
      }
      
      showToast.success('Order updated');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8" data-section="admin-beranda-mitra/header" aria-label="Beranda Mitra Header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Mitra</h1>
          <p className="text-slate-500 text-sm">Partner industri dan perusahaan</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} /> Add Mitra
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto" data-section="admin-beranda-mitra/modal-overlay" aria-label="Overlay Edit Mitra">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl" data-section="admin-beranda-mitra/modal-card" aria-label="Modal Edit Mitra">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">{editing === 'new' ? 'Add New Mitra' : 'Edit Mitra'}</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6" data-section="admin-beranda-mitra/form" aria-label="Form Edit Mitra">
              <div className="space-y-2">
                <label className="text-slate-600 text-xs uppercase font-bold tracking-wider">Nama Perusahaan</label>
                <input 
                  type="text" 
                  value={formData.nama || ''} 
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-primary-600 focus:outline-none transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-slate-600 text-xs uppercase font-bold tracking-wider">Website URL</label>
                <input 
                  type="text" 
                  value={formData.website || ''} 
                  onChange={e => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-primary-600 focus:outline-none transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, aktif: !prev.aktif }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${formData.aktif ? 'bg-primary-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.aktif ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-slate-900 font-medium">Status Aktif</span>
              </div>

              <div className="space-y-2">
                <label className="text-slate-600 text-xs uppercase font-bold tracking-wider block mb-2">Logo Perusahaan</label>
                <ImageUploader 
                  currentImage={formData.logo_url} 
                  onUploadComplete={(url) => setFormData({...formData, logo_url: url})} 
                  aspectRatio={16/9} 
                  bucket="mitra" 
                  folder="" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                  <Save size={18} /> Save Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-3xl" data-section="admin-beranda-mitra/list" aria-label="Daftar Mitra">
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} data-section="admin-beranda-mitra/reorder-group" aria-label="Kelompok Reorder Mitra">
          {items.map((item) => (
            <MitraItem 
              key={item.id} 
              item={item} 
              handleEdit={handleEdit} 
              handleDelete={handleDelete} 
            />
          ))}
        </Reorder.Group>
        
        {items.length === 0 && !loading && (
          <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed" data-section="admin-beranda-mitra/empty-state" aria-label="Kosong Mitra">
            <Building2 size={48} className="mx-auto mb-4 opacity-20 text-slate-400" />
            <p>No partners found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(MitraAdmin);
