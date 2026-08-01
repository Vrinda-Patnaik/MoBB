import React from 'react';
import { ArrowRight, Sparkles, Shield, Bookmark, Compass } from 'lucide-react';
import { GalleryId } from '../../types';

interface EntranceHallProps {
  onNavigate: (galleryId: GalleryId) => void;
}

export const EntranceHall: React.FC<EntranceHallProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Hero Welcome Plaque */}
      <div className="relative bg-[#131417]/95 text-white p-8 sm:p-12 rounded-3xl museum-card-shadow border-2 border-[#2d2f36] overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff9d00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-4 left-12 w-36 h-7 masking-tape-dark rotate-[-2deg] opacity-90" />
        <div className="absolute -top-4 right-12 w-36 h-7 masking-tape-dark rotate-[2deg] opacity-90" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-block text-4xl mb-3 animate-bounce">🏛️</span>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#3d1d07]/90 text-[#f59e0b] rounded-full text-xs font-mono mb-4 border border-[#b45309]/80 font-bold shadow-md">
            WELCOME TO THE GRAND HALL
          </div>
          <h1 className="font-handwritten text-4xl sm:text-5xl text-white font-bold leading-tight">
            The Museum of Broken Builds: Entrance Hall
          </h1>
          <p className="text-stone-300 text-base sm:text-lg mt-4 font-sans leading-relaxed">
            Every software system has an issue tracker. This is the world's first <span className="text-[#ff9d00] font-semibold">Emotional Bug Tracking Museum</span>—where procrastination, burnout, overthinking, and lost focus are preserved as historical artifacts.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('patience')}
              className="flex items-center gap-2 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg border-2 border-[#ffb733] transition-transform hover:scale-105 active:scale-95 text-base"
              id="btn-begin-exhibits"
            >
              <span>Begin Museum Tour</span>
              <ArrowRight className="w-5 h-5 text-stone-950" />
            </button>
            <button
              onClick={() => onNavigate('tracker')}
              className="flex items-center gap-2 bg-[#18191d] hover:bg-[#282a30] text-stone-200 px-5 py-3.5 rounded-2xl border border-[#2d2f36] transition-colors text-sm font-mono"
            >
              <Compass className="w-4 h-4 text-[#ff9d00]" />
              <span>Open Bug Tracker</span>
            </button>
          </div>
        </div>
      </div>

      {/* Curator Statement Card */}
      <div className="bg-[#e2e1dc] text-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-300 shadow-xl mb-10 relative">
        <div className="absolute -top-3 left-8 w-24 h-5 masking-tape rotate-[1deg]" />

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-16 h-16 bg-[#ff9d00] text-stone-950 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2 border-stone-900 shadow">
            🦆
          </div>
          <div>
            <h3 className="font-handwritten text-2xl font-bold text-stone-900">
              Curator's Manifesto
            </h3>
            <p className="text-stone-800 text-sm mt-2 font-sans leading-relaxed">
              "We built The Museum of Broken Builds on a simple truth: pretending you have everything together at 100% capacity is an unmaintainable architectural debt. When you step inside these galleries, remember that every bug preserved here was experienced by thousands of students, developers, designers, and thinkers before you."
            </p>
            <span className="block mt-3 text-xs font-mono font-bold text-amber-900">
              — Dr. Quackers, Senior Museum Curator & Software Engineer
            </span>
          </div>
        </div>
      </div>

      {/* Quick Exhibit Wings Grid */}
      <h3 className="font-handwritten text-2xl font-bold text-white mb-4">
        Museum Galleries Wing
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { id: 'patience', title: 'Hall of Lost Patience', desc: 'Memorial for depleted reserves', color: 'border-2 border-[#b91c1c] bg-[#200c0e] text-white shadow-lg shadow-red-950/40', icon: '🪦' },
          { id: 'focus', title: 'Hall of Lost Focus', desc: 'Rabbit holes & tab overload', color: 'border-2 border-[#7e22ce] bg-[#170e24] text-white shadow-lg shadow-purple-950/40', icon: '🐸' },
          { id: 'burnout', title: 'Burnout Exhibit', desc: 'The Burning Laptop Duck', color: 'border-2 border-[#b45309] bg-[#1a120c] text-white shadow-lg shadow-amber-950/40', icon: '🔥' },
          { id: 'email', title: 'Email Graveyard', desc: '99+ Unread Notifications', color: 'border-2 border-[#3b82f6] bg-[#0f172a] text-white shadow-lg shadow-blue-950/40', icon: '💀' },
          { id: 'recovery', title: 'CTRL Recovery Room', desc: 'Hopeful & calm reset space', color: 'border-2 border-[#10b981] bg-[#062e1e] text-white shadow-lg shadow-emerald-950/40', icon: '🌿' },
          { id: 'achievements', title: 'Trophy Cabinet', desc: 'Unlocked museum achievements', color: 'border-2 border-[#f59e0b] bg-[#2a1e05] text-white shadow-lg shadow-amber-950/40', icon: '🏆' },
        ].map((wing) => (
          <div
            key={wing.id}
            onClick={() => onNavigate(wing.id as GalleryId)}
            className={`p-5 rounded-2xl ${wing.color} hover:scale-[1.02] transition-transform cursor-pointer flex flex-col justify-between`}
          >
            <div>
              <span className="text-3xl mb-2 block">{wing.icon}</span>
              <h4 className="font-handwritten text-xl font-bold text-white">
                {wing.title}
              </h4>
              <p className="text-xs text-stone-300 mt-1 font-sans">
                {wing.desc}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
              <span>Enter Room</span>
              <ArrowRight className="w-4 h-4 text-[#ff9d00]" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
