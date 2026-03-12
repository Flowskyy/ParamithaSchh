import React from 'react';
import { getJurusanBySlug } from '../../services/api';
import JurusanDetail from '../../components/JurusanDetail';
import Layout from '../../components/Layout';

export async function getServerSideProps({ params }) {
  const { slug } = params;

  // 1. Try to fetch from API/Database
  let jurusan = await getJurusanBySlug(slug);

  // 2. If not found in DB, return 404
  if (!jurusan) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      jurusan,
    },
  };
}

export default function JurusanSlug({ jurusan }) {
  if (!jurusan) return null;

  return (
    <Layout 
      title={`Jurusan ${jurusan.name} — SMK Paramitha 2 Jakarta`}
      description={`Pelajari kompetensi keahlian ${jurusan.name} (${jurusan.singkatan}) di SMK Paramitha 2 Jakarta. Prospek karir cemerlang dan kurikulum industri.`}
      keywords={`Jurusan ${jurusan.name}, SMK Paramitha 2, Kompetensi ${jurusan.singkatan}, Prospek Karir ${jurusan.singkatan}`}
      ogImage={jurusan.image_url || "/images/logo.jpg"}
    >
      <JurusanDetail jurusan={jurusan} />
    </Layout>
  );
}
