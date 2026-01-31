'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface StoreContextType {
  storeId: string | null;
  storeName: string | null;
  setStore: (id: string, name: string) => void;
  clearStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  useEffect(() => {
    const savedStoreId = localStorage.getItem('tea-dojo-store-id');
    const savedStoreName = localStorage.getItem('tea-dojo-store-name');
    if (savedStoreId && savedStoreName) {
      setStoreId(savedStoreId);
      setStoreName(savedStoreName);
    }
  }, []);

  const setStore = (id: string, name: string) => {
    setStoreId(id);
    setStoreName(name);
    localStorage.setItem('tea-dojo-store-id', id);
    localStorage.setItem('tea-dojo-store-name', name);
  };

  const clearStore = () => {
    setStoreId(null);
    setStoreName(null);
    localStorage.removeItem('tea-dojo-store-id');
    localStorage.removeItem('tea-dojo-store-name');
  };

  return (
    <StoreContext.Provider value={{ storeId, storeName, setStore, clearStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
