const getApiEndpoint = () => {
  // Server-side: use absolute URL
  if (typeof window === 'undefined') {
    return 'http://localhost:3000/api/db';
  }
  // Client-side: use relative URL
  return '/api/db';
};

const requestApi = async (action, payload = {}, fallback = null, isMutation = false) => {
  try {
    const API_ENDPOINT = getApiEndpoint();
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
  return requestApi('getHero', {}, null);
}
export async function upsertHero(payload) {
  return requestApi('upsertHero', { payload }, null, true);
}
export async function saveHero(payload) { return upsertHero(payload); }

// ─── JURUSAN ───────────────────────────────────────────────────────
export async function getJurusan() {
  try {
    const data = await requestApi('getJurusan', {}, []);
    return Array.isArray(data) ? data.filter((item) => item.aktif !== false) : [];
  } catch (err) {
    console.error('getJurusan error:', err);
    return [];
  }
}

export async function getJurusanAll() {
  return requestApi('getJurusanAll', {}, []);
}

export async function getJurusanBySlug(slug) {
  const data = await requestApi('getJurusanBySlug', { slug }, null);
  return data || null;
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
  return requestApi('getAlumni', {}, []);
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
  return requestApi('getMitra', {}, []);
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
  return requestApi('getSekolahInfo', {}, {});
}
export async function upsertSekolahInfo(payload) {
  return requestApi('upsertSekolahInfo', { payload }, null, true);
}

// ─── HOMEPAGE SECTIONS ─────────────────────────────────────────────
export async function getHomepageSections() {
  return requestApi('getHomepageSections', {}, []);
}

export async function updateHomepageSectionOrder(updates) {
  return requestApi('updateHomepageSectionOrder', { updates }, null, true);
}

export async function setDefaultHomepageSections() {
  const defaultSections = [
    { id: 'hero', label: 'Hero Section', component: 'hero', order_index: 0, is_active: true },
    { id: 'sambutan', label: 'Sambutan Kepsek', component: 'sambutan', order_index: 1, is_active: true },
    { id: 'jurusan', label: 'Jurusan', component: 'jurusan', order_index: 2, is_active: true },
    { id: 'alumni', label: 'Alumni', component: 'alumni', order_index: 3, is_active: true },
    { id: 'proyek_pkk', label: 'Proyek PKK', component: 'proyek_pkk', order_index: 4, is_active: true },
    { id: 'mitra', label: 'Mitra Perusahaan', component: 'mitra', order_index: 5, is_active: true },
  ];
  return requestApi('updateHomepageSectionOrder', { updates: defaultSections }, null, true);
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

export async function getVisitorLogsByDate(startDate, endDate) {
  return requestApi('getVisitorLogsByDate', { startDate, endDate }, []);
}

export async function logWhatsappClick(clickData) {
  return requestApi('logWhatsappClick', { clickData }, null, true);
}

export async function getWhatsappClicks(startDate, endDate) {
  return requestApi('getWhatsappClicks', { startDate, endDate }, []);
}

export async function getAllImages() {
  return requestApi('getAllImages', {}, []);
}

export async function checkImageUsage(imageUrl) {
  return requestApi('checkImageUsage', { imageUrl }, { used: false, references: [] });
}

export async function deleteImage(imageUrl) {
  return requestApi('deleteImage', { imageUrl }, null, true);
}

// ─── STORAGE ───────────────────────────────────────────────────────
// TODO: Storage is still handled outside Prisma and should be migrated to a real file backend.
export function getPublicUrl(bucket, path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `/${path.replace(/^\/+/, '')}`;
}



export async function uploadFile(bucket, path, file) {
  return requestApi('uploadFile', { bucket, path, file }, null, true);
}

// ─── PPDB ──────────────────────────────────────────────────────────
export async function getJadwalPPDB() {
  return requestApi('getJadwalPPDB', {}, []);
}
export async function getPersyaratanPPDB() {
  return requestApi('getPersyaratanPPDB', {}, []);
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
  return requestApi('getFasilitas', {}, []);
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
  return requestApi('getGaleri', {}, []);
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
  return requestApi('getSejarah', {}, []);
}
export async function createSejarah(p) { return requestApi('createSejarah', { payload: p }, null, true); }
export async function updateSejarah(id, p) { return requestApi('updateSejarah', { id, payload: p }, null, true); }
export async function deleteSejarah(id) { return requestApi('deleteSejarah', { id }, null, true); }
export async function updateSejarahOrder(updates) {
  return requestApi('updateSejarahOrder', { updates }, null, true);
}

// ─── MOTTO & MARS ──────────────────────────────────────────────────
export async function getMottoMars() {
  return requestApi('getMottoMars', {}, {});
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

// ─── PROYEK PKK ───────────────────────────────────────────────────
export async function getProyekPkk() {
  return requestApi('getProyekPkk', {}, null);
}
export async function upsertProyekPkk(payload) {
  return requestApi('upsertProyekPkk', { payload }, null, true);
}

// ─── DASHBOARD / REPORT ────────────────────────────────────────────
export async function getReport() {
  return requestApi('getReport', {}, { pendaftar: 0, alumni: 0, mitra: 0, jurusan: 0 });
}
