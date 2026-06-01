import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { formatBikePrice } from '../lib/currency';
import {
  getCurrencyPreference,
  setCurrencyPreference,
  type CurrencyCode,
} from '../lib/storage';

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (next: CurrencyCode) => Promise<void>;
  formatPrice: (usd: number) => string;
  ready: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('LKR');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      const saved = await getCurrencyPreference();
      if (saved) setCurrencyState(saved);
      setReady(true);
    }
    void load();
  }, []);

  const setCurrency = useCallback(async (next: CurrencyCode) => {
    setCurrencyState(next);
    await setCurrencyPreference(next);
  }, []);

  const formatPrice = useCallback(
    (usd: number) => formatBikePrice(usd, currency),
    [currency],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      formatPrice,
      ready,
    }),
    [currency, setCurrency, formatPrice, ready],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return ctx;
}
