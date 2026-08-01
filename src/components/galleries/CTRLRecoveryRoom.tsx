import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Wind, Sun, Smile, ArrowRight } from 'lucide-react';
import { StickerAsset } from '../Stickers';

interface RecoveryActivity {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Skipped';
}

interface CTRLRecoveryRoomProps {
  onUnlockAchievement: (id: string) => void;
}

export const CTRLRecoveryRoom: React.FC<CTRLRecoveryRoomProps> = ({ onUnlockAchievement }) => {
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timerCount, setTimerCount] = useState<number>(4);
  const [kindQuote, setKindQuote] = useState<string | null>(null);

  // Self-Care Recovery Activities State
  const [activities, setActivities] = useState<RecoveryActivity[]>(() => {
    try {
      const stored = localStorage.getItem('museum_recovery_activities');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { id: '1', title: 'Drink a glass of water', status: 'Done' },
      { id: '2', title: 'Unclamp jaw & drop shoulders', status: 'In Progress' },
      { id: '3', title: '5-minute step away from screen', status: 'To Do' },
      { id: '4', title: 'Acknowledge that done is better than perfect', status: 'Done' },
    ];
  });
  const [newActivityTitle, setNewActivityTitle] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('museum_recovery_activities', JSON.stringify(activities));
    } catch {}
  }, [activities]);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;
    const item: RecoveryActivity = {
      id: `act-${Date.now()}`,
      title: newActivityTitle.trim(),
      status: 'To Do',
    };
    setActivities([item, ...activities]);
    setNewActivityTitle('');
  };

  const handleSetStatus = (id: string, status: RecoveryActivity['status']) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status } : act))
    );
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  // Breathing Circle Animation Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerCount((prev) => {
        if (prev <= 1) {
          if (breathingPhase === 'Inhale') {
            setBreathingPhase('Hold');
            return 7;
          } else if (breathingPhase === 'Hold') {
            setBreathingPhase('Exhale');
            return 8;
          } else {
            setBreathingPhase('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingPhase]);

  const wholesomeQuotes = [
    "You don't have to be productive every single second to deserve rest.",
    "Small steps still count as moving forward.",
    "Your worth is not defined by how many tasks you checked off today.",
    "Drink a glass of water, unclamp your jaw, and drop your shoulders.",
    "Even broken code gets fixed eventually. You will figure this out too.",
  ];

  const handleHeartClick = () => {
    const random = wholesomeQuotes[Math.floor(Math.random() * wholesomeQuotes.length)];
    setKindQuote(random);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Title Banner - Green/Bright Hopeful Accent */}
      <div className="relative bg-[#062e1e] text-white p-6 sm:p-8 rounded-3xl museum-card-shadow border-2 border-[#10b981] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 left-10 w-28 h-6 masking-tape-dark opacity-90" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-300 rounded-full text-xs font-mono mb-2 border border-emerald-800 font-bold">
              <Sun className="w-3.5 h-3.5 text-emerald-400" />
              HOPEFUL RECOVERY SPACE
            </div>
            <h1 className="font-handwritten text-3xl sm:text-4xl text-emerald-100 font-bold">
              CTRL Recovery Room
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-xl">
              The brightest exhibit in The Museum of Broken Builds. Dedicated to getting back on track, self-compassion, and celebrating the fact that you did the thing anyway.
            </p>
          </div>

          <div className="bg-[#0b4d32] text-emerald-200 px-5 py-3 rounded-2xl border border-[#10b981] text-center font-mono">
            <span className="block text-2xl font-bold text-emerald-300">100%</span>
            <span className="text-[10px] uppercase tracking-wider text-stone-300">Recovery Mode</span>
          </div>
        </div>
      </div>

      {/* Main Artifact Display */}
      <div className="bg-[#062e1e] p-8 rounded-3xl border-2 border-[#10b981] shadow-lg shadow-emerald-950/40 mb-10 flex flex-col md:flex-row items-center gap-8 relative">
        <div className="absolute -top-3 right-10 w-24 h-5 masking-tape-dark rotate-[1deg]" />

        <div className="shrink-0" onClick={handleHeartClick}>
          <StickerAsset type="heart" />
        </div>

        <div className="space-y-3 flex-1 text-white">
          <div className="font-mono text-xs font-bold text-emerald-400">
            SPECIMEN #ART-9999
          </div>
          <h2 className="font-handwritten text-3xl font-bold text-emerald-100">
            "You Did The Thing Anyway"
          </h2>
          <p className="text-sm font-sans text-stone-300 leading-relaxed">
            Preserved artifact awarded to everyone who procrastinated for 4 hours, panicked for 20 minutes, but still submitted or finished the project on time.
          </p>

          <div className="bg-[#0b4d32]/80 p-4 rounded-2xl border border-[#10b981] text-xs font-handwritten text-emerald-200">
            ✍️ Curator Note: "Done is better than perfect. You are resilient, human, and doing great."
          </div>
        </div>
      </div>

      {/* Wholesome Quote Banner on Heart Click */}
      {kindQuote && (
        <div className="mb-8 p-4 bg-[#3d1d07] text-[#ff9d00] rounded-2xl border border-[#b45309] font-handwritten text-lg text-center shadow-md animate-in fade-in duration-200">
          💖 "{kindQuote}"
        </div>
      )}

      {/* Guided 4-7-8 Breathing Synthesizer Widget */}
      <div className="bg-[#131417]/95 p-8 rounded-3xl border border-[#2d2f36] shadow-xl text-center text-white">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
          <Wind className="w-4 h-4 animate-pulse" />
          <span>4-7-8 Ambient Breathing Loop</span>
        </div>

        <p className="text-xs text-stone-400 mb-6 font-sans">
          Take a moment to sync your breathing with the expanding circle below:
        </p>

        {/* Breathing Circle */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4">
          <div
            className={`absolute inset-0 rounded-full bg-emerald-500/20 border-4 border-[#10b981] transition-all duration-1000 ${
              breathingPhase === 'Inhale'
                ? 'scale-110 shadow-2xl shadow-emerald-500/30'
                : breathingPhase === 'Hold'
                ? 'scale-110 shadow-lg shadow-emerald-500/20'
                : 'scale-75 opacity-60'
            }`}
          />

          <div className="relative z-10 font-handwritten">
            <span className="block text-3xl font-bold text-emerald-300">
              {breathingPhase}
            </span>
            <span className="font-mono text-2xl font-bold text-stone-200 mt-1 block">
              {timerCount}s
            </span>
          </div>
        </div>

        <p className="text-xs font-handwritten text-stone-300 mt-4">
          "Deep breaths reset the nervous system faster than any caffeine intake."
        </p>
      </div>

      {/* Self-Care Recovery Activities Logger */}
      <div className="mt-10 bg-[#062e1e]/90 p-6 sm:p-8 rounded-3xl border-2 border-[#10b981] shadow-xl text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
              <Smile className="w-4 h-4 text-emerald-300" />
              <span>Self-Care Recovery Log</span>
            </div>
            <h3 className="font-handwritten text-2xl font-bold text-emerald-100">
              Personal Recovery Activities
            </h3>
            <p className="text-stone-300 text-xs font-sans mt-0.5">
              Log custom self-care goals and set their status (To Do, In Progress, Done, Skipped)
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-300 bg-[#0b4d32] px-3 py-1.5 rounded-xl border border-emerald-700">
            <span>Completed:</span>
            <span className="font-bold text-emerald-200">
              {activities.filter((a) => a.status === 'Done').length} / {activities.length}
            </span>
          </div>
        </div>

        {/* Form to Add Custom Recovery Activity */}
        <form onSubmit={handleAddActivity} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newActivityTitle}
            onChange={(e) => setNewActivityTitle(e.target.value)}
            placeholder="Log a custom self-care activity (e.g. 'Take a 10min walk without phone')..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#10b981]/50 bg-[#041f14] text-emerald-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-sans"
            id="input-custom-recovery-activity"
          />
          <button
            type="submit"
            id="btn-add-recovery-activity"
            className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-stone-950 font-bold rounded-xl text-xs font-mono shadow transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Add Activity</span>
          </button>
        </form>

        {/* Activity List with Status Sub-Options */}
        <div className="space-y-3">
          {activities.map((act) => {
            const statusColors = {
              'To Do': 'bg-stone-800 text-stone-300 border-stone-600',
              'In Progress': 'bg-amber-950 text-amber-300 border-amber-700',
              'Done': 'bg-emerald-950 text-emerald-300 border-emerald-600',
              'Skipped': 'bg-red-950 text-red-300 border-red-800',
            };

            return (
              <div
                key={act.id}
                className="bg-[#0b4d32]/80 p-4 rounded-2xl border border-[#10b981]/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {act.status === 'Done' ? '✅' : act.status === 'In Progress' ? '⏳' : act.status === 'Skipped' ? '⏭️' : '📌'}
                  </span>
                  <span
                    className={`font-handwritten text-base text-emerald-100 ${
                      act.status === 'Done' ? 'line-through opacity-75' : ''
                    }`}
                  >
                    {act.title}
                  </span>
                </div>

                {/* Sub-Options Status Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['To Do', 'In Progress', 'Done', 'Skipped'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSetStatus(act.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        act.status === st
                          ? `${statusColors[st]} ring-2 ring-emerald-400 scale-105`
                          : 'bg-[#041f14] text-stone-400 border-emerald-900/60 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleDeleteActivity(act.id)}
                    className="ml-2 text-stone-400 hover:text-red-400 text-xs font-mono px-2 py-1"
                    title="Delete item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
