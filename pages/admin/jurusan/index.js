import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getJurusan, saveJurusan, deleteJurusan, uploadImage } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Plus, Edit, Trash, X, Save, CheckCircle, ArrowRight, Upload, Loader2 } from 'lucide-react';
import SmartImage from '../../../components/SmartImage';
import ImageUploader from '../../../components/ImageUploader';
import toast from 'react-hot-toast';

function JurusanAdmin() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL query params for deep linking
  useEffect(() => {
    if (!loading && items.length > 0) {
      const { slug, action } = router.query;
      
      if (action === 'new') {
        if (editing !== 'new') handleCreate();
      } else if (slug) {
        // If editing specific slug, ensure we find it and open editor immediately
        const item = items.find(i => i.slug === slug);
        if (item) {
           if (editing !== item.id) {
             setEditing(item.id);
             setFormData({
                ...item,
                kompetensi: item.kompetensi || [],
                prospek: item.prospek || []
             });
           }
        }
      } else {
        if (editing) {
          setEditing(null);
          setFormData({});
        }
      }
    }
  }, [loading, items, router.query]);

  async function loadData() {
    setLoading(true);
    const data = await getJurusan();
    if (data) setItems(data);
    setLoading(false);
  }

  const closeEditor = () => {
    setEditing(null);
    setFormData({});
    router.push('/admin/jurusan', undefined, { shallow: true });
  };

  const handleEdit = (item) => {
    if (editing !== item.id) {
      setEditing(item.id);
      setFormData({
        ...item,
        kompetensi: item.kompetensi || [],
        prospek: item.prospek || [],
        fasilitas: item.fasilitas || [],
        gallery: item.gallery || []
      });
    }
    
    if (router.query.slug !== item.slug) {
      router.push({
        pathname: '/admin/jurusan',
        query: { slug: item.slug }
      }, undefined, { shallow: true });
    }
  };

  const handleCreate = () => {
    if (editing !== 'new') {
      const newItem = {
        name: '',
        short_desc: '',
        content: '',
        image_url: '',
        slug: '',
        kompetensi: [],
        prospek: [],
        fasilitas: [],
        gallery: []
      };
      setEditing('new');
      setFormData(newItem);
    }
    
    if (router.query.action !== 'new') {
      router.push({
        pathname: '/admin/jurusan',
        query: { action: 'new' }
      }, undefined, { shallow: true });
    }
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
      if (editing === id) {
        setEditing(null);
        setFormData({});
      }
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
                  <label className="text-slate-600 text-sm font-medium">Full Content</label>
                  <textarea 
                    value={formData.content || ''} 
                    onChange={e => setFormData({...formData, content: e.target.value})}
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

              {/* Fasilitas Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-600 text-sm font-medium">Fasilitas</label>
                  <button type="button" onClick={() => addArrayItem('fasilitas')} className="text-primary-600 text-xs font-bold hover:underline">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {(formData.fasilitas || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="bg-slate-100 p-2 rounded text-slate-500"><CheckCircle size={14} /></div>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={e => updateArrayItem('fasilitas', idx, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-primary-500"
                        placeholder="Nama fasilitas..."
                      />
                      <button type="button" onClick={() => removeArrayItem('fasilitas', idx)} className="text-red-400 hover:text-red-600 p-1">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {(!formData.fasilitas || formData.fasilitas.length === 0) && (
                    <p className="text-slate-400 text-xs italic">Belum ada data fasilitas.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-slate-600 text-sm font-medium">Galeri Kegiatan / Praktek Siswa</label>
                <button type="button" onClick={() => addArrayItem('gallery')} className="text-primary-600 text-xs font-bold hover:underline">+ Add Image URL</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(formData.gallery || []).map((item, idx) => (
                  <div key={idx} className="relative group border border-slate-200 rounded-lg p-2 bg-slate-50">
                    <div className="aspect-[4/5] relative mb-2 bg-slate-200 rounded overflow-hidden">
                       {item ? (
                         <SmartImage src={item} fill className="object-cover" />
                       ) : (
                         <div className="flex items-center justify-center h-full text-slate-400 text-xs">No Image</div>
                       )}
                    </div>
                    <input 
                      type="text" 
                      value={item} 
                      onChange={e => updateArrayItem('gallery', idx, e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded p-1 mb-2"
                      placeholder="Image URL"
                    />
                    <div className="mb-2">
                       <ImageUploader 
                          currentImage={item} 
                          onUploadComplete={(url) => updateArrayItem('gallery', idx, url)}
                          aspectRatio={4/5}
                          bucket="jurusan"
                          folder="gallery"
                          variant="compact"
                          showPreview={false}
                       />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeArrayItem('gallery', idx)} 
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div 
                  onClick={() => addArrayItem('gallery')}
                  className="aspect-[4/5] border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  <Plus size={24} />
                  <span className="text-xs mt-2 font-medium">Add Image</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100 mt-4">
              <div>
                {editing !== 'new' && (
                  <button 
                    type="button" 
                    onClick={() => handleDelete(editing)} 
                    className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash size={16} /> Delete
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={closeEditor} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                  <Save size={16} /> Save Jurusan
                </button>
              </div>
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
