import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, title = "SMK Paramitha 2 Jakarta" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="SMK Paramitha 2 Jakarta - Vocational School" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-white flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}
