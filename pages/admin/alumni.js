import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAdmin from '../../utils/withAdmin';
import { getAlumni, createAlumni, updateAlumni, deleteAlumni } from '../../services/api';
import { showToast } from '../../utils/toast';
import { Plus, Trash, X, Save, Edit, Search, Users } from 'lucide-react';
import SmartImage from '../../components/SmartImage';
import ImageUploader from '../../components/ImageUploader';

function AlumniAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleCreate = () => {
    setEditing('new');
    setFormData({ 
      nama: '', 
      jurusan: 'Rekayasa Perangkat Lunak', 
      angkatan: new Date().getFullYear().toString(),
      foto_url: '',
      perusahaan: '',
      posisi: '',
      deskripsi: '',
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
        result = await createAlumni(formData);
      } else {
        result = await updateAlumni(editing, formData);
      }
      
      if (result.error) throw result.error;
      
      showToast.success('Saved successfully');
      setEditing(null);
      loadData();
    } catch (error) {
      console.error(error);
      showToast.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this alumni?')) {
      const { error } = await deleteAlumni(id);
      if (error) {
        showToast.error('Failed to delete');
        return;
      }
      showToast.success('Deleted successfully');
      loadData();
    }
  };

  const filteredItems = items.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.perusahaan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Alumni</h1>
          <p className="text-slate-400 text-sm">Kelola data alumni dan cerita sukses</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search alumni..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0f0f1a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:border-[#4F8EF7] focus:outline-none w-full md:w-64"
            />
          </div>
          <button 
            onClick={handleCreate}
            className="px-4 py-2 bg-[#4F8EF7] hover:bg-[#3b7acf] text-white rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-[#4F8EF7]/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} /> Add Alumni
          </button>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">{editing === 'new' ? 'Add New Alumni' : 'Edit Alumni'}</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={formData.nama || ''} 
                    onChange={e => setFormData({...formData, nama: e.target.value})}
                    className="w-full bg-[#080810] border border-white/10 rounded-xl p-3 text-white focus:border-[#4F8EF7] focus:outline-none transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Angkatan</label>
                  <input 
                    type="text" 
                    value={formData.angkatan || ''} 
                    onChange={e => setFormData({...formData, angkatan: e.target.value})}
                    className="w-full bg-[#080810] border border-white/10 rounded-xl p-3 text-white focus:border-[#4F8EF7] focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Jurusan</label>
                  <select 
                    value={formData.jurusan || 'Rekayasa Perangkat Lunak'} 
                    onChange={e => setFormData({...formData, jurusan: e.target.value})}
                    className="w-full bg-[#080810] border border-white/10 rounded-xl p-3 text-white focus:border-[#4F8EF7] focus:outline-none transition-all"
                  >
                    <option>Rekayasa Perangkat Lunak</option>
                    <option>Desain Komunikasi Visual</option>
                    <option>Perhotelan</option>
                    <option>Kuliner</option>
                    <option>Usaha Layanan Wisata</option>
                    <option>Manajemen Logistik</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Urutan</label>
                  <input 
                    type="number" 
                    value={formData.order_index || 0} 
                    onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})}
                    className="w-full bg-[#080810] border border-white/10 rounded-xl p-3 text-white focus:border-[#4F8EF7] focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Perusahaan</label>
                  <input 
                    type="text" 
                    value={formData.perusahaan || ''} 
                    onChange={e => setFormData({...formData, perusahaan: e.target.value})}
                    className="w-full bg-[#080810] border border-white/10 rounded-xl p-3 text-white focus:border-[#4F8EF7] focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Posisi / Jabatan</label>
                  <input 
                    type="text" 
                    value={formData.posisi || ''} 
                    onChange={e => setFormData({...formData, posisi: e.target.value})}
                    className="w-full bg-[#080810] border border-white/10 rounded-xl p-3 text-white focus:border-[#4F8EF7] focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Deskripsi / Testimoni</label>
                <textarea 
                  rows="3"
                  value={formData.deskripsi || ''} 
                  onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full bg-[#080810] border border-white/10 rounded-xl p-3 text-white focus:border-[#4F8EF7] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-2">Foto Alumni</label>
                <ImageUploader 
                  currentImage={formData.foto_url} 
                  onUploadComplete={(url) => setFormData({...formData, foto_url: url})} 
                  aspectRatio={1/1} 
                  bucket="media" 
                  folder="alumni" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-slate-400 font-medium hover:bg-white/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-[#4F8EF7] hover:bg-[#3b7acf] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#4F8EF7]/20 transition-all hover:-translate-y-0.5">
                  <Save size={18} /> Save Alumni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-5 flex gap-5 hover:border-[#4F8EF7]/50 transition-all group">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 relative border-2 border-white/10">
              <SmartImage src={item.foto_url} fill style={{ objectFit: 'cover' }} className="group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-white font-bold truncate pr-2">{item.nama}</h4>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(item)} className="p-1.5 text-[#4F8EF7] hover:bg-[#4F8EF7]/10 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm truncate">{item.posisi} at {item.perusahaan}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white/5 rounded-md text-slate-300">{item.jurusan}</span>
                <span className="text-[10px] text-slate-500">{item.angkatan}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-[#0f0f1a]/50 rounded-2xl border border-white/5 border-dashed">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p>No alumni found matching your search.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AlumniAdmin);
