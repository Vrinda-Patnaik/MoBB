import { EmotionalBug, Artifact, PassportStamp, Achievement } from '../types';
import { storage } from './storage';

export const INITIAL_BUGS: EmotionalBug[] = [
  {
    id: 'bug-042',
    bugCode: 'BUG-042',
    title: 'Sudden Loss of All Motivation',
    severity: 'Critical',
    status: 'Investigating',
    category: 'Energy',
    description: 'Occurs immediately after opening a 45-page research document or starting a large refactoring task.',
    timestamp: '2026-07-31 09:14 AM',
    donatedToMuseum: true,
  },
  {
    id: 'bug-101',
    bugCode: 'BUG-101',
    title: '84 Open Tabs Paralyzing Brain Engine',
    severity: 'Nuclear',
    status: 'Investigating',
    category: 'Focus',
    description: 'Refusal to close any browser tab out of irrational fear of losing an indispensable article from 2021.',
    timestamp: '2026-07-30 11:42 PM',
    donatedToMuseum: true,
  },
  {
    id: 'bug-204',
    bugCode: 'BUG-204',
    title: 'This Email Does Not Find Me Well',
    severity: 'Moderate',
    status: 'Closed',
    category: 'Social',
    description: 'Staring at a 3-sentence draft reply for 45 minutes trying to adjust exclamation mark density.',
    timestamp: '2026-07-29 02:15 PM',
    donatedToMuseum: false,
  },
  {
    id: 'bug-308',
    bugCode: 'BUG-308',
    title: 'Impulsive Refactoring at 2:00 AM',
    severity: 'Critical',
    status: 'Preserved in Museum',
    category: 'Code',
    description: 'Attempting to rewrite the entire UI component layer 4 hours before final demo.',
    timestamp: '2026-07-28 02:03 AM',
    donatedToMuseum: true,
  },
  {
    id: 'bug-500',
    bugCode: 'BUG-500',
    title: 'Phantom Vibration & Notification Anxiety',
    severity: 'Mild',
    status: 'Ignored',
    category: 'Productivity',
    description: 'Checking phone every 3 minutes even though phone has been in Airplane mode since Tuesday.',
    timestamp: '2026-07-27 04:30 PM',
    donatedToMuseum: false,
  },
];

export const INITIAL_ARTIFACTS: Artifact[] = [
  {
    id: 'art-01',
    artifactNumber: 'ART-1092',
    title: 'The Burning Laptop of Eternal Burnout',
    discoveryDate: 'Circa 2026',
    classification: 'Overheating Silicon & Spirit',
    severity: 'Nuclear',
    recoveredFrom: 'On a desk beside 4 empty espresso cups and a cold slice of pizza',
    curatorNotes: 'Specimen ran 14 docker containers, 3 Electron apps, and an unoptimized loop simultaneously. Double-clicking extinguishes the flames.',
    achievementUnlocked: 'Firefighter',
    stickerType: 'laptop',
    timestamp: '2026-07-31 10:00 AM',
  },
  {
    id: 'art-02',
    artifactNumber: 'ART-2048',
    title: 'Hocus Pocus, You Lost Your Focus',
    discoveryDate: 'Circa 2025',
    classification: 'Cognitive Hijack Specimen',
    severity: 'Critical',
    recoveredFrom: 'A 3-hour rabbit hole starting with a quick syntax check and ending on Wikipedia articles about medieval siege engines',
    curatorNotes: 'Guarded by the Distraction Frog. Highly contagious among students and software developers.',
    achievementUnlocked: 'Lost & Found',
    stickerType: 'frog',
    timestamp: '2026-07-30 08:30 PM',
  },
  {
    id: 'art-03',
    artifactNumber: 'ART-0001',
    title: 'In Memory of My Patience (RIP 2026)',
    discoveryDate: 'Circa 2026',
    classification: 'Depleted Reserve Memorial',
    severity: 'Critical',
    recoveredFrom: 'After reading "per my previous email" for the 5th time in one afternoon',
    curatorNotes: 'A quiet memorial dedicated to all patience lost in waiting for builds to complete, npm installs, and slow Wi-Fi.',
    achievementUnlocked: 'In Memoriam',
    stickerType: 'patience',
    timestamp: '2026-07-29 01:10 PM',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'Welcome to Broken Builds',
    description: 'Crossed the threshold into MuseumOS™.',
    iconName: 'DoorOpen',
    unlocked: true,
    unlockedAt: new Date().toLocaleTimeString(),
  },
  {
    id: 'bug_reporter',
    title: 'First Bug Filed',
    description: 'Logged an emotional bug in the Museum Tracker.',
    iconName: 'Bug',
    unlocked: false,
  },
  {
    id: 'firefighter',
    title: 'Extinguisher of Flames',
    description: 'Extinguished the fire on the Burning Laptop Duck.',
    iconName: 'Flame',
    unlocked: false,
  },
  {
    id: 'focus_finder',
    title: 'Focus Lost & Found',
    description: 'Interacted with the Distraction Frog in the Focus Gallery.',
    iconName: 'Eye',
    unlocked: false,
  },
  {
    id: 'patience_candle',
    title: 'In Memoriam',
    description: 'Lit a tribute candle in the Hall of Lost Patience.',
    iconName: 'Flame',
    unlocked: false,
  },
  {
    id: 'email_gravedigger',
    title: 'Inbox Gravedigger',
    description: 'Archived a haunting email in the Email Graveyard.',
    iconName: 'Mail',
    unlocked: false,
  },
  {
    id: 'undo_master',
    title: 'Life Doesn\'t Support Undo',
    description: 'Attempted to press Ctrl+Z in real life.',
    iconName: 'RotateCcw',
    unlocked: false,
  },
  {
    id: 'duck_whisperer',
    title: 'Quacktastic Master',
    description: 'Unlocked the secret Duck Gallery via Konami Code.',
    iconName: 'Bird',
    unlocked: false,
    secret: true,
  },
  {
    id: 'museum_donor',
    title: 'Artifact Philanthropist',
    description: 'Donated an emotional bug to the AI Museum Generator.',
    iconName: 'Sparkles',
    unlocked: false,
  },
  {
    id: 'passport_master',
    title: 'Master Curator Passport',
    description: 'Visited all museum galleries and stamped your passport.',
    iconName: 'Award',
    unlocked: false,
  },
];

export function getStoredBugs(): EmotionalBug[] {
  return storage.getBugs();
}

export function saveStoredBugs(bugs: EmotionalBug[]) {
  storage.saveBugs(bugs);
}

export function getStoredArtifacts(): Artifact[] {
  return storage.getArtifacts();
}

export function saveStoredArtifacts(artifacts: Artifact[]) {
  storage.saveArtifacts(artifacts);
}

export function getStoredPassport(): PassportStamp[] {
  return storage.getPassport();
}

export function saveStoredPassport(stamps: PassportStamp[]) {
  storage.savePassport(stamps);
}

export function getStoredAchievements(): Achievement[] {
  return storage.getAchievements();
}

export function saveStoredAchievements(achievements: Achievement[]) {
  storage.saveAchievements(achievements);
}
