const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gdtdzafxgedriupuqxtq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdGR6YWZ4Z2Vkcml1cHVxeHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDI4NDQsImV4cCI6MjA4NjkxODg0NH0.EF3q4_9AEcOm_zpOyVEJWP3hKLwr2VxJbsvmCdYn0QY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
  console.log('Checking Storage Buckets...');
  
  const requiredBuckets = ['hero', 'jurusan', 'fasilitas', 'galeri', 'alumni', 'carousel', 'media', 'mitra', 'testimonial', 'images'];
  
  // 1. Try to list buckets (might fail for anon)
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.log('Error listing buckets (Expected for anon key):', listError.message);
  } else {
    console.log('Buckets found:', buckets.map(b => b.name));
  }

  // 2. Check each bucket individually
  for (const bucket of requiredBuckets) {
    console.log(`\nChecking bucket: ${bucket}`);
    
    // Try to list files
    const { data, error } = await supabase.storage.from(bucket).list(null, { limit: 1 });
    
    if (error) {
      console.log(`  ❌ Error listing files: ${error.message}`);
      if (error.message.includes('Bucket not found')) {
        console.log('     -> Bucket does not exist or is not public.');
      }
    } else {
      console.log('  ✅ Accessible (List successful)');
    }
    
    // Try to upload a dummy file (should fail for anon usually, unless policy allows)
    // We won't try upload to avoid clutter, just list is enough for read access.
  }
}

checkBuckets();
