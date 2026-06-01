import { useCallback, useEffect, useMemo, useState } from 'react';
import { countBikesByProvince, filterBikesByProvince } from '../lib/bikeProvince';
import { detectProvinceFromDeviceLocation } from '../lib/clientLocation';
import { getClientProvince, setClientProvince } from '../lib/storage';
import { normalizeProvince, type SriLankaProvince } from '../lib/sriLankaProvinces';
import type { BikeSummary } from '../types/bike';

export function useClientProvinceFilter(bikes: BikeSummary[]) {
  const [selectedProvince, setSelectedProvinceState] = useState<SriLankaProvince | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await getClientProvince();
      if (!cancelled && stored) {
        setSelectedProvinceState(normalizeProvince(stored));
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setSelectedProvince = useCallback((province: SriLankaProvince | null) => {
    setSelectedProvinceState(province);
    void setClientProvince(province);
  }, []);

  const provinceCounts = useMemo(() => countBikesByProvince(bikes), [bikes]);

  const filteredBikes = useMemo(
    () => filterBikesByProvince(bikes, selectedProvince),
    [bikes, selectedProvince],
  );

  const detectFromGps = useCallback(async () => {
    setLocating(true);
    try {
      const province = await detectProvinceFromDeviceLocation();
      if (province) setSelectedProvince(province);
    } finally {
      setLocating(false);
    }
  }, [setSelectedProvince]);

  return {
    selectedProvince,
    setSelectedProvince,
    provinceCounts,
    filteredBikes,
    detectFromGps,
    locating,
    hydrated,
  };
}
