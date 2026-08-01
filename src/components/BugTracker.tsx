import React, { useState } from 'react';
import { EmotionalBug, SeverityLevel, BugStatus, BugCategory } from '../types';
import { Plus, Bug as BugIcon, CheckCircle2, ShieldAlert, Sparkles, Filter, Trash2, ArrowUpRight, Flame } from 'lucide-react';

import { playArtifactOpenSound } from '../lib/sound';

interface BugTrackerProps {
  bugs: EmotionalBug[];
  onAddBug: (bug: Omit<EmotionalBug, 'id' | 'bugCode' | 'timestamp'>) => void;
  onUpdateBug: (id: string, updates: Partial<EmotionalBug>) => void;
  onDeleteBug: (id: string) => void;
  onDonateBugToMuseum: (bug: EmotionalBug) => void;
  onUnlockAchievement: (id: string) => void;
}

export const BugTracker: React.FC<BugTrackerProps> = ({
  bugs,
  onAddBug,
  onUpdateBug,
  onDeleteBug,
  onDonateBugToMuseum,
  onUnlockAchievement,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [clickCountMap, setClickCountMap] = useState<Record<string, number>>({});
  const [breakToast, setBreakToast] = useState<string | null>(null);

  // New Bug Form State
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('Moderate');
  const [category, setCategory] = useState<BugCategory>('Productivity');
  const [description, setDescription] = useState('');

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddBug({
      title,
      severity,
      status: 'Investigating',
      category,
      description,
    });

    onUnlockAchievement('bug_reporter');

    setTitle('');
    setDescription('');
    setShowCreateModal(false);
  };

  const handleBugClick = (bugId: string) => {
    playArtifactOpenSound();
    const current = (clickCountMap[bugId] || 0) + 1;
    setClickCountMap((prev) => ({ ...prev, [bugId]: current }));

    if (current >= 5) {
      setBreakToast("Have you tried taking a break? (And maybe drinking a glass of water?) 🍵");
      setTimeout(() => setBreakToast(null), 4000);
      setClickCountMap((prev) => ({ ...prev, [bugId]: 0 }));
    }
  };

  const filteredBugs = bugs.filter((bug) => {
    if (selectedCategory === 'ALL') return true;
    return bug.category === selectedCategory;
  });

  const getSeverityBadgeClass = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Mild':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300';
      case 'Critical':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300';
      case 'Nuclear':
        return 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 animate-pulse';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Toast Notification for Spam Click Easter Egg */}
      {breakToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2b2927] text-amber-300 px-6 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 font-handwritten text-lg flex items-center gap-3 animate-bounce">
          <span>🍵</span>
          <span>{breakToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative bg-[#131417]/95 text-white p-6 sm:p-8 rounded-3xl museum-card-shadow border-2 border-[#2d2f36] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9d00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 right-10 w-32 h-6 masking-tape-dark rotate-[-3deg] opacity-90" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3d1d07] text-[#ff9d00] rounded-full text-xs font-mono mb-2 border border-[#b45309] font-bold">
              <BugIcon className="w-3.5 h-3.5 text-[#ff9d00]" />
              EMOTIONAL BUG TRACKER v2.6
            </div>
            <h1 className="font-handwritten text-3xl sm:text-4xl text-white font-bold">
              Log Your Emotional Software Glitches
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-xl">
              Procrastination, burnout, overthinking, and lost focus aren't personal flaws—they are undocumented features. Document them here or donate them directly to the Museum.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            id="btn-open-create-bug"
            className="flex items-center gap-2 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold px-5 py-3 rounded-2xl border-2 border-[#ffb733] shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5 text-stone-950" />
            <span>Report Emotional Bug</span>
          </button>
        </div>
      </div>

      {/* Category Filter & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#18191d] p-4 rounded-2xl border border-[#2d2f36] shadow-md text-white">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-[#ff9d00]" />
          <span className="text-xs font-mono uppercase text-stone-400 mr-2">Filter:</span>
          {['ALL', 'Productivity', 'Social', 'Focus', 'Energy', 'Code'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#ff9d00] text-stone-950 font-bold'
                  : 'bg-[#282a30] text-stone-300 hover:bg-[#343740]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-stone-400">
          Total Preserved Bugs: <span className="font-bold text-[#ff9d00]">{bugs.length}</span>
        </div>
      </div>

      {/* Bug List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBugs.map((bug) => (
          <div
            key={bug.id}
            onClick={() => handleBugClick(bug.id)}
            className="group relative bg-[#18191d] p-5 rounded-2xl border border-[#2d2f36] hover:border-[#ff9d00]/50 transition-all shadow-lg flex flex-col justify-between text-white"
          >
            {/* Top Tape Accent */}
            <div className="absolute -top-2 left-6 w-16 h-4 masking-tape-dark opacity-80 rotate-[-1deg]" />

            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-300 bg-[#282a30] px-2 py-0.5 rounded border border-[#3b3e48]">
                    {bug.bugCode}
                  </span>
                  <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${getSeverityBadgeClass(bug.severity)}`}>
                    {bug.severity}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400 bg-[#282a30] px-2 py-0.5 rounded">
                    {bug.category}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-stone-400">
                  {bug.timestamp}
                </div>
              </div>

              {/* Bug Title */}
              <h3 className="font-handwritten text-xl font-bold text-white group-hover:text-[#ff9d00] transition-colors">
                {bug.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-stone-300 mt-2 line-clamp-3 font-sans leading-relaxed">
                {bug.description}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-[#2d2f36] flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                  Status:
                  <span className="font-bold text-white">
                    {bug.status}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Donate to Museum Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDonateBugToMuseum(bug);
                  }}
                  title="Preserve in Museum AI Artifact Generator"
                  className="flex items-center gap-1 text-[#ff9d00] bg-[#3d1d07] hover:bg-[#52280a] px-2.5 py-1 rounded-lg border border-[#b45309] transition-colors font-handwritten text-xs font-bold"
                  id={`btn-donate-${bug.id}`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ff9d00]" />
                  <span>Donate to Museum</span>
                </button>

                {/* Resolve/Close toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newStatus: BugStatus = bug.status === 'Closed' ? 'Investigating' : 'Closed';
                    onUpdateBug(bug.id, { status: newStatus });
                  }}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    bug.status === 'Closed'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-[#282a30] text-stone-300 border-[#2d2f36] hover:bg-[#343740]'
                  }`}
                  title={bug.status === 'Closed' ? 'Reopen Bug' : 'Mark as Resolved'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBug(bug.id);
                  }}
                  className="p-1.5 rounded-lg bg-[#282a30] text-stone-400 hover:text-red-400 hover:bg-red-950/60 transition-colors border border-[#2d2f36]"
                  title="Delete Bug"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBugs.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#22201e] rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-800">
          <BugIcon className="w-12 h-12 mx-auto text-stone-300 mb-2" />
          <p className="font-handwritten text-xl text-stone-600 dark:text-stone-400">
            No bugs found in this category!
          </p>
          <p className="text-xs font-mono text-stone-400 mt-1">
            (You are either remarkably well-rested or in deep denial.)
          </p>
        </div>
      )}

      {/* Create Bug Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fdfbf7] dark:bg-[#22201e] text-[#2b2927] dark:text-[#f0ece1] w-full max-w-lg p-6 rounded-3xl border-2 border-[#2b2927] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* Top Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 masking-tape rotate-[1deg]" />

            <h2 className="font-handwritten text-2xl font-bold mb-1">
              File New Emotional Software Bug
            </h2>
            <p className="text-xs text-stone-500 mb-6 font-sans">
              Archive your human friction before it disappears into thin air.
            </p>

            <form onSubmit={handleCreateBug} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 dark:text-stone-400 mb-1">
                  Bug Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sudden Impulse to Reorganize Bookshelf at 1 AM"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#282623] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  id="input-bug-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 dark:text-stone-400 mb-1">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#282623] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    id="select-bug-severity"
                  >
                    <option value="Mild">Mild (Minor sigh)</option>
                    <option value="Moderate">Moderate (Staring at wall)</option>
                    <option value="Critical">Critical (Heavy coffee reliance)</option>
                    <option value="Nuclear">Nuclear (Tabs & panic)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 dark:text-stone-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BugCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#282623] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    id="select-bug-category"
                  >
                    <option value="Productivity">Productivity</option>
                    <option value="Social">Social</option>
                    <option value="Focus">Focus</option>
                    <option value="Energy">Energy</option>
                    <option value="Code">Code</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 dark:text-stone-400 mb-1">
                  Description & Symptoms
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened, how many cups of coffee were involved, and what tab you opened next..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#282623] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  id="textarea-bug-desc"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-bug"
                  className="px-5 py-2.5 rounded-xl bg-[#2b2927] hover:bg-black text-amber-300 font-bold text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  Save Bug to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
