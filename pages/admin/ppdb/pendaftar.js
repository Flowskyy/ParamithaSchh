import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../components/AdminLayout';
import { getPendaftar, updatePendaftar } from '../../../services/api';
import { 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Loader2,
  Phone,
  Mail,
  School,
  User,
  Hash,
  X,
  Edit,
  Save
} from 'lucide-react';
import { showToast } from '../../../utils/toast';

export default function AdminPendaftarPPDB() {
  const [pendaftar, setPendaftar] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('All');
  const [selectedPendaftar, setSelectedPendaftar] = useState(null);
  const [editingPendaftar, setEditingPendaftar] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getPendaftar();
    if (data) {
      setPendaftar(data);
      setFilteredData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let result = pendaftar;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.nama?.toLowerCase().includes(lower) ||
        item.nisn?.toLowerCase().includes(lower) ||
        item.asal_sekolah?.toLowerCase().includes(lower)
      );
    }

    if (filterJurusan !== 'All') {
      result = result.filter(item => item.jurusan === filterJurusan);
    }

    setFilteredData(result);
  }, [searchTerm, filterJurusan, pendaftar]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      showToast.error('Tidak ada data untuk diexport');
      return;
    }

    const headers = ['Nama Lengkap', 'NISN', 'Asal Sekolah', 'Jurusan', 'Email', 'No. WhatsApp', 'Tanggal Daftar', 'Pesan'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        `"${item.nama || ''}"`,
        `"${item.nisn || ''}"`,
        `"${item.asal_sekolah || ''}"`,
        `"${item.jurusan || ''}"`,
        `"${item.email || ''}"`,
        `"${item.whatsapp || ''}"`,
        `"${new Date(item.created_at).toLocaleDateString('id-ID')}"`,
        `"${(item.pesan || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_pendaftar_ppdb_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (item) => {
    setEditingPendaftar(item);
    setFormData({
      nama: item.nama || '',
      nisn: item.nisn || '',
      asal_sekolah: item.asal_sekolah || '',
      jurusan: item.jurusan || '',
      email: item.email || '',
      whatsapp: item.whatsapp || '',
      pesan: item.pesan || ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const toastId = showToast.loading('Menyimpan perubahan...');

    try {
      const { error } = await updatePendaftar(editingPendaftar.id, formData);
      if (error) throw error;

      showToast.success('Data pendaftar berhasil diperbarui', toastId);
      setEditingPendaftar(null);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast.error('Gagal menyimpan perubahan', toastId);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Data Pendaftar PPDB - Admin SMK Paramitha</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Data Pendaftar PPDB</h1>
            <p className="text-slate-500">Kelola data calon siswa baru</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama, NISN, atau asal sekolah..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C] appearance-none bg-white"
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
            >
              <option value="All">Semua Jurusan</option>
              <option value="RPL">Rekayasa Perangkat Lunak</option>
              <option value="TKJ">Teknik Komputer & Jaringan</option>
              <option value="MM">Multimedia</option>
              <option value="AK">Akuntansi</option>
              <option value="AP">Administrasi Perkantoran</option>
              <option value="PM">Pemasaran</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Tanggal Daftar</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Nama Lengkap</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">NISN</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Asal Sekolah</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Jurusan</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      Tidak ada data pendaftar yang sesuai filter
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                        {item.nisn}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.asal_sekolah}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.jurusan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedPendaftar(item)}
                            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-[#1E1E8F] rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer stats */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-sm text-slate-500 flex justify-between items-center">
            <span>Menampilkan {filteredData.length} dari {pendaftar.length} pendaftar</span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPendaftar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg text-slate-900">Edit Data Pendaftar</h3>
              <button 
                onClick={() => setEditingPendaftar(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 border-b pb-2">Informasi Pribadi</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={formData.nama}
                      onChange={e => setFormData({...formData, nama: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">NISN</label>
                    <input 
                      type="text" 
                      value={formData.nisn}
                      onChange={e => setFormData({...formData, nisn: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Asal Sekolah</label>
                    <input 
                      type="text" 
                      value={formData.asal_sekolah}
                      onChange={e => setFormData({...formData, asal_sekolah: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 border-b pb-2">Pilihan & Kontak</h4>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Jurusan</label>
                    <select
                      value={formData.jurusan}
                      onChange={e => setFormData({...formData, jurusan: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                      required
                    >
                      <option value="">Pilih Jurusan</option>
                      <option value="RPL">Rekayasa Perangkat Lunak</option>
                      <option value="TKJ">Teknik Komputer & Jaringan</option>
                      <option value="MM">Multimedia</option>
                      <option value="AK">Akuntansi</option>
                      <option value="AP">Administrasi Perkantoran</option>
                      <option value="PM">Pemasaran</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">WhatsApp</label>
                    <input 
                      type="text" 
                      value={formData.whatsapp}
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Pesan Tambahan</label>
                <textarea 
                  rows="3"
                  value={formData.pesan}
                  onChange={e => setFormData({...formData, pesan: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0161C]/20 focus:border-[#C0161C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setEditingPendaftar(null)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5"
                >
                  <Save size={16} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPendaftar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPendaftar(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Detail Pendaftar</h3>
              <button 
                onClick={() => setSelectedPendaftar(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Informasi Pribadi</label>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="text-slate-400 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{selectedPendaftar.nama}</p>
                        <p className="text-xs text-slate-500">Nama Lengkap</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hash className="text-slate-400 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{selectedPendaftar.nisn}</p>
                        <p className="text-xs text-slate-500">NISN</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <School className="text-slate-400 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{selectedPendaftar.asal_sekolah}</p>
                        <p className="text-xs text-slate-500">Asal Sekolah</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pilihan Jurusan</label>
                  <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg font-medium">
                    {selectedPendaftar.jurusan}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Kontak</label>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="text-slate-400 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{selectedPendaftar.email}</p>
                        <p className="text-xs text-slate-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="text-slate-400 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{selectedPendaftar.whatsapp}</p>
                        <p className="text-xs text-slate-500">WhatsApp</p>
                        <a 
                          href={`https://wa.me/${selectedPendaftar.whatsapp}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-green-600 hover:underline mt-1 inline-block"
                        >
                          Chat via WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPendaftar.pesan && (
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pesan Tambahan</label>
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                      "{selectedPendaftar.pesan}"
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Waktu Pendaftaran</label>
                  <p className="text-sm text-slate-600">
                    {new Date(selectedPendaftar.created_at).toLocaleString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPendaftar(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
