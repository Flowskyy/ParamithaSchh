import { supabase } from './supabase';
import { 
  fallbackJurusan, 
  fallbackSekolahInfo, 
  fallbackMottoMars,
  fallbackSejarah,
  fallbackVisiMisi,
  fallbackFasilitas,
  fallbackGaleri,
  fallbackTestimonial,
  fallbackAlumni,
  fallbackMitra,
  fallbackJadwalPPDB,
  fallbackPersyaratanPPDB,
  fallbackPendaftar,
  fallbackHero,
  fallbackCarousel
} from '../utils/fallbackData';

// Helper to handle Supabase response (GET)
// Returns data directly, or fallback on error
const handleResponse = async (promise, fallback = null) => {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error('Supabase Error (GET):', error);
      return fallback;
    }
    return data;
  } catch (err) {
    console.error('Network/Unexpected Error (GET):', err);
    return fallback;
  }
};

// Helper for mutations (CREATE, UPDATE, DELETE)
// Returns { data, error } explicitly so caller can handle UI feedback
const handleMutation = async (promise) => {
  try {
    const result = await promise;
    // Supabase returns { data, error }
    return result; 
  } catch (err) {
    console.error('Mutation Error:', err);
    // Return error object so caller knows it failed
    return { data: null, error: err };
  }
};

// ─── HERO ──────────────────────────────────────────────────────────
export async function getHero() {
  return handleResponse(
    supabase.from('hero').select('*').order('created_at', { ascending: false }).limit(1).single(),
    fallbackHero || null
  );
}
export async function upsertHero(payload) {
  if (payload.id) return handleMutation(supabase.from('hero').update(payload).eq('id', payload.id));
  return handleMutation(supabase.from('hero').insert(payload));
}
export async function saveHero(payload) { return upsertHero(payload); }

// ─── CAROUSEL ──────────────────────────────────────────────────────
export async function getCarousel() {
  return handleResponse(
    supabase.from('carousel').select('*').order('order_index'),
    fallbackCarousel || []
  );
}
export async function createCarousel(p) { return handleMutation(supabase.from('carousel').insert(p)); }
export async function updateCarousel(id, p) { return handleMutation(supabase.from('carousel').update(p).eq('id', id)); }
export async function deleteCarousel(id) { return handleMutation(supabase.from('carousel').delete().eq('id', id)); }
export async function saveCarousel(payload) { 
  if (payload.id) return updateCarousel(payload.id, payload); 
  return createCarousel(payload); 
}

// ─── JURUSAN ───────────────────────────────────────────────────────
export async function getJurusan() {
  try {
    // Try to fetch active jurusan only
    const { data, error } = await supabase
      .from('jurusan')
      .select('*')
      .eq('aktif', true)
      .order('order_index', { ascending: true });

    if (error) {
      // If error (e.g. column 'aktif' doesn't exist), try fetching all
      console.warn('Error fetching active jurusan, retrying all...', error.message);
      const { data: allData, error: allError } = await supabase
        .from('jurusan')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (allError) throw allError;
      return allData || fallbackJurusan;
    }
    
    return data || fallbackJurusan;
  } catch (err) {
    console.error('getJurusan Error:', err);
    return fallbackJurusan;
  }
}

export async function getJurusanAll() {
  // Fetch ALL jurusan including non-active, ensure we select ALL columns
  return handleResponse(
    supabase.from('jurusan').select('*').order('order_index'),
    fallbackJurusan
  );
}

export async function getJurusanBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('jurusan')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) throw error;
    return data || fallbackJurusan.find(j => j.slug === slug);
  } catch (err) {
    console.error('getJurusanBySlug Error:', err);
    return fallbackJurusan.find(j => j.slug === slug);
  }
}

export async function createJurusan(p) { return handleMutation(supabase.from('jurusan').insert(p)); }
export async function updateJurusan(id, p) { return handleMutation(supabase.from('jurusan').update(p).eq('id', id)); }
export async function updateJurusanOrder(id, order_index) {
  return handleMutation(supabase.from('jurusan').update({ order_index }).eq('id', id));
}

