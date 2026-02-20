import React from 'react';
import { getJurusanBySlug } from '../../services/api';
import JurusanDetail from '../../components/JurusanDetail';

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
  return <JurusanDetail jurusan={jurusan} />;
}
