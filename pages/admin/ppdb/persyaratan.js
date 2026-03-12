import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../components/AdminLayout';
import { 
  getPersyaratanPPDB, 
  createPersyaratanPPDB, 
  updatePersyaratanPPDB, 
  deletePersyaratanPPDB 
} from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminPersyaratanPPDB() {
  const [persyaratan, setPersyaratan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    deskripsi: '',
    wajib: true
  });

  const fetchData = async () => {
    setLoading(true);
    const data = await getPersyaratanPPDB();
    if (data) {
      setPersyaratan(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        deskripsi: item.deskripsi,
        wajib: item.wajib !== undefined ? item.wajib : true
      });
    } else {
      setEditingItem(null);
      setFormData({
        deskripsi: '',
        wajib: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = showToast.loading('Menyimpan data...');
    
    try {
      if (editingItem) {
        const { error } = await updatePersyaratanPPDB(editingItem.id, formData);
        if (error) throw error;
        showToast.success('Persyaratan berhasil diperbarui', toastId);
      } else {
        const { error } = await createPersyaratanPPDB(formData);
        if (error) throw error;
        showToast.success('Persyaratan berhasil ditambahkan', toastId);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast.error('Gagal menyimpan data', toastId);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus persyaratan ini?')) {
      const toastId = showToast.loading('Menghapus data...');
      try {
        const { error } = await deletePersyaratanPPDB(id);
        if (error) throw error;
        showToast.success('Persyaratan berhasil dihapus', toastId);
        fetchData();
      } catch (err) {
        console.error(err);
        showToast.error('Gagal menghapus data', toastId);
      }
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kelola Persyaratan PPDB - Admin SMK Paramitha</title>
      </Head>

      <div className="space-y-6" data-section="admin-ppdb-persyaratan/root" aria-label="PPDB Persyaratan Root">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-section="admin-ppdb-persyaratan/header" aria-label="Header Persyaratan">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Persyaratan Berkas PPDB</h1>
            <p className="text-slate-500">Kelola daftar dokumen persyaratan pendaftaran</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#C0161C] text-white px-4 py-2 rounded-lg hover:bg-[#a51318] transition-colors"
          >
            <Plus size={18} />
            <span>Tambah Persyaratan</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" data-section="admin-ppdb-persyaratan/table-card" aria-label="Tabel Persyaratan">
          <div className="overflow-x-auto" data-section="admin-ppdb-persyaratan/table-wrapper">
            <table className="w-full text-left text-sm" data-section="admin-ppdb-persyaratan/table">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 w-16">No</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Deskripsi Persyaratan</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Sifat</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" data-section="admin-ppdb-persyaratan/table-body">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : persyaratan.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      Belum ada persyaratan yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  persyaratan.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {item.deskripsi}
                      </td>
                      <td className="px-6 py-4">
                        {item.wajib ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle size={12} />
                            Wajib
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <CheckCircle2 size={12} />
                            Opsional
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-section="admin-ppdb-persyaratan/modal-overlay" aria-label="Overlay Form Persyaratan">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" data-section="admin-ppdb-persyaratan/modal-card" aria-label="Form Persyaratan">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingItem ? 'Edit Persyaratan' : 'Tambah Persyaratan Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4" data-section="admin-ppdb-persyaratan/form" aria-label="Form Persyaratan Fields">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Persyaratan</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Contoh: Fotokopi Ijazah SMP dilegalisir (2 lembar)"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sifat Dokumen</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wajib"
                      className="text-[#C0161C] focus:ring-[#C0161C]"
                      checked={formData.wajib === true}
                      onChange={() => setFormData({...formData, wajib: true})}
                    />
                    <span className="text-sm text-slate-700">Wajib</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wajib"
                      className="text-[#C0161C] focus:ring-[#C0161C]"
                      checked={formData.wajib === false}
                      onChange={() => setFormData({...formData, wajib: false})}
                    />
                    <span className="text-sm text-slate-700">Opsional</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#C0161C] text-white font-medium hover:bg-[#a51318] transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
