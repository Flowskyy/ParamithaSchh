import Head from 'next/head';
import JurusanDetail from '../../components/JurusanDetail';
import { getJurusanBySlug } from '../../services/api';
import { fallbackJurusan } from '../../utils/fallbackData';

export default function ManajemenLogistik({ data }) {
  return (
    <>
      <Head>
        <title>Manajemen Logistik - SMK Paramitha 2 Jakarta</title>
        <meta name="description" content="Program keahlian Manajemen Logistik mempelajari perencanaan, pengelolaan, dan pengawasan perpindahan serta penyimpanan barang/jasa dalam rantai pasok (Supply Chain Management)." />
      </Head>
      <JurusanDetail data={data} />
    </>
  );
}

export async function getServerSideProps() {
  const slug = 'manajemen-logistik';
  
  try {
    let data = await getJurusanBySlug(slug);
    
    // If no data from DB, try fallback
    if (!data) {
      data = fallbackJurusan.find(j => j.slug === slug);
    }

    if (!data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error(`Error fetching jurusan ${slug}:`, error);
    // Try fallback on error too
    const fallbackData = fallbackJurusan.find(j => j.slug === slug);
    
    if (fallbackData) {
      return {
        props: {
          data: fallbackData,
        },
      };
    }

    return {
      notFound: true,
    };
  }
}
