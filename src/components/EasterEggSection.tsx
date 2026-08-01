import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  RotateCcw,
  MousePointer,
  Pencil,
  CheckCircle2,
  Flame,
  Award,
  ArrowRight,
  HelpCircle,
  Zap,
  Terminal,
  Key,
} from 'lucide-react';
import { Achievement, GalleryId } from '../types';
import {
  playClickSound,
  playArtifactOpenSound,
  playAchievementSound,
  playQuackSound,
} from '../lib/sound';

interface EasterEggSectionProps {
  achievements: Achievement[];
  onUnlockAchievement: (id: string) => void;
  onNavigateGallery: (galleryId: GalleryId) => void;
  customPencilCursor: boolean;
  setCustomPencilCursor: (val: boolean) => void;
  duckFollower: boolean;
  setDuckFollower: (val: boolean) => void;
}

export const EasterEggSection: React.FC<EasterEggSectionProps> = ({
  achievements,
  onUnlockAchievement,
  onNavigateGallery,
  customPencilCursor,
  setCustomPencilCursor,
  duckFollower,
  setDuckFollower,
}) => {
  // Konami Code State
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  const konamiLabels = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'];
  const [userKonami, setUserKonami] = useState<string[]>([]);
  const [konamiUnlocked, setKonamiUnlocked] = useState<boolean>(false);

  // Custom Quack Synthesizer Pitch
  const [quackPitch, setQuackPitch] = useState<number>(380);

  // Undo Toast state
  const [undoToast, setUndoToast] = useState<boolean>(false);

  // Docker Flame Extinguished State
  const [flameExtinguished, setFlameExtinguished] = useState<boolean>(false);

  const handleKonamiKey = (key: string) => {
    playClickSound();
    const nextSeq = [...userKonami, key];
    
    // Check match up to length
    let isMatch = true;
    for (let i = 0; i < nextSeq.length; i++) {
      if (nextSeq[i] !== konamiSequence[i]) {
        isMatch = false;
        break;
      }
    }

    if (!isMatch) {
      setUserKonami(key === konamiSequence[0] ? [key] : []);
      return;
    }

    setUserKonami(nextSeq);

    if (nextSeq.length === konamiSequence.length) {
      setKonamiUnlocked(true);
      playAchievementSound();
      onUnlockAchievement('duck_whisperer');
    }
  };

  const playCustomQuack = () => {
    playQuackSound(quackPitch);
  };

  const handleTriggerUndo = () => {
    playArtifactOpenSound();
    setUndoToast(true);
    onUnlockAchievement('undo_master');
    setTimeout(() => setUndoToast(false), 3500);
  };

  const handleFlameDoubleClick = () => {
    setFlameExtinguished(!flameExtinguished);
    playAchievementSound();
    onUnlockAchievement('firefighter');
  };

  // Checklist items based on achievements & interactions
  const duckUnlocked = achievements.find((a) => a.id === 'duck_whisperer')?.unlocked || konamiUnlocked;
  const undoUnlocked = achievements.find((a) => a.id === 'undo_master')?.unlocked;
  const firefighterUnlocked = achievements.find((a) => a.id === 'firefighter')?.unlocked || flameExtinguished;
  const patienceUnlocked = achievements.find((a) => a.id === 'patience_candle')?.unlocked;
  const passportUnlocked = achievements.find((a) => a.id === 'passport_master')?.unlocked;

  const easterEggChecklist = [
    {
      id: 'konami',
      title: 'The Konami Code Secret Chamber',
      unlocked: duckUnlocked,
      hint: 'Press ↑ ↑ ↓ ↓ ← → ← → B A on your keyboard or press the keypad below.',
      action: () => onNavigateGallery('duck'),
      actionLabel: 'Visit Duck Gallery 🦆',
    },
    {
      id: 'undo',
      title: 'Real-Life Ctrl+Z Time Machine',
      unlocked: undoUnlocked,
      hint: 'Press Ctrl+Z or Cmd+Z anywhere on the site.',
      action: handleTriggerUndo,
      actionLabel: 'Test Real-Life Undo ⏪',
    },
    {
      id: 'duck_follower',
      title: 'Rubber Duck Cursor Companion',
      unlocked: duckFollower,
      hint: 'Toggle the duck cursor companion in the Easter Egg controls below.',
      action: () => setDuckFollower(!duckFollower),
      actionLabel: duckFollower ? 'Disable Duck 🦆' : 'Enable Duck 🦆',
    },
    {
      id: 'firefighter',
      title: 'Extinguish the Burning Docker Flame',
      unlocked: firefighterUnlocked,
      hint: 'Double-click the Burning Laptop specimen card in exhibits or below.',
      action: handleFlameDoubleClick,
      actionLabel: flameExtinguished ? 'Re-ignite Fire 🔥' : 'Extinguish Fire 🧯',
    },
    {
      id: 'patience',
      title: 'Tribute Candle in Hall of Patience',
      unlocked: patienceUnlocked,
      hint: 'Visit the Hall of Lost Patience and light a tribute candle.',
      action: () => onNavigateGallery('patience'),
      actionLabel: 'Go to Patience Hall 🕯️',
    },
    {
      id: 'passport',
      title: 'Master Curator Passport Collection',
      unlocked: passportUnlocked,
      hint: 'Visit all 6 museum galleries to collect stamps on your passport.',
      action: () => onNavigateGallery('entrance'),
      actionLabel: 'Explore Galleries 🏛️',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 font-sans animate-in fade-in duration-300">
      {/* Toast Notification for Undo */}
      {undoToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#18191d] text-white px-6 py-3 rounded-2xl border-2 border-[#ff9d00] museum-card-shadow flex items-center gap-3 animate-bounce">
          <RotateCcw className="w-5 h-5 text-[#ff9d00] animate-spin" />
          <div>
            <div className="font-bold text-sm text-[#ff9d00]">Life Doesn't Support Undo!</div>
            <div className="text-xs text-stone-300 font-mono">
              Error 404: Real-life mistakes cannot be reversed. Achievement Unlocked!
            </div>
          </div>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="relative bg-[#131417]/95 text-white p-6 sm:p-10 rounded-3xl museum-card-shadow border-2 border-[#2d2f36] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff9d00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 left-10 w-36 h-6 masking-tape-dark rotate-[-1deg] opacity-90" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#3d1d07] text-[#ff9d00] rounded-full text-xs font-mono mb-3 border border-[#b45309] font-bold">
              <span>🥚</span>
              SECRET VAULT & EASTER EGG CHAMBERS
            </div>
            <h1 className="font-handwritten text-4xl sm:text-5xl font-bold text-white leading-tight">
              MuseumOS™ Easter Egg Vault
            </h1>
            <p className="font-sans text-stone-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Discover secret keyboard codes, interactive sound synthesizers, cursor companions, and hidden museum jokes preserved under glass.
            </p>
          </div>

          <div className="bg-[#18191d] p-4 rounded-2xl border border-[#2d2f36] flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 bg-[#3d1d07] rounded-xl flex items-center justify-center text-2xl border border-[#b45309]">
              🦆
            </div>
            <div>
              <div className="font-handwritten text-[#ff9d00] font-bold text-lg">Dr. Quackers Vault</div>
              <div className="font-mono text-[10px] text-stone-400">
                {easterEggChecklist.filter((e) => e.unlocked).length} of {easterEggChecklist.length} Discovered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Toys & Playground Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Konami Keypad */}
        <div className="bg-[#18191d] p-6 rounded-3xl border border-[#2d2f36] museum-card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-2 left-6 w-20 h-4 masking-tape-dark rotate-[2deg] opacity-80" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-[#ff9d00] font-bold flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[#ff9d00]" />
                KONAMI TERMINAL
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  konamiUnlocked
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-[#3d1d07] text-[#ff9d00] border-[#b45309]'
                }`}
              >
                {konamiUnlocked ? 'UNLOCKED 🦆' : 'LOCKED'}
              </span>
            </div>

            <h3 className="font-handwritten text-2xl font-bold text-white mb-2">
              Konami Code Simulator
            </h3>
            <p className="text-xs text-stone-300 font-sans mb-4">
              Enter <code className="bg-[#282a30] px-1.5 py-0.5 rounded font-mono text-[#ff9d00]">↑ ↑ ↓ ↓ ← → ← → B A</code> to unlock the Secret Duck Gallery.
            </p>

            {/* Live Key Sequence Display */}
            <div className="bg-[#121316] p-3 rounded-xl border border-[#2d2f36] mb-4 flex items-center justify-center gap-1 overflow-x-auto">
              {konamiSequence.map((seqKey, idx) => {
                const isPressed = idx < userKonami.length;
                return (
                  <span
                    key={idx}
                    className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center border transition-all ${
                      isPressed
                        ? 'bg-[#ff9d00] text-stone-950 border-[#ffb733] scale-110 shadow-md'
                        : 'bg-[#282a30] text-stone-400 border-[#2d2f36]'
                    }`}
                  >
                    {konamiLabels[idx]}
                  </span>
                );
              })}
            </div>

            {/* Clickable Touch/Mouse Keypad */}
            <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mx-auto text-xs font-mono font-bold">
              <div className="col-span-3 flex justify-center">
                <button
                  onClick={() => handleKonamiKey('ArrowUp')}
                  className="w-10 h-8 bg-[#282a30] hover:bg-[#ff9d00] hover:text-stone-950 text-white rounded-lg border border-[#3d404a] active:scale-95 transition-all"
                >
                  ↑
                </button>
              </div>
              <div className="col-span-3 flex justify-center gap-1.5">
                <button
                  onClick={() => handleKonamiKey('ArrowLeft')}
                  className="w-10 h-8 bg-[#282a30] hover:bg-[#ff9d00] hover:text-stone-950 text-white rounded-lg border border-[#3d404a] active:scale-95 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={() => handleKonamiKey('ArrowDown')}
                  className="w-10 h-8 bg-[#282a30] hover:bg-[#ff9d00] hover:text-stone-950 text-white rounded-lg border border-[#3d404a] active:scale-95 transition-all"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleKonamiKey('ArrowRight')}
                  className="w-10 h-8 bg-[#282a30] hover:bg-[#ff9d00] hover:text-stone-950 text-white rounded-lg border border-[#3d404a] active:scale-95 transition-all"
                >
                  →
                </button>
              </div>
              <div className="col-span-3 flex justify-center gap-2 mt-1">
                <button
                  onClick={() => handleKonamiKey('KeyB')}
                  className="w-10 h-8 bg-[#b91c1c] hover:bg-red-500 text-white rounded-lg border border-red-700 active:scale-95 transition-all"
                >
                  B
                </button>
                <button
                  onClick={() => handleKonamiKey('KeyA')}
                  className="w-10 h-8 bg-[#b91c1c] hover:bg-red-500 text-white rounded-lg border border-red-700 active:scale-95 transition-all"
                >
                  A
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateGallery('duck')}
            className="mt-6 w-full py-2.5 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow"
          >
            <span>Visit Duck Gallery</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </button>
        </div>

        {/* Card 2: Quack Synthesizer & Duck Companion */}
        <div className="bg-[#18191d] p-6 rounded-3xl border border-[#2d2f36] museum-card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-2 left-6 w-20 h-4 masking-tape-dark rotate-[-2deg] opacity-80" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-[#ff9d00] font-bold flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#ff9d00]" />
                AUDIO SYNTHESIZER
              </span>
              <span className="text-2xl animate-bounce">🦆</span>
            </div>

            <h3 className="font-handwritten text-2xl font-bold text-white mb-2">
              Quack Frequency Synthesizer
            </h3>
            <p className="text-xs text-stone-300 font-sans mb-4">
              Adjust pitch oscillation frequency and synthesize custom acoustic quacks.
            </p>

            {/* Pitch Slider */}
            <div className="bg-[#121316] p-3 rounded-xl border border-[#2d2f36] mb-4">
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>Frequency Pitch:</span>
                <span className="text-[#ff9d00] font-bold">{quackPitch} Hz</span>
              </div>
              <input
                type="range"
                min="180"
                max="800"
                step="10"
                value={quackPitch}
                onChange={(e) => setQuackPitch(Number(e.target.value))}
                className="w-full accent-[#ff9d00] bg-[#282a30] cursor-pointer"
              />
            </div>

            <button
              onClick={playCustomQuack}
              className="w-full py-2.5 bg-[#3d1d07] hover:bg-[#52270a] text-[#ff9d00] border border-[#b45309] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 mb-3"
            >
              <Volume2 className="w-4 h-4 text-[#ff9d00]" />
              <span>SYNTHESIZE QUACK ({quackPitch}Hz)</span>
            </button>
          </div>

          {/* Duck Follower Toggle */}
          <div className="pt-3 border-t border-[#2d2f36] flex items-center justify-between">
            <span className="text-xs font-mono text-stone-300">Duck Cursor Follower:</span>
            <button
              onClick={() => {
                setDuckFollower(!duckFollower);
                playClickSound();
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all border ${
                duckFollower
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-[#282a30] text-stone-400 border-[#2d2f36]'
              }`}
            >
              {duckFollower ? 'ACTIVE 🦆' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Card 3: Interactive Docker Flame Extinguisher */}
        <div className="bg-[#18191d] p-6 rounded-3xl border border-[#2d2f36] museum-card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-2 left-6 w-20 h-4 masking-tape-dark rotate-[1deg] opacity-80" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-[#ff9d00] font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#ff9d00]" />
                EXHIBIT SPECIMEN
              </span>
              <span className="text-2xl">{flameExtinguished ? '💻' : '🔥'}</span>
            </div>

            <h3 className="font-handwritten text-2xl font-bold text-white mb-2">
              The Burning Docker Laptop
            </h3>
            <p className="text-xs text-stone-300 font-sans mb-4">
              Preserved specimen from a 14-container Docker build. Double-click to extinguish or re-ignite!
            </p>

            <div
              onDoubleClick={handleFlameDoubleClick}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none ${
                flameExtinguished
                  ? 'bg-stone-900 border-stone-700 text-stone-400'
                  : 'bg-[#200c0e] border-[#b91c1c] text-red-200'
              }`}
            >
              <div className="text-4xl mb-2 animate-pulse">
                {flameExtinguished ? '💨 💻 🧯' : '🔥 💻 🔥'}
              </div>
              <div className="font-handwritten font-bold text-lg">
                {flameExtinguished ? 'Laptop Extinguished (Cooling Down)' : 'Laptop On Fire (100% CPU)'}
              </div>
              <div className="text-[10px] font-mono opacity-80 mt-1">
                (Double click to toggle)
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#2d2f36] flex items-center justify-between text-xs font-mono text-stone-400">
            <span>Status:</span>
            <span className={flameExtinguished ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {flameExtinguished ? 'SAFE & Extinguished' : 'OVERHEATING'}
            </span>
          </div>
        </div>
      </div>

      {/* Easter Egg Vault Discovery Checklist */}
      <div className="bg-[#15161a] p-6 sm:p-8 rounded-3xl border border-[#2d2f36] museum-card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2d2f36]">
          <div>
            <h3 className="font-handwritten text-3xl font-bold text-white">
              Easter Egg Discovery Vault
            </h3>
            <p className="text-xs text-stone-400 font-mono mt-1">
              Check off all hidden features and secret triggers across MuseumOS™
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#18191d] px-4 py-2 rounded-2xl border border-[#2d2f36] text-xs font-mono font-bold text-[#ff9d00]">
            <Award className="w-4 h-4 text-[#ff9d00]" />
            <span>
              {easterEggChecklist.filter((e) => e.unlocked).length} / {easterEggChecklist.length} Unlocked
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {easterEggChecklist.map((egg) => (
            <div
              key={egg.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                egg.unlocked
                  ? 'bg-[#18191d] border-[#ff9d00]/50 museum-card-shadow'
                  : 'bg-[#121316]/60 border-[#2d2f36] opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-handwritten text-xl font-bold text-white flex items-center gap-2">
                    {egg.unlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-stone-500 shrink-0" />
                    )}
                    <span>{egg.title}</span>
                  </h4>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      egg.unlocked
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-[#282a30] text-stone-400 border-[#2d2f36]'
                    }`}
                  >
                    {egg.unlocked ? 'DISCOVERED' : 'HIDDEN'}
                  </span>
                </div>

                <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4">
                  {egg.hint}
                </p>
              </div>

              <button
                onClick={egg.action}
                className="w-full py-2 bg-[#282a30] hover:bg-[#383a42] text-stone-200 font-mono text-xs font-bold rounded-xl border border-[#3d404a] transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>{egg.actionLabel}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
