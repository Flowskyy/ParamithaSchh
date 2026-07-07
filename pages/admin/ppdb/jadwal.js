import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getJadwalPPDB, createJadwalPPDB, updateJadwalPPDB, deleteJadwalPPDB } from '../../../services/api';
import { toastSuccess, toastError } from '../../../utils/toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const emptyJadwal = {
  id: null,
  nama: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  status: 'akan_datang'
};

export default function JadwalPPDBPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyJadwal);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getJadwalPPDB();
    setItems(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      nama: form.nama,
      tanggal_mulai: form.tanggal_mulai || null,
      tanggal_selesai: form.tanggal_selesai || null,
      status: form.status
    };

    const response = form.id 
      ? await updateJadwalPPDB(form.id, payload)
      : await createJadwalPPDB(payload);
    
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan jadwal.');
      return;
    }
    toastSuccess('Jadwal berhasil disimpan.');
    setForm(emptyJadwal);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      nama: item.nama || '',
      tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : '',
      tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.split('T')[0] : '',
      status: item.status || 'akan_datang'
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus jadwal ini?')) return;
    const response = await deleteJadwalPPDB(id);
    if (response.error) {
      toastError('Gagal menghapus jadwal.');
      return;
    }
    toastSuccess('Jadwal berhasil dihapus.');
    load();
  };

  const handleReset = () => setForm(emptyJadwal);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatStatus = (status) => {
    const statusMap = {
      'akan_datang': 'Akan Datang',
      'sedang_berlangsung': 'Sedang Berlangsung',
      'selesai': 'Selesai'
    };
    return statusMap[status] || status;
  };

  return (
    <AdminLayout title="Jadwal PPDB">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Link href="/admin/ppdb" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#C0161C] transition-colors mb-4">
              <ArrowLeft size={16} />
              Kembali ke PPDB
            </Link>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Jadwal PPDB</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola jadwal penerimaan peserta didik baru</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Daftar Jadwal</h2>
            <div className="space-y-3">
              {items.length === 0 && (
                <div className="bg-[#F8F8FF] rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="text-slate-500">Belum ada jadwal.</p>
                </div>
              )}
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 p-4 hover:border-[#C0161C] transition-colors shadow-sm hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1E1E8F]">{item.nama}</h3>
                      <p className="text-slate-500 text-sm mt-1">
                        {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}
                      </p>
                      <span className={`inline-block mt-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === 'sedang_berlangsung' ? 'bg-red-50 text-red-700 border border-red-200' :
                        item.status === 'selesai' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                        'bg-blue-50 text-[#1E1E8F] border border-blue-200'
                      }`}>
                        {formatStatus(item.status)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(item)} className="bg-white text-slate-700 font-medium text-sm px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="bg-white text-red-600 font-medium text-sm px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Tambah / Edit Jadwal</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Nama Jadwal</label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: Gelombang 1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Tanggal Mulai</label>
                <input
                  name="tanggal_mulai"
                  type="date"
                  value={form.tanggal_mulai}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Tanggal Selesai</label>
                <input
                  name="tanggal_selesai"
                  type="date"
                  value={form.tanggal_selesai}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                >
                  <option value="akan_datang">Akan Datang</option>
                  <option value="sedang_berlangsung">Sedang Berlangsung</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
              <div className="flex justify-between gap-3">
                <button type="button" onClick={handleReset} className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
                <button type="submit" disabled={loading} className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60 shadow-lg shadow-red-100">{loading ? 'Menyimpan...' : form.id ? 'Update Jadwal' : 'Tambah Jadwal'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
