import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function JurusanBaru() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main jurusan page with action=new
    router.replace('/admin/jurusan?action=new');
  }, [router]);

  return null; // Render nothing while redirecting
}
