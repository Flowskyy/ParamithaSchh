import {
  fallbackJurusan,
  fallbackSekolahInfo,
  fallbackMottoMars,
  fallbackSejarah,
  fallbackFasilitas,
  fallbackGaleri,
  fallbackAlumni,
  fallbackMitra,
  fallbackJadwalPPDB,
  fallbackPersyaratanPPDB,
  fallbackHero,
  fallbackHomepageSections
} from '../utils/fallbackData';

const API_ENDPOINT = '/api/db';

const requestApi = async (action, payload = {}, fallback = null, isMutation = false) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload })
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json?.error || 'Request failed');
    }

    if (isMutation) {
      return { data: json?.data ?? null, error: null };
    }

    return json?.data ?? fallback;
  } catch (err) {
    console.error(`${action} error:`, err);
    return isMutation
      ? { data: null, error: err?.message || String(err) }
      : fallback;
  }
};

// ─── HERO ──────────────────────────────────────────────────────────
export async function getHero() {
  return requestApi('getHero', {}, fallbackHero || null);
}
export async function upsertHero(payload) {
  return requestApi('upsertHero', { payload }, null, true);
}
export async function saveHero(payload) { return upsertHero(payload); }

// ─── JURUSAN ───────────────────────────────────────────────────────
export async function getJurusan() {
  try {
    const data = await requestApi('getJurusan', {}, fallbackJurusan || []);
    return Array.isArray(data) ? data.filter((item) => item.aktif !== false) : [];
  } catch (err) {
    console.error('getJurusan error:', err);
    return fallbackJurusan.filter((j) => j.aktif !== false);
  }
}

export async function getJurusanAll() {
  return requestApi('getJurusanAll', {}, fallbackJurusan || []);
}

export async function getJurusanBySlug(slug) {
  const data = await requestApi('getJurusanBySlug', { slug }, null);
  return data || fallbackJurusan.find((j) => j.slug === slug);
}

export async function createJurusan(p) { return requestApi('createJurusan', { payload: p }, null, true); }
export async function updateJurusan(id, p) {
  const { id: _, created_at: __, ...payload } = p;
  return requestApi('updateJurusan', { id, payload }, null, true);
}
export async function updateJurusanOrder(id, order_index) {
  return requestApi('updateJurusanOrder', { id, order_index }, null, true);
}
export async function updateJurusanOrderBatch(updates) {
  return requestApi('updateJurusanOrderBatch', { updates }, null, true);
}
export async function deleteJurusan(id) { return requestApi('deleteJurusan', { id }, null, true); }
export async function toggleJurusanAktif(id, aktif) {
  return requestApi('toggleJurusanAktif', { id, aktif }, null, true);
}

export async function addJurusanGallery(id, imageUrl) {
  return requestApi('addJurusanGallery', { id, imageUrl }, null, true);
}

export async function removeJurusanGallery(id, imageUrl) {
  return requestApi('removeJurusanGallery', { id, imageUrl }, null, true);
}

// ─── ALUMNI ────────────────────────────────────────────────────────
export async function getAlumni() {
  return requestApi('getAlumni', {}, fallbackAlumni || []);
}
export async function createAlumni(p) { return requestApi('createAlumni', { payload: p }, null, true); }
export async function updateAlumni(id, p) { return requestApi('updateAlumni', { id, payload: p }, null, true); }
export async function deleteAlumni(id) { return requestApi('deleteAlumni', { id }, null, true); }
export async function saveAlumni(payload) {
  if (payload.id) return updateAlumni(payload.id, payload);
  return createAlumni(payload);
}

// ─── MITRA PERUSAHAAN ───────────────────────────────────────────────
export async function getMitra() {
  return requestApi('getMitra', {}, fallbackMitra || []);
}
export async function createMitra(p) { return requestApi('createMitra', { payload: p }, null, true); }
export async function updateMitra(id, p) { return requestApi('updateMitra', { id, payload: p }, null, true); }
export async function deleteMitra(id) { return requestApi('deleteMitra', { id }, null, true); }
export async function saveMitra(payload) {
  if (payload.id) return updateMitra(payload.id, payload);
  return createMitra(payload);
}

// ─── SEKOLAH INFO ──────────────────────────────────────────────────
export async function getSekolahInfo() {
  return requestApi('getSekolahInfo', {}, fallbackSekolahInfo);
}
export async function upsertSekolahInfo(payload) {
  return requestApi('upsertSekolahInfo', { payload }, null, true);
}

// ─── HOMEPAGE SECTIONS ─────────────────────────────────────────────
export async function getHomepageSections() {
  return requestApi('getHomepageSections', {}, fallbackHomepageSections || []);
}

export async function updateHomepageSectionOrder(updates) {
  return requestApi('updateHomepageSectionOrder', { updates }, null, true);
}

// ─── ACTIVITY LOG ──────────────────────────────────────────────────
export async function logActivity(action, target, adminEmail) {
  return requestApi('logActivity', { action, target, adminEmail }, null, true);
}
export async function getActivityLog(limit = 50) {
  return requestApi('getActivityLog', { limit }, []);
}

export async function logVisitor(visitor) {
  return requestApi('logVisitor', { visitor }, null, true);
}

