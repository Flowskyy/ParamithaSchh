CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "activity_log" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "action" TEXT NOT NULL,
    "target" TEXT,
    "details" TEXT,
    "admin_email" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nama" TEXT NOT NULL,
    "jurusan" TEXT,
    "angkatan" TEXT,
    "foto_url" TEXT,
    "perusahaan" TEXT,
    "posisi" TEXT,
    "deskripsi" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fasilitas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "fasilitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeri" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT,
    "category" TEXT,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "caption" TEXT,

    CONSTRAINT "galeri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT,
    "subtitle" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_sections" (
    "id" TEXT NOT NULL,
    "label" TEXT,
    "component" TEXT,
    "order_index" INTEGER,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal_ppdb" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nama" TEXT NOT NULL,
    "tanggal_mulai" DATE,
    "tanggal_selesai" DATE,
    "status" TEXT DEFAULT 'akan_datang',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jadwal_ppdb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurusan" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_desc" TEXT,
    "icon" TEXT,
    "image_url" TEXT,
    "content" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "description" TEXT,
    "kompetensi" TEXT[],
    "prospek" TEXT[],
    "fasilitas" TEXT[],
    "gallery" TEXT[],
    "warna_primer" TEXT DEFAULT '#C0161C',
    "warna_sekunder" TEXT DEFAULT '#A01218',
    "singkatan" TEXT,
    "aktif" BOOLEAN DEFAULT true,
    "sekolah" TEXT DEFAULT 'paramitha2',
    "materi" JSONB DEFAULT '[]',
    "activities" JSONB DEFAULT '[]',
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitra_perusahaan" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "nama" TEXT NOT NULL,
    "logo_url" TEXT,
    "website" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "aktif" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mitra_perusahaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motto_mars" (
    "id" BIGSERIAL NOT NULL,
    "pink_values" JSONB DEFAULT '[]',
    "jitu_values" JSONB DEFAULT '[]',
    "mars_lyrics" JSONB DEFAULT '[]',
    "mars_audio_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "motto_mars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persyaratan" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "teks" TEXT NOT NULL,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persyaratan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sejarah" (
    "id" BIGSERIAL NOT NULL,
    "year" TEXT,
    "title" TEXT,
    "description" TEXT,
    "icon" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "sejarah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sekolah_info" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "map_url" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "kepsek_name" TEXT,
    "kepsek_photo" TEXT,
    "kepsek_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "cta_title" TEXT,
    "cta_description" TEXT,
    "cta_link" TEXT,
    "cta_button_text" TEXT,
    "tiktok" TEXT,
    "sosmed_ig_aktif" BOOLEAN DEFAULT true,
    "sosmed_yt_aktif" BOOLEAN DEFAULT true,
    "sosmed_fb_aktif" BOOLEAN DEFAULT true,
    "sosmed_tiktok_aktif" BOOLEAN DEFAULT true,
    "vision" TEXT,
    "mission" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "history" TEXT,
    "motto" TEXT,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sekolah_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visi_misi" (
    "id" BIGSERIAL NOT NULL,
    "visi" TEXT NOT NULL,
    "misi" JSONB DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "visi_misi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "device_type" TEXT NOT NULL,
    "page_url" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jurusan_slug_key" ON "jurusan"("slug");
