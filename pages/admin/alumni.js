import { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminLayout from '../../components/AdminLayout';
import { getAlumni, createAlumni, updateAlumni, deleteAlumni } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import { toastSuccess, toastError } from '../../utils/toast';

const emptyAlumni = {
  id: null,
  nama: '',
  jurusan: '',
  tahun_lulus: '',
  tempat_kerja: '',
  jabatan: '',
  foto_url: ''
};

export default function AlumniPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyAlumni);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getAlumni();
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
      jurusan: form.jurusan || '',
      tahun_lulus: form.tahun_lulus || null,
      tempat_kerja: form.tempat_kerja || '',
      jabatan: form.jabatan || '',
      foto_url: form.foto_url || ''
    };

    const response = form.id 
      ? await updateAlumni(form.id, payload)
      : await createAlumni(payload);
    
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan alumni.');
      return;
    }
    toastSuccess('Alumni berhasil disimpan.');
    setForm(emptyAlumni);
    load();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      nama: item.nama || '',
      jurusan: item.jurusan || '',
      tahun_lulus: item.tahun_lulus || '',
      tempat_kerja: item.tempat_kerja || '',
      jabatan: item.jabatan || '',
      foto_url: item.foto_url || ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus alumni ini?')) return;
    const response = await deleteAlumni(id);
    if (response.error) {
      toastError('Gagal menghapus alumni.');
      return;
    }
    toastSuccess('Alumni berhasil dihapus.');
    load();
  };

  const handleReset = () => setForm(emptyAlumni);

  return (
    <AdminLayout title="Alumni">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Alumni</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola data alumni sekolah</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E1E8F] mb-6">Daftar Alumni</h2>
            <div className="space-y-3">
              {items.length === 0 && (
                <div className="bg-[#F8F8FF] rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="text-slate-500">Belum ada data alumni.</p>
                </div>
              )}
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 overflow-hidden hover:border-[#C0161C] transition-colors shadow-sm hover:shadow-md">
                  <div className="flex gap-4 p-4 bg-slate-50">
                    {item.foto_url ? (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={item.foto_url}
                          alt={item.nama}
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-bold">
                        {item.nama?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{item.nama}</h3>
                      <p className="text-slate-500 text-sm mt-1">{item.jurusan}</p>
                      <p className="text-slate-400 text-xs mt-1">{item.tempat_kerja} - {item.jabatan}</p>
                      <p className="text-slate-400 text-xs mt-1">Lulusan {item.tahun_lulus}</p>
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

          <div className="bg-white rounded-xl border border-black/7 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Tambah / Edit Alumni</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Nama Alumni</label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Jurusan</label>
                <input
                  name="jurusan"
                  value={form.jurusan}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: Rekayasa Perangkat Lunak"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Tahun Lulus</label>
                <input
                  name="tahun_lulus"
                  value={form.tahun_lulus}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: 2020"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Tempat Kerja</label>
                <input
                  name="tempat_kerja"
                  value={form.tempat_kerja}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: PT LRT Jakarta"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Jabatan</label>
                <input
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                  placeholder="Contoh: Software Engineer"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Foto Alumni</label>
                <ImageUploader
                  currentImage={form.foto_url}
                  onUploadComplete={(url) => setForm((prev) => ({ ...prev, foto_url: url }))}
                  aspectRatio={1 / 1}
                  bucket="media"
                  folder="alumni"
                />
              </div>
              <div className="flex justify-between gap-3">
                <button type="button" onClick={handleReset} className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
                <button type="submit" disabled={loading} className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60">{loading ? 'Menyimpan...' : form.id ? 'Update Alumni' : 'Tambah Alumni'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
