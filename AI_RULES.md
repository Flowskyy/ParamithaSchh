# AI_RULES.md — Baca ini sebelum edit apapun

## STACK
- Next.js 14 **Pages Router** (BUKAN App Router)
- TIDAK ada folder `app/`
- TIDAK pakai `'use client'` directive
- Semua halaman ada di `pages/`
- Styling: Tailwind CSS
- Animasi: Framer Motion
- Database: Supabase
- Font: Plus Jakarta Sans (via globals.css)

---

## STRUKTUR FOLDER (JANGAN DIUBAH)
```
pages/
  _app.js
  _document.js
  index.js
  contact.js
  tentang/
    fasilitas.js
    visi-misi.js
    galeri.js
    sejarah.js
    motto-mars.js
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
  supabase.js
  api.js

utils/
  toast.js
  withAdmin.js
  fallbackData.js
  cacheImage.js

styles/
  globals.css
```

---

## ATURAN WAJIB SAAT EDIT

1. **Berikan FULL FILE** dari baris pertama sampai terakhir
2. **DILARANG** tulis `// ...existing code` atau `// ...rest of component`
3. **DILARANG** hapus import yang sudah ada
4. **DILARANG** hapus `getServerSideProps` yang sudah ada
5. **DILARANG** tambah dependency baru tanpa bilang dulu
6. **DILARANG** ubah file lain selain yang diminta
7. Setiap page **wajib** punya `export default function`
8. Setiap page publik **wajib** punya `getServerSideProps` yang return `sekolahInfo`

---

## IMPORT YANG BENAR (JANGAN DIUBAH)

```js
// Toast → selalu pakai utils/toast.js
import { toastSuccess, toastError, toastLoading, toastDismiss } from '../utils/toast'

// Supabase client
import supabase from '../services/supabase'

// API helpers
import { getJurusan, createJurusan, ... } from '../services/api'

// Fallback data
import { fallbackJurusan, fallbackSekolahInfo, ... } from '../utils/fallbackData'

// Komponen
import { SectionWrapper, SectionHeader, StaggerContainer, StaggerItem } from '../components/Section'
import { InlineLoader, CardSkeleton } from '../components/Loader'
import SmartImage from '../components/SmartImage'

// Admin protection
import withAdmin from '../utils/withAdmin'
```

---

## TEMPLATE getServerSideProps (WAJIB ADA DI SEMUA PAGE PUBLIK)

```js
export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo()
    return { props: { sekolahInfo: sekolahInfo || null } }
  } catch {
    return { props: { sekolahInfo: null } }
  }
}
```

---

## TEMPLATE PAGE PUBLIK

```jsx
import Head from 'next/head'
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
```

---

## TEMPLATE PAGE ADMIN

```jsx
import Head from 'next/head'
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
// TIDAK ADA getServerSideProps di admin page
```

---

## DESIGN SYSTEM (JANGAN DIUBAH)

```
Background:  #080810
Surface:     #0f0f1a
Card:        #151525
Primary:     #4F8EF7
Accent:      #F97316
Text:        #F0F0F8
Muted:       #7070A0
Border:      rgba(255,255,255,0.07)
```

```css
/* Class yang sudah ada di globals.css — tinggal pakai */
.glass          → frosted glass effect
.glass-dark     → navbar glass
.gradient-text  → gradient blue-orange
.mesh-bg        → hero background
.btn-primary    → tombol biru
.btn-ghost      → tombol transparan
.card-hover     → hover lift effect
.skeleton       → loading shimmer
.input-field    → form input styling
.noise          → grain overlay (di Layout)
```

---

## ERROR YANG SERING TERJADI & CARA HINDARI

| Situasi | Yang HARUS dilakukan AI |
|---|---|
| Tambah state baru | Taruh `useState` di level atas komponen, bukan di dalam kondisi |
| Tambah fetch data | Gunakan `useEffect` + try/catch + finally untuk set loading false |
| Tambah komponen baru | Buat file baru DAN update import di file yang memakainya |
| Edit form | Jangan hapus field form yang sudah ada, hanya tambah yang baru |
| Edit admin page | Pastikan `withAdmin` tetap membungkus komponen di `export default` |
| Tambah halaman baru | Ikuti template page publik/admin di atas |

jangan sampai anda ngestuck, ngeglitch, diam, terus berkerja jgn smpai loop dll. dan pastikan kerja cepat, detail, teliti, jgn ada error atau salah. ini berlaku sampai sy ganti room chat
