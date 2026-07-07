import React from 'react';
import { getJurusanBySlug } from '../../services/api';
import Layout from '../../components/Layout';
import FormattedDescription from '../../components/FormattedDescription';
import Image from 'next/image';

export async function getServerSideProps({ params }) {
  const { slug } = params;

  // 1. Try to fetch from API/Database
  let jurusan = await getJurusanBySlug(slug);

  // Debug log
  console.log('=== DEBUG [slug].js ===');
  console.log('Slug:', slug);
  console.log('Jurusan data:', jurusan);
  console.log('Articles:', jurusan?.articles);
  console.log('Articles type:', typeof jurusan?.articles);
  console.log('Articles length:', Array.isArray(jurusan?.articles) ? jurusan.articles.length : 'not array');

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

  // If jurusan is not active, show unavailable message
  if (jurusan.aktif === false) {
    return (
      <Layout 
        title={`Jurusan ${jurusan.name} — SMK Paramitha 2 Jakarta`}
        description={`Jurusan ${jurusan.name} saat ini tidak tersedia.`}
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Jurusan Tidak Tersedia</h1>
            <p className="text-gray-600 mb-8">
              Mohon maaf, jurusan {jurusan.name} saat ini belum tersedia untuk pendaftaran baru.
            </p>
            <a 
              href="/jurusan" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Lihat Jurusan Lain
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  const { name, content, deskripsi, gallery = [], apa_yang_dipelajari, peluang_karir, articles } = jurusan;
  
  // Ensure articles is always an array
  const safeArticles = Array.isArray(articles) ? articles : [];
  
  // Debug: log articles data
  console.log('Articles data:', articles);
  console.log('Safe articles:', safeArticles);
  console.log('Articles length:', safeArticles.length);

  return (
    <Layout 
      title={`Jurusan ${name} — SMK Paramitha 2 Jakarta`}
      description={`Pelajari kompetensi keahlian ${name} di SMK Paramitha 2 Jakarta.`}
      ogImage={jurusan.image_url || "/images/logo.jpg"}
    >
      <article className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">{name}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {deskripsi ? (
              <FormattedDescription text={deskripsi} className="leading-relaxed" />
            ) : content ? (
              <div 
                className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap"
              >
                {content}
              </div>
            ) : (
              <p className="text-slate-400 italic">Konten belum tersedia</p>
            )}

            {gallery && gallery.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Foto Kegiatan</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src={imgUrl}
                        alt={`Foto kegiatan ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {safeArticles && safeArticles.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Artikel</h2>
                <div className="space-y-4">
                  {safeArticles.map((article, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{article.title}</h3>
                      <FormattedDescription text={article.description} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            {apa_yang_dipelajari && apa_yang_dipelajari.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Apa yang Dipelajari</h3>
                <div className="space-y-3">
                  {apa_yang_dipelajari.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-1">{card.title}</h4>
                      <FormattedDescription text={card.description} textClassName="text-sm text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {peluang_karir && peluang_karir.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Peluang Karir</h3>
                <div className="space-y-3">
                  {peluang_karir.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-1">{card.title}</h4>
                      <FormattedDescription text={card.description} textClassName="text-sm text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
}
