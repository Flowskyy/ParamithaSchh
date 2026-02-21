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
  uploadImage 
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
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    singkatan: '',
    slug: '',
    deskripsi: '',
    warna_primer: '#C0161C',
    warna_sekunder: '#1E1E8F',
    image_url: '',
    kompetensi: [],
    prospek_karir: [],
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
        deskripsi: jurusan.deskripsi || '',
        warna_primer: jurusan.warna_primer || '#C0161C',
        warna_sekunder: jurusan.warna_sekunder || '#1E1E8F',
        image_url: jurusan.image_url || '',
        kompetensi: Array.isArray(jurusan.kompetensi) ? jurusan.kompetensi : [],
        prospek_karir: Array.isArray(jurusan.prospek_karir) ? jurusan.prospek_karir : [],
        aktif: jurusan.aktif ?? true
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        singkatan: '',
        slug: '',
        deskripsi: '',
        warna_primer: '#C0161C',
        warna_sekunder: '#1E1E8F',
        image_url: '',
        kompetensi: [],
        prospek_karir: [],
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
      toastError('Gagal menyimpan data')
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-12 text-center">
          <InlineLoader className="text-blue-600" />
          <p className="mt-4 text-slate-500">Memuat data jurusan...</p>
        </div>
      )
    }

    if (jurusanList.length === 0) {
      return (
        <div className="p-12 text-center text-slate-500">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 opacity-50" />
          </div>
          <p>Belum ada data jurusan.</p>
        </div>
      )
    }

    if (!winReady) return null

    return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 w-12"></th>
                <th className="p-6 font-semibold">Jurusan</th>
                <th className="p-6 font-semibold">Singkatan</th>
                <th className="p-6 font-semibold">Warna</th>
                <th className="p-6 font-semibold">Status</th>
                <th className="p-6 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <Droppable droppableId="jurusan-list">
              {(provided) => (
                <tbody 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="divide-y divide-slate-100"
                >
                  {jurusanList.map((jurusan, index) => (
                    <Draggable key={jurusan.id} draggableId={jurusan.id} index={index}>
                      {(provided) => (
                        <tr 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group hover:bg-slate-50 transition-colors ${!jurusan.aktif ? 'opacity-60 grayscale-[0.5]' : ''}`}
                        >
                          <td className="p-4 text-center">
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing p-2"
                            >
                              <GripVertical className="w-5 h-5" />
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                {jurusan.image_url ? (
                                  <img src={jurusan.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div 
                                    className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{ background: `linear-gradient(135deg, ${jurusan.warna_primer}, ${jurusan.warna_sekunder})` }}
                                  >
                                    {jurusan.singkatan}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 text-lg">{jurusan.name}</div>
                                <div className="text-sm text-slate-500 max-w-xs truncate">{jurusan.deskripsi}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 rounded-md bg-slate-100 border border-slate-200 font-mono text-sm text-slate-600">
                              {jurusan.singkatan}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: jurusan.warna_primer }} title="Primer" />
                              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: jurusan.warna_sekunder }} title="Sekunder" />
                            </div>
                          </td>
                          <td className="p-6">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={jurusan.aktif}
                                onChange={() => handleToggleAktif(jurusan.id, jurusan.aktif)}
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                              <span className="ml-3 text-sm font-medium text-slate-600">
                                {jurusan.aktif ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </label>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openModal(jurusan)}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(jurusan.id)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-5 h-5" />
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
          </table>
        </div>
      </DragDropContext>
    )
  }

  return (
    <AdminLayout>
      <Head><title>Kelola Jurusan — Admin SMK Paramitha 2</title></Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Jurusan & Program Keahlian</h1>
            <p className="text-slate-500 mt-1">Kelola daftar jurusan yang tersedia di sekolah</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Tambah Jurusan
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {renderContent()}
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. INFO UTAMA */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Nama Jurusan</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={handleNameChange}
                        className="input-field w-full bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-800 p-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Contoh: Rekayasa Perangkat Lunak"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Singkatan</label>
                        <input 
                          type="text" 
                          required
                          value={formData.singkatan}
                          onChange={e => setFormData({...formData, singkatan: e.target.value})}
                          className="input-field w-full bg-slate-50 border-slate-200 text-slate-800 p-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          placeholder="RPL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Slug (URL)</label>
                        <input 
                          type="text" 
                          required
                          value={formData.slug}
                          onChange={e => setFormData({...formData, slug: e.target.value})}
                          className="input-field w-full bg-slate-50 border-slate-200 text-slate-800 p-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          placeholder="rpl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Deskripsi Singkat</label>
                      <textarea 
                        rows={4}
                        value={formData.deskripsi}
                        onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                        className="input-field w-full bg-slate-50 border-slate-200 text-slate-800 p-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Deskripsi singkat tentang jurusan ini..."
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Colors */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <label className="block text-sm font-medium text-slate-600 mb-3">Warna Identitas</label>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Primer</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={formData.warna_primer}
                              onChange={e => setFormData({...formData, warna_primer: e.target.value})}
                              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="text-sm font-mono text-slate-600">{formData.warna_primer}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Sekunder</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={formData.warna_sekunder}
                              onChange={e => setFormData({...formData, warna_sekunder: e.target.value})}
                              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="text-sm font-mono text-slate-600">{formData.warna_sekunder}</span>
                          </div>
                        </div>
                      </div>
                      <div 
                        className="h-12 rounded-lg w-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                        style={{ background: `linear-gradient(to right, ${formData.warna_primer}, ${formData.warna_sekunder})` }}
                      >
                        Preview Gradient
                      </div>
                    </div>

                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Gambar Cover / Icon</label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                          {formData.image_url ? (
                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Search className="text-slate-300" />
                          )}
                          {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <RefreshCw className="w-6 h-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors border border-slate-200 shadow-sm">
                            <Upload className="w-4 h-4" />
                            Upload Gambar
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                          <p className="text-xs text-slate-500 mt-2">Format: JPG, PNG, WEBP. Max 2MB.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* 2. KOMPETENSI & PROSPEK */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Kompetensi */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-lg font-semibold text-slate-800">Kompetensi Keahlian</label>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {formData.kompetensi.length} item
                      </span>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={tempKompetensi}
                        onChange={e => setTempKompetensi(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('kompetensi', tempKompetensi, setTempKompetensi))}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 focus:border-blue-500 outline-none"
                        placeholder="Tambah kompetensi..."
                      />
                      <button 
                        type="button"
                        onClick={() => addArrayItem('kompetensi', tempKompetensi, setTempKompetensi)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {formData.kompetensi.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 group">
                          <span className="text-sm text-slate-700">{item}</span>
                          <button 
                            type="button"
                            onClick={() => removeArrayItem('kompetensi', idx)}
                            className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {formData.kompetensi.length === 0 && (
                        <p className="text-sm text-slate-400 italic text-center py-4">Belum ada kompetensi ditambahkan.</p>
                      )}
                    </div>
                  </div>

                  {/* Prospek Karir */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-lg font-semibold text-slate-800">Prospek Karir</label>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        {formData.prospek_karir.length} item
                      </span>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={tempProspek}
                        onChange={e => setTempProspek(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('prospek_karir', tempProspek, setTempProspek))}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-800 focus:border-green-500 outline-none"
                        placeholder="Tambah prospek karir..."
                      />
                      <button 
                        type="button"
                        onClick={() => addArrayItem('prospek_karir', tempProspek, setTempProspek)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {formData.prospek_karir.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 group">
                          <span className="text-sm text-slate-700">{item}</span>
                          <button 
                            type="button"
                            onClick={() => removeArrayItem('prospek_karir', idx)}
                            className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {formData.prospek_karir.length === 0 && (
                        <p className="text-sm text-slate-400 italic text-center py-4">Belum ada prospek karir ditambahkan.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.aktif}
                      onChange={e => setFormData({...formData, aktif: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700">Status Aktif</span>
                  </label>

                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors font-medium"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Simpan Data
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default withAdmin(AdminJurusan)
