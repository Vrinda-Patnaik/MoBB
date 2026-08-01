import React, { useState, useEffect } from 'react';
import { Flame, Terminal, Coffee, Sparkles, AlertTriangle, Plus, Trash2, Heart, Activity } from 'lucide-react';
import { StickerAsset } from '../Stickers';

export interface BurnoutSymptomItem {
  id: string;
  symptom: string;
  severity: number; // 1 to 5 rating
  status: 'Burning' | 'Cooling' | 'Extinguished' | 'Recovered';
  createdAt: string;
}

const DEFAULT_SYMPTOMS: BurnoutSymptomItem[] = [
  {
    id: 'symp-1',
    symptom: "Left eye twitching at 3:15 AM while reading stack trace",
    severity: 5,
    status: 'Burning',
    createdAt: '03:15 AM',
  },
  {
    id: 'symp-2',
    symptom: "Refusing to close laptop until red test suite turns green",
    severity: 4,
    status: 'Cooling',
    createdAt: '02:40 AM',
  },
  {
    id: 'symp-3',
    symptom: "Explaining recursion out loud to rubber duck debugger",
    severity: 3,
    status: 'Recovered',
    createdAt: 'Yesterday',
  },
];

const COFFEE_ROASTS = [
  "[ROAST] Adding caffeine to a memory leak won't make it fix itself, chief.",
  "[ROAST] Blood type updated to 95% Espresso, 5% Panic.",
  "[ROAST] Pouring more coffee won't compile your broken code any faster!",
  "[ROAST] Warning: Heart rate equalizing with CPU fan RPM.",
  "[ROAST] Sleep is optional, but your sanity isn't. Take a break!",
  "[ROAST] Pouring 5th espresso... CPU temperature remains at critical roast levels.",
  "[ROAST] Debugging with coffee: turning jittery anxiety into bugs at 120 WPM.",
  "[ROAST] Rubber duck requests water instead of another espresso shot.",
  "[ROAST] Coffee level ++ | Bug level ++ | Progress == 0",
];

interface BurnoutExhibitProps {
  onUnlockAchievement: (id: string) => void;
}

