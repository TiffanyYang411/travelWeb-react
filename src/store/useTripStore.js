// useTripStore.js
import { useContext } from 'react';
import { TripContext } from './TripStore';

export function useTripStore() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripStore 必須在 TripProvider 內使用');
  }
  return context;
}
