import React from 'react';

interface StickerProps {
  type: 'laptop' | 'frog' | 'patience' | 'email' | 'social' | 'heart' | 'duck';
  className?: string;
  isExtinguished?: boolean;
  onClick?: () => void;
  showAnnotations?: boolean;
}

export const StickerAsset: React.FC<StickerProps> = ({
  type,
  className = '',
  isExtinguished = false,
  onClick,
  showAnnotations = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group transition-transform duration-300 hover:scale-[1.03] ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Top Tape Strip */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 masking-tape border-t border-b border-black/10 z-20 rotate-[-2deg]" />

      {/* Main Sticker Frame */}
      <div className="relative bg-[#fcfaf5] dark:bg-[#282623] p-4 rounded-xl border-2 border-[#2b2927]/20 dark:border-white/20 shadow-md flex flex-col items-center justify-center overflow-hidden">
        
        {/* Subtle Paper Grain */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2b2927_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        {/* Sticker Graphics */}
        <div className="relative z-10 w-36 h-36 flex items-center justify-center my-1">
          {type === 'laptop' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Flames if not extinguished */}
              {!isExtinguished ? (
                <div className="absolute -top-4 animate-bounce z-10 flex gap-1">
                  <span className="text-3xl animate-pulse">🔥</span>
                  <span className="text-2xl animate-ping">🔥</span>
                  <span className="text-3xl animate-pulse">🔥</span>
                </div>
              ) : (
                <div className="absolute -top-5 z-10 text-xs font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  💨 FIRE EXTINGUISHED!
                </div>
              )}

              {/* Hand-drawn style laptop + Duck */}
              <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-sm">
                {/* Screen */}
                <rect x="15" y="15" width="70" height="48" rx="4" fill="#e8e4d9" stroke="#2b2927" strokeWidth="2.5" />
                {/* Display Content */}
                <rect x="20" y="20" width="60" height="38" rx="2" fill={isExtinguished ? '#222' : '#2b1500'} />
                {/* Terminal text */}
                {!isExtinguished ? (
                  <>
                    <text x="24" y="32" fill="#ff6b00" fontSize="6" fontFamily="monospace">ERR_OVERHEAT: 98°C</text>
                    <text x="24" y="42" fill="#ffaa00" fontSize="5" fontFamily="monospace">CPU_USAGE: 999%</text>
                    <text x="24" y="50" fill="#ff4400" fontSize="5" fontFamily="monospace">burnout.ts: FATAL</text>
                  </>
                ) : (
                  <>
                    <text x="24" y="32" fill="#10b981" fontSize="6" fontFamily="monospace">SYSTEM_COOLING: OK</text>
                    <text x="24" y="42" fill="#34d399" fontSize="5" fontFamily="monospace">Patience Restored</text>
                    <text x="24" y="50" fill="#a7f3d0" fontSize="5" fontFamily="monospace">*quack soft peace*</text>
                  </>
                )}
                {/* Laptop Base */}
                <path d="M 5 66 L 95 66 L 85 82 L 15 82 Z" fill="#d3cfc2" stroke="#2b2927" strokeWidth="2.5" />
                <rect x="40" y="70" width="20" height="4" rx="1" fill="#a39f93" />

                {/* Duck mascot sitting on laptop keyboard */}
                <g transform="translate(62, 52) scale(0.35)">
                  <path d="M20,40 Q20,20 40,20 Q60,20 60,40 Q60,60 40,60 Q20,60 20,40 Z" fill="#facc15" stroke="#2b2927" strokeWidth="3"/>
                  <circle cx="32" cy="32" r="4" fill="#2b2927"/>
                  <path d="M15,38 Q5,38 10,46 Q20,46 20,38 Z" fill="#f97316" stroke="#2b2927" strokeWidth="2"/>
                </g>
              </svg>
            </div>
          )}

          {type === 'frog' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-sm">
                {/* Frog Body */}
                <ellipse cx="50" cy="58" rx="32" ry="24" fill="#a3e635" stroke="#2b2927" strokeWidth="2.5" />
                {/* Frog Eyes */}
                <circle cx="36" cy="34" r="10" fill="#a3e635" stroke="#2b2927" strokeWidth="2.5" />
                <circle cx="64" cy="34" r="10" fill="#a3e635" stroke="#2b2927" strokeWidth="2.5" />
                <circle cx="36" cy="34" r="4" fill="#2b2927" />
                <circle cx="64" cy="34" r="4" fill="#2b2927" />
                <circle cx="38" cy="32" r="1.5" fill="#fff" />
                <circle cx="66" cy="32" r="1.5" fill="#fff" />
                {/* Frog Mouth & Spiral Distraction Eyes */}
                <path d="M 38 60 Q 50 68 62 60" fill="none" stroke="#2b2927" strokeWidth="2.5" strokeLinecap="round" />
                {/* Crown / Distraction Sparkles */}
                <path d="M 42 18 L 47 10 L 50 16 L 53 10 L 58 18 Z" fill="#fbbf24" stroke="#2b2927" strokeWidth="1.5" />
              </svg>
              <div className="absolute bottom-1 bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded border border-purple-300/50">
                🐸 HOCUS POCUS FOCUS
              </div>
            </div>
          )}

          {type === 'patience' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-sm">
                {/* Tombstone / Memorial Stone */}
                <path d="M 25 85 L 25 35 A 25 25 0 0 1 75 35 L 75 85 Z" fill="#d1d5db" stroke="#2b2927" strokeWidth="2.5" />
                {/* Engraving */}
                <text x="50" y="42" textAnchor="middle" fill="#374151" fontSize="7" fontWeight="bold" fontFamily="sans-serif">R.I.P.</text>
                <text x="50" y="52" textAnchor="middle" fill="#4b5563" fontSize="6" fontFamily="sans-serif">MY PATIENCE</text>
                <text x="50" y="60" textAnchor="middle" fill="#6b7280" fontSize="5" fontFamily="monospace">2026 - 2026</text>
                <text x="50" y="72" textAnchor="middle" fill="#ef4444" fontSize="4.5" fontFamily="sans-serif">"Per my last email..."</text>
                {/* Small candle beside stone */}
                <rect x="12" y="70" width="8" height="15" fill="#fff" stroke="#2b2927" strokeWidth="1.5" />
                <path d="M 16 64 Q 18 68 16 70" fill="none" stroke="#f97316" strokeWidth="2" />
              </svg>
            </div>
          )}

          {type === 'email' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-sm">
                {/* Overflowing Envelope */}
                <rect x="15" y="35" width="70" height="48" rx="3" fill="#374151" stroke="#2b2927" strokeWidth="2.5" />
                <path d="M 15 35 L 50 60 L 85 35" fill="none" stroke="#f3f4f6" strokeWidth="2.5" />
                {/* Unread badge explosion */}
                <circle cx="78" cy="28" r="14" fill="#ef4444" stroke="#2b2927" strokeWidth="2" />
                <text x="78" y="32" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">99+</text>
                {/* Tombstone cross / Skeleton mark */}
                <path d="M 42 18 L 58 18 M 50 10 L 50 26" stroke="#e5e7eb" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-1 bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-300 text-[9.5px] font-mono px-2 py-0.5 rounded border border-red-300/50">
                💀 UNREAD FOREVER
              </div>
            </div>
          )}

          {type === 'social' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-sm">
                <rect x="15" y="25" width="70" height="50" rx="6" fill="#1f2937" stroke="#2b2927" strokeWidth="2.5" />
                <text x="50" y="48" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="monospace">404</text>
                <text x="50" y="60" textAnchor="middle" fill="#9ca3af" fontSize="5.5" fontFamily="monospace">SOCIAL_SKILLS_NOT_FOUND</text>
              </svg>
            </div>
          )}

          {type === 'heart' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-sm">
                <path d="M 50 82 C 20 60 10 40 25 25 C 38 12 48 24 50 30 C 52 24 62 12 75 25 C 90 40 80 60 50 82 Z" fill="#ec4899" stroke="#2b2927" strokeWidth="2.5" />
                <path d="M 40 38 Q 45 32 52 38" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-1 bg-pink-100 dark:bg-pink-950/80 text-pink-900 dark:text-pink-300 text-[10px] font-handwritten font-bold px-2 py-0.5 rounded">
                ❤️ Take a Breath
              </div>
            </div>
          )}

          {type === 'duck' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-28 h-28 drop-shadow-sm">
                <path d="M 25 55 Q 15 35 35 25 Q 55 15 70 30 Q 80 45 75 60 Q 65 80 35 75 Q 15 70 25 55 Z" fill="#facc15" stroke="#2b2927" strokeWidth="2.5" />
                <circle cx="58" cy="38" r="4" fill="#2b2927" />
                <circle cx="60" cy="36" r="1" fill="#fff" />
                {/* Beak */}
                <path d="M 70 38 Q 85 36 82 45 Q 72 48 68 42 Z" fill="#f97316" stroke="#2b2927" strokeWidth="2" />
                {/* Tiny Detective Hat or Glasses */}
                <path d="M 45 22 L 65 18 M 50 15 L 60 13 L 58 20 Z" fill="#374151" stroke="#2b2927" strokeWidth="1.5" />
              </svg>
            </div>
          )}
        </div>

        {/* Handwritten Label / Caption surround */}
        {showAnnotations && (
          <div className="mt-1 text-center font-handwritten text-sm text-[#2b2927] dark:text-[#e2ded4] flex items-center justify-center gap-1">
            <span className="opacity-60">✍️</span>
            <span>
              {type === 'laptop' && 'Burnout Artifact #01'}
              {type === 'frog' && 'Lost Focus Specimen'}
              {type === 'patience' && 'Patience Memorial'}
              {type === 'email' && 'Email Graveyard #99+'}
              {type === 'social' && 'Social Battery 0%'}
              {type === 'heart' && 'Self-Kindness Token'}
              {type === 'duck' && 'Senior Duck Curator'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Tape or Sticky Tag */}
      <div className="absolute -bottom-2 right-2 w-16 h-4 masking-tape border-t border-b border-black/10 z-20 rotate-[3deg]" />
    </div>
  );
};
