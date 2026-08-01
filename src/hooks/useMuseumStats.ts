import { useState, useEffect, useCallback } from 'react';
import { storage, VisitorStats } from '../lib/storage';

export function useMuseumStats() {
  const [stats, setStats] = useState<VisitorStats>(() => storage.getStats());

  useEffect(() => {
    storage.saveStats(stats);
  }, [stats]);

  const incrementCandles = useCallback(() => {
    setStats((prev) => ({ ...prev, candlesLit: prev.candlesLit + 1 }));
  }, []);

  const incrementEmailsBuried = useCallback(() => {
    setStats((prev) => ({ ...prev, emailsBuried: prev.emailsBuried + 1 }));
  }, []);

  const incrementTabsOpened = useCallback((count = 1) => {
    setStats((prev) => ({ ...prev, tabsOpened: prev.tabsOpened + count }));
  }, []);

  return {
    stats,
    incrementCandles,
    incrementEmailsBuried,
    incrementTabsOpened,
  };
}
