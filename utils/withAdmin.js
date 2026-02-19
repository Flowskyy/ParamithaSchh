import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../services/supabase';
import Loader from '../components/Loader';

const withAdmin = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace('/admin');
        } else {
          setAuthenticated(true);
        }
        setLoading(false);
      };

      checkSession();
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <Loader />
        </div>
      );
    }

    if (!authenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdmin;
