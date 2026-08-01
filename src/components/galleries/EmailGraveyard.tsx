import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Archive, Skull, Sparkles, CheckCircle2, Plus, AlertCircle } from 'lucide-react';
import { StickerAsset } from '../Stickers';

export interface DraftEmailItem {
  id: string;
  subject: string;
  recipient: string;
  reason: string;
  status: 'Overthinking' | 'Drafting' | 'Responded' | 'Archived';
  createdAt: string;
}

const DEFAULT_DRAFTS: DraftEmailItem[] = [
  {
    id: 'draft-1',
    subject: "Re: Quick sync on Q3 roadmap?",
    recipient: "boss@corp.com",
    reason: "Debating for 2 hours whether 'Sounds good!' has too many exclamation marks.",
    status: 'Overthinking',
    createdAt: 'Today at 09:14 AM',
  },
  {
    id: 'draft-2',
    subject: "Apologies for the delayed response",
    recipient: "client@agency.org",
    reason: "Spent 4 days drafting a polite excuse for why a 10-minute fix took 3 weeks.",
    status: 'Drafting',
    createdAt: 'Yesterday at 04:30 PM',
  },
  {
    id: 'draft-3',
    subject: "Per my last email...",
    recipient: "colleague@company.io",
    reason: "Softening the passive-aggressive tone before hitting send.",
    status: 'Archived',
    createdAt: '3 days ago',
  },
];

interface EmailGraveyardProps {
  onUnlockAchievement: (id: string) => void;
}