export async function updateJurusanOrderBatch(updates) {
  return handleMutation(supabase.from('jurusan').upsert(updates, { onConflict: 'id' }));
}
export async function deleteJurusan(id) { return handleMutation(supabase.from('jurusan').delete().eq('id', id)); }
export async function toggleJurusanAktif(id, aktif) {
  return handleMutation(supabase.from('jurusan').update({ aktif }).eq('id', id));
}

export async function addJurusanGallery(id, imageUrl) {
  try {
    const { data: current, error } = await supabase
      .from('jurusan')
      .select('gallery')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    const gallery = current?.gallery || [];
    const newGallery = [...gallery, imageUrl];
    
    return handleMutation(supabase.from('jurusan').update({ gallery: newGallery }).eq('id', id));
  } catch (err) {
    console.error('addJurusanGallery Error:', err);
    return { data: null, error: err };
  }
}

export async function removeJurusanGallery(id, imageUrl) {
  try {
    const { data: current, error } = await supabase
      .from('jurusan')
      .select('gallery')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    const gallery = current?.gallery || [];
    const newGallery = gallery.filter(url => url !== imageUrl);
    
    return handleMutation(supabase.from('jurusan').update({ gallery: newGallery }).eq('id', id));
  } catch (err) {
    console.error('removeJurusanGallery Error:', err);
    return { data: null, error: err };
  }
}

export async function saveJurusan(payload) { 
  if (payload.id) return updateJurusan(payload.id, payload); 
  return createJurusan(payload); 
}

// ─── FASILITAS ─────────────────────────────────────────────────────
export async function getFasilitas() {
  return handleResponse(
    supabase.from('fasilitas').select('*').order('order_index'),
    fallbackFasilitas || []
  );
}
export async function createFasilitas(p) { return handleMutation(supabase.from('fasilitas').insert(p)); }
export async function updateFasilitas(id, p) { return handleMutation(supabase.from('fasilitas').update(p).eq('id', id)); }
export async function deleteFasilitas(id) { return handleMutation(supabase.from('fasilitas').delete().eq('id', id)); }
export async function saveFasilitas(payload) { 
  if (payload.id) return updateFasilitas(payload.id, payload); 
  return createFasilitas(payload); 
}

// ─── GALERI ────────────────────────────────────────────────────────
export async function getGaleri(kategori = null) {
  try {
    let q = supabase.from('galeri').select('*').order('created_at', { ascending: false });
    if (kategori) q = q.eq('category', kategori);
    const { data, error } = await q;
    if (error) throw error;
    return data || fallbackGaleri || [];
  } catch (err) {
    console.error('getGaleri Error:', err);
    return fallbackGaleri || [];
  }
}
export async function createGaleri(p) { return handleMutation(supabase.from('galeri').insert(p)); }
export async function updateGaleri(id, p) { return handleMutation(supabase.from('galeri').update(p).eq('id', id)); }
export async function deleteGaleri(id) { return handleMutation(supabase.from('galeri').delete().eq('id', id)); }
export async function saveGaleri(payload) { 
  if (payload.id) return updateGaleri(payload.id, payload); 
  return createGaleri(payload); 
}

// ─── TESTIMONIAL ───────────────────────────────────────────────────
export async function getTestimonial() {
  return handleResponse(
    supabase.from('testimonial').select('*').order('created_at', { ascending: false }),
    fallbackTestimonial || []
  );
}
export async function createTestimonial(p) { return handleMutation(supabase.from('testimonial').insert(p)); }
export async function updateTestimonial(id, p) { return handleMutation(supabase.from('testimonial').update(p).eq('id', id)); }
export async function deleteTestimonial(id) { return handleMutation(supabase.from('testimonial').delete().eq('id', id)); }
export async function saveTestimonial(payload) { 
  if (payload.id) return updateTestimonial(payload.id, payload); 
  return createTestimonial(payload); 
}

