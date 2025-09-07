import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing Supabase connection...');
        console.log('🔍 Testing Supabase connection...');

        // Test basic connection by trying to fetch from experiences table
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .limit(1);

        if (error) {
          throw error;
        }

        console.log('✅ Supabase connection successful!');
        console.log('📊 Response:', data);
        setStatus('✅ Supabase connection successful!');
      } catch (err) {
        console.error('❌ Supabase connection failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('❌ Supabase connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      <div className="space-y-2">
        <p><strong>Status:</strong> {status}</p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600"><strong>Error:</strong> {error}</p>
          </div>
        )}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600">
            <strong>Debug Info:</strong> Check browser console for detailed logs
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