export const EmailGraveyard: React.FC<EmailGraveyardProps> = ({ onUnlockAchievement }) => {
  // Un-sent Draft Emails Persistent Activity Log State
  const [drafts, setDrafts] = useState<DraftEmailItem[]>(() => {
    try {
      const stored = localStorage.getItem('museum_draft_emails');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_DRAFTS;
  });

  // Form State for New Draft Email
  const [subjectInput, setSubjectInput] = useState<string>('');
  const [recipientInput, setRecipientInput] = useState<string>('');
  const [reasonInput, setReasonInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<DraftEmailItem['status']>('Overthinking');

  useEffect(() => {
    try {
      localStorage.setItem('museum_draft_emails', JSON.stringify(drafts));
    } catch {}
  }, [drafts]);

  const handleAddDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectInput.trim()) return;

    const newDraft: DraftEmailItem = {
      id: `draft-${Date.now()}`,
      subject: subjectInput.trim(),
      recipient: recipientInput.trim() || 'unsent-ghost@inbox.void',
      reason: reasonInput.trim() || 'Unsent draft preserved in the graveyard.',
      status: statusInput,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDrafts([newDraft, ...drafts]);
    setSubjectInput('');
    setRecipientInput('');
    setReasonInput('');
    setStatusInput('Overthinking');
    onUnlockAchievement('email_gravedigger');
  };

  const handleUpdateDraftStatus = (id: string, newStatus: DraftEmailItem['status']) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Title Banner - Charcoal/Blue Accent Dominance */}
      <div className="relative bg-[#0f172a] text-white p-6 sm:p-8 rounded-3xl museum-card-shadow border-2 border-[#3b82f6] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 left-10 w-28 h-6 masking-tape-dark opacity-90" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-blue-300 rounded-full text-xs font-mono mb-2 border border-blue-800 font-bold">
              <Skull className="w-3.5 h-3.5 text-blue-400" />
              DIGITAL GRAVEYARD EXHIBIT
            </div>
            <h1 className="font-handwritten text-3xl sm:text-4xl text-blue-100 font-bold">
              The Email Graveyard
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-xl">
              Where unread notifications, corporate jargon, and 'per my last email' pass away peacefully into the digital void.
            </p>
          </div>
        </div>
      </div>

      {/* Main Artifact Display */}
      <div className="bg-[#0f172a] p-6 sm:p-8 rounded-3xl border-2 border-[#3b82f6] shadow-lg shadow-blue-950/40 mb-10 flex flex-col md:flex-row items-center gap-8 relative">
        <div className="absolute -top-3 right-10 w-24 h-5 masking-tape-dark rotate-[-1deg]" />

        <div className="shrink-0">
          <StickerAsset type="email" />
        </div>

        <div className="space-y-3 flex-1 text-white">
          <div className="font-mono text-xs font-bold text-blue-400">
            SPECIMEN #ART-9901
          </div>
          <h2 className="font-handwritten text-3xl font-bold text-blue-100">
            "This Email Does Not Find Me Well"
          </h2>
          <p className="text-sm font-sans text-stone-300 leading-relaxed">
            Preserved specimen of a draft email reply that spent 3 hours in a compose window while the author debated whether adding two exclamation marks sounded 'too eager'.
          </p>

          <div className="bg-[#1e293b]/80 p-4 rounded-2xl border border-[#3b82f6] text-xs font-handwritten text-blue-200">
            ✍️ Curator Note: "Inbox Zero is a myth invented by productivity SaaS companies to sell subscription plans."
          </div>
        </div>
      </div>

      {/* ACTIVITY LOGGING SECTION: Un-sent Draft Emails Logger */}
      <div className="bg-[#0f172a] p-6 sm:p-8 rounded-3xl border-2 border-[#3b82f6] museum-card-shadow text-white mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Un-sent Draft Email Activity Log</span>
            </div>
            <h3 className="font-handwritten text-2xl font-bold text-blue-100">
              Preserve an Unsent Draft Email
            </h3>
            <p className="text-stone-300 text-xs font-sans mt-0.5">
              Log emails you hesitated to send with sub-options: Overthinking, Drafting, Responded, or Archived.
            </p>
          </div>

          <span className="font-mono text-xs bg-[#1e293b] text-blue-300 px-3 py-1.5 rounded-xl border border-blue-800 font-bold shrink-0">
            {drafts.length} Preserved Draft{drafts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Form to Log Unsent Draft Email */}
        <form onSubmit={handleAddDraft} className="space-y-4 mb-8 bg-[#1e293b]/60 p-5 rounded-2xl border border-blue-900/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-blue-300 mb-1 uppercase font-bold">
                Email Subject Line *
              </label>
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="e.g. 'Re: Quick question about timeline...' "
                className="w-full px-4 py-2.5 rounded-xl border border-blue-800 bg-[#0f172a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
                required
                id="input-draft-subject"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-blue-300 mb-1 uppercase font-bold">
                Recipient / To
              </label>
              <input
                type="text"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                placeholder="e.g. 'team-lead@company.com' or 'client'..."
                className="w-full px-4 py-2.5 rounded-xl border border-blue-800 bg-[#0f172a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
                id="input-draft-recipient"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs text-blue-300 mb-1 uppercase font-bold">
                Reason / Overthinking Context
              </label>
              <input
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="e.g. 'Spent 45 mins deleting exclamation marks...' "
                className="w-full px-4 py-2.5 rounded-xl border border-blue-800 bg-[#0f172a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
                id="input-draft-reason"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-blue-300 mb-1 uppercase font-bold">
                Initial Status
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as DraftEmailItem['status'])}
                className="w-full px-4 py-2.5 rounded-xl border border-blue-800 bg-[#0f172a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono font-bold"
                id="select-draft-status"
              >
                <option value="Overthinking">🤔 Overthinking</option>
                <option value="Drafting">✍️ Drafting</option>
                <option value="Responded">📩 Responded</option>
                <option value="Archived">🪦 Archived</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              id="btn-log-draft-email"
              className="w-full sm:w-auto px-6 py-3 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl text-sm font-handwritten flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Unsent Draft Email</span>
            </button>
          </div>
        </form>

        {/* Draft Items List with Status Sub-Options */}
        <div className="space-y-3">
          {drafts.length === 0 ? (
            <p className="text-stone-400 text-xs font-mono text-center py-4">No draft emails logged yet.</p>
          ) : (
            drafts.map((draft) => {
              const statusBadges = {
                Overthinking: 'bg-amber-950/80 text-amber-300 border-amber-700',
                Drafting: 'bg-blue-950/80 text-blue-300 border-blue-700',
                Responded: 'bg-emerald-950/80 text-emerald-300 border-emerald-600',
                Archived: 'bg-slate-800 text-slate-300 border-slate-600',
              };

              return (
                <div
                  key={draft.id}
                  className="bg-[#1e293b] p-4 rounded-2xl border border-blue-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-blue-300">TO: {draft.recipient}</span>
                      <span className="text-stone-400">• {draft.createdAt}</span>
                    </div>
                    <h4 className="font-handwritten text-lg font-bold text-white">
                      "{draft.subject}"
                    </h4>
                    <p className="text-xs text-stone-300 font-sans italic">
                      "{draft.reason}"
                    </p>
                  </div>

                  {/* Sub-Options Status Selector Buttons & Delete */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {(['Overthinking', 'Drafting', 'Responded', 'Archived'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateDraftStatus(draft.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                          draft.status === st
                            ? `${statusBadges[st]} ring-2 ring-blue-400 scale-105`
                            : 'bg-[#0f172a] text-stone-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="ml-2 p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-red-200 border border-red-800 transition-colors"
                      title="Delete Draft"
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
