/**
 * ============================================================================
 * ADMIN API HANDLER
 * ============================================================================
 *
 * @author Calvin
 *
 * Endpoint tunggal buat semua kebutuhan CRUD dashboard admin (jurusan, alumni,
 * mitra, PPDB, galeri, dll). Semua request masuk lewat satu POST endpoint,
 * dibedain lewat field `action` di body-nya.
 *
 * Contoh pemakaian:
 *   POST /api/admin
 *   { "action": "getJurusan" }
 *
 *   POST /api/admin
 *   { "action": "createJurusan", "payload": { "name": "...", "slug": "..." } }
 *
 * Body yang dipakai (tergantung action-nya):
 *   - action, payload, id, updates, slug, limit
 *   - adminEmail, target (buat activity log)
 *   - visitor (buat visitor log)
 *   - imageUrl (galeri jurusan)
 *   - aktif, order_index
 *
 * Response:
 *   Sukses -> { success: true, data: ... }
 *   Gagal  -> { success: false, error: "..." }
 *
 * Daftar action:
 *   Hero          : getHero, upsertHero
 *   Jurusan       : getJurusan, getJurusanAll, getJurusanBySlug, createJurusan,
 *                   updateJurusan, deleteJurusan, updateJurusanOrder,
 *                   updateJurusanOrderBatch, toggleJurusanAktif,
 *                   addJurusanGallery, removeJurusanGallery
 *   Alumni        : getAlumni, createAlumni, updateAlumni, deleteAlumni
 *   Mitra         : getMitra, createMitra, updateMitra, deleteMitra
 *   Info Sekolah  : getSekolahInfo, upsertSekolahInfo
 *   Homepage      : getHomepageSections, updateHomepageSectionOrder
 *   Log           : logActivity, getActivityLog, logVisitor, getVisitorLogs,
 *                   getVisitorSummary
 *   PPDB Jadwal   : getJadwalPPDB, createJadwalPPDB, updateJadwalPPDB, deleteJadwalPPDB
 *   PPDB Syarat   : getPersyaratanPPDB, createPersyaratanPPDB,
 *                   updatePersyaratanPPDB, deletePersyaratanPPDB
 *   Pendaftar     : createPendaftar, getPendaftar, updatePendaftar
 *   Fasilitas     : getFasilitas, createFasilitas, updateFasilitas, deleteFasilitas
 *   Galeri        : getGaleri, createGaleri, updateGaleri, deleteGaleri
 *   Sejarah       : getSejarah, createSejarah, updateSejarah, deleteSejarah
 *   Motto & Mars  : getMottoMars, upsertMottoMars
 *   Report        : getReport
 *
 * Catatan:
 *   - Fungsi normalize* itu buat jembatanin beda nama kolom DB vs frontend
 *     (misal description <-> deskripsi, image_url <-> photo_url).
 *   - wa_ppdb & wa_kontak dicek dulu keberadaan kolomnya (via information_schema)
 *     soalnya belum tentu ada di semua environment.
 *   - Tabel pendaftar masih pakai raw SQL karena belum ada di schema Prisma.
 * ============================================================================
 */

import prisma from '../../services/prisma';
import UAParser from 'ua-parser-js';
import fs from 'node:fs';
import path from 'node:path';

const cleanObject = (value) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));

const toSerializable = (value) => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'bigint') return Number(value);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(toSerializable);
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toSerializable(item)])
    );
  }
  return value;
};

const sendData = (res, data) => {
  res.status(200).json({ success: true, data: toSerializable(data) });
};

const sendError = (res, statusCode, error) => {
  res.status(statusCode).json({ success: false, error });
};


const parseJsonValue = (value, fallback = [], fieldName = 'unknown') => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string') return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  try {
    return JSON.parse(trimmed);
  } catch (err) {
    console.error(`JSON parse error for field "${fieldName}":`, err.message);
    console.error(`Value being parsed:`, trimmed.substring(0, 200));
    return fallback;
  }
};

const normalizeStringArrayInput = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    const parsed = parseJsonValue(value, null);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeBigIntId = (value) => BigInt(String(value));

const normalizeJurusanInput = (payload = {}) =>
  cleanObject({
    name: payload.name,
    slug: payload.slug,
    short_desc: payload.short_desc ?? null,
    icon: payload.icon ?? null,
    image_url: payload.image_url ?? null,
    content: payload.content ?? null,
    order_index:
      payload.order_index === '' || payload.order_index === null || payload.order_index === undefined
        ? undefined
        : Number(payload.order_index),
    description: payload.deskripsi ?? payload.description ?? null,
    apa_yang_dipelajari: parseJsonValue(payload.apa_yang_dipelajari, payload.kompetensi, [], 'apa_yang_dipelajari'),
    peluang_karir: parseJsonValue(payload.peluang_karir, payload.prospek, [], 'peluang_karir'),
    fasilitas: normalizeStringArrayInput(payload.fasilitas),
    gallery: Array.isArray(payload.gallery) ? payload.gallery.filter(Boolean) : [],
    warna_primer: payload.warna_primer ?? null,
    warna_sekunder: payload.warna_sekunder ?? null,
    singkatan: payload.singkatan ?? null,
    aktif: payload.aktif === undefined ? undefined : Boolean(payload.aktif),
    sekolah: payload.sekolah ?? undefined,
    materi: parseJsonValue(payload.materi, [], 'materi'),
    activities: parseJsonValue(payload.activities, [], 'activities'),
    articles: parseJsonValue(payload.articles, [], 'articles'),
    updated_at: new Date()
  });

