import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { 
  getJurusanAll, 
  createJurusan, 
  updateJurusan, 
  deleteJurusan, 
  toggleJurusanAktif,
  updateJurusanOrder,
  updateJurusanOrderBatch,
  uploadImage,
  addJurusanGallery,
  removeJurusanGallery
} from '../../services/api'
import withAdmin from '../../utils/withAdmin'
import { toastSuccess, toastError, toastLoading, toastDismiss } from '../../utils/toast'
import { InlineLoader } from '../../components/Loader'
import AdminLayout from '../../components/AdminLayout'
import { 
  Plus, Edit, Trash2, X, Upload, Save, Check, Search, 
  MoreHorizontal, AlertCircle, RefreshCw, GripVertical
} from 'lucide-react'

function AdminJurusan() {
  const [jurusanList, setJurusanList] = useState([])
  const [loading, setLoading] = useState(true)
  const [winReady, setWinReady] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form State - Using DB column names
  const [formData, setFormData] = useState({
    name: '',
    singkatan: '',
    slug: '',
    description: '', // Fix: deskripsi -> description
    short_desc: '',
    warna_primer: '#C0161C',
    warna_sekunder: '#1E1E8F',
    image_url: '',
    kompetensi: [],
    prospek: [], // Fix: prospek_karir -> prospek
    gallery: [],
    aktif: true
  })
  
  const [uploading, setUploading] = useState(false)
  const [tempKompetensi, setTempKompetensi] = useState('')
  const [tempProspek, setTempProspek] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    setWinReady(true)
    fetchData()
  }, [])

  useEffect(() => {
    if (router.isReady) {
      const { edit, action } = router.query
      
      if (action === 'new') {
        openModal()
      } else if (edit && jurusanList.length > 0) {
        const found = jurusanList.find(j => j.slug === edit)
        if (found) {
          openModal(found)
        }
      }
    }
  }, [router.isReady, router.query, jurusanList])

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)
    const data = await getJurusanAll()
    setJurusanList(data || [])
    if (!silent) setLoading(false)
  }

  const handleToggleAktif = async (id, currentStatus) => {
    const toastId = toastLoading('Updating status...')
    try {
      await toggleJurusanAktif(id, !currentStatus)
      setJurusanList(prev => prev.map(item => 
        item.id === id ? { ...item, aktif: !currentStatus } : item
      ))
      toastDismiss(toastId)
      toastSuccess(`Jurusan ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
    } catch (error) {
      toastDismiss(toastId)
      toastError('Gagal update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus jurusan ini?')) return

    const toastId = toastLoading('Menghapus...')
    try {
      const { error } = await deleteJurusan(id)
      if (error) throw error
      setJurusanList(prev => prev.filter(item => item.id !== id))
      toastDismiss(toastId)
      toastSuccess('Jurusan berhasil dihapus')
    } catch (error) {
      toastDismiss(toastId)
      toastError('Gagal menghapus jurusan')
    }
  }

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return
    
    const items = Array.from(jurusanList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    setJurusanList(items)
    
    // Optimistic update done, now save to DB
    try {
      // Prepare batch updates - Optimized to send only necessary fields
      const updates = items.map((item, index) => ({
        id: item.id,
        order_index: index
      }))
      
      await updateJurusanOrderBatch(updates)
      toastSuccess('Urutan disimpan')
    } catch (error) {
      console.error(error)
      toastError('Gagal menyimpan urutan')
      fetchData(true) // Revert silently
    }
  }

  const openModal = (jurusan = null) => {
    if (jurusan) {
      setEditingId(jurusan.id)
      setFormData({
        name: jurusan.name || '',
        singkatan: jurusan.singkatan || '',
        slug: jurusan.slug || '',
        description: jurusan.description || '', // Fix: deskripsi -> description
        short_desc: jurusan.short_desc || '',
        warna_primer: jurusan.warna_primer || '#C0161C',
        warna_sekunder: jurusan.warna_sekunder || '#1E1E8F',
        image_url: jurusan.image_url || '',
        kompetensi: Array.isArray(jurusan.kompetensi) ? jurusan.kompetensi : [],
        prospek: Array.isArray(jurusan.prospek) ? jurusan.prospek : [], // Fix: prospek_karir -> prospek
        gallery: Array.isArray(jurusan.gallery) ? jurusan.gallery : [],
        aktif: jurusan.aktif ?? true
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        singkatan: '',
        slug: '',
        description: '',
        short_desc: '',
        warna_primer: '#C0161C',
        warna_sekunder: '#1E1E8F',
        image_url: '',
        kompetensi: [],
        prospek: [],
        gallery: [],
        aktif: true
      })
    }
    setIsModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const { url, error } = await uploadImage(file, 'jurusan', 'cover')
    setUploading(false)

    if (error) {
      toastError('Gagal upload gambar')
    } else {
      setFormData(prev => ({ ...prev, image_url: url }))
      toastSuccess('Gambar terupload')
    }
  }

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const toastId = toastLoading('Mengupload foto...')
    const { url, error } = await uploadImage(file, 'jurusan', `${formData.slug || 'temp'}/gallery`)
    
    if (error) {
      toastDismiss(toastId)
      toastError('Gagal upload: ' + error)
      return
    }

    if (editingId) {
      // Direct save to DB
      const { error: dbError } = await addJurusanGallery(editingId, url)
      if (dbError) {
        toastDismiss(toastId)
        toastError('Gagal simpan ke DB')
      } else {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }))
        toastDismiss(toastId)
        toastSuccess('Foto ditambahkan')
      }
    } else {
      // Just local state
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }))
      toastDismiss(toastId)
      toastSuccess('Foto terupload (Draft)')
    }
  }

  const handleDeleteGallery = async (url) => {
    if (!confirm('Hapus foto ini?')) return

    if (editingId) {
      const toastId = toastLoading('Menghapus...')
      const { error } = await removeJurusanGallery(editingId, url)
      if (error) {
        toastDismiss(toastId)
        toastError('Gagal hapus')
      } else {
        setFormData(prev => ({ ...prev, gallery: prev.gallery.filter(u => u !== url) }))
        toastDismiss(toastId)
        toastSuccess('Foto dihapus')
      }
    } else {
      setFormData(prev => ({ ...prev, gallery: prev.gallery.filter(u => u !== url) }))
    }
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    // Auto-generate slug & suggestion for singkatan if adding new
    if (!editingId) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const singkatan = name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 5)
      setFormData(prev => ({ ...prev, name, slug, singkatan }))
    } else {
      setFormData(prev => ({ ...prev, name }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const toastId = toastLoading('Menyimpan data...')
    
    try {
      const payload = { ...formData }
      let res
      
      if (editingId) {
        res = await updateJurusan(editingId, payload)
      } else {
        // New item gets last order
        payload.order_index = jurusanList.length
        res = await createJurusan(payload)
      }

      if (res.error) throw res.error

      toastDismiss(toastId)
      toastSuccess(editingId ? 'Jurusan diperbarui' : 'Jurusan ditambahkan')
      setIsModalOpen(false)
      
      // Clear query params to prevent reopening modal on refresh
      if (router.query.edit || router.query.action) {
        router.push('/admin/jurusan', undefined, { shallow: true })
      }
      
      fetchData(true) // Silent refresh
    } catch (error) {
      toastDismiss(toastId)
      const msg = error.message || 'Gagal menyimpan data'
      toastError(msg)
      console.error(error)
    }
  }

  // Helper for dynamic arrays
  const addArrayItem = (field, tempValue, setTemp) => {
    if (!tempValue.trim()) return
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], tempValue.trim()]
    }))
    setTemp('')
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  if (!winReady) return null

  return (
    <AdminLayout>
      <Head>
        <title>Kelola Jurusan — Admin SMK Paramitha 2</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kelola Jurusan</h1>
          <p className="text-slate-500">Atur program keahlian dan kompetensi siswa</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1E1E8F] text-white rounded-xl hover:bg-[#151560] transition-all shadow-lg shadow-blue-900/20 font-bold"
        >
          <Plus size={20} />
          <span>Tambah Jurusan</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <RefreshCw className="animate-spin text-[#1E1E8F] mb-4" size={40} />
          <p className="text-slate-500 font-medium">Memuat data jurusan...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Urutan</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jurusan</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Singkatan</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="jurusan-list">
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-slate-100">
                      {jurusanList.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <tr 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`group hover:bg-slate-50/50 transition-colors ${snapshot.isDragging ? 'bg-white shadow-2xl z-50' : ''}`}
                            >
                              <td className="px-6 py-4">
                                <div {...provided.dragHandleProps} className="p-2 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                                  <GripVertical size={20} />
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div 
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner"
                                    style={{ backgroundColor: item.warna_primer }}
                                  >
                                    <span className="font-bold text-lg">{item.singkatan?.[0]}</span>
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-800">{item.name}</div>
                                    <div className="text-xs text-slate-400 font-mono">/{item.slug}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono text-sm text-slate-600">
                                {item.singkatan}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => handleToggleAktif(item.id, item.aktif)}
                                    className={`
                                      flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all
                                      ${item.aktif 
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                                    `}
                                  >
                                    {item.aktif ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                                    {item.aktif ? 'AKTIF' : 'NON-AKTIF'}
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => openModal(item)}
                                    className="p-2 text-slate-400 hover:text-[#1E1E8F] hover:bg-blue-50 rounded-lg transition-all"
                                    title="Edit"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Hapus"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </table>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}
                </h2>
                <p className="text-sm text-slate-500">Lengkapi detail informasi jurusan</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section 1: Dasar */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nama Jurusan</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={handleNameChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E1E8F] outline-none transition-all"
                      placeholder="Contoh: Rekayasa Perangkat Lunak"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Singkatan</label>
                      <input 
                        type="text" 
                        value={formData.singkatan}
                        onChange={(e) => setFormData({...formData, singkatan: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E1E8F] outline-none transition-all"
                        placeholder="RPL"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Slug URL</label>
                      <input 
                        type="text" 
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E1E8F] outline-none transition-all"
                        placeholder="rpl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Warna Branding</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={formData.warna_primer}
                        onChange={(e) => setFormData({...formData, warna_primer: e.target.value})}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <input 
                        type="text" 
                        value={formData.warna_primer}
                        onChange={(e) => setFormData({...formData, warna_primer: e.target.value})}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Gambar Cover</label>
                    <div className="relative group">
                      {formData.image_url ? (
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
                          <img src={formData.image_url} alt="Cover" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, image_url: ''})}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all">
                          <div className="p-4 bg-white rounded-full shadow-sm mb-2">
                            <Upload className="text-slate-400" size={24} />
                          </div>
                          <span className="text-xs font-medium text-slate-500">{uploading ? 'Mengupload...' : 'Klik untuk Upload Cover'}</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Konten */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Deskripsi Utama</label>
                    <textarea 
                      value={formData.description} // Fix: deskripsi -> description
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="4"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E1E8F] outline-none transition-all resize-none"
                      placeholder="Jelaskan secara detail tentang jurusan ini..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Short Description (SEO/Navbar)</label>
                    <textarea 
                      value={formData.short_desc}
                      onChange={(e) => setFormData({...formData, short_desc: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E1E8F] outline-none transition-all resize-none text-xs"
                      placeholder="Deskripsi singkat untuk tampilan menu..."
                    />
                  </div>

                  {/* Kompetensi & Prospek Karir (Dynamic Tags) */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                        <span>Kompetensi Keahlian</span>
                        <span className="text-[10px] text-slate-400">{formData.kompetensi.length} Item</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.kompetensi.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-[#1E1E8F] text-xs font-bold rounded-lg border border-blue-100">
                            {tag}
                            <button type="button" onClick={() => removeArrayItem('kompetensi', idx)}><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={tempKompetensi}
                          onChange={(e) => setTempKompetensi(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('kompetensi', tempKompetensi, setTempKompetensi))}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                          placeholder="Tambah kompetensi..."
                        />
                        <button 
                          type="button"
                          onClick={() => addArrayItem('kompetensi', tempKompetensi, setTempKompetensi)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                        <span>Prospek Karir</span>
                        <span className="text-[10px] text-slate-400">{formData.prospek.length} Item</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.prospek.map((tag, idx) => ( // Fix: prospek_karir -> prospek
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100">
                            {tag}
                            <button type="button" onClick={() => removeArrayItem('prospek', idx)}><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={tempProspek}
                          onChange={(e) => setTempProspek(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('prospek', tempProspek, setTempProspek))}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                          placeholder="Tambah prospek..."
                        />
                        <button 
                          type="button"
                          onClick={() => addArrayItem('prospek', tempProspek, setTempProspek)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Section */}
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Galeri Foto Jurusan</label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all">
                    <Plus size={16} />
                    <span>Tambah Foto</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} />
                  </label>
                </div>
                
                {formData.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {formData.gallery.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => handleDeleteGallery(url)}
                          className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
                    <AlertCircle className="text-slate-300 mb-2" size={32} />
                    <p className="text-xs text-slate-400">Belum ada foto galeri.</p>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-10 py-3 bg-[#1E1E8F] text-white rounded-xl font-bold hover:bg-[#151560] transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                >
                  <Save size={20} />
                  <span>Simpan Jurusan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default withAdmin(AdminJurusan)
