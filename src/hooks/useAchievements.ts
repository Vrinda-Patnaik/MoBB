import { useState, useEffect, useCallback } from 'react';
import { Achievement } from '../types';
import { storage } from '../lib/storage';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.getAchievements());

  useEffect(() => {
    storage.saveAchievements(achievements);
  }, [achievements]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) =>
      prev.map((ach) =>
        ach.id === id && !ach.unlocked
          ? { ...ach, unlocked: true, unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : ach
      )
    );
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return {
    achievements,
    unlockAchievement,
    unlockedCount,
    totalCount: achievements.length,
  };
}