export async function getVisitorLogs(limit = 100) {
  return requestApi('getVisitorLogs', { limit }, []);
}

export async function getVisitorSummary() {
  return requestApi('getVisitorSummary', {}, { today: 0, week: 0, month: 0, logs: [], deviceCounts: {} });
}

// ─── STORAGE ───────────────────────────────────────────────────────
// TODO: Storage is still handled outside Prisma and should be migrated to a real file backend.
export function getPublicUrl(bucket, path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `/${path.replace(/^\/+/, '')}`;
}

export const uploadImage = async (file, bucket, folder = '') => {
  try {
    const fileNameBase = file?.name ? file.name.split('.').shift() : `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const fileExt = file?.name?.split('.').pop() || 'jpg';
    const fileName = `${folder ? folder + '/' : ''}${fileNameBase}-${Date.now()}.${fileExt}`;

    const objectUrl = typeof window !== 'undefined' && file instanceof Blob
      ? URL.createObjectURL(file)
      : null;

    return { url: objectUrl || `/${fileName}`, error: null };
  } catch (error) {
    console.error('Upload failed:', error?.message || error);
    return { url: null, error: error?.message || String(error) };
  }
};

export async function uploadFile(bucket, path, file) {
  return requestApi('uploadFile', { bucket, path, file }, null, true);
}

// ─── PPDB ──────────────────────────────────────────────────────────
export async function getJadwalPPDB() {
  return requestApi('getJadwalPPDB', {}, fallbackJadwalPPDB || []);
}
export async function getPersyaratanPPDB() {
  return requestApi('getPersyaratanPPDB', {}, fallbackPersyaratanPPDB || []);
}
export async function createPendaftar(p) {
  return requestApi('createPendaftar', { payload: p }, null, true);
}
export async function getPendaftar() {
  return requestApi('getPendaftar', {}, []);
}
export async function updatePendaftar(id, p) { return requestApi('updatePendaftar', { id, payload: p }, null, true); }

// ─── FASILITAS ─────────────────────────────────────────────────────
export async function getFasilitas() {
  return requestApi('getFasilitas', {}, fallbackFasilitas || []);
}
export async function createFasilitas(p) { return requestApi('createFasilitas', { payload: p }, null, true); }
export async function updateFasilitas(id, p) { return requestApi('updateFasilitas', { id, payload: p }, null, true); }
export async function deleteFasilitas(id) { return requestApi('deleteFasilitas', { id }, null, true); }
export async function saveFasilitas(payload) {
  if (payload.id) return updateFasilitas(payload.id, payload);
  return createFasilitas(payload);
}

export async function saveJurusan(payload) {
  if (payload.id) return updateJurusan(payload.id, payload);
  return createJurusan(payload);
}

// ─── GALERI ────────────────────────────────────────────────────────
export async function getGaleri() {
  return requestApi('getGaleri', {}, fallbackGaleri || []);
}
export async function createGaleri(p) { return requestApi('createGaleri', { payload: p }, null, true); }
export async function updateGaleri(id, p) { return requestApi('updateGaleri', { id, payload: p }, null, true); }
export async function deleteGaleri(id) { return requestApi('deleteGaleri', { id }, null, true); }
export async function saveGaleri(payload) {
  if (payload.id) return updateGaleri(payload.id, payload);
  return createGaleri(payload);
}

// ─── SEJARAH ───────────────────────────────────────────────────────
export async function getSejarah() {
  return requestApi('getSejarah', {}, fallbackSejarah || []);
}
export async function createSejarah(p) { return requestApi('createSejarah', { payload: p }, null, true); }
export async function updateSejarah(id, p) { return requestApi('updateSejarah', { id, payload: p }, null, true); }
export async function deleteSejarah(id) { return requestApi('deleteSejarah', { id }, null, true); }

// ─── MOTTO & MARS ──────────────────────────────────────────────────
export async function getMottoMars() {
  return requestApi('getMottoMars', {}, fallbackMottoMars);
}
export async function upsertMottoMars(payload) {
  return requestApi('upsertMottoMars', { payload }, null, true);
}

// ─── PPDB JADWAL & PERSYARATAN ─────────────────────────────────────
export async function createJadwalPPDB(p) { return requestApi('createJadwalPPDB', { payload: p }, null, true); }
export async function updateJadwalPPDB(id, p) { return requestApi('updateJadwalPPDB', { id, payload: p }, null, true); }
export async function deleteJadwalPPDB(id) { return requestApi('deleteJadwalPPDB', { id }, null, true); }

export async function createPersyaratanPPDB(p) { return requestApi('createPersyaratanPPDB', { payload: p }, null, true); }
export async function updatePersyaratanPPDB(id, p) { return requestApi('updatePersyaratanPPDB', { id, payload: p }, null, true); }
export async function deletePersyaratanPPDB(id) { return requestApi('deletePersyaratanPPDB', { id }, null, true); }

// ─── DASHBOARD / REPORT ────────────────────────────────────────────
export async function getReport() {
  return requestApi('getReport', {}, { pendaftar: 0, alumni: 0, mitra: 0, jurusan: 0 });
}
