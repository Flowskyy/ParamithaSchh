import Head from 'next/head'
import Layout from '../../components/Layout'
import JurusanDetail from '../../components/JurusanDetail'
import { getJurusanBySlug, getSekolahInfo } from '../../services/api'
import { fallbackJurusan, fallbackSekolahInfo } from '../../utils/fallbackData'

export default function Page({ jurusan, sekolahInfo }) {
  const finalJurusan = jurusan || fallbackJurusan.find(j => j.slug === 'manajemen-logistik');
  
  return (
    <Layout 
      sekolahInfo={sekolahInfo || fallbackSekolahInfo}
      title={`${finalJurusan?.name || 'Manajemen Logistik'} — SMK Paramitha 2 Jakarta`}
      description={`Pelajari kompetensi keahlian ${finalJurusan?.name} di SMK Paramitha 2 Jakarta. Keahlian manajemen rantai pasok dan pergudangan modern.`}
      keywords={`Logistik SMK Paramitha 2, Jurusan Manajemen Logistik, SMK Jakarta Timur`}
      ogImage={finalJurusan?.image_url}
    >
      <JurusanDetail jurusan={finalJurusan} sekolahInfo={sekolahInfo} />
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const [jurusan, sekolahInfo] = await Promise.all([
      getJurusanBySlug('manajemen-logistik'),
      getSekolahInfo()
    ])
    return { props: {
      jurusan: jurusan || fallbackJurusan.find(j => j.slug === 'manajemen-logistik') || null,
      sekolahInfo: sekolahInfo || null
    }}
  } catch {
    return { props: {
      jurusan: fallbackJurusan.find(j => j.slug === 'manajemen-logistik') || null,
      sekolahInfo: null
    }}
  }
}
