import supabase from './supabase';
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
  fallbackCarousel,
  fallbackHomepageSections
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
    // Return data if not null/undefined (including empty array)
    return data !== null && data !== undefined ? data : fallback;
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
    supabase.from('hero').select('id, title, subtitle, description, image_url, cta_text, cta_url, created_at').order('created_at', { ascending: false }).limit(1).single(),
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
      .select('id, name, slug, singkatan, aktif, description, short_desc, warna_primer, order_index, image_url, deskripsi')
      .eq('aktif', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('getJurusan Error:', error.message);
      return fallbackJurusan.filter(j => j.aktif !== false);
    }
    
    return data !== null ? data : [];
  } catch (err) {
    console.error('getJurusan Catch Error:', err);
    return fallbackJurusan.filter(j => j.aktif !== false);
  }
}

export async function getJurusanAll() {
  // Fetch ALL jurusan including non-active
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
export async function updateJurusan(id, p) { 
  // Clean payload from extra fields that might not be in DB
  const { id: _, created_at: __, ...payload } = p;
  return handleMutation(supabase.from('jurusan').update(payload).eq('id', id)); 
}
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
    const newGallery = gallery.filter(img => img !== imageUrl);
    
    return handleMutation(supabase.from('jurusan').update({ gallery: newGallery }).eq('id', id));
  } catch (err) {
    console.error('removeJurusanGallery Error:', err);
    return { data: null, error: err };
  }
}

// ─── ALUMNI ────────────────────────────────────────────────────────
export async function getAlumni() {
  return handleResponse(
    supabase.from('alumni').select('*').order('created_at', { ascending: false }),
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
    supabase.from('sekolah_info').select('id, name, phone, email, address, facebook, instagram, youtube, kepsek_name, kepsek_photo, kepsek_message, map_url, vision, mission, history, motto, mars_lyrics').order('created_at', { ascending: false }).limit(1).single(),
    fallbackSekolahInfo
  );
}
export async function upsertSekolahInfo(payload) {
  if (payload.id) return handleMutation(supabase.from('sekolah_info').update(payload).eq('id', payload.id));
  return handleMutation(supabase.from('sekolah_info').insert(payload));
}

// ─── HOMEPAGE SECTIONS ─────────────────────────────────────────────
export async function getHomepageSections() {
  return handleResponse(
    supabase.from('homepage_sections').select('*').order('order_index'),
    fallbackHomepageSections
  );
}

export async function updateHomepageSectionOrder(updates) {
  // updates is array of { id, order_index }
  return handleMutation(supabase.from('homepage_sections').upsert(updates, { onConflict: 'id' }));
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
  } catch (error) {
    return { data: null, error };
  }
}

// ─── PPDB ──────────────────────────────────────────────────────────
export async function getJadwalPPDB() {
  return handleResponse(supabase.from('jadwal_ppdb').select('*').order('order_index'), fallbackJadwalPPDB);
}
export async function getPersyaratanPPDB() {
  return handleResponse(supabase.from('persyaratan_ppdb').select('*').order('order_index'), fallbackPersyaratanPPDB);
}
export async function createPendaftar(p) {
  return handleMutation(supabase.from('pendaftar').insert(p));
}
export async function getPendaftar() {
  return handleResponse(supabase.from('pendaftar').select('*').order('created_at', { ascending: false }), []);
}
export async function updatePendaftar(id, p) { return handleMutation(supabase.from('pendaftar').update(p).eq('id', id)); }

// ─── FASILITAS ─────────────────────────────────────────────────────
export async function getFasilitas() {
  return handleResponse(supabase.from('fasilitas').select('*').order('created_at', { ascending: false }), fallbackFasilitas || []);
}
export async function createFasilitas(p) { return handleMutation(supabase.from('fasilitas').insert(p)); }
export async function updateFasilitas(id, p) { return handleMutation(supabase.from('fasilitas').update(p).eq('id', id)); }
export async function deleteFasilitas(id) { return handleMutation(supabase.from('fasilitas').delete().eq('id', id)); }
export async function saveFasilitas(payload) {
  if (payload.id) return updateFasilitas(payload.id, payload);
  return createFasilitas(payload);
}

// ─── GALERI ────────────────────────────────────────────────────────
export async function getGaleri() {
  return handleResponse(supabase.from('galeri').select('*').order('created_at', { ascending: false }), fallbackGaleri || []);
}
export async function createGaleri(p) { return handleMutation(supabase.from('galeri').insert(p)); }
export async function updateGaleri(id, p) { return handleMutation(supabase.from('galeri').update(p).eq('id', id)); }
export async function deleteGaleri(id) { return handleMutation(supabase.from('galeri').delete().eq('id', id)); }
export async function saveGaleri(payload) {
  if (payload.id) return updateGaleri(payload.id, payload);
  return createGaleri(payload);
}

// ─── SEJARAH ───────────────────────────────────────────────────────
export async function getSejarah() {
  return handleResponse(supabase.from('sejarah').select('*').order('year', { ascending: true }), fallbackSejarah || []);
}
export async function createSejarah(p) { return handleMutation(supabase.from('sejarah').insert(p)); }
export async function updateSejarah(id, p) { return handleMutation(supabase.from('sejarah').update(p).eq('id', id)); }
export async function deleteSejarah(id) { return handleMutation(supabase.from('sejarah').delete().eq('id', id)); }

// ─── MOTTO & MARS ──────────────────────────────────────────────────
export async function getMottoMars() {
  return handleResponse(supabase.from('motto_mars').select('*').limit(1).single(), fallbackMottoMars);
}
export async function upsertMottoMars(payload) {
  if (payload.id) return handleMutation(supabase.from('motto_mars').update(payload).eq('id', payload.id));
  return handleMutation(supabase.from('motto_mars').insert(payload));
}

// ─── PPDB JADWAL & PERSYARATAN ─────────────────────────────────────
export async function createJadwalPPDB(p) { return handleMutation(supabase.from('jadwal_ppdb').insert(p)); }
export async function updateJadwalPPDB(id, p) { return handleMutation(supabase.from('jadwal_ppdb').update(p).eq('id', id)); }
export async function deleteJadwalPPDB(id) { return handleMutation(supabase.from('jadwal_ppdb').delete().eq('id', id)); }

export async function createPersyaratanPPDB(p) { return handleMutation(supabase.from('persyaratan_ppdb').insert(p)); }
export async function updatePersyaratanPPDB(id, p) { return handleMutation(supabase.from('persyaratan_ppdb').update(p).eq('id', id)); }
export async function deletePersyaratanPPDB(id) { return handleMutation(supabase.from('persyaratan_ppdb').delete().eq('id', id)); }

// ─── DASHBOARD / REPORT ────────────────────────────────────────────
export async function getReport() {
  try {
    const [pendaftar, alumni, mitra, jurusan] = await Promise.all([
      supabase.from('pendaftar').select('id', { count: 'exact' }),
      supabase.from('alumni').select('id', { count: 'exact' }),
      supabase.from('mitra_perusahaan').select('id', { count: 'exact' }),
      supabase.from('jurusan').select('id', { count: 'exact' }),
    ]);
    
    return {
      pendaftar: pendaftar.count || 0,
      alumni: alumni.count || 0,
      mitra: mitra.count || 0,
      jurusan: jurusan.count || 0,
    };
  } catch (error) {
    console.error('getReport error:', error);
    return { pendaftar: 0, alumni: 0, mitra: 0, jurusan: 0 };
  }
}