// ─── ALUMNI (New) ──────────────────────────────────────────────────
export async function getAlumni() {
  return handleResponse(
    supabase.from('alumni').select('*').order('order_index'),
    fallbackAlumni || []
  );
}
export async function createAlumni(p) { return handleMutation(supabase.from('alumni').insert(p)); }
export async function updateAlumni(id, p) { return handleMutation(supabase.from('alumni').update(p).eq('id', id)); }
export async function deleteAlumni(id) { return handleMutation(supabase.from('alumni').delete().eq('id', id)); }
export async function saveAlumni(payload) {
  if (payload.id) return updateAlumni(payload.id, payload);
  return createAlumni(payload);
}

// ─── MITRA PERUSAHAAN (New) ────────────────────────────────────────
export async function getMitra() {
  return handleResponse(
    supabase.from('mitra_perusahaan').select('*').order('order_index'),
    fallbackMitra || []
  );
}
export async function createMitra(p) { return handleMutation(supabase.from('mitra_perusahaan').insert(p)); }
export async function updateMitra(id, p) { return handleMutation(supabase.from('mitra_perusahaan').update(p).eq('id', id)); }
export async function deleteMitra(id) { return handleMutation(supabase.from('mitra_perusahaan').delete().eq('id', id)); }
export async function saveMitra(payload) {
  if (payload.id) return updateMitra(payload.id, payload);
  return createMitra(payload);
}

// ─── SEKOLAH INFO ──────────────────────────────────────────────────
export async function getSekolahInfo() {
  return handleResponse(
    supabase.from('sekolah_info').select('*').order('created_at', { ascending: false }).limit(1).single(),
    fallbackSekolahInfo
  );
}
export async function upsertSekolahInfo(payload) {
  if (payload.id) return handleMutation(supabase.from('sekolah_info').update(payload).eq('id', payload.id));
  return handleMutation(supabase.from('sekolah_info').insert(payload));
}

// ─── ACTIVITY LOG ──────────────────────────────────────────────────
export async function logActivity(action, target, adminEmail) {
  return handleMutation(supabase.from('activity_log').insert({ action, target, admin_email: adminEmail }));
}
export async function getActivityLog(limit = 50) {
  return handleResponse(
    supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(limit),
    []
  );
}

// ─── STORAGE ───────────────────────────────────────────────────────
export function getPublicUrl(bucket, path) {
  try {
    if (!path) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (err) {
    console.error('getPublicUrl Error:', err);
    return null;
  }
}

// NEW: Universal Upload Function
export const uploadImage = async (file, bucket, folder = '') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random()
      .toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });
    
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error('Upload failed:', error.message);
    return { url: null, error: error.message };
  }
};

// REMOVED: initStorageBuckets - Buckets must be created manually in Supabase Dashboard

export async function uploadFile(bucket, path, file) {
  try {
    const result = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: true });
    return result;
  } catch (err) {
    console.error('uploadFile Error:', err);
    return { data: null, error: err };
  }
}
export async function deleteFile(bucket, path) {
  try {
    const result = await supabase.storage.from(bucket).remove([path]);
    return result;
  } catch (err) {
    console.error('deleteFile Error:', err);
    return { data: null, error: err };
  }
}

// ─── REPORT ────────────────────────────────────────────────────────
export async function getReport() {
  try {
    const [j, g, t, f, c, a, m, p] = await Promise.all([
      supabase.from('jurusan').select('id', { count: 'exact', head: true }),
      supabase.from('galeri').select('id', { count: 'exact', head: true }),
      supabase.from('testimonial').select('id', { count: 'exact', head: true }),
      supabase.from('fasilitas').select('id', { count: 'exact', head: true }),
      supabase.from('carousel').select('id', { count: 'exact', head: true }),
      supabase.from('alumni').select('id', { count: 'exact', head: true }),
      supabase.from('mitra_perusahaan').select('id', { count: 'exact', head: true }),
      supabase.from('pendaftar').select('id', { count: 'exact', head: true })
    ]);
    
    return {
      jurusan: j.count || 0,
      galeri: g.count || 0,
      testimonial: t.count || 0,
      fasilitas: f.count || 0,
      carousel: c.count || 0,
      alumni: a.count || 0,
      mitra: m.count || 0,
      pendaftar: p.count || 0
    };
  } catch (err) {
    console.error('getReport Error:', err);
    return {
      jurusan: 0,
      galeri: 0,
      testimonial: 0,
      fasilitas: 0,
      carousel: 0,
      alumni: 0,
      mitra: 0,
      pendaftar: 0
    };
  }
}

