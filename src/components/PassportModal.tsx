import React from 'react';
import { PassportStamp, GalleryId } from '../types';
import { Award, CheckCircle, Stamp, X, Sparkles } from 'lucide-react';
import { playArtifactOpenSound } from '../lib/sound';

interface PassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stamps: PassportStamp[];
  onNavigateGallery: (galleryId: GalleryId) => void;
}

export const ALL_GALLERIES: { id: GalleryId; name: string; icon: string; description: string }[] = [
  { id: 'entrance', name: 'Entrance Hall', icon: '🏛️', description: 'Origin of The Museum of Broken Builds' },
  { id: 'patience', name: 'Hall of Lost Patience', icon: '🪦', description: 'Memorial for depleted patience reserves' },
  { id: 'focus', name: 'Hall of Lost Focus', icon: '🐸', description: 'Distraction & rabbit hole simulator' },
  { id: 'burnout', name: 'Burnout Exhibit', icon: '🔥', description: 'The Burning Laptop Duck' },
  { id: 'email', name: 'Email Graveyard', icon: '💀', description: '99+ Unread Notifications' },
  { id: 'recovery', name: 'CTRL Recovery Room', icon: '🌿', description: 'You Did The Thing Anyway' },
];

export const PassportModal: React.FC<PassportModalProps> = ({
  isOpen,
  onClose,
  stamps,
  onNavigateGallery,
}) => {
  if (!isOpen) return null;

  const stampedIds = new Set(stamps.map((s) => s.galleryId));
  const progressPercent = Math.round((stampedIds.size / ALL_GALLERIES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131417] text-white w-full max-w-xl p-6 sm:p-8 rounded-3xl border-2 border-[#2d2f36] museum-card-shadow relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden font-sans">
        
        {/* Top Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-6 masking-tape-dark rotate-[-1deg] opacity-90" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2d2f36] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#3d1d07] rounded-2xl flex items-center justify-center text-2xl border border-[#b45309]">
              🛂
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-[#ff9d00] tracking-widest uppercase">
                OFFICIAL MUSEUM DOCUMENT
              </div>
              <h2 className="font-handwritten text-2xl font-bold text-white">
                Museum Passport
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#282a30] transition-colors"
            id="btn-close-passport"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#18191d] p-4 rounded-2xl border border-[#2d2f36] mb-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="font-bold text-stone-300">Galleries Visited:</span>
            <span className="font-bold text-[#ff9d00]">{stampedIds.size} / {ALL_GALLERIES.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3 bg-[#121316] rounded-full overflow-hidden p-0.5 border border-[#2d2f36]">
            <div
              className="h-full bg-[#ff9d00] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Gallery Stamp Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {ALL_GALLERIES.map((gal) => {
            const isStamped = stampedIds.has(gal.id);
            const stampData = stamps.find((s) => s.galleryId === gal.id);

            return (
              <div
                key={gal.id}
                onClick={() => {
                  playArtifactOpenSound();
                  onNavigateGallery(gal.id);
                  onClose();
                }}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                  isStamped
                    ? 'bg-[#18191d] border-[#ff9d00]/60 shadow-md text-white'
                    : 'bg-[#121316]/60 border-dashed border-[#2d2f36] opacity-60 hover:opacity-100 text-stone-400'
                }`}
              >
                {/* Stamp Graphic */}
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#ff9d00] flex items-center justify-center text-2xl mb-2 relative rotate-[-4deg]">
                  <span>{gal.icon}</span>
                  {isStamped && (
                    <div className="absolute -bottom-1 -right-1 bg-[#ff9d00] text-stone-950 p-0.5 rounded-full border border-stone-950 shadow">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <h4 className="font-handwritten font-bold text-sm text-white">
                  {gal.name}
                </h4>

                <span className="text-[10px] font-mono text-stone-400 mt-1">
                  {isStamped ? `Stamped ${stampData?.stampedAt.slice(0, 5)}` : 'Unvisited'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Completion Banner */}
        {stampedIds.size === ALL_GALLERIES.length && (
          <div className="bg-[#ff9d00] text-stone-950 p-4 rounded-2xl text-center font-handwritten font-bold shadow-md border-2 border-[#ffb733] flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-5 h-5 text-stone-950" />
            <span>Master Curator Passport Complete! Final Achievement Unlocked!</span>
          </div>
        )}

      </div>
    </div>
  );
};
