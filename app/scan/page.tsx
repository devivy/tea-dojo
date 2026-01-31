'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store-context';

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setStore } = useStore();

  useEffect(() => {
    const storeParam = searchParams.get('store');
    
    if (storeParam) {
      // Map store IDs to names (in production, fetch from API)
      const storeNames: Record<string, string> = {
        'store-orchard': 'Tea Dojo Orchard',
        'store-marina': 'Tea Dojo Marina Bay',
      };

      const storeName = storeNames[storeParam] || 'Tea Dojo';
      setStore(storeParam, storeName);
      
      // Redirect to menu after setting store
      router.push('/menu');
    }
  }, [searchParams, setStore, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-900 mx-auto mb-4"></div>
        <p className="text-lg text-amber-900">Setting up your store...</p>
      </div>
    </div>
  );
}
