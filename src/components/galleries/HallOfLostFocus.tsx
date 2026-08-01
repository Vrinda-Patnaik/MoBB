import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink, Sparkles, AlertCircle, RefreshCw, Plus, Trash2, Globe, Monitor } from 'lucide-react';
import { StickerAsset } from '../Stickers';

export interface FocusTabItem {
  id: string;
  tabTitle: string;
  category: string;
  status: 'Active Tab' | 'Distracted' | 'Closed' | 'Archived';
  createdAt: string;
}

const DEFAULT_TABS: FocusTabItem[] = [
  {
    id: 'tab-1',
    tabTitle: "Wikipedia: History of Mechanical Clocks",
    category: "Rabbit Hole",
    status: 'Distracted',
    createdAt: '10 mins ago',
  },
  {
    id: 'tab-2',
    tabTitle: "StackOverflow: How to center a div in 2026",
    category: "Coding",
    status: 'Active Tab',
    createdAt: 'Just now',
  },
  {
    id: 'tab-3',
    tabTitle: "Custom Mechanical Keycap Sets - Pre-order",
    category: "Shopping",
    status: 'Archived',
    createdAt: '1 hour ago',
  },
];

interface HallOfLostFocusProps {
  onUnlockAchievement: (id: string) => void;
}

export const HallOfLostFocus: React.FC<HallOfLostFocusProps> = ({ onUnlockAchievement }) => {
  const [openTabsCount, setOpenTabsCount] = useState<number>(14);
  const [distractionLog, setDistractionLog] = useState<string[]>([
    "Initial Intent: Read 1 documentation page about CSS Grid.",
    "Tab 2: Searching why cats knead on blankets.",
    "Tab 5: Watching a 45-minute documentary about mechanical clocks.",
  ]);

  // Open Tabs Activity Logging Persistent State
  const [tabs, setTabs] = useState<FocusTabItem[]>(() => {
    try {
      const stored = localStorage.getItem('museum_focus_tabs');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_TABS;
  });

  // Form State for New Tab / Distraction
  const [tabTitleInput, setTabTitleInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<string>('Rabbit Hole');
  const [statusInput, setStatusInput] = useState<FocusTabItem['status']>('Distracted');

  useEffect(() => {
    try {
      localStorage.setItem('museum_focus_tabs', JSON.stringify(tabs));
    } catch {}
  }, [tabs]);

  const handleTriggerDistraction = (type: string) => {
    onUnlockAchievement('focus_finder');
    setOpenTabsCount((prev) => prev + Math.floor(3 + Math.random() * 5));

    const distractionPrompts: Record<string, string[]> = {
      wiki: [
        "Opened Wikipedia: History of Trebuchets in 12th Century Siege Warfare.",
        "Opened Wikipedia: Why standard elevator music was invented in 1922.",
        "Opened Wikipedia: List of unusual units of measurement (attoparsec).",
      ],
      social: [
        "Checked phone: Scroll 25 minutes on short-form videos.",
        "Refreshed email: 0 new messages, but checked spam folder anyway.",
        "Opened Slack: Re-read general channel messages from yesterday.",
      ],
      theme: [
        "Opened VS Code settings: Spent 35 minutes testing syntax color schemes.",
        "Browsed mechanical keyboards: Added a $300 custom keycap set to cart.",
      ],
    };

    const options = distractionPrompts[type] || ["Distraction triggered! Focus level -10."];
    const picked = options[Math.floor(Math.random() * options.length)];
    setDistractionLog((prev) => [picked, ...prev]);
  };

  const handleResetFocus = () => {
    setOpenTabsCount(1);
    setDistractionLog(["Focus Reset: All browser tabs closed! Back to 1 single tab."]);
  };

  const handleAddTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabTitleInput.trim()) return;

    const newTab: FocusTabItem = {
      id: `tab-${Date.now()}`,
      tabTitle: tabTitleInput.trim(),
      category: categoryInput.trim() || 'General Distraction',
      status: statusInput,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTabs([newTab, ...tabs]);
    setTabTitleInput('');
    setStatusInput('Distracted');
    setOpenTabsCount((prev) => prev + 1);
    onUnlockAchievement('focus_finder');
  };

  const handleUpdateTabStatus = (id: string, newStatus: FocusTabItem['status']) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const handleDeleteTab = (id: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Title Banner - Purple Accent Dominance */}
      <div className="relative bg-[#170e24] text-white p-6 sm:p-8 rounded-3xl museum-card-shadow border-2 border-[#7e22ce] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 left-10 w-28 h-6 masking-tape-dark opacity-90" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950 text-purple-300 rounded-full text-xs font-mono mb-2 border border-purple-800 font-bold">
              <span>🐸</span>
              COGNITIVE DISTRACTION GALLERY
            </div>
            <h1 className="font-handwritten text-3xl sm:text-4xl text-purple-100 font-bold">
              Hall of Lost Focus
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-xl">
              Preserving the mysterious psychological phenomenon where a 5-second sanity check transforms into a 3-hour journey through unrelated internet rabbit holes.
            </p>
          </div>

          <div className="bg-[#2a1340] text-purple-200 px-5 py-3 rounded-2xl border border-[#7e22ce] text-center font-mono shrink-0">
            <span className="block text-2xl font-bold text-purple-300">{openTabsCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-stone-300">Simulated Open Tabs</span>
          </div>
        </div>
      </div>

      {/* Main Artifact & Tab Simulator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-stretch">
        {/* Specimen #ART-2048 Display */}
        <div className="lg:col-span-7 bg-[#170e24] p-6 sm:p-8 rounded-3xl border-2 border-[#7e22ce] shadow-lg shadow-purple-950/40 flex flex-col sm:flex-row items-center gap-6 relative">
          <div className="absolute -top-3 right-8 w-24 h-5 masking-tape-dark rotate-[2deg]" />

          <div className="shrink-0">
            <StickerAsset type="frog" />
          </div>

          <div className="space-y-3 flex-1 text-white">
            <div className="font-mono text-xs font-bold text-purple-400">
              SPECIMEN #ART-2048
            </div>
            <h2 className="font-handwritten text-3xl font-bold text-purple-100">
              "Hocus Pocus, You Lost Your Focus"
            </h2>
            <p className="text-sm font-sans text-stone-300 leading-relaxed">
              The Distraction Frog guards this room. Every time you attempt to focus on a single task, the frog casts an ancient spell that forces you to check phone notifications or read Wikipedia articles.
            </p>

            <div className="bg-[#2a1340]/80 p-3 rounded-2xl border border-[#7e22ce] text-xs font-handwritten text-purple-200">
              ✍️ Curator Note: "The mind is not broken; it is simply curious about medieval siege engines."
            </div>
          </div>
        </div>

        {/* Compact Tab Simulator Section */}
        <div className="lg:col-span-5 bg-[#131417]/95 p-5 sm:p-6 rounded-3xl border border-[#2d2f36] shadow-xl text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-handwritten text-2xl font-bold text-white flex items-center gap-2">
                <span>🌐</span>
                <span>Tab simulator</span>
              </h3>
              <span className="font-mono text-xs font-bold text-purple-300 bg-[#2a1340] px-2.5 py-1 rounded-lg border border-[#7e22ce]">
                {openTabsCount} tabs
              </span>
            </div>
            <p className="text-xs text-stone-400 mb-4 font-sans">
              Simulate opening random rabbit-hole tabs or clear your browser focus:
            </p>

            {/* Simple & Fun Controls */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => handleTriggerDistraction('wiki')}
                className="flex-1 px-3.5 py-2.5 bg-[#2a1340] hover:bg-[#3d1a5c] text-purple-200 rounded-xl font-handwritten font-bold text-sm border border-[#7e22ce] transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow"
                id="btn-tab-simulator-open"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>+ Open Random Tab</span>
              </button>
              <button
                onClick={handleResetFocus}
                className="px-3 py-2.5 bg-[#18191d] hover:bg-[#282a30] text-stone-300 rounded-xl font-mono text-xs font-bold border border-[#2d2f36] transition-transform active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                id="btn-tab-simulator-reset"
                title="Close all tabs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#ff9d00]" />
                <span>Reset</span>
              </button>
            </div>

            {/* Live Recent Tab Log */}
            <div className="bg-[#18191d] p-3 rounded-xl border border-[#2d2f36] max-h-36 overflow-y-auto space-y-1.5">
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
                Recent History:
              </div>
              {distractionLog.slice(0, 3).map((log, idx) => (
                <div key={idx} className="text-xs font-mono text-stone-300 flex items-center gap-1.5 truncate">
                  <span className="text-purple-400 shrink-0 text-[10px]">🔗</span>
                  <span className="truncate">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY LOGGING SECTION: Open Tabs & Distractions Activity Logger */}
      <div className="bg-[#170e24] p-6 sm:p-8 rounded-3xl border-2 border-[#7e22ce] museum-card-shadow text-white mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-900/60">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Open Tabs & Distractions Activity Logger</span>
            </div>
            <h3 className="font-handwritten text-2xl font-bold text-purple-100">
              Log Open Browser Tab / Distraction
            </h3>
            <p className="text-stone-300 text-xs font-sans mt-0.5">
              Record active open tabs or rabbit holes with status sub-options: Active Tab, Distracted, Closed, or Archived.
            </p>
          </div>

          <span className="font-mono text-xs bg-[#2a1340] text-purple-300 px-3 py-1.5 rounded-xl border border-purple-700 font-bold shrink-0">
            {tabs.length} Logged Tab{tabs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Form to Log Open Tab */}
        <form onSubmit={handleAddTab} className="space-y-4 mb-8 bg-[#25133b]/70 p-5 rounded-2xl border border-purple-800/60">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs text-purple-300 mb-1 uppercase font-bold">
                Tab Title / Website *
              </label>
              <input
                type="text"
                value={tabTitleInput}
                onChange={(e) => setTabTitleInput(e.target.value)}
                placeholder="e.g. 'Why do cats knead on blankets?' "
                className="w-full px-4 py-2.5 rounded-xl border border-purple-800 bg-[#170e24] text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-sans"
                required
                id="input-tab-title"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-purple-300 mb-1 uppercase font-bold">
                Category
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-purple-800 bg-[#170e24] text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono font-bold"
                id="select-tab-category"
              >
                <option value="Rabbit Hole">🌐 Wikipedia / Rabbit Hole</option>
                <option value="Social">📱 Social Media / Slack</option>
                <option value="Shopping">🛒 Shopping / Gadgets</option>
                <option value="Coding">💻 Theme / Syntax Tweaking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs text-purple-300 mb-1 uppercase font-bold">
                Initial Status Sub-Option
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as FocusTabItem['status'])}
                className="w-full px-4 py-2.5 rounded-xl border border-purple-800 bg-[#170e24] text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono font-bold"
                id="select-tab-status"
              >
                <option value="Active Tab">📌 Active Tab</option>
                <option value="Distracted">🐸 Distracted</option>
                <option value="Closed">✕ Closed</option>
                <option value="Archived">📂 Archived</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                id="btn-log-tab-distraction"
                className="w-full px-6 py-2.5 bg-[#7e22ce] hover:bg-purple-700 text-white font-bold rounded-xl text-sm font-handwritten flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Log Open Tab</span>
              </button>
            </div>
          </div>
        </form>

        {/* Tab Items List with Status Sub-Options */}
        <div className="space-y-3">
          {tabs.length === 0 ? (
            <p className="text-stone-400 text-xs font-mono text-center py-4">No open tabs logged yet.</p>
          ) : (
            tabs.map((tab) => {
              const statusBadges = {
                'Active Tab': 'bg-emerald-950/90 text-emerald-300 border-emerald-600',
                'Distracted': 'bg-purple-950/90 text-purple-300 border-purple-600',
                'Closed': 'bg-stone-800 text-stone-300 border-stone-600',
                'Archived': 'bg-[#2a1340] text-purple-200 border-purple-700',
              };

              return (
                <div
                  key={tab.id}
                  className="bg-[#25133b]/80 p-4 rounded-2xl border border-purple-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800 font-bold">
                        {tab.category}
                      </span>
                      <span className="text-stone-400">• {tab.createdAt}</span>
                    </div>
                    <h4 className="font-handwritten text-lg font-bold text-white flex items-center gap-2">
                      <span>🌐</span>
                      <span>"{tab.tabTitle}"</span>
                    </h4>
                  </div>

                  {/* Sub-Options Status Selector Buttons & Delete */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {(['Active Tab', 'Distracted', 'Closed', 'Archived'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateTabStatus(tab.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                          tab.status === st
                            ? `${statusBadges[st]} ring-2 ring-purple-400 scale-105`
                            : 'bg-[#170e24] text-stone-400 border-purple-950 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleDeleteTab(tab.id)}
                      className="ml-2 p-1.5 rounded-lg bg-purple-950 hover:bg-red-950 text-stone-300 hover:text-red-300 border border-purple-800 transition-colors"
                      title="Delete Tab Log"
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

    </div>
  );
};
