const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  console.log('Verifying Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Try to fetch data from 'jurusan' table (public read access)
    const { data, error } = await supabase.from('jurusan').select('*').limit(5);
    
    if (error) {
      console.error('Connection failed:', error.message);
      console.error('Details:', error);
    } else {
      console.log('Connection successful!');
      if (data) {
        console.log(`Found ${data.length} rows in 'jurusan' table.`);
        if (data.length > 0) {
          console.log('First row:', data[0]);
        } else {
          console.log('Table is empty.');
        }
      } else {
        console.log('Data is null.');
      }
    }

    // Check storage buckets
    console.log('\nChecking storage buckets...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Failed to list buckets:', bucketError.message);
    } else {
      if (buckets) {
        console.log('Buckets found:', buckets.map(b => b.name).join(', ') || 'None');
        const imagesBucket = buckets.find(b => b.name === 'images');
        if (imagesBucket) {
          console.log("Bucket 'images' exists.");
        } else {
          console.log("Bucket 'images' DOES NOT exist. You need to create it.");
        }
      } else {
        console.log('Buckets list is null.');
      }
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

verifyConnection();
