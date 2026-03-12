import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import withAdmin from '../../../utils/withAdmin';
import { getAlumni, saveAlumni, deleteAlumni } from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { Plus, Edit, Trash, X, Save, Briefcase, GraduationCap } from 'lucide-react';
import SmartImage from '../../../components/SmartImage';
import ImageUploader from '../../../components/ImageUploader';

function AlumniAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getAlumni();
    if (data) setItems(data);
    setLoading(false);
  }

  const handleEdit = (item) => {
    setEditing(item.id);
    setFormData(item);
  };

  const handleCreate = () => {
    const newItem = {
      nama: '',
      jurusan: '',
      angkatan: '', // or tahun_lulus
      perusahaan: '',
      posisi: '', 
      foto_url: '',
      deskripsi: ''
    };
    setEditing('new');
    setFormData(newItem);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await saveAlumni(formData);
    if (error) {
      console.error("Save Error:", error);
      showToast.error(`Failed to save: ${error.message || error.details || 'Unknown error'}`);
      return;
    }
    showToast.success('Saved successfully');
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this alumni?')) {
      const { error } = await deleteAlumni(id);
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
      <div className="flex items-center justify-between mb-8" data-section="admin-beranda-alumni/header" aria-label="Beranda Alumni Header">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Alumni</h1>
          <p className="text-slate-500 text-sm">Kelola data alumni berprestasi</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add Alumni
        </button>
      </div>

      {editing ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm" data-section="admin-beranda-alumni/form-card" aria-label="Form Alumni">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">{editing === 'new' ? 'New Alumni' : 'Edit Alumni'}</h3>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4" data-section="admin-beranda-alumni/form" aria-label="Form Alumni Fields">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-section="admin-beranda-alumni/form-grid" aria-label="Form Grid">
              <div className="space-y-4">
                 <div className="space-y-2">
                  <label className="text-slate-600 text-sm font-medium">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={formData.nama || ''} 
                    onChange={e => setFormData({...formData, nama: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                    required
                    placeholder="Nama Alumni"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-600 text-sm font-medium">Jurusan</label>
                    <input 
                      type="text" 
                      value={formData.jurusan || ''} 
                      onChange={e => setFormData({...formData, jurusan: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                      placeholder="Contoh: RPL"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-600 text-sm font-medium">Angkatan / Tahun Lulus</label>
                    <input 
                      type="text" 
                      value={formData.angkatan || ''} 
                      onChange={e => setFormData({...formData, angkatan: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                      placeholder="2020"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-600 text-sm font-medium">Perusahaan</label>
                    <input 
                      type="text" 
                      value={formData.perusahaan || ''} 
                      onChange={e => setFormData({...formData, perusahaan: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                      placeholder="Nama Perusahaan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-600 text-sm font-medium">Jabatan / Posisi</label>
                    <input 
                      type="text" 
                      value={formData.posisi || ''} 
                      onChange={e => setFormData({...formData, posisi: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                      placeholder="Contoh: Senior Developer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-600 text-sm font-medium mb-2 block">Foto Alumni</label>
                  <ImageUploader 
                    currentImage={formData.foto_url} 
                    onUploadComplete={(url) => setFormData({...formData, foto_url: url})} 
                    aspectRatio={1} 
                    bucket="alumni" 
                    folder="" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-600 text-sm font-medium">Testimoni / Deskripsi</label>
                  <textarea 
                    value={formData.deskripsi || ''} 
                    onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all h-32"
                    placeholder="Kesan pesan alumni..."
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5">
                <Save size={16} /> Save Alumni
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" data-section="admin-beranda-alumni/table-card" aria-label="Tabel Alumni">
          <div className="overflow-x-auto" data-section="admin-beranda-alumni/table-wrapper" aria-label="Pembungkus Tabel">
            <table className="w-full text-left border-collapse" data-section="admin-beranda-alumni/table" aria-label="Tabel Data Alumni">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Foto</th>
                  <th className="p-4 font-bold">Nama / Angkatan</th>
                  <th className="p-4 font-bold">Jurusan</th>
                  <th className="p-4 font-bold">Karir</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" data-section="admin-beranda-alumni/table-body" aria-label="Body Tabel Alumni">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group" data-section="admin-beranda-alumni/table-row" aria-label={`Alumni ${item.nama}`}>
                    <td className="p-4 w-20">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-200">
                        <SmartImage src={item.foto_url} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{item.nama}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <GraduationCap size={12} /> {item.angkatan || item.tahun_lulus}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">
                        {item.jurusan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-900">{item.perusahaan}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Briefcase size={12} /> {item.posisi || item.jabatan}
                      </div>
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
                    <td colSpan="5" className="p-8 text-center text-slate-400">
                      Belum ada data alumni. Silakan tambah data baru.
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

export default withAdmin(AlumniAdmin);
