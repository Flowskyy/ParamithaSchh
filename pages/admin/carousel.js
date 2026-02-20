import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getCarousel, saveCarousel, deleteCarousel } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Plus, Trash, X, Save } from 'lucide-react';
import SmartImage from '../../components/SmartImage';
import ImageUploader from '../../components/ImageUploader';

function CarouselAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getCarousel();
    if (data) setItems(data);
    setLoading(false);
  }

  const handleCreate = () => {
    setEditing('new');
    setFormData({ title: '', image_url: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await saveCarousel(formData);
    if (error) {
      console.error(error);
      showToast.error(error.message || 'Failed to save');
      return;
    }
    showToast.success('Saved successfully');
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this item?')) {
      const { error } = await deleteCarousel(id);
      if (error) {
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
          <h1 className="text-2xl font-bold text-slate-900">Manage Carousel</h1>
          <p className="text-slate-500 text-sm">Kelola gambar slider halaman depan</p>
        </div>
        <button onClick={handleCreate} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">New Carousel Item</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-1 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-600 text-sm font-medium">Title (Optional)</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  placeholder="Enter title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-600 text-sm font-medium mb-2 block">Image</label>
                <ImageUploader 
                  currentImage={formData.image_url} 
                  onUploadComplete={(url) => setFormData({...formData, image_url: url})} 
                  aspectRatio={16/9} 
                  bucket="carousel" 
                  folder="" 
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                  <Save size={16} /> Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
            <div className="h-48 relative overflow-hidden">
              <SmartImage src={item.image_url} fill style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-red-500 rounded-full hover:scale-110 transition-transform shadow-lg">
                  <Trash size={18} />
                </button>
              </div>
            </div>
            {item.title && (
              <div className="p-4 border-t border-slate-100">
                <h4 className="text-slate-800 font-bold truncate">{item.title}</h4>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(CarouselAdmin);
