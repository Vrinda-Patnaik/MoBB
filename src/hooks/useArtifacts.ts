import { useState, useEffect, useCallback } from 'react';
import { Artifact } from '../types';
import { storage } from '../lib/storage';

export function useArtifacts() {
  const [artifacts, setArtifacts] = useState<Artifact[]>(() => storage.getArtifacts());

  useEffect(() => {
    storage.saveArtifacts(artifacts);
  }, [artifacts]);

  const addArtifact = useCallback((newArtifact: Artifact) => {
    setArtifacts((prev) => [newArtifact, ...prev]);
  }, []);

  const deleteArtifact = useCallback((id: string) => {
    setArtifacts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    artifacts,
    addArtifact,
    deleteArtifact,
    setArtifacts,
  };
}
