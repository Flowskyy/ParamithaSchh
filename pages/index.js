import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { getSekolahInfo, getAlumni, getMitra, getJurusan, getHomepageSections } from '../services/api';
import { fallbackHomepageSections } from '../utils/fallbackData';

// Dynamic Imports for Sections with Loading States
const HeroSection = dynamic(() => import('../components/home/HeroSection'), { 
  ssr: true,
  loading: () => <div className="h-screen bg-slate-900 animate-pulse" />
});
const SambutanSection = dynamic(() => import('../components/home/SambutanSection'), { 
  ssr: true,
  loading: () => <div className="h-96 bg-slate-100 animate-pulse" />
});
const HomeJurusan = dynamic(() => import('../components/HomeJurusan'), { 
  ssr: true,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />
});

// These sections are further down, we can disable SSR to reduce initial HTML size
const TeachingFactorySection = dynamic(() => import('../components/home/TeachingFactorySection'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-slate-100 animate-pulse" />
});
const AlumniSection = dynamic(() => import('../components/home/AlumniSection'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />
});
const MitraSection = dynamic(() => import('../components/home/MitraSection'), { 
  ssr: false,
  loading: () => <div className="h-48 bg-white animate-pulse" />
});

export default function Home({ sekolahInfo, alumniList, mitraList, jurusanList, sectionsOrder }) {
  // Safe extraction with fallbacks to avoid crashes if data is null/undefined
  const info = sekolahInfo || {};
  const alumni = Array.isArray(alumniList) ? alumniList : [];
  const mitra = Array.isArray(mitraList) ? mitraList : [];
  const jurusan = Array.isArray(jurusanList)
    ? jurusanList.filter((item) => item?.aktif !== false)
    : [];
  
  // Ensure sections is always an array
  const sections = Array.isArray(sectionsOrder) && sectionsOrder.length > 0
    ? sectionsOrder 
    : (Array.isArray(fallbackHomepageSections) ? fallbackHomepageSections : []);

  // Wrap section rendering in try-catch to prevent whole page crash
  const renderSection = (section) => {
    if (!section || !section.id) return null;
    
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
    <Layout 
      title="SMK Paramitha 2 Jakarta — Sekolah Pusat Keunggulan & Masa Depan Dimulai Di Sini"
      description="Website resmi SMK Paramitha 2 Jakarta. Sekolah Pusat Keunggulan dengan jurusan RPL, DKV, Kuliner, Perhotelan, dan ULW. Daftar PPDB sekarang!"
      keywords="SMK Paramitha 2 Jakarta, PPDB SMK 2026, SMK Pusat Keunggulan, Jurusan RPL, Jurusan DKV, Jurusan Perhotelan"
    >
      <div className="flex flex-col" data-section="home/root" aria-label="Homepage Root">
        {sections.length > 0 ? (
          sections
            .filter(section => section && section.is_active !== false)
            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
            .map(section => {
              const content = renderSection(section);
              if (!content) return null;
              return (
                <div 
                  key={section.id} 
                  className="w-full"
                  data-section={`home/${section.id}`}
                  aria-label={`Homepage Section: ${section.id}`}
                >
                  {content}
                </div>
              );
            })
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-500">Memuat konten...</p>
          </div>
        )}
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
