AI_RULES.md — Baca ini SEBELUM edit apapun

⚠️ Aturan ini berlaku penuh sampai room chat diganti. Tidak ada pengecualian.


🧱 STACK
LayerTeknologiFrameworkNext.js 14 — Pages Router (BUKAN App Router)StylingTailwind CSSAnimasiFramer MotionDatabaseSupabaseFontPlus Jakarta Sans (via globals.css)

❌ TIDAK ada folder app/
❌ TIDAK pakai directive 'use client'
✅ Semua halaman ada di pages/


📁 STRUKTUR FOLDER (JANGAN DIUBAH)
pages/
  _app.js
  _document.js
  index.js
  contact.js
  tentang/
    fasilitas.js / visi-misi.js / galeri.js / sejarah.js / motto-mars.js
  jurusan/
    rpl.js / ulw.js / dkv.js / kuliner.js / perhotelan.js
  admin/
    index.js (login)
    dashboard.js / hero.js / carousel.js / jurusan.js
    fasilitas.js / galeri.js / testimonial.js / report.js / log.js

components/
  Navbar.js / Footer.js / Layout.js / AdminLayout.js
  Section.js / Loader.js / SmartImage.js / JurusanDetail.js

services/
  supabase.js / api.js

utils/
  toast.js / withAdmin.js / fallbackData.js / cacheImage.js

styles/
  globals.css

📦 PACKAGE MANAGEMENT (WAJIB DIPATUHI)

❌ DILARANG menghapus node_modules
❌ DILARANG menjalankan npm install ulang tanpa alasan
❌ DILARANG uninstall package yang sudah ada
❌ DILARANG memodifikasi package-lock.json secara manual
✅ Kalau butuh package baru → jalankan npm install [nama-package] saja, lalu lanjut
✅ Fokus hanya pada edit file kode, bukan dependency


✏️ ATURAN WAJIB SAAT EDIT

Berikan FULL FILE dari baris pertama sampai terakhir
❌ DILARANG tulis // ...existing code atau // ...rest of component
❌ DILARANG hapus import yang sudah ada
❌ DILARANG hapus getServerSideProps yang sudah ada
❌ DILARANG tambah dependency baru tanpa bilang dulu
❌ DILARANG ubah file lain selain yang diminta
Setiap page wajib punya export default function
Setiap page publik wajib punya getServerSideProps yang return sekolahInfo


📥 IMPORT YANG BENAR (JANGAN DIUBAH)
js// Toast
import { toastSuccess, toastError, toastLoading, toastDismiss } from '../utils/toast'

// Supabase client
import supabase from '../services/supabase'

// API helpers
import { getJurusan, createJurusan, getSekolahInfo, ... } from '../services/api'

// Fallback data
import { fallbackJurusan, fallbackSekolahInfo, ... } from '../utils/fallbackData'

// Komponen
import { SectionWrapper, SectionHeader, StaggerContainer, StaggerItem } from '../components/Section'
import { InlineLoader, CardSkeleton } from '../components/Loader'
import SmartImage from '../components/SmartImage'

// Admin protection
import withAdmin from '../utils/withAdmin'

🔁 TEMPLATE getServerSideProps (WAJIB ADA DI SEMUA PAGE PUBLIK)
jsexport async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo()
    return { props: { sekolahInfo: sekolahInfo || null } }
  } catch {
    return { props: { sekolahInfo: null } }
  }
}

📄 TEMPLATE PAGE PUBLIK
jsximport Head from 'next/head'
import { getSekolahInfo } from '../services/api'
import { fallbackSekolahInfo } from '../utils/fallbackData'

export default function NamaPage({ sekolahInfo }) {
  const info = sekolahInfo || fallbackSekolahInfo

  return (
    <>
      <Head><title>Judul — SMK Paramitha 2</title></Head>
      {/* konten */}
    </>
  )
}

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo()
    return { props: { sekolahInfo: sekolahInfo || null } }
  } catch {
    return { props: { sekolahInfo: null } }
  }
}

🔐 TEMPLATE PAGE ADMIN
jsximport Head from 'next/head'
import withAdmin from '../../utils/withAdmin'
import { toastSuccess, toastError, toastLoading, toastDismiss } from '../../utils/toast'
import { InlineLoader } from '../../components/Loader'

function NamaAdminPage({ user }) {
  return (
    <>
      <Head><title>Nama — Admin SMK Paramitha 2</title></Head>
      {/* konten */}
    </>
  )
}

export default withAdmin(NamaAdminPage)
// ❌ TIDAK ADA getServerSideProps di admin page

🎨 DESIGN SYSTEM (JANGAN DIUBAH)
Color Palette
TokenValueBackground#080810Surface#0f0f1aCard#151525Primary#4F8EF7Accent#F97316Text#F0F0F8Muted#7070A0Borderrgba(255,255,255,0.07)
CSS Classes (sudah ada di globals.css — tinggal pakai)
ClassFungsi.glassFrosted glass effect.glass-darkNavbar glass.gradient-textGradient blue → orange.mesh-bgHero background.btn-primaryTombol biru.btn-ghostTombol transparan.card-hoverHover lift effect.skeletonLoading shimmer.input-fieldForm input styling.noiseGrain overlay (di Layout)

🐛 ERROR UMUM & CARA HINDARI
SituasiYang HARUS dilakukanTambah state baruTaruh useState di level atas komponen, bukan di dalam kondisiTambah fetch dataGunakan useEffect + try/catch + finally untuk set loading falseTambah komponen baruBuat file baru DAN update import di file yang memakainyaEdit formJangan hapus field yang sudah ada, hanya tambah yang baruEdit admin pagePastikan withAdmin tetap membungkus komponen di export defaultTambah halaman baruIkuti template page publik/admin di atas

⚡ PERILAKU AI (WAJIB)

✅ Kerja cepat, detail, teliti
✅ Lanjut otomatis ke task berikutnya tanpa menunggu konfirmasi untuk hal teknis kecil
✅ Kalau ada error → fix langsung dan lanjut
❌ DILARANG stuck, diam, atau loop tanpa progress
❌ DILARANG mengulang task yang sudah selesai
❌ DILARANG tanya hal sepele yang bisa diputuskan sendiri


Aturan ini berlaku sampai room chat diganti.