import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getGaleri, saveGaleri, deleteGaleri, uploadImage } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Plus, Trash, X, Save, Upload, Loader2 } from 'lucide-react';
import SmartImage from '../../components/SmartImage';
import ImageUploader from '../../components/ImageUploader';
import toast from 'react-hot-toast';

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
    setFormData({ title: '', category: 'Kegiatan', image_url: '' });
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
            <h3 className="text-xl font-bold text-slate-900">New Gallery Item</h3>
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
              <label className="text-slate-600 text-sm font-medium mb-2 block">Image</label>
              
              <ImageUploader 
                currentImage={formData.image_url} 
                onUploadComplete={(url) => setFormData({...formData, image_url: url})} 
                aspectRatio={4/3} 
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-square bg-slate-100 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <SmartImage src={item.image_url} fill style={{ objectFit: 'cover' }} className="group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white font-bold text-sm truncate">{item.title}</p>
              <span className="text-xs text-primary-300 font-medium">{item.category}</span>
              <button 
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-full hover:scale-110 transition-transform shadow-lg"
                title="Delete"
              >
                <Trash size={14} />
              </button>
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