const normalizeJurusanRecord = (record) => {
  const data = toSerializable(record);
  const result = {
    ...data,
    deskripsi: data?.description ?? null,
    content: data?.content ?? null,
    articles: parseJsonValue(data?.articles, [], 'articles'),
    apa_yang_dipelajari: parseJsonValue(data?.apa_yang_dipelajari, [], 'apa_yang_dipelajari'),
    peluang_karir: parseJsonValue(data?.peluang_karir, [], 'peluang_karir')
  };
  console.log('Normalized jurusan record:', result.name, 'articles:', result.articles);
  return result;
};

const normalizeFasilitasInput = (payload = {}) =>
  cleanObject({
    title: payload.title,
    description: payload.description ?? null,
    image_url: payload.photo_url ?? payload.image_url ?? null,
    order_index:
      payload.order_index === '' || payload.order_index === null || payload.order_index === undefined
        ? undefined
        : Number(payload.order_index)
  });

const normalizeFasilitasRecord = (record) => {
  const data = toSerializable(record);
  return {
    ...data,
    photo_url: data?.image_url ?? null
  };
};

const normalizeSejarahInput = (payload = {}) =>
  cleanObject({
    year: payload.year ?? null,
    title: payload.title ?? null,
    description: payload.content ?? payload.description ?? null,
    icon: payload.icon ?? null,
    order_index: payload.order_index === undefined ? undefined : Number(payload.order_index)
  });

const normalizeSejarahRecord = (record) => {
  const data = toSerializable(record);
  return {
    ...data,
    content: data?.description ?? null
  };
};

const normalizePersyaratanInput = (payload = {}) =>
  cleanObject({
    teks: payload.teks ?? payload.deskripsi ?? null,
    order_index:
      payload.order_index === '' || payload.order_index === null || payload.order_index === undefined
        ? undefined
        : Number(payload.order_index)
  });

const normalizePersyaratanRecord = (record) => {
  const data = toSerializable(record);
  return {
    ...data,
    deskripsi: data?.teks ?? null
  };
};

const normalizeMottoMarsInput = (payload = {}) =>
  cleanObject({
    pink_values: parseJsonValue(payload.pink_values, [], 'pink_values'),
    jitu_values: parseJsonValue(payload.jitu_values, [], 'jitu_values'),
    mars_lyrics: parseJsonValue(payload.mars_lyrics, [], 'mars_lyrics'),
    mars_audio_url: payload.mars_audio_url ?? null,
    motto: payload.motto ?? null
  });

const normalizeMissionInput = (value) => normalizeStringArrayInput(value);

const normalizeSekolahInfoInput = (payload = {}) =>
  cleanObject({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    address: payload.address,
    map_url: payload.map_url,
    facebook: payload.facebook,
    instagram: payload.instagram,
    youtube: payload.youtube,
    kepsek_name: payload.kepsek_name,
    kepsek_photo: payload.kepsek_photo,
    kepsek_message: payload.kepsek_message,
    cta_title: payload.cta_title,
    cta_description: payload.cta_description,
    cta_link: payload.cta_link,
    cta_button_text: payload.cta_button_text,
    tiktok: payload.tiktok,
    sosmed_ig_aktif: payload.sosmed_ig_aktif,
    sosmed_yt_aktif: payload.sosmed_yt_aktif,
    sosmed_fb_aktif: payload.sosmed_fb_aktif,
    sosmed_tiktok_aktif: payload.sosmed_tiktok_aktif,
    vision: payload.vision,
    mission: payload.mission === undefined ? undefined : normalizeMissionInput(payload.mission),
    history: payload.history,
    motto: payload.motto
  });

let sekolahInfoColumnsPromise;

