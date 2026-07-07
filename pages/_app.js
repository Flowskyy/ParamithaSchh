import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import PageLoader from '../components/PageLoader';
import '../styles/globals.css';

// Note: NProgress removed in favor of PageLoader overlay

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Track visitor on page load (except admin pages)
    if (typeof window !== 'undefined' && !router.pathname.startsWith('/admin')) {
      const trackVisitor = async () => {
        try {
          const deviceType = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 
                           /Tablet/i.test(navigator.userAgent) ? 'tablet' : 'desktop';
          
          const visitorData = {
            device_type: deviceType,
            page_url: router.pathname,
            user_agent: navigator.userAgent,
            ip_address: null, // IP will be captured server-side if needed
            referrer: document.referrer || null
          };

          await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logVisitor', visitor: visitorData })
          });
        } catch (error) {
          console.error('Visitor tracking error:', error);
        }
      };

      trackVisitor();
    }
  }, [router.pathname]);

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
