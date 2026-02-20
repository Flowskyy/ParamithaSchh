import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function TestConnection() {
  const [results, setResults] = useState({
    db: { status: 'pending', message: 'Testing...' },
    storage: { status: 'pending', message: 'Testing...' },
    buckets: []
  });

  useEffect(() => {
    async function runTests() {
      // Test DB Connection
      try {
        const { data, error } = await supabase.from('sekolah_info').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setResults(prev => ({ ...prev, db: { status: 'success', message: 'Connected to DB successfully' } }));
      } catch (err) {
        setResults(prev => ({ ...prev, db: { status: 'error', message: err.message } }));
      }

      // Test Storage Connection
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) throw error;
        
        setResults(prev => ({ 
          ...prev, 
          storage: { status: 'success', message: `Found ${buckets.length} buckets` },
          buckets: buckets.map(b => b.name)
        }));
      } catch (err) {
        setResults(prev => ({ ...prev, storage: { status: 'error', message: err.message } }));
      }
    }

    runTests();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">System Connection Diagnostics</h1>
      
      <div className="space-y-6">
        <div className={`p-4 rounded-lg border ${results.db.status === 'success' ? 'bg-green-50 border-green-200' : results.db.status === 'error' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <h2 className="font-bold mb-2">Database Connection</h2>
          <p>{results.db.message}</p>
        </div>

        <div className={`p-4 rounded-lg border ${results.storage.status === 'success' ? 'bg-green-50 border-green-200' : results.storage.status === 'error' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <h2 className="font-bold mb-2">Storage Connection</h2>
          <p>{results.storage.message}</p>
          
          {results.buckets.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2">Available Buckets:</h3>
              <ul className="list-disc pl-5">
                {results.buckets.map(b => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}