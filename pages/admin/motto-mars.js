import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getMottoMars, upsertMottoMars } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';

export default function MottoMarsAdminPage() {
  const [motto, setMotto] = useState('PINK JITU\n\nProfesional\nInovatif\nNasionalis\nKompeten\n\nJujur\nIman\nTangguh\nUnggul');
  const [marsLyrics, setMarsLyrics] = useState(`Kami Para Putra-Putri Siswa Paramitha
Pewaris Penerus Cita Pembangunan Negara
Kami Semua Berusaha Tuk Mencapai Cita-Cita
Giat Belajar Bekerja Berjuang Bersama Gembira

Sekolah Menengah Industri Pariwisata
Serta Teknologi Informatika
Dibina Dididik Jiwa Raganya
Agar Berguna Tuk Nusa Bangsa

Dunia Usaha Kita Memanggil Kita Semua
Marilah Giat Belajar
Jayalah Paramitha Kita
Marilah Giat Belajar
Jayalah Paramitha Kita`);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await getMottoMars();
      if (result) {
        setId(result?.id || null);
        if (result?.motto) setMotto(result.motto);
        if (result?.mars_lyrics) {
          if (Array.isArray(result.mars_lyrics)) {
            setMarsLyrics(result.mars_lyrics.join('\n\n'));
          } else {
            setMarsLyrics(result.mars_lyrics);
          }
        }
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const marsArray = marsLyrics.split('\n\n').filter(m => m.trim());
    const payload = { id, motto, mars_lyrics: marsArray };
    
    const response = await upsertMottoMars(payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan motto dan mars.');
    } else {
      toastSuccess('Motto dan Mars berhasil disimpan.');
    }
  };

  return (
    <AdminLayout title="Motto & Mars">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Motto & Mars</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola motto dan lirik mars sekolah</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Motto Sekolah</label>
              <p className="text-xs text-slate-500 mb-2">PINK JITU - Profesional Inovatif Nasionalis Kompeten, Jujur Iman Tangguh Unggul</p>
              <textarea
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                rows={8}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Masukkan motto sekolah..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Lirik Mars Sekolah</label>
              <p className="text-xs text-slate-500 mb-2">Setiap paragraf dipisahkan dengan baris kosong</p>
              <textarea
                value={marsLyrics}
                onChange={(e) => setMarsLyrics(e.target.value)}
                rows={12}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Masukkan lirik mars sekolah..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan Motto & Mars'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
