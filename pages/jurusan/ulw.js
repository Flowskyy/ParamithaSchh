import Head from 'next/head'
import Layout from '../../components/Layout'
import JurusanDetail from '../../components/JurusanDetail'
import { getJurusanBySlug, getSekolahInfo } from '../../services/api'

export default function Page({ jurusan, sekolahInfo }) {
  const finalJurusan = jurusan;
  
  return (
    <Layout 
      sekolahInfo={sekolahInfo || {}}
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
      jurusan: jurusan || null,
      sekolahInfo: sekolahInfo || null
    }}
  } catch {
    return { props: {
      jurusan: null,
      sekolahInfo: null
    }}
  }
}
