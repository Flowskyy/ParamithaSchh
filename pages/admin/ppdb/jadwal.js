import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../components/AdminLayout';
import { 
  getJadwalPPDB, 
  createJadwalPPDB, 
  updateJadwalPPDB, 
  deleteJadwalPPDB 
} from '../../../services/api';
import { showToast } from '../../../utils/toast';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  Save,
  X,
  Loader2
} from 'lucide-react';

export default function AdminJadwalPPDB() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    gelombang: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    deskripsi: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const data = await getJadwalPPDB();
    if (data) {
      setJadwal(data);
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
        gelombang: item.gelombang,
        tanggal_mulai: item.tanggal_mulai,
        tanggal_selesai: item.tanggal_selesai,
        deskripsi: item.deskripsi || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        gelombang: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        deskripsi: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = showToast.loading('Menyimpan data...');
    
    try {
      if (editingItem) {
        const { error } = await updateJadwalPPDB(editingItem.id, formData);
        if (error) throw error;
        showToast.success('Jadwal berhasil diperbarui', toastId);
      } else {
        const { error } = await createJadwalPPDB(formData);
        if (error) throw error;
        showToast.success('Jadwal berhasil ditambahkan', toastId);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast.error('Gagal menyimpan data', toastId);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      const toastId = showToast.loading('Menghapus data...');
      try {
        const { error } = await deleteJadwalPPDB(id);
        if (error) throw error;
        showToast.success('Jadwal berhasil dihapus', toastId);
        fetchData();
      } catch (err) {
        console.error(err);
        showToast.error('Gagal menghapus data', toastId);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kelola Jadwal PPDB - Admin SMK Paramitha</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Jadwal Gelombang PPDB</h1>
            <p className="text-slate-500">Kelola jadwal pendaftaran siswa baru</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#C0161C] text-white px-4 py-2 rounded-lg hover:bg-[#a51318] transition-colors"
          >
            <Plus size={18} />
            <span>Tambah Jadwal</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Gelombang</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Tanggal Mulai</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Tanggal Selesai</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Deskripsi</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : jadwal.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      Belum ada jadwal yang ditambahkan
                    </td>
                  </tr>
                ) : (
                  jadwal.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {item.gelombang}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {formatDate(item.tanggal_mulai)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {formatDate(item.tanggal_selesai)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {item.deskripsi || '-'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingItem ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Gelombang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gelombang 1"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                  value={formData.gelombang}
                  onChange={(e) => setFormData({...formData, gelombang: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi (Opsional)</label>
                <textarea
                  rows="3"
                  placeholder="Keterangan tambahan..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                ></textarea>
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
