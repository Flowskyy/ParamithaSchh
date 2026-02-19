import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getJurusan, saveJurusan, deleteJurusan } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Plus, Edit, Trash, X, Save } from 'lucide-react';
import SmartImage from '../../components/SmartImage';
import ImageUploader from '../../components/ImageUploader';

function JurusanAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getJurusan();
    if (data) setItems(data);
    setLoading(false);
  }

  const handleEdit = (item) => {
    setEditing(item.id);
    setFormData(item);
  };

  const handleCreate = () => {
    const newItem = {
      name: '',
      short_desc: '',
      description: '',
      image_url: '',
      slug: ''
    };
    setEditing('new');
    setFormData(newItem);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await saveJurusan(formData);
    if (error) {
      showToast.error('Failed to save');
      return;
    }
    showToast.success('Saved successfully');
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this?')) {
      const { error } = await deleteJurusan(id);
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
          <h1 className="text-2xl font-bold text-slate-900">Manage Jurusan</h1>
          <p className="text-slate-500 text-sm">Kelola daftar kompetensi keahlian</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {editing ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">{editing === 'new' ? 'New Jurusan' : 'Edit Jurusan'}</h3>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-600 text-sm font-medium">Name</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  required
                  placeholder="Nama Jurusan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-600 text-sm font-medium">Slug (URL)</label>
                <input 
                  type="text" 
                  value={formData.slug || ''} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  required
                  placeholder="nama-jurusan"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-slate-600 text-sm font-medium">Short Description</label>
              <textarea 
                value={formData.short_desc || ''} 
                onChange={e => setFormData({...formData, short_desc: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all h-20"
                placeholder="Deskripsi singkat..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-600 text-sm font-medium">Full Description</label>
              <textarea 
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all h-32"
                placeholder="Deskripsi lengkap..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-600 text-sm font-medium mb-2 block">Cover Image</label>
              <ImageUploader 
                currentImage={formData.image_url} 
                onUploadComplete={(url) => setFormData({...formData, image_url: url})} 
                aspectRatio={16/9} 
                bucket="media" 
                folder="jurusan" 
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                <Save size={16} /> Save Jurusan
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row h-full md:h-48 group">
              <div className="w-full md:w-48 h-48 md:h-full relative shrink-0">
                <SmartImage src={item.image_url} fill style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{item.short_desc}</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => handleEdit(item)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && (
            <p className="text-slate-400 text-center py-8 col-span-full">No data found.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

export default withAdmin(JurusanAdmin);
