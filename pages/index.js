import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { getSekolahInfo, getAlumni, getMitra, getJurusan, getHomepageSections } from '../services/api';
import { fallbackHomepageSections } from '../utils/fallbackData';

// Dynamic Imports for Sections
const HeroSection = dynamic(() => import('../components/home/HeroSection'), { ssr: true });
const SambutanSection = dynamic(() => import('../components/home/SambutanSection'), { ssr: true });
const TeachingFactorySection = dynamic(() => import('../components/home/TeachingFactorySection'), { ssr: true });
const AlumniSection = dynamic(() => import('../components/home/AlumniSection'), { ssr: true });
const MitraSection = dynamic(() => import('../components/home/MitraSection'), { ssr: true });
const HomeJurusan = dynamic(() => import('../components/HomeJurusan'), { ssr: true });

export default function Home({ sekolahInfo, alumniList, mitraList, jurusanList, sectionsOrder }) {
  const info = sekolahInfo || {};
  const alumni = alumniList || [];
  const mitra = mitraList || [];
  const jurusan = jurusanList || [];
  
  // Use fallback if sectionsOrder is null, undefined, or empty array
  const sections = (Array.isArray(sectionsOrder) && sectionsOrder.length > 0) 
    ? sectionsOrder 
    : fallbackHomepageSections;

  // We move component mapping here to avoid creating all elements at once
  const renderSection = (section) => {
    try {
      switch (section.id) {
        case 'hero':
          return <HeroSection info={info} />;
        case 'sambutan':
          return <SambutanSection info={info} />;
        case 'jurusan':
          return <HomeJurusan jurusanList={jurusan} />;
        case 'teaching_factory':
          return <TeachingFactorySection />;
        case 'alumni':
          return <AlumniSection alumni={alumni} />;
        case 'mitra':
          return <MitraSection mitra={mitra} />;
        default:
          return null;
      }
    } catch (err) {
      console.error(`Error rendering section ${section.id}:`, err);
      return null;
    }
  };

  return (
    <Layout>
      <Head>
        <title>SMK Paramitha 2 Jakarta — Masa Depan Dimulai Di Sini</title>
        <meta name="description" content="SMK Paramitha 2 Jakarta - Sekolah Pusat Keunggulan dengan fasilitas modern dan kurikulum berbasis industri." />
      </Head>

      <div className="flex flex-col">
        {sections
          .filter(section => section && section.is_active !== false)
          .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
          .map(section => {
            const content = renderSection(section);
            if (!content) return null;
            return <div key={section.id}>{content}</div>;
          })
        }
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [sekolahInfo, alumniList, mitraList, jurusanList, sectionsOrder] = await Promise.all([
      getSekolahInfo(),
      getAlumni(),
      getMitra(),
      getJurusan(),
      getHomepageSections(),
    ]);

    return { 
      props: { 
        sekolahInfo: sekolahInfo || null,
        alumniList: alumniList || [],
        mitraList: mitraList || [],
        jurusanList: jurusanList || [],
        sectionsOrder: sectionsOrder || null,
      } 
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { 
      props: { 
        sekolahInfo: null,
        alumniList: [],
        mitraList: [],
        jurusanList: [],
        sectionsOrder: null,
      } 
    };
  }
}
