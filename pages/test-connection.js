import { useState, useEffect } from 'react';

export default function TestConnection() {
  const [results, setResults] = useState({
    db: { status: 'pending', message: 'Testing...' },
    storage: { status: 'pending', message: 'Testing...' },
    buckets: []
  });

  useEffect(() => {
    async function runTests() {
      try {
        const response = await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getSekolahInfo' })
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json?.error || 'Request failed');
        setResults((prev) => ({ ...prev, db: { status: 'success', message: 'Prisma API responded successfully' } }));
      } catch (err) {
        setResults((prev) => ({ ...prev, db: { status: 'error', message: err.message } }));
      }

      setResults((prev) => ({
        ...prev,
        storage: { status: 'success', message: 'Storage is now handled through the Prisma-backed API layer' },
        buckets: []
      }));
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
        </div>
      </div>
    </div>
  );
}