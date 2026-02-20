import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getGaleri, saveGaleri, deleteGaleri } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Plus, Trash, X, Save, Edit } from 'lucide-react';
import SmartImage from '../../../components/SmartImage';
import ImageUploader from '../../../components/ImageUploader';

function GaleriAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getGaleri();
    if (data) setItems(data);
    setLoading(false);
  }

  const handleCreate = () => {
    setEditing('new');
    setFormData({ title: '', category: 'Kegiatan', image_url: '', caption: '' });
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setFormData(item);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { error } = await saveGaleri(formData);
      if (error) throw error;
      showToast.success('Saved successfully');
      setEditing(null);
      loadData();
    } catch (error) {
      console.error(error);
      showToast.error(error.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this item?')) {
      const { error } = await deleteGaleri(id);
      if (error) {
        console.error(error);
        showToast.error('Failed to delete');
        return;
      }
      showToast.success('Deleted successfully');
      loadData();
    }
  };

  // Pattern WAJIB: Upload Image
  // Replaced with ImageUploader component

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Galeri</h1>
          <p className="text-slate-500 text-sm">Kelola foto kegiatan dan galeri sekolah</p>
        </div>
        <button onClick={handleCreate} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      {editing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">{editing === 'new' ? 'New Gallery Item' : 'Edit Gallery Item'}</h3>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-600 text-sm font-medium">Title</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  required
                  placeholder="Judul Foto"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-600 text-sm font-medium">Category</label>
                <select 
                  value={formData.category || 'Kegiatan'} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                >
                  <option>Kegiatan</option>
                  <option>Prestasi</option>
                  <option>Fasilitas</option>
                  <option>Lainnya</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-slate-600 text-sm font-medium">Caption</label>
                <textarea 
                  rows="3"
                  value={formData.caption || ''} 
                  onChange={e => setFormData({...formData, caption: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="Tulis caption seperti di Instagram..."
                />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 text-sm font-medium mb-2 block">Image (Instagram Portrait Ratio 4:5)</label>
              
              <ImageUploader 
                currentImage={formData.image_url} 
                onUploadComplete={(url) => setFormData({...formData, image_url: url})} 
                aspectRatio={4/5} 
                bucket="galeri" 
                folder="uploads" 
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                <Save size={16} /> Save Gallery
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
            {/* Header: User Profile style */}
            <div className="p-3 flex items-center gap-2 border-b border-slate-50">
               <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden relative">
                  <SmartImage src="/images/logo.jpg" fill className="object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                 <p className="text-xs text-slate-500 truncate">{item.category}</p>
               </div>
               <div className="flex gap-1">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
               </div>
            </div>

            {/* Image: Portrait 4:5 */}
             <div className="relative aspect-[4/5] bg-slate-100">
               <SmartImage src={item.image_url} fill style={{ objectFit: 'cover' }} />
             </div>

            {/* Caption */}
            <div className="p-3">
              <div className="flex gap-3 mb-2">
                 {/* Fake Action Buttons */}
                 <div className="text-slate-800"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>
                 <div className="text-slate-800"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></div>
                 <div className="text-slate-800"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></div>
              </div>
              <p className="text-sm text-slate-800 line-clamp-2">
                <span className="font-bold mr-2">admin_sekolah</span>
                {item.caption || <span className="text-slate-400 italic">No caption...</span>}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <p className="text-slate-400 text-center py-8 col-span-full">No gallery items found.</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(GaleriAdmin);
