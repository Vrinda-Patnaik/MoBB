import { EmotionalBug, Artifact, PassportStamp, Achievement } from '../types';
import { INITIAL_BUGS, INITIAL_ARTIFACTS, INITIAL_ACHIEVEMENTS } from './museumStore';

const STORAGE_VERSION = 'v2';
const VERSION_KEY = 'museumos_storage_version';

const KEYS = {
  BUGS: `museumos_bugs_${STORAGE_VERSION}`,
  ARTIFACTS: `museumos_artifacts_${STORAGE_VERSION}`,
  PASSPORT: `museumos_passport_${STORAGE_VERSION}`,
  ACHIEVEMENTS: `museumos_achievements_${STORAGE_VERSION}`,
  STATS: `museumos_stats_${STORAGE_VERSION}`,
  SETTINGS: `museumos_settings_${STORAGE_VERSION}`,
  THEME: `museumos_theme_${STORAGE_VERSION}`,
};

// Legacy keys for migration
const LEGACY_KEYS = {
  BUGS: 'museumos_bugs_v1',
  ARTIFACTS: 'museumos_artifacts_v1',
  PASSPORT: 'museumos_passport_v1',
  ACHIEVEMENTS: 'museumos_achievements_v1',
  THEME: 'museumos_theme_v1',
};

export interface VisitorStats {
  totalVisits: number;
  lastVisit: string;
  candlesLit: number;
  emailsBuried: number;
  tabsOpened: number;
}

export interface MuseumSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  autoSave: boolean;
}

const DEFAULT_STATS: VisitorStats = {
  totalVisits: 1,
  lastVisit: new Date().toISOString(),
  candlesLit: 0,
  emailsBuried: 0,
  tabsOpened: 0,
};

const DEFAULT_SETTINGS: MuseumSettings = {
  soundEnabled: true,
  reducedMotion: false,
  autoSave: true,
};

// Auto migration helper
function runMigrations() {
  try {
    const currentVer = localStorage.getItem(VERSION_KEY);
    if (!currentVer) {
      // Migrate v1 data to v2
      for (const [key, legacyKey] of Object.entries(LEGACY_KEYS)) {
        const raw = localStorage.getItem(legacyKey);
        if (raw) {
          const newKey = KEYS[key as keyof typeof KEYS];
          if (newKey) localStorage.setItem(newKey, raw);
        }
      }
      localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
    }
  } catch (e) {
    console.warn('Storage migration failed or restricted:', e);
  }
}

// Run migration check once at load
runMigrations();

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage, resetting to default:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// Public Storage API
export const storage = {
  getBugs: (): EmotionalBug[] => safeGet(KEYS.BUGS, INITIAL_BUGS),
  saveBugs: (bugs: EmotionalBug[]): void => safeSet(KEYS.BUGS, bugs),

  getArtifacts: (): Artifact[] => safeGet(KEYS.ARTIFACTS, INITIAL_ARTIFACTS),
  saveArtifacts: (artifacts: Artifact[]): void => safeSet(KEYS.ARTIFACTS, artifacts),

  getPassport: (): PassportStamp[] => safeGet(KEYS.PASSPORT, []),
  savePassport: (passport: PassportStamp[]): void => safeSet(KEYS.PASSPORT, passport),

  getAchievements: (): Achievement[] => safeGet(KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
  saveAchievements: (achievements: Achievement[]): void => safeSet(KEYS.ACHIEVEMENTS, achievements),

  getStats: (): VisitorStats => safeGet(KEYS.STATS, DEFAULT_STATS),
  saveStats: (stats: VisitorStats): void => safeSet(KEYS.STATS, stats),

  getSettings: (): MuseumSettings => safeGet(KEYS.SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (settings: MuseumSettings): void => safeSet(KEYS.SETTINGS, settings),

  getTheme: (): string => safeGet(KEYS.THEME, 'dark'),
  saveTheme: (theme: string): void => safeSet(KEYS.THEME, theme),

  clearAll: (): void => {
    try {
      Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
      localStorage.removeItem(VERSION_KEY);
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  },
};
