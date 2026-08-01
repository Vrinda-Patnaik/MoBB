import React, { useState, useEffect } from 'react';
import { Flame, Heart, Sparkles, MessageSquarePlus, Hourglass, Power, Eye, EyeOff, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { StickerAsset } from '../Stickers';

export interface TributeItem {
  id: string;
  text: string;
  isSessionLog?: boolean;
}

export interface PatienceIncidentItem {
  id: string;
  incident: string;
  lossPercent: number; // e.g. 25, 50, 80, 100
  status: 'Still Waiting' | 'Expired' | 'Survived' | 'Raging';
  createdAt: string;
}

const DEFAULT_INCIDENTS: PatienceIncidentItem[] = [
  {
    id: 'inc-1',
    incident: "Vite dev server locked up during HMR refresh",
    lossPercent: 85,
    status: 'Still Waiting',
    createdAt: 'Today at 10:20 AM',
  },
  {
    id: 'inc-2',
    incident: "npm install fetching 1,400 nested node_modules",
    lossPercent: 95,
    status: 'Raging',
    createdAt: 'Yesterday at 11:45 PM',
  },
  {
    id: 'inc-3',
    incident: "Waiting for PR review on 1-line typo fix",
    lossPercent: 50,
    status: 'Survived',
    createdAt: '2 days ago',
  },
];

interface HallOfLostPatienceProps {
  onUnlockAchievement: (id: string) => void;
}

export const HallOfLostPatience: React.FC<HallOfLostPatienceProps> = ({ onUnlockAchievement }) => {
  const [candleLit, setCandleLit] = useState<boolean>(false);
  
  // Tribute Wall State (Starts empty, only user-added & focus log activity)
  const [tributes, setTributes] = useState<TributeItem[]>(() => {
    try {
      const stored = localStorage.getItem('museum_patience_tributes');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });
  const [newTribute, setNewTribute] = useState<string>('');

  // Save tributes to local storage
  useEffect(() => {
    try {
      localStorage.setItem('museum_patience_tributes', JSON.stringify(tributes));
    } catch {}
  }, [tributes]);

  // Patience Mode State
  const [isPatienceModeActive, setIsPatienceModeActive] = useState<boolean>(false);
  const [patienceTimer, setPatienceTimer] = useState<number>(0);
  const [timeIn, setTimeIn] = useState<string | null>(null);

  // Patience Incidents Activity Logging State
  const [incidents, setIncidents] = useState<PatienceIncidentItem[]>(() => {
    try {
      const stored = localStorage.getItem('museum_patience_incidents');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_INCIDENTS;
  });

  // Form State for New Patience Incident
  const [incidentInput, setIncidentInput] = useState<string>('');
  const [lossPercentInput, setLossPercentInput] = useState<number>(75);
  const [statusInput, setStatusInput] = useState<PatienceIncidentItem['status']>('Still Waiting');

  useEffect(() => {
    try {
      localStorage.setItem('museum_patience_incidents', JSON.stringify(incidents));
    } catch {}
  }, [incidents]);

  // Timer Effect when Patience Mode is Active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPatienceModeActive) {
      interval = setInterval(() => {
        setPatienceTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPatienceModeActive]);

  const handleTogglePatienceMode = () => {
    if (!isPatienceModeActive) {
      // ENTER PATIENCE MODE
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTimeIn(now);
      setPatienceTimer(0);
      setIsPatienceModeActive(true);
      onUnlockAchievement('patience_master');
    } else {
      // EXIT PATIENCE MODE & LOG TIME IN & TIME OUT TO TRIBUTE WALL
      const nowOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const mins = Math.floor(patienceTimer / 60);
      const secs = patienceTimer % 60;
      const durationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

      const logMsg = `🧘 Patience Session: Time In at ${timeIn || 'Start'} ➔ Time Out at ${nowOut} (Total Patience: ${durationStr})`;
      const sessionItem: TributeItem = {
        id: `trib-${Date.now()}`,
        text: logMsg,
        isSessionLog: true,
      };
      setTributes((prev) => [sessionItem, ...prev]);

      setIsPatienceModeActive(false);
      setPatienceTimer(0);
      setTimeIn(null);
    }
  };

  const handleToggleCandle = () => {
    const nextState = !candleLit;
    setCandleLit(nextState);
    if (nextState) {
      onUnlockAchievement('patience_candle');
    }
  };

  const handleAddTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTribute.trim()) return;
    const item: TributeItem = {
      id: `trib-${Date.now()}`,
      text: newTribute.trim(),
    };
    setTributes((prev) => [item, ...prev]);
    setNewTribute('');
  };

  const handleDeleteTribute = (id: string) => {
    setTributes((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentInput.trim()) return;

    const item: PatienceIncidentItem = {
      id: `inc-${Date.now()}`,
      incident: incidentInput.trim(),
      lossPercent: Number(lossPercentInput) || 50,
      status: statusInput,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setIncidents([item, ...incidents]);
    setIncidentInput('');
    setLossPercentInput(75);
    setStatusInput('Still Waiting');
    onUnlockAchievement('patience_master');
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: PatienceIncidentItem['status']) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
  };

  const handleDeleteIncident = (id: string) => {
    setIncidents((prev) => prev.filter((inc) => inc.id !== id));
  };

  // Format timer into MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // DISTRACTION-FREE PATIENCE MODE VIEW (All other content disappears)
  if (isPatienceModeActive) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center text-white font-sans animate-in fade-in duration-500">
        <div className="bg-[#121316] p-8 sm:p-12 rounded-3xl border-2 border-[#6b1d24] museum-card-shadow max-w-xl w-full flex flex-col items-center relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-800 to-transparent animate-pulse" />

          <div className="font-mono text-xs font-bold text-red-300 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Hourglass className="w-4 h-4 animate-spin-slow text-red-300" />
            <span>PATIENCE MODE ACTIVE • NO DISTRACTIONS</span>
          </div>

          <h2 className="font-handwritten text-4xl sm:text-5xl font-bold text-red-100 mb-2">
            Resting Your Mind
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm font-sans mb-8 max-w-md">
            All exhibits have been hidden. Time in patience is being recorded. Time In: <span className="font-mono text-red-300 font-bold">{timeIn}</span>
          </p>

          {/* Large Pulsating Timer Counter */}
          <div className="my-6 bg-[#200c0e] px-8 py-6 rounded-3xl border-2 border-red-900 shadow-2xl shadow-red-950/60 font-mono text-5xl sm:text-6xl font-bold text-red-300 tracking-wider animate-pulse">
            {formatTimer(patienceTimer)}
          </div>

          <p className="font-handwritten text-lg text-amber-200 mb-8 italic">
            "Patience is not the ability to wait, but the ability to keep a good attitude while waiting."
          </p>

          {/* Pulsating Exit Button */}
          <button
            onClick={handleTogglePatienceMode}
            id="btn-exit-patience-mode"
            className="group relative flex items-center justify-center gap-3 bg-[#7f1d1d] hover:bg-[#991b1b] text-white font-bold font-handwritten px-8 py-4 rounded-2xl border-2 border-red-800 shadow-xl transition-all hover:scale-105 active:scale-95 text-lg animate-pulse"
          >
            <Power className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
            <span>Exit Patience Mode & Log Time</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Header & Patience Mode Card Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
        {/* Gallery Title Banner */}
        <div className="lg:col-span-7 bg-[#200c0e] text-white p-6 rounded-3xl museum-card-shadow border-2 border-[#6b1d24] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-3 left-8 w-24 h-5 masking-tape-dark opacity-90" />

          <div className="relative z-10 mb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-red-950 text-red-300 rounded-full text-[11px] font-mono mb-2 border border-red-900 font-bold">
              <span>🪦</span>
              MEMORIAL EXHIBIT ROOM
            </div>
            <h1 className="font-handwritten text-3xl sm:text-4xl text-red-100 font-bold">
              Hall of Lost Patience
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 leading-relaxed">
              A quiet memorial space dedicated to all human patience lost in software builds, infinite spinner animations, and corporate email threads.
            </p>
          </div>

          <button
            onClick={handleToggleCandle}
            id="btn-candle-toggle"
            className={`w-full sm:w-auto self-start flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold font-handwritten text-xs sm:text-sm transition-all shadow-md shrink-0 ${
              candleLit
                ? 'bg-[#ff9d00] text-stone-950 border-2 border-[#ffb733] scale-105 animate-pulse'
                : 'bg-[#4a0d12] hover:bg-[#5e1117] text-[#fca5a5] border border-[#6b1d24]'
            }`}
          >
            <Flame className={`w-4 h-4 ${candleLit ? 'text-orange-950 fill-orange-950' : 'text-stone-400'}`} />
            <span>{candleLit ? '🔥 Candle Lit (In Memoriam)' : '🕯️ Light Tribute Candle'}</span>
          </button>
        </div>

        {/* Compact Patience Mode Card */}
        <div className="lg:col-span-5 bg-[#18191d] p-5 sm:p-6 rounded-3xl border-2 border-[#ff9d00]/70 shadow-xl flex flex-col justify-between text-white">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#ff9d00] font-bold uppercase tracking-wider mb-1">
              <Hourglass className="w-3.5 h-3.5 text-[#ff9d00]" />
              <span>Distraction-Free Focus</span>
            </div>
            <h3 className="font-handwritten text-2xl font-bold text-white mb-1">
              Patience Mode
            </h3>
            <p className="text-xs font-sans text-stone-300 leading-relaxed">
              Clear all page distractions and start a zen timer. Log sessions directly to the Tribute Wall upon exiting.
            </p>
          </div>

          <button
            onClick={handleTogglePatienceMode}
            id="btn-enter-patience-mode"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold font-handwritten px-4 py-2.5 rounded-xl border border-[#ffb733] shadow-md transition-transform active:scale-95 text-sm"
          >
            <EyeOff className="w-4 h-4 text-stone-950" />
            <span>🧘 Enter Patience Mode</span>
          </button>
        </div>
      </div>

      {/* Main Artifact Display */}
      <div className="bg-[#200c0e] p-6 sm:p-8 rounded-3xl border-2 border-[#6b1d24] shadow-lg shadow-red-950/40 mb-10 flex flex-col md:flex-row items-center gap-8 relative">
        <div className="absolute -top-3 right-10 w-24 h-5 masking-tape-dark rotate-[-2deg]" />

        <div className="shrink-0">
          <StickerAsset type="patience" />
        </div>

        <div className="space-y-3 flex-1 text-white">
          <div className="font-mono text-xs font-bold text-red-300">
            SPECIMEN #ART-0001
          </div>
          <h2 className="font-handwritten text-3xl font-bold text-red-100">
            "In Memory of My Patience"
          </h2>
          <p className="text-sm font-sans text-stone-300 leading-relaxed">
            Preserved specimen recovered from an open terminal window during a 42-minute deployment wait. Tests showed zero remaining patience cells left in the organism.
          </p>

          <div className="bg-[#4a0d12]/80 p-4 rounded-2xl border border-[#6b1d24] text-xs font-handwritten text-red-200">
            ✍️ Curator Note: "Patience is a renewable resource, provided you step away from the keyboard and get some fresh air."
          </div>
        </div>
      </div>

      {/* ACTIVITY LOGGING SECTION: Patience Incident Logger */}
      <div className="bg-[#200c0e] p-6 sm:p-8 rounded-3xl border-2 border-[#6b1d24] museum-card-shadow text-white mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-red-950">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-red-300 font-bold uppercase tracking-wider mb-1">
              <Hourglass className="w-4 h-4 text-red-300" />
              <span>Patience Incident Activity Logger</span>
            </div>
            <h3 className="font-handwritten text-2xl font-bold text-red-100">
              Log Patience Loss Incident
            </h3>
            <p className="text-stone-300 text-xs font-sans mt-0.5">
              Record specific incidents with patience loss percentages and status sub-options: Still Waiting, Expired, Survived, or Raging.
            </p>
          </div>

          <span className="font-mono text-xs bg-[#4a0d12] text-red-300 px-3 py-1.5 rounded-xl border border-[#6b1d24] font-bold shrink-0">
            {incidents.length} Incident{incidents.length !== 1 ? 's' : ''} Logged
          </span>
        </div>

        {/* Form to Log Patience Incident */}
        <form onSubmit={handleAddIncident} className="space-y-4 mb-8 bg-[#330f13]/80 p-5 rounded-2xl border border-red-900/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs text-red-300 mb-1 uppercase font-bold">
                Patience Loss Incident Event *
              </label>
              <input
                type="text"
                value={incidentInput}
                onChange={(e) => setIncidentInput(e.target.value)}
                placeholder="e.g. 'Webpack build stuck at 99% for 12 minutes...' "
                className="w-full px-4 py-2.5 rounded-xl border border-[#6b1d24] bg-[#200c0e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
                required
                id="input-patience-incident"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-red-300 mb-1 uppercase font-bold">
                Patience Loss (%): <span className="text-white font-bold">{lossPercentInput}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={lossPercentInput}
                onChange={(e) => setLossPercentInput(Number(e.target.value))}
                className="w-full h-2 bg-[#200c0e] rounded-lg appearance-none cursor-pointer accent-red-700 mt-2"
                id="slider-patience-loss"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs text-red-300 mb-1 uppercase font-bold">
                Status Sub-Option
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as PatienceIncidentItem['status'])}
                className="w-full px-4 py-2.5 rounded-xl border border-[#6b1d24] bg-[#200c0e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold"
                id="select-patience-status"
              >
                <option value="Still Waiting">⏳ Still Waiting</option>
                <option value="Expired">💀 Expired</option>
                <option value="Survived">🧘 Survived</option>
                <option value="Raging">🤬 Raging</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                id="btn-log-patience-incident"
                className="w-full px-6 py-2.5 bg-[#7f1d1d] hover:bg-[#991b1b] text-white font-bold rounded-xl text-sm font-handwritten flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Log Incident</span>
              </button>
            </div>
          </div>
        </form>

        {/* Incidents List with Sub-Options */}
        <div className="space-y-3">
          {incidents.length === 0 ? (
            <p className="text-stone-400 text-xs font-mono text-center py-4">No patience incidents logged yet.</p>
          ) : (
            incidents.map((inc) => {
              const statusBadges = {
                'Still Waiting': 'bg-amber-950/90 text-amber-300 border-amber-700',
                'Expired': 'bg-stone-800 text-stone-300 border-stone-600',
                'Survived': 'bg-emerald-950/90 text-emerald-300 border-emerald-600',
                'Raging': 'bg-red-950/90 text-red-300 border-red-800',
              };

              return (
                <div
                  key={inc.id}
                  className="bg-[#330f13]/80 p-4 rounded-2xl border border-red-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 bg-red-950 text-red-300 rounded border border-red-900 font-bold">
                        Patience Loss: {inc.lossPercent}%
                      </span>
                      <span className="text-stone-400">• {inc.createdAt}</span>
                    </div>
                    <h4 className="font-handwritten text-lg font-bold text-white">
                      "{inc.incident}"
                    </h4>
                  </div>

                  {/* Sub-Options Status Selector Buttons & Delete */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {(['Still Waiting', 'Expired', 'Survived', 'Raging'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateIncidentStatus(inc.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                          inc.status === st
                            ? `${statusBadges[st]} ring-2 ring-red-500 scale-105`
                            : 'bg-[#200c0e] text-stone-400 border-red-950 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleDeleteIncident(inc.id)}
                      className="ml-2 p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition-colors"
                      title="Delete Incident Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive Tribute Wall */}
      <div className="bg-[#131417]/95 p-6 rounded-3xl border border-[#2d2f36] shadow-xl text-white">
        <h3 className="font-handwritten text-2xl font-bold text-white mb-2">
          Tribute Wall
        </h3>
        <p className="text-xs text-stone-400 mb-4 font-sans">
          Leave a 1-line tribute to something that tested your patience today or view logged patience sessions.
        </p>

        <form onSubmit={handleAddTribute} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTribute}
            onChange={(e) => setNewTribute(e.target.value)}
            placeholder="e.g. RIP patience lost when the build failed on line 1042..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#2d2f36] bg-[#18191d] text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
            id="input-tribute"
          />
          <button
            type="submit"
            id="btn-add-tribute"
            className="px-5 py-2.5 bg-[#6b1d24] hover:bg-[#7f1d1d] text-white rounded-xl font-bold text-xs shadow transition-colors flex items-center gap-1.5 shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Leave Tribute</span>
          </button>
        </form>

        <div className="space-y-2">
          {tributes.length === 0 ? (
            <p className="text-stone-400 text-xs font-mono text-center py-4">
              No tributes on the wall yet. Leave a tribute or complete a patience session above!
            </p>
          ) : (
            tributes.map((trib) => (
              <div
                key={trib.id}
                className={`p-3 rounded-xl border font-handwritten text-sm flex items-center justify-between gap-3 text-white ${
                  trib.isSessionLog || trib.text.includes('Patience Session')
                    ? 'bg-[#3d1d07]/90 text-amber-200 border-[#b45309]'
                    : 'bg-[#200c0e] text-stone-200 border-[#6b1d24]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-red-400 shrink-0">🕯️</span>
                  <span className="break-words">"{trib.text}"</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTribute(trib.id)}
                  className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition-colors shrink-0"
                  title="Delete Tribute Log"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-300" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
