import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import ImageUploader from '../../../components/ImageUploader';
import FormattedDescription from '../../../components/FormattedDescription';
import { getJurusanAll, saveJurusan, addJurusanGallery, removeJurusanGallery } from '../../../services/api';
import { toastSuccess, toastError } from '../../../utils/toast';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

const emptyJurusan = {
  id: null,
  name: '',
  slug: '',
  singkatan: '',
  warna_primer: '#1E1E8F',
  warna_sekunder: '#3B82F6',
  short_desc: '',
  deskripsi: 'Program keahlian Rekayasa Perangkat Lunak di SMK Paramitha 2 dirancang untuk mencetak lulusan yang siap kerja dan kompeten. Kurikulum kami disesuaikan dengan kebutuhan industri terkini, didukung fasilitas modern dan pengajar praktisi.',
  content: '',
  aktif: true,
  order_index: 0,
  image_url: '',
  gallery: [],
  materi: [],
  activities: [],
  apa_yang_dipelajari: [],
  peluang_karir: [],
  articles: []
};

export default function JurusanEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(emptyJurusan);
  const [loading, setLoading] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    
    console.log('Loading jurusan with id:', id);
    setDataLoading(true);
    
    if (id === 'new') {
      setIsAddMode(true);
      setForm(emptyJurusan);
      setDataLoading(false);
      return;
    }

    try {
      const items = await getJurusanAll() || [];
      console.log('All jurusan items:', items);
      
      const itemToEdit = items.find(item => item.id === id);
      console.log('Found item:', itemToEdit);
      
      if (itemToEdit) {
        const { kompetensi, prospek, kompetensi_cards, ...cleanItem } = itemToEdit;
        setForm({ 
          ...cleanItem, 
          apa_yang_dipelajari: Array.isArray(itemToEdit.apa_yang_dipelajari) ? itemToEdit.apa_yang_dipelajari : [],
          peluang_karir: Array.isArray(itemToEdit.peluang_karir) ? itemToEdit.peluang_karir : [],
          articles: Array.isArray(itemToEdit.articles) ? itemToEdit.articles : [],
          aktif: itemToEdit.aktif 
        });
      } else {
        console.error('Jurusan not found with id:', numericId);
        console.error('Available IDs:', items.map(i => i.id));
      }
    } catch (error) {
      console.error('Error loading jurusan:', error);
    } finally {
      setDataLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddCard = (type) => {
    setForm(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), { title: '', description: '' }]
    }));
  };

  const handleRemoveCard = (type, index) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleCardChange = (type, index, field, value) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].map((card, i) => 
        i === index ? { ...card, [field]: value } : card
      )
    }));
  };

  const handleGalleryUpload = async (imageUrl) => {
    if (!form.id) {
      setForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), imageUrl] }));
      return;
    }
    const response = await addJurusanGallery(form.id, imageUrl);
    if (response.error) {
      toastError(`Gagal menambah foto ke galeri: ${response.error}`);
      return;
    }
    toastSuccess('Foto berhasil ditambahkan ke galeri.');
    load();
  };

  const handleGalleryRemove = async (imageUrl) => {
    if (!form.id) {
      setForm(prev => ({ ...prev, gallery: (prev.gallery || []).filter(url => url !== imageUrl) }));
      return;
    }
    const response = await removeJurusanGallery(form.id, imageUrl);
    if (response.error) {
      toastError(`Gagal menghapus foto dari galeri: ${response.error}`);
      return;
    }
    toastSuccess('Foto berhasil dihapus dari galeri.');
    load();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { kompetensi, prospek, kompetensi_cards, ...payload } = form;
    const cleanPayload = { ...payload, aktif: !!form.aktif };
    const response = await saveJurusan(cleanPayload);
    setLoading(false);
    if (response.error) {
      toastError(`Gagal menyimpan jurusan`, response.error);
      return;
    }
    toastSuccess('Jurusan berhasil disimpan.');
    router.push('/admin/jurusan');
  };

  return (
    <AdminLayout title={isAddMode ? 'Tambah Jurusan' : 'Edit Jurusan'}>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin/jurusan" className="text-slate-500 hover:text-slate-700">
            Semua Jurusan
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium">{isAddMode ? 'Tambah Jurusan' : form.name || 'Edit Jurusan'}</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E8F]">{isAddMode ? 'Tambah Jurusan' : 'Edit Jurusan'}</h1>
            <p className="text-sm text-slate-500 mt-1">{isAddMode ? 'Tambah program keahlian baru' : 'Edit program keahlian sekolah'}</p>
          </div>
          <Link
            href="/admin/jurusan"
            className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Kembali
          </Link>
        </div>

        {/* Loading State */}
        {dataLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-sm text-center">
            <p className="text-slate-500">Memuat data jurusan...</p>
          </div>
        ) : (
          /* Form */
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nama Jurusan</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Singkatan</label>
                <input name="singkatan" value={form.singkatan} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Slug URL</label>
                <input name="slug" value={form.slug} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Deskripsi Utama</label>
              <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows={4} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              {form.deskripsi && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 mb-2">Preview:</p>
                  <FormattedDescription text={form.deskripsi} textClassName="text-sm" />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Short Description (SEO/Navbar)</label>
              <textarea name="short_desc" value={form.short_desc} onChange={handleChange} rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Warna Branding</label>
                <input name="warna_primer" type="color" value={form.warna_primer} onChange={handleChange} className="w-full h-10 bg-white border border-slate-200 rounded-xl px-2 cursor-pointer" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Order Index</label>
                <input name="order_index" type="number" value={form.order_index} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Gambar Cover</label>
              <ImageUploader
                onUploadComplete={(url) => setForm(prev => ({ ...prev, image_url: url }))}
                aspectRatio={16 / 9}
                variant="compact"
                showPreview={true}
              />
              {form.image_url && (
                <div className="mt-3 relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                  <Image src={form.image_url} alt="Cover" fill unoptimized className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Galeri Foto Jurusan</label>
              <div className="space-y-4">
                <ImageUploader
                  onUploadComplete={handleGalleryUpload}
                  aspectRatio={4 / 3}
                  variant="compact"
                  showPreview={false}
                />
                {form.gallery && form.gallery.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {form.gallery.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 group">
                        <Image
                          src={imgUrl}
                          alt={`Gallery ${idx + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleGalleryRemove(imgUrl)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                          title="Hapus Foto"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Belum ada foto galeri</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Apa yang Dipelajari</label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleAddCard('apa_yang_dipelajari')}
                  className="bg-[#C0161C] text-white px-4 py-2 rounded-xl hover:bg-[#a01217] transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus size={16} /> Tambah Card
                </button>
                {(Array.isArray(form.apa_yang_dipelajari) ? form.apa_yang_dipelajari : []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(Array.isArray(form.apa_yang_dipelajari) ? form.apa_yang_dipelajari : []).map((card, index) => (
                      <div key={index} className="rounded-xl border border-slate-200 p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-medium text-slate-500">Card #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCard('apa_yang_dipelajari', index)}
                            className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Judul</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => handleCardChange('apa_yang_dipelajari', index, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                              placeholder="Judul..."
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Deskripsi</label>
                            <textarea
                              value={card.description}
                              onChange={(e) => handleCardChange('apa_yang_dipelajari', index, 'description', e.target.value)}
                              rows={2}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                              placeholder="Deskripsi..."
                            />
                            {card.description && (
                              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-xs font-medium text-slate-500 mb-1">Preview:</p>
                                <FormattedDescription text={card.description} textClassName="text-xs" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Belum ada card</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Peluang Karir</label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleAddCard('peluang_karir')}
                  className="bg-[#C0161C] text-white px-4 py-2 rounded-xl hover:bg-[#a01217] transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus size={16} /> Tambah Card
                </button>
                {(Array.isArray(form.peluang_karir) ? form.peluang_karir : []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(Array.isArray(form.peluang_karir) ? form.peluang_karir : []).map((card, index) => (
                      <div key={index} className="rounded-xl border border-slate-200 p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-medium text-slate-500">Card #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCard('peluang_karir', index)}
                            className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Judul</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => handleCardChange('peluang_karir', index, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                              placeholder="Judul..."
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Deskripsi</label>
                            <textarea
                              value={card.description}
                              onChange={(e) => handleCardChange('peluang_karir', index, 'description', e.target.value)}
                              rows={2}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                              placeholder="Deskripsi..."
                            />
                            {card.description && (
                              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-xs font-medium text-slate-500 mb-1">Preview:</p>
                                <FormattedDescription text={card.description} textClassName="text-xs" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Belum ada card</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Artikel</label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleAddCard('articles')}
                  className="bg-[#C0161C] text-white px-4 py-2 rounded-xl hover:bg-[#a01217] transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus size={16} /> Tambah Artikel
                </button>
                {(Array.isArray(form.articles) ? form.articles : []).length > 0 ? (
                  <div className="space-y-3">
                    {(Array.isArray(form.articles) ? form.articles : []).map((article, index) => (
                      <div key={index} className="rounded-xl border border-slate-200 p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-medium text-slate-500">Artikel #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCard('articles', index)}
                            className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Judul</label>
                            <input
                              type="text"
                              value={article.title}
                              onChange={(e) => handleCardChange('articles', index, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                              placeholder="Judul artikel..."
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Deskripsi</label>
                            <textarea
                              value={article.description}
                              onChange={(e) => handleCardChange('articles', index, 'description', e.target.value)}
                              rows={3}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/10 focus:outline-none"
                              placeholder="Deskripsi artikel..."
                            />
                            {article.description && (
                              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-xs font-medium text-slate-500 mb-1">Preview:</p>
                                <FormattedDescription text={article.description} textClassName="text-xs" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Belum ada artikel</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input id="aktif" type="checkbox" name="aktif" checked={!!form.aktif} onChange={handleChange} className="h-4 w-4 rounded border-slate-200 text-[#C0161C] focus:ring-[#C0161C]" />
              <label htmlFor="aktif" className="text-sm font-medium text-slate-700">Aktifkan jurusan</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Link
                href="/admin/jurusan"
                className="bg-white text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#C0161C] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#a01217] transition-colors disabled:opacity-60 shadow-lg shadow-red-100"
              >
                {loading ? 'Menyimpan...' : 'Simpan Jurusan'}
              </button>
            </div>
          </form>
        </div>
        )}
      </div>
    </AdminLayout>
  );
}
