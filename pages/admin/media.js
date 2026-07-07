import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllImages, checkImageUsage, deleteImage } from '../../services/api';
import { Image as ImageIcon, ExternalLink, Trash2, AlertTriangle, CheckCircle, Clock, FileImage, Search, Filter, X, Download, Eye } from 'lucide-react';
import { showToast } from '../../utils/toast';

export default function MediaManagerPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [usageData, setUsageData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, used, unused
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await getAllImages();
      setImages(data || []);
      
      // Check usage for each image
      const usagePromises = data.map(async (img) => {
        const usage = await checkImageUsage(img.url);
        return { url: img.url, usage };
      });
      
      const usageResults = await Promise.all(usagePromises);
      const usageMap = {};
      usageResults.forEach(({ url, usage }) => {
        usageMap[url] = usage;
      });
      setUsageData(usageMap);
    } catch (error) {
      console.error('Error loading images:', error);
      showToast.error('Gagal memuat gambar');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsage = async (imageUrl) => {
    try {
      const usage = await checkImageUsage(imageUrl);
      setSelectedImage({ url: imageUrl, usage });
    } catch (error) {
      console.error('Error checking usage:', error);
    }
  };

  const handleDeleteImage = async (imageUrl, isUsed) => {
    const warningMessage = isUsed 
      ? 'PERINGATAN: Gambar ini sedang digunakan di database. Menghapusnya dapat menyebabkan gambar hilang dari konten yang menggunakan gambar ini. Apakah Anda yakin ingin tetap menghapusnya?'
      : 'Apakah Anda yakin ingin menghapus gambar ini?';
    
    if (!confirm(warningMessage)) {
      return;
    }

    try {
      await deleteImage(imageUrl);
      showToast.success('Gambar berhasil dihapus');
      loadImages(); // Refresh the image list
    } catch (error) {
      console.error('Error deleting image:', error);
      showToast.error(error.response?.data?.error || 'Gagal menghapus gambar');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getUnusedImages = () => {
    return images.filter(img => !usageData[img.url]?.used);
  };

  const getUsedImages = () => {
    return images.filter(img => usageData[img.url]?.used);
  };

  const getFilteredImages = () => {
    let filtered = images;
    
    // Filter by status
    if (filterStatus === 'used') {
      filtered = filtered.filter(img => usageData[img.url]?.used);
    } else if (filterStatus === 'unused') {
      filtered = filtered.filter(img => !usageData[img.url]?.used);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img => 
        img.url.toLowerCase().includes(query) ||
        img.sources?.some(s => s.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  return (
    <AdminLayout title="Media Manager">
      <div className="space-y-6">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#C0161C] to-[#1E1E8F] p-8 md:p-10">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Media Manager</h1>
            <p className="text-white/80 text-lg">Kelola semua gambar di database dengan mudah</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-[#1E1E8F] to-[#2D2DB8] rounded-xl shadow-lg">
                <FileImage className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Gambar</p>
                <p className="text-3xl font-bold text-[#1E1E8F]">{images.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Digunakan</p>
                <p className="text-3xl font-bold text-green-600">{getUsedImages().length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <AlertTriangle className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Tidak Digunakan</p>
                <p className="text-3xl font-bold text-orange-600">{getUnusedImages().length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Cari gambar berdasarkan URL atau sumber..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#C0161C] focus:ring-2 focus:ring-[#C0161C]/20 outline-none transition-all bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="used">Digunakan</option>
                <option value="unused">Tidak Digunakan</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 transition-colors ${viewMode === 'grid' ? 'bg-[#1E1E8F] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  title="Grid View"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="2" y="2" width="7" height="7" rx="1" />
                    <rect x="11" y="2" width="7" height="7" rx="1" />
                    <rect x="2" y="11" width="7" height="7" rx="1" />
                    <rect x="11" y="11" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 transition-colors ${viewMode === 'list' ? 'bg-[#1E1E8F] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  title="List View"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="2" y="3" width="16" height="3" rx="1" />
                    <rect x="2" y="8.5" width="16" height="3" rx="1" />
                    <rect x="2" y="14" width="16" height="3" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Unused Images Warning */}
        {getUnusedImages().length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertTriangle className="text-orange-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-orange-900 text-lg">
                  {getUnusedImages().length} gambar tidak digunakan
                </p>
                <p className="text-orange-700 mt-2">
                  Gambar-gambar ini tidak direferensikan di database manapun. Pertimbangkan untuk menghapusnya untuk menghemat storage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Images Grid/List */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <div className="w-8 h-8 border-4 border-[#C0161C] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg">Memuat gambar...</span>
            </div>
          </div>
        ) : getFilteredImages().length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
              <ImageIcon className="text-slate-400" size={40} />
            </div>
            <p className="text-slate-500 text-lg">Tidak ada gambar ditemukan</p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                className="mt-4 text-[#C0161C] font-semibold hover:underline"
              >
                Hapus filter
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getFilteredImages().map((image, index) => {
              const usage = usageData[image.url] || { used: false, references: [], totalUsage: 0 };
              return (
                <div
                  key={`${image.url}-${index}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-[#C0161C]/30"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={image.url}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {usage.used ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                          <CheckCircle size={12} />
                          Digunakan ({usage.totalUsage}x)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                          <AlertTriangle size={12} />
                          Tidak Digunakan
                        </span>
                      )}
                    </div>
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <button
                          onClick={() => handleViewUsage(image.url)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-lg"
                          title="Lihat penggunaan"
                        >
                          <Eye size={16} />
                          <span className="text-sm">Detail</span>
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.url, usage.used)}
                          className="flex items-center justify-center p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                          title="Hapus gambar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 truncate mb-1" title={image.url}>
                        {image.url}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {image.sources?.slice(0, 2).map((source, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                            {source}
                          </span>
                        ))}
                        {image.sources?.length > 2 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                            +{image.sources.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(image.created_at)}
                      </div>
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#1E1E8F] hover:text-[#C0161C] transition-colors font-medium"
                      >
                        <ExternalLink size={14} />
                        Buka
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Preview</th>
                    <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider text-slate-600">URL</th>
                    <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Status</th>
                    <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider text-slate-600 hidden md:table-cell">Sumber</th>
                    <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider text-slate-600 hidden lg:table-cell">Diupload</th>
                    <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredImages().map((image, index) => {
                    const usage = usageData[image.url] || { used: false, references: [], totalUsage: 0 };
                    return (
                      <tr key={`${image.url}-${index}`} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <img
                            src={image.url}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-xs truncate text-sm text-slate-700 font-medium" title={image.url}>
                            {image.url}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {usage.used ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              <CheckCircle size={12} />
                              Digunakan ({usage.totalUsage}x)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                              <AlertTriangle size={12} />
                              Tidak Digunakan
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {image.sources?.slice(0, 2).map((source, i) => (
                              <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                                {source}
                              </span>
                            ))}
                            {image.sources?.length > 2 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                                +{image.sources.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDate(image.created_at)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewUsage(image.url)}
                              className="p-2 text-[#1E1E8F] hover:bg-[#1E1E8F]/10 rounded-xl transition-colors"
                              title="Lihat penggunaan"
                            >
                              <Eye size={18} />
                            </button>
                            <a
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                              title="Buka gambar"
                            >
                              <ExternalLink size={18} />
                            </a>
                            <button
                              onClick={() => handleDeleteImage(image.url, usage.used)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Hapus gambar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Usage Detail Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-slate-100 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1E1E8F]">Detail Penggunaan</h3>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X size={24} className="text-slate-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Image Preview */}
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={selectedImage.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>

                {/* URL */}
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">URL Gambar</p>
                  <p className="text-sm text-slate-700 break-all bg-slate-50 p-3 rounded-xl">{selectedImage.url}</p>
                </div>
                
                {/* Status */}
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Status</p>
                  {selectedImage.usage.used ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-bold">
                      <CheckCircle size={18} />
                      Digunakan di {selectedImage.usage.references.length} tabel
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-bold">
                      <AlertTriangle size={18} />
                      Tidak digunakan
                    </div>
                  )}
                </div>
                
                {/* References */}
                {selectedImage.usage.used && (
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Referensi</p>
                    <div className="space-y-2">
                      {selectedImage.usage.references.map((ref, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                          <span className="text-sm font-semibold text-slate-700 capitalize">{ref.table}</span>
                          <span className="text-sm font-bold text-[#1E1E8F] bg-white px-3 py-1 rounded-lg">{ref.count}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E1E8F] to-[#2D2DB8] text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <ExternalLink size={18} />
                    Buka Gambar
                  </a>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