export const BurnoutExhibit: React.FC<BurnoutExhibitProps> = ({ onUnlockAchievement }) => {
  const [isExtinguished, setIsExtinguished] = useState<boolean>(false);
  const [coffeeCount, setCoffeeCount] = useState<number>(4);
  const [logs, setLogs] = useState<string[]>([
    "02:00:01 [WARN] CPU Temperature: 94°C",
    "02:00:15 [FATAL] Overheating in module: infinite_loop_brain.ts",
    "02:00:30 [INFO] Coffee reserves depleted. Attempting cold brew backup...",
  ]);

  const handlePourCoffee = () => {
    setCoffeeCount((prev) => prev + 1);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const roast = COFFEE_ROASTS[Math.floor(Math.random() * COFFEE_ROASTS.length)];
    setLogs((prev) => [`${nowStr} ${roast}`, ...prev.slice(0, 8)]);
  };

  // Burnout Symptoms Activity Logging Persistent State
  const [symptoms, setSymptoms] = useState<BurnoutSymptomItem[]>(() => {
    try {
      const stored = localStorage.getItem('museum_burnout_symptoms');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SYMPTOMS;
  });

  // Form State for New Debugging Symptom Log
  const [symptomInput, setSymptomInput] = useState<string>('');
  const [severityInput, setSeverityInput] = useState<number>(4);
  const [statusInput, setStatusInput] = useState<BurnoutSymptomItem['status']>('Burning');

  useEffect(() => {
    try {
      localStorage.setItem('museum_burnout_symptoms', JSON.stringify(symptoms));
    } catch {}
  }, [symptoms]);

  // Terminal log typing loop effect
  useEffect(() => {
    if (isExtinguished) return;

    const interval = setInterval(() => {
      const additionalLogs = [
        "02:01:04 [WARN] Memory Leak in tab #47 (StackOverflow thread from 2018)",
        "02:01:20 [ERROR] Emotional Bandwidth exception: Out of Memory",
        "02:01:38 [CRITICAL] 12 Docker containers spinning silently in background",
        "02:02:01 [ALERT] Quack! Duck cooling fan requested immediately!",
      ];
      const nextLog = additionalLogs[Math.floor(Math.random() * additionalLogs.length)];
      setLogs((prev) => [nextLog, ...prev.slice(0, 8)]);
    }, 3500);

    return () => clearInterval(interval);
  }, [isExtinguished]);

  const handleDoubleClickLaptop = () => {
    setIsExtinguished(true);
    onUnlockAchievement('firefighter');
  };

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    const item: BurnoutSymptomItem = {
      id: `symp-${Date.now()}`,
      symptom: symptomInput.trim(),
      severity: Number(severityInput) || 3,
      status: statusInput,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSymptoms([item, ...symptoms]);
    setSymptomInput('');
    setSeverityInput(4);
    setStatusInput('Burning');
    onUnlockAchievement('firefighter');
  };

  const handleUpdateSymptomStatus = (id: string, newStatus: BurnoutSymptomItem['status']) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Title Banner & Burning Laptop Duck Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
        {/* Header Section */}
        <div className="lg:col-span-7 bg-[#1a120c] text-white p-6 rounded-3xl museum-card-shadow border-2 border-[#b45309] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-3 left-8 w-24 h-5 masking-tape-dark opacity-90" />

          <div className="relative z-10 mb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3d1d07]/90 text-[#f59e0b] rounded-full text-[11px] font-mono mb-2 border border-[#b45309]/80 font-bold">
              <Flame className="w-3.5 h-3.5 text-[#ff9d00]" />
              HIGH THERMAL EXHIBIT ROOM
            </div>
            <h1 className="font-handwritten text-3xl sm:text-4xl text-amber-100 font-bold">
              Burnout Exhibit
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 leading-relaxed">
              Preserving the physical and emotional temperature spike when human workload exceeds available cooling capacity.
            </p>
          </div>

          <div className="bg-[#3d1d07]/90 text-[#ff9d00] px-4 py-2.5 rounded-2xl border border-[#b45309] font-mono shrink-0 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-300 block">Thermal Status</span>
              <span className="text-lg font-bold text-[#ff9d00]">{isExtinguished ? '22°C (Cool)' : '98°C (BURNING)'}</span>
            </div>
            <span className="text-2xl">{isExtinguished ? '🧯' : '🔥'}</span>
          </div>
        </div>

        {/* Compact Burning Laptop Duck Section */}
        <div className="lg:col-span-5 bg-[#1a120c] p-5 sm:p-6 rounded-3xl border-2 border-[#b45309] shadow-lg shadow-amber-950/40 flex flex-col justify-between text-white relative">
          <div className="absolute -top-3 right-8 w-20 h-5 masking-tape-dark rotate-[-1deg]" />

          <div className="flex items-start gap-4">
            {/* Interactive Sticker Asset */}
            <div className="shrink-0 flex flex-col items-center">
              <StickerAsset
                type="laptop"
                isExtinguished={isExtinguished}
                onClick={handleDoubleClickLaptop}
              />
              <span className="text-[10px] font-handwritten text-[#ff9d00] mt-1 text-center">
                👇 Double-click to extinguish
              </span>
            </div>

            <div className="space-y-1.5 flex-1 text-white">
              <div className="font-mono text-[10px] font-bold text-[#ff9d00]">
                SPECIMEN #ART-1092
              </div>
              <h2 className="font-handwritten text-xl font-bold text-amber-100">
                The Burning Laptop Duck
              </h2>
              <p className="text-xs font-sans text-stone-300 leading-relaxed">
                Recovered beside 4 empty espresso cups. Refused to abandon keyboard until build errors resolved.
              </p>
            </div>
          </div>

          <div className="mt-3 bg-[#3d1d07]/80 p-2.5 rounded-xl border border-[#b45309] text-[11px] font-handwritten text-amber-200">
            ✍️ "If you smell smoke, it's either your CPU or your spirit. Please extinguish both!"
          </div>
        </div>
      </div>

      {/* ACTIVITY LOGGING SECTION: Late-Night Debugging Symptoms Logger */}
      <div className="bg-[#1a120c] p-6 sm:p-8 rounded-3xl border-2 border-[#b45309] museum-card-shadow text-white mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-900/60">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#ff9d00] font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-[#ff9d00]" />
              <span>Late-Night Debugging Symptom Activity Logger</span>
            </div>
            <h3 className="font-handwritten text-2xl font-bold text-amber-100">
              Log Debugging & Overheat Symptoms
            </h3>
            <p className="text-stone-300 text-xs font-sans mt-0.5">
              Log physical & emotional symptoms with severity ratings (1-5) and status sub-options: Burning, Cooling, Extinguished, or Recovered. Includes delete support.
            </p>
          </div>

          <span className="font-mono text-xs bg-[#3d1d07] text-[#ff9d00] px-3 py-1.5 rounded-xl border border-[#b45309] font-bold shrink-0">
            {symptoms.length} Symptom{symptoms.length !== 1 ? 's' : ''} Logged
          </span>
        </div>

        {/* Form to Log Debugging Symptom */}
        <form onSubmit={handleAddSymptom} className="space-y-4 mb-8 bg-[#2d180a]/80 p-5 rounded-2xl border border-[#b45309]/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs text-[#ff9d00] mb-1 uppercase font-bold">
                Late-Night Symptom / Event *
              </label>
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="e.g. 'Eye twitching at 3:30 AM over missing semicolon' "
                className="w-full px-4 py-2.5 rounded-xl border border-[#b45309] bg-[#1a120c] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9d00] font-sans"
                required
                id="input-symptom-name"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#ff9d00] mb-1 uppercase font-bold">
                Severity Rating: <span className="text-white font-bold">🔥 Level {severityInput}/5</span>
              </label>
              <select
                value={severityInput}
                onChange={(e) => setSeverityInput(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#b45309] bg-[#1a120c] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9d00] font-mono font-bold"
                id="select-symptom-severity"
              >
                <option value={1}>🔥 Level 1 - Mild Warmth</option>
                <option value={2}>🔥 Level 2 - Moderate Heat</option>
                <option value={3}>🔥 Level 3 - High Temperature</option>
                <option value={4}>🔥 Level 4 - Critical Overheat</option>
                <option value={5}>🔥 Level 5 - Total Meltdown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs text-[#ff9d00] mb-1 uppercase font-bold">
                Status Sub-Option
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as BurnoutSymptomItem['status'])}
                className="w-full px-4 py-2.5 rounded-xl border border-[#b45309] bg-[#1a120c] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9d00] font-mono font-bold"
                id="select-symptom-status"
              >
                <option value="Burning">🔥 Burning</option>
                <option value="Cooling">🧊 Cooling</option>
                <option value="Extinguished">🧯 Extinguished</option>
                <option value="Recovered">🌱 Recovered</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                id="btn-log-burnout-symptom"
                className="w-full px-6 py-2.5 bg-[#b45309] hover:bg-[#d97706] text-white font-bold rounded-xl text-sm font-handwritten flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Log Symptom</span>
              </button>
            </div>
          </div>
        </form>

        {/* Symptoms List with Sub-Options & Delete Support */}
        <div className="space-y-3">
          {symptoms.length === 0 ? (
            <p className="text-stone-400 text-xs font-mono text-center py-4">No debugging symptoms logged yet.</p>
          ) : (
            symptoms.map((symp) => {
              const statusBadges = {
                'Burning': 'bg-red-950/90 text-red-300 border-red-600',
                'Cooling': 'bg-blue-950/90 text-blue-300 border-blue-600',
                'Extinguished': 'bg-stone-800 text-stone-300 border-stone-600',
                'Recovered': 'bg-emerald-950/90 text-emerald-300 border-emerald-600',
              };

              return (
                <div
                  key={symp.id}
                  className="bg-[#2d180a]/80 p-4 rounded-2xl border border-[#b45309]/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 bg-[#3d1d07] text-[#ff9d00] rounded border border-[#b45309] font-bold">
                        🔥 Severity: {symp.severity}/5
                      </span>
                      <span className="text-stone-400">• {symp.createdAt}</span>
                    </div>
                    <h4 className="font-handwritten text-lg font-bold text-white">
                      "{symp.symptom}"
                    </h4>
                  </div>

                  {/* Sub-Options Status Selector Buttons & Delete Support */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {(['Burning', 'Cooling', 'Extinguished', 'Recovered'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateSymptomStatus(symp.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                          symp.status === st
                            ? `${statusBadges[st]} ring-2 ring-amber-400 scale-105`
                            : 'bg-[#1a120c] text-stone-400 border-amber-950 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleDeleteSymptom(symp.id)}
                      className="ml-2 p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition-colors"
                      title="Delete Symptom Log"
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

      {/* Realtime Terminal Errors Terminal */}
      <div className="bg-[#131417]/95 text-amber-200 p-6 rounded-3xl border border-[#2d2f36] font-mono shadow-xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2d2f36] pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2 text-xs">
            <Terminal className="w-4 h-4 text-[#ff9d00]" />
            <span className="font-bold text-white">SYSTEM_OVERHEAT_DIAGNOSTICS.LOG</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Coffee className="w-4 h-4 text-[#ff9d00]" />
            <span>Espresso Count: <strong className="text-white">{coffeeCount}</strong></span>
            <button
              onClick={handlePourCoffee}
              id="btn-[#pour-coffee]"
              className="px-2.5 py-1 bg-[#3d1d07] text-[#ff9d00] rounded-lg border border-[#b45309] text-[10px] hover:bg-[#52280a] font-bold transition-transform active:scale-95"
            >
              + Pour Coffee
            </button>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-stone-300 max-h-40 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-stone-600">&gt;</span>
              <span
                className={
                  log.includes('[ROAST]')
                    ? 'text-orange-400 font-bold'
                    : log.includes('FATAL') || log.includes('ERROR')
                    ? 'text-red-400 font-bold'
                    : log.includes('WARN')
                    ? 'text-amber-[#f59e0b]'
                    : 'text-stone-300'
                }
              >
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
