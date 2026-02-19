import { useRouter } from 'next/router';
import Head from 'next/head';
import JurusanDetail from '../../components/JurusanDetail';
import { getJurusanBySlug } from '../../services/api';
import { fallbackJurusan } from '../../utils/fallbackData';

export default function JurusanSlug({ data }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data jurusan...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Jurusan Tidak Ditemukan</h1>
          <p className="text-slate-600 mb-8">Maaf, jurusan yang Anda cari tidak tersedia atau telah dihapus.</p>
          <button 
            onClick={() => router.push('/jurusan')}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            Kembali ke Daftar Jurusan
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{data.title || data.name} - SMK Paramitha 2 Jakarta</title>
        <meta name="description" content={data.description || `Program keahlian ${data.title} di SMK Paramitha 2 Jakarta`} />
      </Head>
      <JurusanDetail data={data} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  
  try {
    let data = await getJurusanBySlug(slug);
    
    // Debugging: Log if data is empty
    if (!data) console.log(`DEBUG: Jurusan ${slug} data is empty from Supabase`);

    // If no data from DB, try fallback
    if (!data) {
      data = fallbackJurusan.find(j => j.slug === slug);
      if (data) console.log(`DEBUG: Using fallback data for Jurusan ${slug}`);
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
      console.log(`DEBUG: Using fallback data for Jurusan ${slug} due to error`);
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
