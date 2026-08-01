import { useState, useEffect, useCallback } from 'react';
import { PassportStamp, GalleryId } from '../types';
import { storage } from '../lib/storage';

export function usePassport() {
  const [stamps, setStamps] = useState<PassportStamp[]>(() => storage.getPassport());

  useEffect(() => {
    storage.savePassport(stamps);
  }, [stamps]);

  const addStamp = useCallback((galleryId: GalleryId, galleryName: string, iconName = 'Compass') => {
    setStamps((prev) => {
      if (prev.some((s) => s.galleryId === galleryId)) return prev;
      const newStamp: PassportStamp = {
        galleryId,
        galleryName,
        iconName,
        stampedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      return [...prev, newStamp];
    });
  }, []);

  return {
    stamps,
    addStamp,
    visitedCount: stamps.length,
  };
}
