import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ 
  children, 
  title = "SMK Paramitha 2 Jakarta — Sekolah Pusat Keunggulan Vokasi",
  description = "Website resmi SMK Paramitha 2 Jakarta (Sekolah Paramitha). Sekolah Menengah Kejuruan Pusat Keunggulan di Jakarta Timur dengan keahlian RPL, DKV, Kuliner, Perhotelan, dan ULW.",
  keywords = "SMK Paramitha, paramitha sekolah, sekolah paramitha, smk paramitha 2, smk paramitha jakarta, smk paramitha 2 jakarta, smk jakarta timur, ppdb smk paramitha, smk pariwisata paramitha, jurusan smk paramitha",
  ogImage = "/images/logo.jpg",
  ogType = "website",
  noindex = false,
  customJsonLd = null
}) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paramithasch.vercel.app';
  
  // Clean canonical path (remove query params & hash fragments)
  const cleanPath = (router?.asPath || '/').split('?')[0].split('#')[0];
  const canonicalUrl = `${siteUrl}${cleanPath === '/' ? '' : cleanPath}`;

  // Ensure absolute URL for social share images (required by Open Graph & Twitter)
  const fullOgImage = ogImage.startsWith('http') 
    ? ogImage 
    : `${siteUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

  const pageId = (router?.pathname || '/')
    .replace(/\//g, '-')
    .replace(/\[|\]/g, '')
    .replace(/^-+/, '') || 'home';

  // Dynamic Breadcrumb for Schema.org
  const pathSegments = cleanPath.split('/').filter(Boolean);
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": siteUrl
    }
  ];

  let accumulatedPath = '';
  pathSegments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    const formattedName = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

    breadcrumbItems.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": formattedName,
      "item": `${siteUrl}${accumulatedPath}`
    });
  });

  // Base Structured Data (Organization, WebSite & Breadcrumbs)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["School", "EducationalOrganization", "HighSchool"],
        "@id": `${siteUrl}/#organization`,
        "name": "SMK Paramitha 2 Jakarta",
        "alternateName": [
          "SMK Paramitha",
          "Paramitha Sekolah",
          "Sekolah Paramitha",
          "SMK Paramitha 2",
          "SMK Paramitha Jakarta",
          "Paramitha School",
          "SMK Paramitha 2 Jakarta Timur",
          "SMK Pariwisata Paramitha"
        ],
        "url": siteUrl,
        "logo": `${siteUrl}/images/logo.jpg`,
        "image": `${siteUrl}/images/logo.jpg`,
        "telephone": "(021) 12345678",
        "email": "info@paramitha2.sch.id",
        "keywords": "SMK Paramitha, Paramitha Sekolah, Sekolah Paramitha, SMK Paramitha 2, SMK Paramitha Jakarta, SMK Jakarta Timur",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Raya Jakarta No. 123",
          "addressLocality": "Jakarta Timur",
          "addressRegion": "DKI Jakarta",
          "postalCode": "13420",
          "addressCountry": "ID"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -6.225,
          "longitude": 106.900
        },
        "sameAs": [
          "https://www.instagram.com/smkparamithajakartaofficial/"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Program Keahlian SMK Paramitha 2",
          "itemListElement": [
            { "@type": "Course", "name": "Rekayasa Perangkat Lunak (RPL)" },
            { "@type": "Course", "name": "Desain Komunikasi Visual (DKV)" },
            { "@type": "Course", "name": "Kuliner" },
            { "@type": "Course", "name": "Perhotelan" },
            { "@type": "Course", "name": "Usaha Layanan Wisata (ULW)" },
            { "@type": "Course", "name": "Manajemen Logistik" }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "SMK Paramitha 2 Jakarta",
        "alternateName": ["SMK Paramitha", "Paramitha Sekolah"],
        "description": "Website resmi SMK Paramitha 2 Jakarta (Sekolah Paramitha) — Sekolah Menengah Kejuruan Pusat Keunggulan",
        "publisher": { "@id": `${siteUrl}/#organization` },
        "inLanguage": "id-ID"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}/#breadcrumb`,
        "itemListElement": breadcrumbItems
      },
      ...(customJsonLd ? (Array.isArray(customJsonLd) ? customJsonLd : [customJsonLd]) : [])
    ]
  };

  return (
    <>
      <Head>
        {/* Core Search Engine Metadata */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="SMK Paramitha 2 Jakarta" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpg" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Indexing Directives */}
        <meta 
          name="robots" 
          content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} 
        />
        <meta 
          name="googlebot" 
          content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} 
        />

        {/* Local SEO / Geo Targeting */}
        <meta name="geo.region" content="ID-JK" />
        <meta name="geo.placename" content="Jakarta Timur" />
        <meta name="geo.position" content="-6.225;106.900" />
        <meta name="ICBM" content="-6.225, 106.900" />

        {/* Mobile & App Theme */}
        <meta name="theme-color" content="#1E1E8F" />
        <meta name="apple-mobile-web-app-title" content="SMK Paramitha" />

        {/* Open Graph / Facebook & WhatsApp Preview */}
        <meta property="og:locale" content="id_ID" />
        <meta property="og:site_name" content="SMK Paramitha 2 Jakarta" />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
