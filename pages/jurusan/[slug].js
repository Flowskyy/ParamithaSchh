import React from 'react';
import { getJurusanBySlug } from '../../services/api';
import { fallbackJurusan } from '../../utils/fallbackData';
import JurusanDetail from '../../components/JurusanDetail';

export async function getServerSideProps({ params }) {
  const { slug } = params;

  // 1. Try to fetch from API/Database
  let jurusan = await getJurusanBySlug(slug);

  // 2. If not found in DB, try fallback data
  if (!jurusan) {
    jurusan = fallbackJurusan.find((j) => j.slug === slug);
  }

  // 3. If still not found, return 404
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
  return <JurusanDetail jurusan={jurusan} />;
}
