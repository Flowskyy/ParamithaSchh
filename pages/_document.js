import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta name="google-site-verification" content="AHtwTHmJ4Mpabtu-3j8XH9Hh8QY7bnrFMDmhYwEs6HQ" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Belleza&display=swap" rel="stylesheet" />
      </Head>

      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-primary-500 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}