// ─── PPDB ────────────────────────────────────────────────────────
export async function getJadwalPPDB() {
  return handleResponse(
    supabase.from('jadwal_ppdb').select('*').order('created_at', { ascending: true }),
    fallbackJadwalPPDB || []
  );
}
export async function createJadwalPPDB(p) { return handleMutation(supabase.from('jadwal_ppdb').insert(p)); }
export async function updateJadwalPPDB(id, p) { return handleMutation(supabase.from('jadwal_ppdb').update(p).eq('id', id)); }
export async function deleteJadwalPPDB(id) { return handleMutation(supabase.from('jadwal_ppdb').delete().eq('id', id)); }

export async function getPersyaratanPPDB() {
  return handleResponse(
    supabase.from('persyaratan_ppdb').select('*').order('created_at', { ascending: true }),
    fallbackPersyaratanPPDB || []
  );
}
export async function createPersyaratanPPDB(p) { return handleMutation(supabase.from('persyaratan_ppdb').insert(p)); }
export async function updatePersyaratanPPDB(id, p) { return handleMutation(supabase.from('persyaratan_ppdb').update(p).eq('id', id)); }
export async function deletePersyaratanPPDB(id) { return handleMutation(supabase.from('persyaratan_ppdb').delete().eq('id', id)); }

export async function getPendaftar() {
  return handleResponse(
    supabase.from('pendaftar').select('*').order('created_at', { ascending: false }),
    fallbackPendaftar || []
  );
}
export async function createPendaftar(p) { return handleMutation(supabase.from('pendaftar').insert(p)); }
export async function updatePendaftar(id, p) { return handleMutation(supabase.from('pendaftar').update(p).eq('id', id)); }
export async function deletePendaftar(id) { return handleMutation(supabase.from('pendaftar').delete().eq('id', id)); }

// ─── SEJARAH (Timeline) ──────────────────────────────────────────────
export async function getSejarah() {
  return handleResponse(
    supabase.from('sejarah').select('*').order('year', { ascending: true }),
    fallbackSejarah || []
  );
}
export async function createSejarah(p) { return handleMutation(supabase.from('sejarah').insert(p)); }
export async function updateSejarah(id, p) { return handleMutation(supabase.from('sejarah').update(p).eq('id', id)); }
export async function deleteSejarah(id) { return handleMutation(supabase.from('sejarah').delete().eq('id', id)); }

// ─── VISI MISI ───────────────────────────────────────────────────────
export async function getVisiMisi() {
  return handleResponse(
    supabase.from('visi_misi').select('*').limit(1).single(),
    fallbackVisiMisi || null
  );
}
export async function upsertVisiMisi(p) {
  if (p.id) return handleMutation(supabase.from('visi_misi').update(p).eq('id', p.id));
  return handleMutation(supabase.from('visi_misi').insert(p));
}

// ─── MOTTO MARS ──────────────────────────────────────────────────────
export async function getMottoMars() {
  return handleResponse(
    supabase.from('motto_mars').select('*').limit(1).single(),
    fallbackMottoMars || null
  );
}
export async function upsertMottoMars(p) {
  if (p.id) return handleMutation(supabase.from('motto_mars').update(p).eq('id', p.id));
  return handleMutation(supabase.from('motto_mars').insert(p));
}
