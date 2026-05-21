'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { loadFromStorage } from '@/store/slices/authSlice';

function StorageLoader() {
  useEffect(() => {
    store.dispatch(loadFromStorage());
  }, []);
  return null;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StorageLoader />
      {children}
    </Provider>
  );
}
