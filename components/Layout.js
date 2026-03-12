import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ 
  children, 
  title = "SMK Paramitha 2 Jakarta",
  description = "SMK Paramitha 2 Jakarta - Sekolah Pusat Keunggulan dengan kurikulum berbasis industri dan fasilitas modern.",
  keywords = "SMK Paramitha 2, SMK Jakarta Timur, Sekolah Keunggulan, SMK Pariwisata, SMK Teknologi",
  ogImage = "/images/logo.jpg",
  ogType = "website"
}) {
  const router = useRouter();
  const canonicalUrl = `https://paramitha2.sch.id${router.asPath}`; // Ganti dengan domain asli jika sudah ada

  const pageId = (router?.pathname || '/')
    .replace(/\//g, '-')
    .replace(/\[|\]/g, '')
    .replace(/^-+/, '') || 'home';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpg" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-white flex flex-col" data-section="layout/root" aria-label="Public Layout Root">
        <Navbar />
        
        <main className="flex-grow" data-section="layout/main" aria-label="Public Layout Main" data-page={pageId}>
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}
