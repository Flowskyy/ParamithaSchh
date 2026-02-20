import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../services/supabase';
import { toastSuccess } from '../utils/toast';

export default function RealtimeReloader() {
  const router = useRouter();

  useEffect(() => {
    // Prevent multiple subscriptions
    const channel = supabase
      .channel('global-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload) => {
          console.log('Database change detected:', payload);
          
          // Filter out changes that don't need a refresh (optional)
          // Exclude 'pendaftar' table so new registrations don't refresh everyone's page
          if (payload.table === 'pendaftar') {
            return;
          }

          // Don't refresh if we are on an admin page (to prevent losing form state)
          if (router.pathname.startsWith('/admin')) {
            return;
          }

          // For now, refresh on any other public schema change to be safe and responsive
          
          // Use replace to refresh data fetched via getServerSideProps
          // scroll: false prevents jumping to top
          router.replace(router.asPath, undefined, { scroll: false });
          
          // Also force a hard reload for client-side fetches (like Navbar) if needed
          // Or we can dispatch a custom event
          window.dispatchEvent(new Event('db-change'));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
