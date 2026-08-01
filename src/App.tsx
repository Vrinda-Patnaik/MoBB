import React, { useState, useEffect } from 'react';
import {
  EmotionalBug,
  Artifact,
  GalleryId,
  PassportStamp,
  Achievement,
} from './types';
import {
  getStoredBugs,
  saveStoredBugs,
  getStoredArtifacts,
  saveStoredArtifacts,
  getStoredPassport,
  saveStoredPassport,
  getStoredAchievements,
  saveStoredAchievements,
  INITIAL_BUGS,
  INITIAL_ARTIFACTS,
} from './lib/museumStore';
import { LandingPage } from './components/LandingPage';
import { EntranceHall } from './components/galleries/EntranceHall';
import { HallOfLostPatience } from './components/galleries/HallOfLostPatience';
import { HallOfLostFocus } from './components/galleries/HallOfLostFocus';
import { BurnoutExhibit } from './components/galleries/BurnoutExhibit';
import { EmailGraveyard } from './components/galleries/EmailGraveyard';
import { CTRLRecoveryRoom } from './components/galleries/CTRLRecoveryRoom';
import { DuckGallery } from './components/galleries/DuckGallery';
import { BugTracker } from './components/BugTracker';
import { ArtifactGenerator } from './components/ArtifactGenerator';
import { AchievementsCabinet } from './components/AchievementsCabinet';
import { EasterEggSection } from './components/EasterEggSection';
import { PassportModal, ALL_GALLERIES } from './components/PassportModal';
import { AICurator } from './components/AICurator';
import { LoadingTicketIntro } from './components/LoadingTicketIntro';
import {
  Sun,
  Moon,
  Compass,
  Bug,
  Sparkles,
  Award,
  Home,
  MousePointer,
  RotateCcw,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  isSoundEnabled,
  setSoundEnabled,
  playClickSound,
  playQuackSound,
  playArtifactOpenSound,
  playAchievementSound,
  startAmbienceSound,
} from './lib/sound';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [visitorName, setVisitorName] = useState<string>('Honored Guest');
  const [currentGallery, setCurrentGallery] = useState<GalleryId>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled);
  const [customPencilCursor, setCustomPencilCursor] = useState<boolean>(false);
  const [duckFollower, setDuckFollower] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Persistent States
  const [bugs, setBugs] = useState<EmotionalBug[]>(getStoredBugs);
  const [artifacts, setArtifacts] = useState<Artifact[]>(getStoredArtifacts);
  const [passportStamps, setPassportStamps] = useState<PassportStamp[]>(getStoredPassport);
  const [achievements, setAchievements] = useState<Achievement[]>(getStoredAchievements);

  // Modals & Toasts
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const [undoToast, setUndoToast] = useState<boolean>(false);
  const [generatorInitialPrompt, setGeneratorInitialPrompt] = useState<string>('');

  // Konami Code Sequence Tracking
  const [konamiIndex, setKonamiIndex] = useState<number>(0);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Save to LocalStorage on updates
  useEffect(() => { saveStoredBugs(bugs); }, [bugs]);
  useEffect(() => { saveStoredArtifacts(artifacts); }, [artifacts]);
  useEffect(() => { saveStoredPassport(passportStamps); }, [passportStamps]);
  useEffect(() => { saveStoredAchievements(achievements); }, [achievements]);

  // Apply dark mode class to html document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Track mouse position for Duck Cursor Follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Global Delegated Button Click Sound & Museum Ambience Initialization
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest('button, a, [role="button"], input[type="button"], input[type="submit"]');
      if (clickable) {
        playClickSound();
      }
    };

    const handleUserGesture = () => {
      startAmbienceSound();
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };

    window.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('click', handleUserGesture);
    window.addEventListener('keydown', handleUserGesture);

    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, []);

  // Keyboard Shortcuts (Ctrl+Z and Konami Code listener accessible from any page)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Z shortcut
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        setUndoToast(true);
        unlockAchievement('undo_master');
        setTimeout(() => setUndoToast(false), 4000);
      }

      // Konami Code listener - case insensitive & accessible from any page
      const expected = konamiCode[konamiIndex];
      const pressed = e.key;

      if (pressed && expected && pressed.toLowerCase() === expected.toLowerCase()) {
        const nextIdx = konamiIndex + 1;
        setKonamiIndex(nextIdx);
        if (nextIdx === konamiCode.length) {
          setCurrentGallery('duck');
          unlockAchievement('duck_whisperer');
          playQuackSound(500);
          setKonamiIndex(0);
        }
      } else {
        if (pressed && pressed.toLowerCase() === konamiCode[0].toLowerCase()) {
          setKonamiIndex(1);
        } else {
          setKonamiIndex(0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  // Unlock Achievement Helper
  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx !== -1 && !prev[idx].unlocked) {
        const updated = [...prev];
        const unlockedItem = {
          ...updated[idx],
          unlocked: true,
          unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        updated[idx] = unlockedItem;

        queueMicrotask(() => {
          setAchievementToast(unlockedItem);
          playAchievementSound();
          setTimeout(() => setAchievementToast(null), 4500);
        });

        return updated;
      }
      return prev;
    });
  };

  // Stamp Passport when entering a gallery
  const navigateToGallery = (galleryId: GalleryId) => {
    setCurrentGallery(galleryId);
    playArtifactOpenSound();

    // Check if gallery belongs to passport list
    const found = ALL_GALLERIES.find((g) => g.id === galleryId);
    if (found) {
      setPassportStamps((prev) => {
        if (!prev.some((s) => s.galleryId === galleryId)) {
          const newStamp: PassportStamp = {
            galleryId,
            galleryName: found.name,
            iconName: found.icon,
            stampedAt: new Date().toLocaleDateString(),
          };
          const updated = [...prev, newStamp];

          // Check if all galleries stamped
          if (updated.length >= ALL_GALLERIES.length) {
            queueMicrotask(() => {
              unlockAchievement('passport_master');
            });
          }

          return updated;
        }
        return prev;
      });
    }
  };

  // Bug Operations
  const handleAddBug = (newBugData: Omit<EmotionalBug, 'id' | 'bugCode' | 'timestamp'>) => {
    const bugCode = `BUG-${Math.floor(100 + Math.random() * 900)}`;
    const newBug: EmotionalBug = {
      ...newBugData,
      id: `bug-${Date.now()}`,
      bugCode,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };
    setBugs((prev) => [newBug, ...prev]);
  };

  const handleUpdateBug = (id: string, updates: Partial<EmotionalBug>) => {
    setBugs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleDeleteBug = (id: string) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
  };

  const handleDonateBugToMuseum = (bug: EmotionalBug) => {
    handleUpdateBug(bug.id, { donatedToMuseum: true, status: 'Preserved in Museum' });
    setGeneratorInitialPrompt(`Emotional Bug [${bug.bugCode}]: ${bug.title} - ${bug.description}`);
    navigateToGallery('generator');
  };

  const handleArtifactGenerated = (art: Artifact) => {
    setArtifacts((prev) => [art, ...prev]);
  };

  const handleDeleteArtifact = (id: string) => {
    setArtifacts((prev) => prev.filter((art) => art.id !== id));
  };

  if (showIntro) {
    return (
      <LoadingTicketIntro
        onComplete={(name) => {
          setVisitorName(name);
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'bg-sketchbook-dark text-[#f0ece1]' : 'bg-sketchbook-light text-[#2b2927]'
      } ${customPencilCursor ? 'custom-pencil-cursor' : ''}`}
    >
      {/* Duck Follower Asset */}
      {duckFollower && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-300 ease-out hidden sm:block opacity-75"
          style={{
            left: `${mousePos.x + 18}px`,
            top: `${mousePos.y + 18}px`,
          }}
        >
          <span className="text-xl inline-block hover-wiggle">🦆</span>
        </div>
      )}

      {/* Achievement Toast Banner */}
      {achievementToast && (
        <div className="fixed top-20 right-6 z-50 bg-amber-400 text-black px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-black flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 font-sans">
          <div className="w-10 h-10 bg-black text-amber-300 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
            🏆
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase font-bold text-stone-800 tracking-wider">
              ACHIEVEMENT UNLOCKED!
            </div>
            <div className="font-handwritten font-bold text-lg leading-none">
              {achievementToast.title}
            </div>
            <div className="text-xs font-sans text-stone-900 mt-0.5">
              {achievementToast.description}
            </div>
          </div>
        </div>
      )}

      {/* Ctrl + Z Toast */}
      {undoToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2b2927] text-amber-300 px-6 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 font-handwritten text-lg flex items-center gap-3 animate-bounce">
          <RotateCcw className="w-5 h-5 text-amber-400" />
          <span>Life doesn't support undo... but you are doing fine anyway!</span>
        </div>
      )}

      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#121316]/95 dark:bg-[#121316]/95 backdrop-blur-md border-b border-[#282a30]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Name */}
          <div
            onClick={() => navigateToGallery('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2a170a] text-[#ff9d00] rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl border border-[#78350f] shadow-md group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <h1 className="font-handwritten font-bold text-sm sm:text-xl leading-tight text-white group-hover:text-[#ff9d00] transition-colors truncate">
                The Museum of Broken Builds
              </h1>
            </div>
          </div>

          {/* Core Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#18191d] p-1 xl:p-1.5 rounded-2xl border border-[#2d2f36] text-[11px] xl:text-xs font-mono max-w-full overflow-x-auto scrollbar-none">
            <button
              onClick={() => navigateToGallery('home')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all font-bold whitespace-nowrap ${
                currentGallery === 'home'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-[#282a30]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateToGallery('entrance')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all whitespace-nowrap ${
                currentGallery === 'entrance'
                  ? 'bg-white text-stone-900 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-[#282a30]'
              }`}
            >
              Entrance
            </button>
            <button
              onClick={() => navigateToGallery('patience')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all whitespace-nowrap ${
                currentGallery === 'patience'
                  ? 'bg-[#b91c1c] text-white font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-[#282a30]'
              }`}
            >
              Patience
            </button>
            <button
              onClick={() => navigateToGallery('focus')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all whitespace-nowrap ${
                currentGallery === 'focus'
                  ? 'bg-[#7e22ce] text-white font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-[#282a30]'
              }`}
            >
              Lost Focus
            </button>
            <button
              onClick={() => navigateToGallery('burnout')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all whitespace-nowrap ${
                currentGallery === 'burnout'
                  ? 'bg-[#b45309] text-white font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-[#282a30]'
              }`}
            >
              Burnout
            </button>
            <button
              onClick={() => navigateToGallery('email')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all whitespace-nowrap ${
                currentGallery === 'email'
                  ? 'bg-[#1e293b] text-blue-200 font-bold border border-blue-500/30'
                  : 'text-stone-300 hover:text-white hover:bg-[#282a30]'
              }`}
            >
              Email Graveyard
            </button>
            <button
              onClick={() => navigateToGallery('recovery')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all whitespace-nowrap ${
                currentGallery === 'recovery'
                  ? 'bg-[#047857] text-white font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-[#282a30]'
              }`}
            >
              CTRL Recovery
            </button>
            <button
              onClick={() => navigateToGallery('tracker')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all flex items-center gap-1 font-bold whitespace-nowrap ${
                currentGallery === 'tracker'
                  ? 'bg-[#4a0d12] text-[#fca5a5] border border-[#8a1c24] shadow-sm'
                  : 'text-[#fca5a5]/80 hover:text-[#fca5a5] hover:bg-[#4a0d12]/60'
              }`}
            >
              <Bug className="w-3.5 h-3.5 text-[#dc2626]" />
              <span>Bug Tracker</span>
            </button>
            <button
              onClick={() => navigateToGallery('generator')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all flex items-center gap-1 font-bold whitespace-nowrap ${
                currentGallery === 'generator'
                  ? 'bg-[#4d320a] text-[#fbbf24] border border-[#945e12] shadow-sm'
                  : 'text-[#fbbf24]/80 hover:text-[#fbbf24] hover:bg-[#4d320a]/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff9d00]" />
              <span>AI Generator</span>
            </button>
            <button
              onClick={() => navigateToGallery('eastereggs')}
              className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg xl:rounded-xl transition-all flex items-center gap-1 font-bold whitespace-nowrap ${
                currentGallery === 'eastereggs' || currentGallery === 'duck'
                  ? 'bg-[#3d1d07] text-[#ff9d00] border border-[#b45309] shadow-sm'
                  : 'text-[#ff9d00]/80 hover:text-[#ff9d00] hover:bg-[#3d1d07]/60'
              }`}
            >
              <span>🥚 Easter Eggs</span>
            </button>
          </nav>

          {/* Right Action Tools & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Museum Passport Button */}
            <button
              onClick={() => setIsPassportOpen(true)}
              className="relative p-1.5 sm:p-2.5 bg-[#18191d] hover:bg-[#282a30] rounded-xl sm:rounded-2xl border border-[#2d2f36] text-xs font-mono font-bold flex items-center gap-1.5 sm:gap-2 transition-all text-stone-200"
              id="btn-open-passport"
              title="Open Museum Passport"
            >
              <span className="text-sm sm:text-base">🛂</span>
              <span className="hidden sm:inline">Passport</span>
              <span className="bg-[#ff9d00] text-stone-950 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-[#cc7e00]">
                {passportStamps.length}/{ALL_GALLERIES.length}
              </span>
            </button>

            {/* Trophies Cabinet Button */}
            <button
              onClick={() => navigateToGallery('achievements')}
              className="p-1.5 sm:p-2.5 bg-[#18191d] hover:bg-[#282a30] text-stone-300 hover:text-white rounded-xl sm:rounded-2xl border border-[#2d2f36] transition-all"
              title="View Trophies & Achievements"
              id="btn-trophies-nav"
            >
              <Award className="w-4 h-4 text-[#ff9d00]" />
            </button>

            {/* Sound On/Off Toggle */}
            <button
              onClick={() => {
                const nextState = !soundOn;
                setSoundOn(nextState);
                setSoundEnabled(nextState);
              }}
              className="p-1.5 sm:p-2.5 bg-[#18191d] hover:bg-[#282a30] text-stone-300 hover:text-white rounded-xl sm:rounded-2xl border border-[#2d2f36] transition-all"
              title={soundOn ? 'Mute Museum Audio' : 'Unmute Museum Audio'}
              id="btn-sound-toggle"
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4 text-[#ff9d00]" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 sm:p-2.5 bg-[#18191d] hover:bg-[#282a30] text-stone-300 hover:text-white rounded-xl sm:rounded-2xl border border-[#2d2f36] transition-all"
              title="Toggle Night Museum Theme"
              id="btn-theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#ff9d00]" />
              ) : (
                <Moon className="w-4 h-4 text-stone-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="lg:hidden bg-[#18191d] px-2 sm:px-4 py-1.5 border-t border-[#2d2f36] flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
          {[
            { id: 'home', label: 'Home' },
            { id: 'entrance', label: 'Entrance' },
            { id: 'patience', label: 'Patience' },
            { id: 'focus', label: 'Lost Focus' },
            { id: 'burnout', label: 'Burnout' },
            { id: 'email', label: 'Email' },
            { id: 'recovery', label: 'Recovery' },
            { id: 'tracker', label: 'Bug Tracker' },
            { id: 'generator', label: 'AI Generator' },
            { id: 'eastereggs', label: 'Easter Eggs 🥚' },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => navigateToGallery(nav.id as GalleryId)}
              className={`px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap transition-colors ${
                currentGallery === nav.id
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-[#282a30]'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Dynamic Gallery Content View */}
      <main className="py-6 sm:py-10 transition-all duration-300">
        {currentGallery === 'home' && (
          <LandingPage
            onEnterMuseum={() => navigateToGallery('entrance')}
            onOpenTracker={() => navigateToGallery('tracker')}
            onOpenGenerator={() => navigateToGallery('generator')}
            onOpenEasterEggs={() => navigateToGallery('eastereggs')}
          />
        )}

        {currentGallery === 'entrance' && (
          <EntranceHall onNavigate={navigateToGallery} />
        )}

        {currentGallery === 'patience' && (
          <HallOfLostPatience onUnlockAchievement={unlockAchievement} />
        )}

        {currentGallery === 'focus' && (
          <HallOfLostFocus onUnlockAchievement={unlockAchievement} />
        )}

        {currentGallery === 'burnout' && (
          <BurnoutExhibit onUnlockAchievement={unlockAchievement} />
        )}

        {currentGallery === 'email' && (
          <EmailGraveyard onUnlockAchievement={unlockAchievement} />
        )}

        {currentGallery === 'recovery' && (
          <CTRLRecoveryRoom onUnlockAchievement={unlockAchievement} />
        )}

        {currentGallery === 'duck' && (
          <DuckGallery onUnlockAchievement={unlockAchievement} />
        )}

        {currentGallery === 'tracker' && (
          <BugTracker
            bugs={bugs}
            onAddBug={handleAddBug}
            onUpdateBug={handleUpdateBug}
            onDeleteBug={handleDeleteBug}
            onDonateBugToMuseum={handleDonateBugToMuseum}
            onUnlockAchievement={unlockAchievement}
          />
        )}

        {currentGallery === 'generator' && (
          <ArtifactGenerator
            initialPrompt={generatorInitialPrompt}
            artifacts={artifacts}
            onArtifactGenerated={handleArtifactGenerated}
            onDeleteArtifact={handleDeleteArtifact}
            onUnlockAchievement={unlockAchievement}
          />
        )}

        {currentGallery === 'achievements' && (
          <AchievementsCabinet achievements={achievements} />
        )}

        {currentGallery === 'eastereggs' && (
          <EasterEggSection
            achievements={achievements}
            onUnlockAchievement={unlockAchievement}
            onNavigateGallery={navigateToGallery}
            customPencilCursor={customPencilCursor}
            setCustomPencilCursor={setCustomPencilCursor}
            duckFollower={duckFollower}
            setDuckFollower={setDuckFollower}
          />
        )}
      </main>

      {/* Passport Modal */}
      <PassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        stamps={passportStamps}
        onNavigateGallery={navigateToGallery}
      />

      {/* Floating AI Museum Curator Widget */}
      <AICurator
        currentGallery={currentGallery}
        userBugsCount={bugs.length}
        onOpenGeneratorWithPrompt={(promptText) => {
          setGeneratorInitialPrompt(promptText);
          navigateToGallery('generator');
        }}
      />
    </div>
  );
}
