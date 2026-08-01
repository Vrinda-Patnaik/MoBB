export type SeverityLevel = 'Mild' | 'Moderate' | 'Critical' | 'Nuclear';

export type BugStatus = 'Investigating' | 'Closed' | 'Preserved in Museum' | 'Ignored';

export type BugCategory = 'Productivity' | 'Social' | 'Focus' | 'Energy' | 'Code';

export interface EmotionalBug {
  id: string;
  bugCode: string; // e.g. BUG-042
  title: string;
  severity: SeverityLevel;
  status: BugStatus;
  category: BugCategory;
  description: string;
  timestamp: string;
  donatedToMuseum?: boolean;
}

export interface Artifact {
  id: string;
  artifactNumber: string; // e.g. ART-8042
  title: string;
  discoveryDate: string;
  classification: string;
  severity: SeverityLevel;
  recoveredFrom: string;
  curatorNotes: string;
  achievementUnlocked: string;
  stickerType?: 'laptop' | 'frog' | 'patience' | 'email' | 'social' | 'heart' | 'duck';
  timestamp: string;
}

export type GalleryId = 
  | 'home'
  | 'entrance'
  | 'patience'
  | 'focus'
  | 'burnout'
  | 'email'
  | 'recovery'
  | 'achievements'
  | 'tracker'
  | 'generator'
  | 'duck'
  | 'eastereggs';

export interface PassportStamp {
  galleryId: GalleryId;
  galleryName: string;
  iconName: string;
  stampedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  secret?: boolean;
}

export interface CuratorChatMessage {
  id: string;
  sender: 'user' | 'curator';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'fallback' | 'error-fallback';
}
