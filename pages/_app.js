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

  return (
    <>
      <Head>
        <title>SMK Paramitha 2 Jakarta</title>
        <link rel="icon" href="/favicon.jpg" />
        <meta name="description" content="SMK Paramitha 2 Jakarta - Vocational School" />
      </Head>
      
      {/* <RealtimeReloader /> */}
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}

export default MyApp;
