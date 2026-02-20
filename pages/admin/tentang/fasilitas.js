import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getFasilitas, saveFasilitas, deleteFasilitas, uploadImage } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Plus, Trash, X, Save, Edit, Upload, Loader2 } from 'lucide-react';
import SmartImage from '../../../components/SmartImage';
import ImageUploader from '../../../components/ImageUploader';
import toast from 'react-hot-toast';

function FasilitasAdmin() {
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
    const data = await getFasilitas();
    if (data) setItems(data);
    setLoading(false);
  }

  const handleCreate = () => {
    setEditing('new');
    setFormData({ title: '', description: '', image_url: '' });
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setFormData(item);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { error } = await saveFasilitas(formData);
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
      const { error } = await deleteFasilitas(id);
      if (error) {
        console.error(error);
        showToast.error('Failed to delete');
        return;
      }
      showToast.success('Deleted successfully');
      loadData();
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Fasilitas</h1>
          <p className="text-slate-500 text-sm">Kelola daftar fasilitas sekolah</p>
        </div>
        <button onClick={handleCreate} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      {editing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">{editing === 'new' ? 'New Fasilitas' : 'Edit Fasilitas'}</h3>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-slate-600 text-sm font-medium">Title</label>
              <input 
                type="text" 
                value={formData.title || ''} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                required
                placeholder="Nama Fasilitas"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-600 text-sm font-medium">Description</label>
              <textarea 
                rows="3"
                value={formData.desc || ''} 
                onChange={e => setFormData({...formData, desc: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                required
                placeholder="Deskripsi fasilitas..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-600 text-sm font-medium mb-2 block">Image</label>
              
              <ImageUploader 
                currentImage={formData.image_url} 
                onUploadComplete={(url) => setFormData({...formData, image_url: url})} 
                aspectRatio={4/3} 
                bucket="fasilitas" 
                folder="uploads" 
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                <Save size={16} /> Save Fasilitas
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-all group">
            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
              <SmartImage src={item.image_url} fill style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-slate-900 font-bold mb-1 group-hover:text-primary-600 transition-colors">{item.title}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-3">{item.desc || item.description}</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => handleEdit(item)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <p className="text-slate-400 text-center py-8 col-span-full">No facilities found.</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(FasilitasAdmin);
