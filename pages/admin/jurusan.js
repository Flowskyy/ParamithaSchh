import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getJurusan, saveJurusan, deleteJurusan, uploadImage } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Plus, Edit, Trash, X, Save, CheckCircle, ArrowRight, Upload, Loader2 } from 'lucide-react';
import SmartImage from '../../components/SmartImage';
import ImageUploader from '../../components/ImageUploader';
import toast from 'react-hot-toast';

function JurusanAdmin() {
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
    const data = await getJurusan();
    if (data) setItems(data);
    setLoading(false);
  }

  const handleEdit = (item) => {
    setEditing(item.id);
    setFormData({
      ...item,
      kompetensi: item.kompetensi || [],
      prospek: item.prospek || []
    });
  };

  const handleCreate = () => {
    const newItem = {
      name: '',
      short_desc: '',
      description: '',
      image_url: '',
      slug: '',
      kompetensi: [],
      prospek: []
    };
    setEditing('new');
    setFormData(newItem);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await saveJurusan(formData);
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

  // Helper for array inputs
  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), '']
    });
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
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
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
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
                <div className="space-y-2">
                  <label className="text-slate-600 text-sm font-medium">Short Description</label>
                  <textarea 
                    value={formData.short_desc || ''} 
                    onChange={e => setFormData({...formData, short_desc: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all h-20"
                    placeholder="Deskripsi singkat untuk kartu..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-600 text-sm font-medium mb-2 block">Cover Image</label>
                  
                  <ImageUploader 
                    currentImage={formData.image_url} 
                    onUploadComplete={(url) => setFormData({...formData, image_url: url})} 
                    aspectRatio={16/9} 
                    bucket="jurusan" 
                    folder="covers" 
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Kompetensi Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-600 text-sm font-medium">Kompetensi / Kurikulum</label>
                  <button type="button" onClick={() => addArrayItem('kompetensi')} className="text-primary-600 text-xs font-bold hover:underline">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {(formData.kompetensi || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="bg-slate-100 p-2 rounded text-slate-500"><CheckCircle size={14} /></div>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={e => updateArrayItem('kompetensi', idx, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-primary-500"
                        placeholder="Materi pembelajaran..."
                      />
                      <button type="button" onClick={() => removeArrayItem('kompetensi', idx)} className="text-red-400 hover:text-red-600 p-1">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {(!formData.kompetensi || formData.kompetensi.length === 0) && (
                    <p className="text-slate-400 text-xs italic">Belum ada data kompetensi.</p>
                  )}
                </div>
              </div>

              {/* Prospek Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-600 text-sm font-medium">Prospek Karir</label>
                  <button type="button" onClick={() => addArrayItem('prospek')} className="text-primary-600 text-xs font-bold hover:underline">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {(formData.prospek || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="bg-slate-100 p-2 rounded text-slate-500"><ArrowRight size={14} /></div>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={e => updateArrayItem('prospek', idx, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-primary-500"
                        placeholder="Peluang karir..."
                      />
                      <button type="button" onClick={() => removeArrayItem('prospek', idx)} className="text-red-400 hover:text-red-600 p-1">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {(!formData.prospek || formData.prospek.length === 0) && (
                    <p className="text-slate-400 text-xs italic">Belum ada data prospek karir.</p>
                  )}
                </div>
              </div>
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
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Image</th>
                  <th className="p-4 font-bold">Jurusan Info</th>
                  <th className="p-4 font-bold">Deskripsi Singkat</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 w-32">
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-200 border border-slate-200 relative">
                        <SmartImage src={item.image_url} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-lg">{item.name}</div>
                      <div className="text-xs text-slate-500 font-mono bg-slate-100 inline-block px-1 rounded">/{item.slug}</div>
                    </td>
                    <td className="p-4 max-w-md">
                      <p className="text-sm text-slate-600 line-clamp-2">{item.short_desc}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-400">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default withAdmin(JurusanAdmin);
