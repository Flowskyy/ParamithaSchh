import prisma from '../../services/prisma';

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
  res.status(200).json({ data: toSerializable(data) });
};

const parseJsonValue = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string') return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  try {
    return JSON.parse(trimmed);
  } catch {
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
    kompetensi: normalizeStringArrayInput(payload.kompetensi),
    prospek: normalizeStringArrayInput(payload.prospek),
    fasilitas: normalizeStringArrayInput(payload.fasilitas),
    gallery: Array.isArray(payload.gallery) ? payload.gallery.filter(Boolean) : [],
    warna_primer: payload.warna_primer ?? null,
    warna_sekunder: payload.warna_sekunder ?? null,
    singkatan: payload.singkatan ?? null,
    aktif: payload.aktif === undefined ? undefined : Boolean(payload.aktif),
    sekolah: payload.sekolah ?? undefined,
    materi: parseJsonValue(payload.materi, []),
    activities: parseJsonValue(payload.activities, [])
  });

const normalizeJurusanRecord = (record) => {
  const data = toSerializable(record);
  return {
    ...data,
    deskripsi: data?.description ?? null
  };
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
    icon: payload.icon ?? null
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
    pink_values: parseJsonValue(payload.pink_values, []),
    jitu_values: parseJsonValue(payload.jitu_values, []),
    mars_lyrics: parseJsonValue(payload.mars_lyrics, []),
    mars_audio_url: payload.mars_audio_url ?? null
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
    mars_lyrics: parseJsonValue(mottoMars?.mars_lyrics, [])
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
  return {
    ...data,
    ip: data?.ip_address ?? null,
    current_url: data?.page_url ?? null,
    browser_name: null,
    os_name: null
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
    tanggal_mulai: payload.tanggal_mulai ?? payload.start_date ?? null,
    tanggal_selesai: payload.tanggal_selesai ?? payload.end_date ?? null,
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
    res.status(405).json({ error: 'Method not allowed' });
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
          subtitle: payload?.subtitle ?? null,
          image_url: payload?.image_url ?? null
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
          const marsPayload = { mars_lyrics: parseJsonValue(payload.mars_lyrics, []) };

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

      case 'uploadFile': {
        // TODO: Storage uploads still exist outside Prisma and need a dedicated storage backend.
        res.status(501).json({ error: 'Storage uploads are not handled by Prisma.' });
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
        const data = await prisma.sejarah.findMany({ orderBy: { year: 'asc' } });
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
        res.status(400).json({ error: 'Unknown action' });
    }
  } catch (error) {
    res.status(500).json({ error: error?.message || 'Prisma request failed' });
  }
}
