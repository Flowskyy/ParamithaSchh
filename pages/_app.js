import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import PageLoader from '../components/PageLoader';
import RealtimeReloader from '../components/RealtimeReloader';
import '../styles/globals.css';

// Note: NProgress removed in favor of PageLoader overlay

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url, { shallow }) => {
      if (!shallow) {
        setLoading(true);
      }
    };
    const handleStop = () => {
      // Add a small delay to prevent flickering on fast loads
      setTimeout(() => setLoading(false), 500);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>SMK Paramitha 2 Jakarta</title>
        <link rel="icon" href="/favicon.jpg" />
        <meta name="description" content="SMK Paramitha 2 Jakarta - Vocational School" />
      </Head>
      
      {loading && <PageLoader />}
      
      <RealtimeReloader />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}

export default MyApp;
