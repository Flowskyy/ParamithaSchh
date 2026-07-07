import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSekolahInfo, upsertSekolahInfo } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { Target, CheckCircle, Globe, Eye, EyeOff } from 'lucide-react';

export default function VisiMisiPage() {
  const [vision, setVision] = useState('Berkarakter, Kompeten dan Mampu Bersaing di Era Masyarakat Global.');
  const [mission, setMission] = useState(`Mendidik dan membekali siswa mandiri, beriman dan bertaqwa kepada Tuhan Yang Maha Esa.
Mendidik dan melatih keterampilan siswa di bidang usaha perjalanan wisata, multimedia, perhotelan dan kuliner.
Mendidik dan melatih siswa mampu berkomunikasi dalam bahasa asing, terutama Bahasa Inggris.
Meningkatkan kemampuan berpikir kreatif dan inovatif di bidangnya.
Menyesuaikan kompetensi pendidik berdasarkan kebutuhan.
Menyempurnakan sarana dan prasarana.`);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    async function load() {
      const sekolah = await getSekolahInfo();
      if (sekolah) {
        setId(sekolah.id || null);
        if (sekolah.vision) setVision(sekolah.vision);
        if (sekolah.mission) {
          setMission(Array.isArray(sekolah.mission) ? sekolah.mission.join('\n') : sekolah.mission);
        }
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const missionArray = mission.split('\n').filter(m => m.trim());
    const payload = { id, vision, mission: missionArray };
    const response = await upsertSekolahInfo(payload);
    setLoading(false);
    if (response.error) {
      toastError('Gagal menyimpan visi dan misi.');
    } else {
      toastSuccess('Visi dan misi berhasil disimpan.');
    }
  };

  const missionArray = mission.split('\n').filter(m => m.trim());

  return (
    <AdminLayout title="Visi & Misi">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">Visi & Misi</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola visi dan misi sekolah</p>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}
          </button>
        </div>

        {showPreview && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Preview Hero */}
            <div className="py-12 bg-white text-center border-b border-slate-200">
              <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-[#C0161C] font-semibold text-sm mb-4">
                FILOSOFI KAMI
              </span>
              <h1 className="text-4xl font-bold text-[#1E1E8F] mb-6">
                Visi & Misi
              </h1>
            </div>

            {/* Preview Visi */}
            <div className="py-12 bg-[#1E1E8F] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0161C] rounded-full filter blur-[60px] opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F5C400] rounded-full filter blur-[60px] opacity-20"></div>
              
              <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-2xl font-bold text-[#F5C400] mb-6 tracking-widest">VISI</h2>
                <p className="text-2xl font-bold leading-tight">
                  "{vision}"
                </p>
              </div>
            </div>

            {/* Preview Misi */}
            <div className="py-12 bg-white">
              <div className="container mx-auto px-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#1E1E8F] mb-4">Misi Sekolah</h2>
                  <div className="w-16 h-1 bg-[#C0161C] mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {missionArray.map((item, index) => (
                    <div key={index} className="bg-[#F8F8FF] p-6 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm text-[#C0161C]">
                        <CheckCircle size={20} />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Visi</label>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Masukkan visi sekolah..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Misi</label>
              <p className="text-xs text-slate-500 mb-2">Setiap baris mewakili satu misi</p>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                rows={8}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                placeholder="Masukkan misi sekolah (satu misi per baris)..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60 shadow-lg shadow-red-100"
          >
            {loading ? 'Menyimpan...' : 'Simpan Visi & Misi'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
