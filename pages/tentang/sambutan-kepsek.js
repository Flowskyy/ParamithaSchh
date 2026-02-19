import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Section from '../../components/Section';
import SmartImage from '../../components/SmartImage';
import { getSekolahInfo } from '../../services/api';

export default function SambutanKepsek() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSekolahInfo();
        if (data) setInfo(data);
      } catch (error) {
        console.error("Failed to fetch info:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout title="Sambutan Kepala Sekolah - SMK Paramitha 2">
      <Section className="pt-32 pb-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              
              {/* Photo Column */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200 rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100">
                    <SmartImage
                      src={info?.kepsek_photo || '/images/Kepsek.JPG'}
                      alt={info?.kepsek_name || 'Kepala Sekolah'}
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                      className="hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-slate-900">
                      {info?.kepsek_name || 'Dr. H. Ahmad Fauzi, M.Pd'}
                    </h3>
                    <p className="text-primary-600 font-medium text-sm">Kepala Sekolah</p>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full md:w-2/3">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 relative inline-block">
                  Sambutan Kepala Sekolah
                  <span className="absolute bottom-0 left-0 w-1/3 h-2 bg-primary-500 rounded-full"></span>
                </h1>
                
                <div className="prose prose-lg text-slate-600 leading-relaxed">
                  <p className="text-xl font-medium text-slate-800 mb-6 italic border-l-4 border-primary-500 pl-4 bg-primary-50 py-2 rounded-r-lg">
                    &quot;Assalamu&apos;alaikum Warahmatullahi Wabarakatuh.&quot;
                  </p>
                  
                  {info?.kepsek_message ? (
                    <div className="whitespace-pre-wrap">{info.kepsek_message}</div>
                  ) : (
                    <>
                      <p className="mb-4">
                        Puji syukur kita panjatkan ke hadirat Allah SWT atas segala limpahan rahmat dan karunia-Nya, sehingga kita masih diberi kesempatan untuk terus berkarya dan mengabdi di dunia pendidikan.
                      </p>
                      <p className="mb-4">
                        Selamat datang di website resmi SMK Paramitha 2 Jakarta. Website ini kami hadirkan sebagai media informasi dan komunikasi antara sekolah dengan masyarakat luas, khususnya orang tua siswa, alumni, dan dunia usaha/dunia industri.
                      </p>
                      <p className="mb-4">
                        SMK Paramitha 2 berkomitmen untuk mencetak lulusan yang tidak hanya kompeten dalam bidang keahliannya, tetapi juga memiliki karakter yang kuat, berakhlak mulia, dan siap bersaing di era global. Kami terus berupaya meningkatkan kualitas pembelajaran, fasilitas, dan kerjasama dengan industri untuk memastikan lulusan kami siap kerja.
                      </p>
                      <p className="mb-4">
                        Mari bergabung bersama kami untuk mewujudkan generasi masa depan yang unggul, kreatif, dan inovatif.
                      </p>
                      <p>
                        Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.
                      </p>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const sekolahInfo = await getSekolahInfo();
    
    if (!sekolahInfo) {
      console.log('DEBUG: Sekolah Info is empty from Supabase');
    }

    return { 
      props: { 
        sekolahInfo: sekolahInfo || null 
      } 
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    console.log('DEBUG: Error fetching sekolah info');
    return { 
      props: { 
        sekolahInfo: null 
      } 
    };
  }
}
