import Head from 'next/head'
import Layout from '../../components/Layout'
import JurusanDetail from '../../components/JurusanDetail'
import { getJurusanBySlug, getSekolahInfo } from '../../services/api'
import { fallbackJurusan, fallbackSekolahInfo } from '../../utils/fallbackData'

export default function Page({ jurusan, sekolahInfo }) {
  const finalJurusan = jurusan || fallbackJurusan.find(j => j.slug === 'ulw');
  
  return (
    <Layout 
      sekolahInfo={sekolahInfo || fallbackSekolahInfo}
      title={`${finalJurusan?.name || 'ULW'} — SMK Paramitha 2 Jakarta`}
      description={`Pelajari kompetensi keahlian ${finalJurusan?.name} (Usaha Layanan Wisata) di SMK Paramitha 2 Jakarta. Jelajahi dunia pariwisata profesional.`}
      keywords={`ULW SMK Paramitha 2, Jurusan Pariwisata Jakarta, Usaha Layanan Wisata`}
      ogImage={finalJurusan?.image_url}
    >
      <JurusanDetail jurusan={finalJurusan} sekolahInfo={sekolahInfo} />
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const [jurusan, sekolahInfo] = await Promise.all([
      getJurusanBySlug('ulw'),
      getSekolahInfo()
    ])
    return { props: {
      jurusan: jurusan || fallbackJurusan.find(j => j.slug === 'ulw') || null,
      sekolahInfo: sekolahInfo || null
    }}
  } catch {
    return { props: {
      jurusan: fallbackJurusan.find(j => j.slug === 'ulw') || null,
      sekolahInfo: null
    }}
  }
}