const getSekolahInfoColumns = async () => {
  if (!sekolahInfoColumnsPromise) {
    sekolahInfoColumnsPromise = prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'sekolah_info'
    `;
  }

  const rows = await sekolahInfoColumnsPromise;
  return new Set((rows || []).map((row) => row.column_name));
};

const getSekolahInfoExtras = async (recordId) => {
  if (!recordId) return {};

  const columns = await getSekolahInfoColumns();
  const extras = {};

  if (columns.has('wa_ppdb')) {
    const rows = await prisma.$queryRaw`
      SELECT wa_ppdb
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.wa_ppdb = rows?.[0]?.wa_ppdb ?? null;
  }

  if (columns.has('wa_kontak')) {
    const rows = await prisma.$queryRaw`
      SELECT wa_kontak
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.wa_kontak = rows?.[0]?.wa_kontak ?? null;
  }

  if (columns.has('ppdb_badge')) {
    const rows = await prisma.$queryRaw`
      SELECT ppdb_badge
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.ppdb_badge = rows?.[0]?.ppdb_badge ?? null;
  }

  if (columns.has('ppdb_hero_title')) {
    const rows = await prisma.$queryRaw`
      SELECT ppdb_hero_title
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.ppdb_hero_title = rows?.[0]?.ppdb_hero_title ?? null;
  }

  if (columns.has('ppdb_hero_description')) {
    const rows = await prisma.$queryRaw`
      SELECT ppdb_hero_description
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.ppdb_hero_description = rows?.[0]?.ppdb_hero_description ?? null;
  }

  if (columns.has('ppdb_countdown_date')) {
    const rows = await prisma.$queryRaw`
      SELECT ppdb_countdown_date
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.ppdb_countdown_date = rows?.[0]?.ppdb_countdown_date ?? null;
  }

  if (columns.has('ppdb_cta_text')) {
    const rows = await prisma.$queryRaw`
      SELECT ppdb_cta_text
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.ppdb_cta_text = rows?.[0]?.ppdb_cta_text ?? null;
  }

  if (columns.has('ppdb_cta_url')) {
    const rows = await prisma.$queryRaw`
      SELECT ppdb_cta_url
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.ppdb_cta_url = rows?.[0]?.ppdb_cta_url ?? null;
  }

  if (columns.has('jam_operasional')) {
    const rows = await prisma.$queryRaw`
      SELECT jam_operasional
      FROM sekolah_info
      WHERE id::text = ${String(recordId)}
      LIMIT 1
    `;
    extras.jam_operasional = rows?.[0]?.jam_operasional ?? null;
  }

  return extras;
};

const updateSekolahInfoExtras = async (recordId, payload = {}) => {
  if (!recordId) return;

  const columns = await getSekolahInfoColumns();

  if (columns.has('wa_ppdb')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET wa_ppdb = ${payload.wa_ppdb ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }

  if (columns.has('wa_kontak')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET wa_kontak = ${payload.wa_kontak ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }

  if (columns.has('ppdb_badge')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET ppdb_badge = ${payload.ppdb_badge ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }

  if (columns.has('ppdb_hero_title')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET ppdb_hero_title = ${payload.ppdb_hero_title ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }

  if (columns.has('ppdb_hero_description')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET ppdb_hero_description = ${payload.ppdb_hero_description ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }

  if (columns.has('ppdb_countdown_date')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET ppdb_countdown_date = ${payload.ppdb_countdown_date ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }

  if (columns.has('ppdb_cta_text')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET ppdb_cta_text = ${payload.ppdb_cta_text ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }

  if (columns.has('ppdb_cta_url')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET ppdb_cta_url = ${payload.ppdb_cta_url ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }

  if (columns.has('jam_operasional')) {
    await prisma.$executeRaw`
      UPDATE sekolah_info
      SET jam_operasional = ${payload.jam_operasional ?? null}
      WHERE id::text = ${String(recordId)}
    `;
  }
};

const normalizeSekolahInfoRecord = async (record) => {
  if (!record) return null;

  const [extras, mottoMars] = await Promise.all([
    getSekolahInfoExtras(record.id),
    prisma.motto_mars.findFirst({ orderBy: { created_at: 'desc' } })
  ]);

  const data = toSerializable(record);

  return {
    ...data,
    ...extras,
    mission: normalizeMissionInput(data?.mission),
    mars_lyrics: parseJsonValue(mottoMars?.mars_lyrics, [], 'mars_lyrics')
  };
};

const normalizeVisitorInput = (visitor = {}) =>
  cleanObject({
    device_type: visitor.device_type || 'unknown',
    page_url: visitor.page_url || visitor.current_url || visitor.url || '/',
    user_agent: visitor.user_agent || null,
    ip_address: visitor.ip_address || visitor.ip || null,
    referrer: visitor.referrer || null
  });

const normalizeVisitorRecord = (record) => {
  const data = toSerializable(record);
  const ua = record.user_agent ? UAParser(record.user_agent) : { browser: { name: null }, os: { name: null } };
  return {
    ...data,
    ip: data?.ip_address ?? null,
    current_url: data?.page_url ?? null,
    browser_name: ua.browser?.name || null,
    os_name: ua.os?.name || null
  };
};

const formatIndonesianDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

const formatDateRange = (start, end) => {
  const startLabel = formatIndonesianDate(start);
  const endLabel = formatIndonesianDate(end);

  if (startLabel && endLabel && startLabel !== endLabel) {
    return `${startLabel} - ${endLabel}`;
  }

  return startLabel || endLabel || null;
};

const normalizeJadwalInput = (payload = {}) =>
  cleanObject({
    nama: payload.nama ?? payload.title ?? null,
    tanggal_mulai: (payload.tanggal_mulai && payload.tanggal_mulai !== '') ? new Date(payload.tanggal_mulai) : ((payload.start_date && payload.start_date !== '') ? new Date(payload.start_date) : null),
    tanggal_selesai: (payload.tanggal_selesai && payload.tanggal_selesai !== '') ? new Date(payload.tanggal_selesai) : ((payload.end_date && payload.end_date !== '') ? new Date(payload.end_date) : null),
    status: payload.status ?? null
  });

const normalizeJadwalRecord = (record) => {
  const data = toSerializable(record);
  return {
    ...data,
    title: data?.nama ?? null,
    date: formatDateRange(data?.tanggal_mulai, data?.tanggal_selesai)
  };
};

const getRawCount = async (tableName) => {
  try {
    const rows = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM ${tableName}`);
    return Number(rows?.[0]?.count || 0);
  } catch {
    return 0;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }


  const {
    action,
    payload,
    id,
    updates,
    slug,
    limit,
    adminEmail,
    target,
    visitor,
    imageUrl,
    aktif,
    order_index
  } = req.body || {};

  try {
    switch (action) {
      case 'getHero': {
        const data = await prisma.hero.findFirst({ orderBy: { created_at: 'desc' } });
        sendData(res, data);
        return;
      }

      case 'upsertHero': {
        const current = await prisma.hero.findFirst({ orderBy: { created_at: 'desc' } });
        const heroPayload = cleanObject({
          title: payload?.title ?? null,
          badge: payload?.badge ?? null,
          description: payload?.description ?? null,
          cta_text: payload?.cta_text ?? null,
          cta_url: payload?.cta_url ?? null,
          cta2_text: payload?.cta2_text ?? null,
          cta2_url: payload?.cta2_url ?? null
        });
        const data = current
          ? await prisma.hero.update({ where: { id: current.id }, data: heroPayload })
          : await prisma.hero.create({ data: heroPayload });
        sendData(res, data);
        return;
      }

      case 'getJurusan':
      case 'getJurusanAll': {
        const data = await prisma.jurusan.findMany({ orderBy: { order_index: 'asc' } });
        sendData(res, data.map(normalizeJurusanRecord));
        return;
      }

      case 'getJurusanBySlug': {
        const data = await prisma.jurusan.findFirst({ where: { slug } });
        sendData(res, data ? normalizeJurusanRecord(data) : null);
        return;
      }

      case 'createJurusan': {
        const data = await prisma.jurusan.create({ data: normalizeJurusanInput(payload) });
        sendData(res, normalizeJurusanRecord(data));
        return;
      }

      case 'updateJurusan': {
        const data = await prisma.jurusan.update({
          where: { id },
          data: normalizeJurusanInput(payload)
        });
        sendData(res, normalizeJurusanRecord(data));
        return;
      }

      case 'updateJurusanOrder': {
        const data = await prisma.jurusan.update({
          where: { id },
          data: { order_index: Number(order_index) }
        });
        sendData(res, normalizeJurusanRecord(data));
        return;
      }

      case 'updateJurusanOrderBatch': {
        const data = await Promise.all(
          (updates || []).map((item) =>
            prisma.jurusan.update({
              where: { id: item.id },
              data: { order_index: Number(item.order_index) }
            })
          )
        );
        sendData(res, data.map(normalizeJurusanRecord));
        return;
      }

      case 'deleteJurusan': {
        const data = await prisma.jurusan.delete({ where: { id } });
        sendData(res, normalizeJurusanRecord(data));
        return;
      }

      case 'toggleJurusanAktif': {
        const data = await prisma.jurusan.update({ where: { id }, data: { aktif: Boolean(aktif) } });
        sendData(res, normalizeJurusanRecord(data));
        return;
      }

      case 'addJurusanGallery': {
        const current = await prisma.jurusan.findUnique({ where: { id } });
        const data = await prisma.jurusan.update({
          where: { id },
          data: { gallery: [...(current?.gallery || []), imageUrl].filter(Boolean) }
        });
        sendData(res, normalizeJurusanRecord(data));
        return;
      }

      case 'removeJurusanGallery': {
        const current = await prisma.jurusan.findUnique({ where: { id } });
        const data = await prisma.jurusan.update({
          where: { id },
          data: { gallery: (current?.gallery || []).filter((item) => item !== imageUrl) }
        });
        sendData(res, normalizeJurusanRecord(data));
        return;
      }

      case 'getAlumni': {
        const data = await prisma.alumni.findMany({ orderBy: { created_at: 'desc' } });
        sendData(res, data);
        return;
      }

      case 'createAlumni': {
        const data = await prisma.alumni.create({ data: payload });
        sendData(res, data);
        return;
      }

      case 'updateAlumni': {
        const data = await prisma.alumni.update({ where: { id }, data: payload });
        sendData(res, data);
        return;
      }

      case 'deleteAlumni': {
        const data = await prisma.alumni.delete({ where: { id } });
        sendData(res, data);
        return;
      }

      case 'getMitra': {
        const data = await prisma.mitra_perusahaan.findMany({ orderBy: { order_index: 'asc' } });
        sendData(res, data);
        return;
      }

      case 'createMitra': {
        const data = await prisma.mitra_perusahaan.create({ data: payload });
        sendData(res, data);
        return;
      }

      case 'updateMitra': {
        const data = await prisma.mitra_perusahaan.update({ where: { id }, data: payload });
        sendData(res, data);
        return;
      }

      case 'deleteMitra': {
        const data = await prisma.mitra_perusahaan.delete({ where: { id } });
        sendData(res, data);
        return;
      }

      case 'getSekolahInfo': {
        const record = await prisma.sekolah_info.findFirst({ orderBy: { created_at: 'desc' } });
        const data = await normalizeSekolahInfoRecord(record);
        sendData(res, data);
        return;
      }

      case 'upsertSekolahInfo': {
        const current = payload?.id
          ? await prisma.sekolah_info.findUnique({ where: { id: payload.id } })
          : await prisma.sekolah_info.findFirst({ orderBy: { created_at: 'desc' } });
        const sekolahInfoPayload = normalizeSekolahInfoInput(payload);
        const data = current
          ? await prisma.sekolah_info.update({ where: { id: current.id }, data: sekolahInfoPayload })
          : await prisma.sekolah_info.create({ data: sekolahInfoPayload });

        await updateSekolahInfoExtras(data.id, payload);

        if (payload?.mars_lyrics !== undefined) {
          const currentMotto = await prisma.motto_mars.findFirst({ orderBy: { created_at: 'desc' } });
          const marsPayload = { mars_lyrics: parseJsonValue(payload.mars_lyrics, [], 'mars_lyrics') };

          if (currentMotto) {
            await prisma.motto_mars.update({
              where: { id: currentMotto.id },
              data: marsPayload
            });
          } else {
            await prisma.motto_mars.create({ data: marsPayload });
          }
        }

        const normalized = await normalizeSekolahInfoRecord(data);
        sendData(res, normalized);
        return;
      }

      case 'getHomepageSections': {
        const data = await prisma.homepage_sections.findMany({ orderBy: { order_index: 'asc' } });
        sendData(res, data);
        return;
      }

      case 'updateHomepageSectionOrder': {
        const data = await Promise.all(
          (updates || []).map((item) =>
            prisma.homepage_sections.upsert({
              where: { id: item.id },
              create: {
                id: item.id,
                label: item.label ?? null,
                component: item.component ?? null,
                order_index: Number(item.order_index ?? 0),
                is_active: item.is_active ?? true
              },
              update: cleanObject({
                label: item.label,
                component: item.component,
                order_index: Number(item.order_index ?? 0),
                is_active: item.is_active
              })
            })
          )
        );
        sendData(res, data);
        return;
      }

      case 'deleteHomepageSection': {
        const data = await prisma.homepage_sections.delete({ where: { id } });
        sendData(res, data);
        return;
      }

      case 'cleanupHomepageSections': {
        // Delete the duplicate teaching_factory section
        await prisma.homepage_sections.deleteMany({
          where: { id: 'teaching_factory' }
        });

        // Update proyek_pkk label to Proyek PKK
        await prisma.homepage_sections.updateMany({
          where: { id: 'proyek_pkk' },
          data: { label: 'Proyek PKK' }
        });

        const data = await prisma.homepage_sections.findMany({ orderBy: { order_index: 'asc' } });
        sendData(res, data);
        return;
      }

      case 'logActivity': {
        const data = await prisma.activity_log.create({
          data: { action, target, admin_email: adminEmail }
        });
        sendData(res, data);
        return;
      }

      case 'getActivityLog': {
        const data = await prisma.activity_log.findMany({
          orderBy: { created_at: 'desc' },
          take: limit || 50
        });
        sendData(res, data);
        return;
      }

      case 'logVisitor': {
        const data = await prisma.visitor_logs.create({ data: normalizeVisitorInput(visitor) });
        sendData(res, normalizeVisitorRecord(data));
        return;
      }

      case 'getVisitorLogs': {
        const data = await prisma.visitor_logs.findMany({
          orderBy: { created_at: 'desc' },
          take: limit || 100
        });
        sendData(res, data.map(normalizeVisitorRecord));
        return;
      }

      case 'getVisitorSummary': {
        const records = await prisma.visitor_logs.findMany({
          orderBy: { created_at: 'desc' },
          take: 100
        });
        const logs = records.map(normalizeVisitorRecord);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfWeek.getDate() - 6);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const deviceCounts = logs.reduce((acc, item) => {
          const key = item.device_type || 'unknown';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        sendData(res, {
          today: logs.filter((item) => item.created_at && new Date(item.created_at) >= startOfDay).length,
          week: logs.filter((item) => item.created_at && new Date(item.created_at) >= startOfWeek).length,
          month: logs.filter((item) => item.created_at && new Date(item.created_at) >= startOfMonth).length,
          logs,
          deviceCounts
        });
        return;
      }

      case 'getVisitorLogsByDate': {
        const { startDate, endDate } = req.body;
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const records = await prisma.visitor_logs.findMany({
          where: {
            created_at: {
              gte: start,
              lte: end
            }
          },
          orderBy: { created_at: 'desc' }
        });
        sendData(res, records.map(normalizeVisitorRecord));
        return;
      }

      case 'logWhatsappClick': {
        const { clickData } = req.body;
        const data = await prisma.whatsapp_clicks.create({
          data: {
            page_url: clickData.page_url || '/',
            button_type: clickData.button_type || 'general',
            user_agent: clickData.user_agent || null,
            ip_address: clickData.ip_address || null
          }
        });
        sendData(res, toSerializable(data));
        return;
      }

      case 'getWhatsappClicks': {
        const { startDate, endDate } = req.body;
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const records = await prisma.whatsapp_clicks.findMany({
          where: {
            created_at: {
              gte: start,
              lte: end
            }
          },
          orderBy: { created_at: 'desc' }
        });
        sendData(res, records.map(toSerializable));
        return;
      }

      case 'getAllImages': {
        const images = [];

        // Get images from all tables
        const [hero, jurusan, fasilitas, galeri, alumni, mitra, sekolahInfo] = await Promise.all([
          prisma.hero.findMany({ select: { image_url: true, created_at: true } }),
          prisma.jurusan.findMany({ select: { image_url: true, icon: true, gallery: true, created_at: true } }),
          prisma.fasilitas.findMany({ select: { image_url: true, created_at: true } }),
          prisma.galeri.findMany({ select: { image_url: true, created_at: true } }),
          prisma.alumni.findMany({ select: { foto_url: true, created_at: true } }),
          prisma.mitra_perusahaan.findMany({ select: { logo_url: true, created_at: true } }),
          prisma.sekolah_info.findMany({ select: { kepsek_photo: true, created_at: true } })
        ]);

        // Collect all image URLs with their sources
        hero.forEach(item => {
          if (item.image_url) images.push({ url: item.image_url, source: 'hero', created_at: item.created_at });
        });

        jurusan.forEach(item => {
          if (item.image_url) images.push({ url: item.image_url, source: 'jurusan', created_at: item.created_at });
          if (item.icon) images.push({ url: item.icon, source: 'jurusan_icon', created_at: item.created_at });
          if (item.gallery && Array.isArray(item.gallery)) {
            item.gallery.forEach(url => {
              images.push({ url, source: 'jurusan_gallery', created_at: item.created_at });
            });
          }
        });

        fasilitas.forEach(item => {
          if (item.image_url) images.push({ url: item.image_url, source: 'fasilitas', created_at: item.created_at });
        });

        galeri.forEach(item => {
          if (item.image_url) images.push({ url: item.image_url, source: 'galeri', created_at: item.created_at });
        });

        alumni.forEach(item => {
          if (item.foto_url) images.push({ url: item.foto_url, source: 'alumni', created_at: item.created_at });
        });

        mitra.forEach(item => {
          if (item.logo_url) images.push({ url: item.logo_url, source: 'mitra', created_at: item.created_at });
        });

        sekolahInfo.forEach(item => {
          if (item.kepsek_photo) images.push({ url: item.kepsek_photo, source: 'sekolah_info', created_at: item.created_at });
        });

        // Get unique images with usage count
        const imageMap = new Map();
        images.forEach(img => {
          if (!img.url) return;
          const existing = imageMap.get(img.url) || { url: img.url, sources: [], created_at: img.created_at, count: 0 };
          existing.sources.push(img.source);
          existing.count++;
          imageMap.set(img.url, existing);
        });

        const uniqueImages = Array.from(imageMap.values()).map(img => ({
          ...img,
          size: 'Unknown', // Would need file system access to get actual size
          used: img.count > 0
        }));

        sendData(res, uniqueImages);
        return;
      }

      case 'checkImageUsage': {
        const { imageUrl } = req.body;
        const references = [];

        // Check all tables for image usage
        const [hero, jurusan, fasilitas, galeri, alumni, mitra, sekolahInfo] = await Promise.all([
          prisma.hero.findMany({ where: { image_url: imageUrl } }),
          prisma.jurusan.findMany({
            where: {
              OR: [
                { image_url: imageUrl },
                { icon: imageUrl },
                { gallery: { has: imageUrl } }
              ]
            }
          }),
          prisma.fasilitas.findMany({ where: { image_url: imageUrl } }),
          prisma.galeri.findMany({ where: { image_url: imageUrl } }),
          prisma.alumni.findMany({ where: { foto_url: imageUrl } }),
          prisma.mitra_perusahaan.findMany({ where: { logo_url: imageUrl } }),
          prisma.sekolah_info.findMany({ where: { kepsek_photo: imageUrl } })
        ]);

        if (hero.length > 0) references.push({ table: 'hero', count: hero.length });
        if (jurusan.length > 0) references.push({ table: 'jurusan', count: jurusan.length });
        if (fasilitas.length > 0) references.push({ table: 'fasilitas', count: fasilitas.length });
        if (galeri.length > 0) references.push({ table: 'galeri', count: galeri.length });
        if (alumni.length > 0) references.push({ table: 'alumni', count: alumni.length });
        if (mitra.length > 0) references.push({ table: 'mitra', count: mitra.length });
        if (sekolahInfo.length > 0) references.push({ table: 'sekolah_info', count: sekolahInfo.length });

        sendData(res, {
          used: references.length > 0,
          references,
          totalUsage: references.reduce((sum, ref) => sum + ref.count, 0)
        });
        return;
      }

      case 'deleteImage': {
        const { imageUrl } = req.body;

        // Remove image from all tables where it might be referenced
        await Promise.all([
          prisma.hero.updateMany({ where: { image_url: imageUrl }, data: { image_url: null } }),
          prisma.jurusan.updateMany({ where: { image_url: imageUrl }, data: { image_url: null } }),
          prisma.jurusan.updateMany({ where: { icon: imageUrl }, data: { icon: null } }),
          prisma.fasilitas.updateMany({ where: { image_url: imageUrl }, data: { image_url: null } }),
          prisma.galeri.updateMany({ where: { image_url: imageUrl }, data: { image_url: null } }),
          prisma.alumni.updateMany({ where: { foto_url: imageUrl }, data: { foto_url: null } }),
          prisma.mitra_perusahaan.updateMany({ where: { logo_url: imageUrl }, data: { logo_url: null } }),
          prisma.sekolah_info.updateMany({ where: { kepsek_photo: imageUrl }, data: { kepsek_photo: null } })
        ]);

        // Remove from gallery arrays
        const jurusanWithGallery = await prisma.jurusan.findMany({
          where: { gallery: { has: imageUrl } }
        });

        for (const jurusan of jurusanWithGallery) {
          const updatedGallery = jurusan.gallery.filter(url => url !== imageUrl);
          await prisma.jurusan.update({
            where: { id: jurusan.id },
            data: { gallery: updatedGallery }
          });
        }

        // Delete the physical file from filesystem
        try {
          const filePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileError) {
          console.error('Error deleting file from filesystem:', fileError);
          // Continue even if file deletion fails - database cleanup is more important
        }

        sendData(res, { success: true, message: 'Gambar berhasil dihapus' });
        return;
      }

      case 'uploadFile': {
        res.status(400).json({ success: false, error: 'Use /api/upload instead' });
        return;
      }


      case 'getJadwalPPDB': {
        const data = await prisma.jadwal_ppdb.findMany({
          orderBy: [{ tanggal_mulai: 'asc' }, { created_at: 'asc' }]
        });
        sendData(res, data.map(normalizeJadwalRecord));
        return;
      }

      case 'createJadwalPPDB': {
        const data = await prisma.jadwal_ppdb.create({ data: normalizeJadwalInput(payload) });
        sendData(res, normalizeJadwalRecord(data));
        return;
      }

      case 'updateJadwalPPDB': {
        const data = await prisma.jadwal_ppdb.update({
          where: { id },
          data: normalizeJadwalInput(payload)
        });
        sendData(res, normalizeJadwalRecord(data));
        return;
      }

      case 'deleteJadwalPPDB': {
        const data = await prisma.jadwal_ppdb.delete({ where: { id } });
        sendData(res, normalizeJadwalRecord(data));
        return;
      }

      case 'getPersyaratanPPDB': {
        const data = await prisma.persyaratan.findMany({ orderBy: { order_index: 'asc' } });
        sendData(res, data.map(normalizePersyaratanRecord));
        return;
      }

      case 'createPersyaratanPPDB': {
        const data = await prisma.persyaratan.create({ data: normalizePersyaratanInput(payload) });
        sendData(res, normalizePersyaratanRecord(data));
        return;
      }

      case 'updatePersyaratanPPDB': {
        const data = await prisma.persyaratan.update({
          where: { id },
          data: normalizePersyaratanInput(payload)
        });
        sendData(res, normalizePersyaratanRecord(data));
        return;
      }

      case 'deletePersyaratanPPDB': {
        const data = await prisma.persyaratan.delete({ where: { id } });
        sendData(res, normalizePersyaratanRecord(data));
        return;
      }

      case 'createPendaftar': {
        const rows = await prisma.$queryRaw`
          INSERT INTO pendaftar (nama, nisn, asal_sekolah, email, whatsapp, jurusan, pesan, created_at)
          VALUES (
            ${payload?.nama ?? null},
            ${payload?.nisn ?? null},
            ${payload?.asal_sekolah ?? null},
            ${payload?.email ?? null},
            ${payload?.whatsapp ?? null},
            ${payload?.jurusan ?? null},
            ${payload?.pesan ?? null},
            COALESCE(${payload?.created_at ?? null}::timestamptz, NOW())
          )
          RETURNING *
        `;
        sendData(res, rows?.[0] ?? null);
        return;
      }

      case 'getPendaftar': {
        const rows = await prisma.$queryRaw`
          SELECT *
          FROM pendaftar
          ORDER BY created_at DESC
        `;
        sendData(res, rows);
        return;
      }

      case 'updatePendaftar': {
        const rows = await prisma.$queryRaw`
          UPDATE pendaftar
          SET
            nama = ${payload?.nama ?? null},
            nisn = ${payload?.nisn ?? null},
            asal_sekolah = ${payload?.asal_sekolah ?? null},
            email = ${payload?.email ?? null},
            whatsapp = ${payload?.whatsapp ?? null},
            jurusan = ${payload?.jurusan ?? null},
            pesan = ${payload?.pesan ?? null}
          WHERE id::text = ${String(id)}
          RETURNING *
        `;
        sendData(res, rows?.[0] ?? null);
        return;
      }

      case 'getFasilitas': {
        const data = await prisma.fasilitas.findMany({ orderBy: { created_at: 'desc' } });
        sendData(res, data.map(normalizeFasilitasRecord));
        return;
      }

      case 'createFasilitas': {
        const data = await prisma.fasilitas.create({ data: normalizeFasilitasInput(payload) });
        sendData(res, normalizeFasilitasRecord(data));
        return;
      }

      case 'updateFasilitas': {
        const data = await prisma.fasilitas.update({
          where: { id },
          data: normalizeFasilitasInput(payload)
        });
        sendData(res, normalizeFasilitasRecord(data));
        return;
      }

      case 'deleteFasilitas': {
        const data = await prisma.fasilitas.delete({ where: { id } });
        sendData(res, normalizeFasilitasRecord(data));
        return;
      }

      case 'getGaleri': {
        const data = await prisma.galeri.findMany({ orderBy: { created_at: 'desc' } });
        sendData(res, data);
        return;
      }

      case 'createGaleri': {
        const data = await prisma.galeri.create({ data: payload });
        sendData(res, data);
        return;
      }

      case 'updateGaleri': {
        const data = await prisma.galeri.update({ where: { id }, data: payload });
        sendData(res, data);
        return;
      }

      case 'deleteGaleri': {
        const data = await prisma.galeri.delete({ where: { id } });
        sendData(res, data);
        return;
      }

      case 'getSejarah': {
        const data = await prisma.sejarah.findMany({ orderBy: { order_index: 'asc' } });
        sendData(res, data.map(normalizeSejarahRecord));
        return;
      }

      case 'createSejarah': {
        const data = await prisma.sejarah.create({ data: normalizeSejarahInput(payload) });
        sendData(res, normalizeSejarahRecord(data));
        return;
      }

      case 'updateSejarah': {
        const data = await prisma.sejarah.update({
          where: { id: normalizeBigIntId(id) },
          data: normalizeSejarahInput(payload)
        });
        sendData(res, normalizeSejarahRecord(data));
        return;
      }

      case 'deleteSejarah': {
        const data = await prisma.sejarah.delete({ where: { id: normalizeBigIntId(id) } });
        sendData(res, normalizeSejarahRecord(data));
        return;
      }

      case 'updateSejarahOrder': {
        const data = await Promise.all(
          (updates || []).map((item) =>
            prisma.sejarah.update({
              where: { id: normalizeBigIntId(item.id) },
              data: { order_index: Number(item.order_index) }
            })
          )
        );
        sendData(res, data.map(normalizeSejarahRecord));
        return;
      }

      case 'getMottoMars': {
        const data = await prisma.motto_mars.findFirst({ orderBy: { created_at: 'desc' } });
        sendData(res, data);
        return;
      }

      case 'upsertMottoMars': {
        const current = payload?.id
          ? await prisma.motto_mars.findUnique({ where: { id: normalizeBigIntId(payload.id) } })
          : await prisma.motto_mars.findFirst({ orderBy: { created_at: 'desc' } });
        const mottoPayload = normalizeMottoMarsInput(payload);
        const data = current
          ? await prisma.motto_mars.update({ where: { id: current.id }, data: mottoPayload })
          : await prisma.motto_mars.create({ data: mottoPayload });
        sendData(res, data);
        return;
      }

      case 'getProyekPkk': {
        const data = await prisma.proyek_pkk.findFirst({ orderBy: { created_at: 'desc' } });
        sendData(res, data);
        return;
      }

      case 'upsertProyekPkk': {
        const current = await prisma.proyek_pkk.findFirst({ orderBy: { created_at: 'desc' } });
        const proyekPayload = cleanObject({
          title: payload?.title ?? null,
          subtitle: payload?.subtitle ?? null,
          description: payload?.description ?? null,
          services: Array.isArray(payload?.services) ? payload.services : [],
          website_url: payload?.website_url ?? null
        });
        const data = current
          ? await prisma.proyek_pkk.update({ where: { id: current.id }, data: proyekPayload })
          : await prisma.proyek_pkk.create({ data: proyekPayload });
        sendData(res, data);
        return;
      }

      case 'getReport': {
        const [pendaftar, alumni, mitra, jurusan] = await Promise.all([
          getRawCount('pendaftar'),
          prisma.alumni.count(),
          prisma.mitra_perusahaan.count(),
          prisma.jurusan.count()
        ]);
        sendData(res, { pendaftar, alumni, mitra, jurusan });
        return;
      }

      default:
        res.status(400).json({ success: false, error: 'Unknown action' });

    }
  } catch (error) {
    res.status(500).json({ success: false, error: error?.message || 'Prisma request failed' });
  }
}
