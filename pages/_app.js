import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/globals.css';

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

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
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="SMK Paramitha 2 Jakarta - Vocational School" />
      </Head>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}

export default MyApp;
