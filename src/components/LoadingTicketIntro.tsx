import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Ticket, ArrowRight, Volume2 } from 'lucide-react';
import { playQuackSound, playArtifactOpenSound } from '../lib/sound';

interface LoadingTicketIntroProps {
  onComplete: (visitorName: string) => void;
}

export const LoadingTicketIntro: React.FC<LoadingTicketIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'loading' | 'ticket'>('loading');
  const [progress, setProgress] = useState<number>(0);
  const [loadingTextIndex, setLoadingTextIndex] = useState<number>(0);
  const [visitorName, setVisitorName] = useState<string>('Fellow Developer');
  const [ticketNumber] = useState<string>(() => `TKT-${Math.floor(10000 + Math.random() * 90000)}`);
  const [issueTime] = useState<string>(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isTicketPrinted, setIsTicketPrinted] = useState<boolean>(false);

  const loadingMessages = [
    'Extracting procrastination artifacts...',
    'Polishing duck debuggers...',
    'Lighting memorial candles in Hall of Lost Patience...',
    'Cataloging 99+ unread email ghosts...',
    'Buffering emotional recovery loops...',
    'Preparing your Museum Visitor Pass...',
  ];

  // Loading Progress Bar Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStage('ticket');
            playArtifactOpenSound();
          }, 400);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 5;
        const currentProgress = next > 100 ? 100 : next;

        // Change text message periodically
        if (currentProgress > 20 && currentProgress < 40) setLoadingTextIndex(1);
        else if (currentProgress >= 40 && currentProgress < 65) setLoadingTextIndex(2);
        else if (currentProgress >= 65 && currentProgress < 85) setLoadingTextIndex(3);
        else if (currentProgress >= 85 && currentProgress < 98) setLoadingTextIndex(4);
        else if (currentProgress >= 98) setLoadingTextIndex(5);

        return currentProgress;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Trigger ticket print animation when entering ticket stage
  useEffect(() => {
    if (stage === 'ticket') {
      const timer = setTimeout(() => {
        setIsTicketPrinted(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleClaimTicket = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    playQuackSound(400);
    onComplete(visitorName.trim() || 'Honored Guest');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#101114] text-white flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {stage === 'loading' ? (
        /* STAGE 1: Fake Loading Screen with Animated Duck & Progress Bar */
        <div className="relative z-10 w-full max-w-lg bg-[#18191d] p-8 sm:p-10 rounded-3xl border-2 border-[#2d2f36] museum-card-shadow text-center">
          
          {/* Masking Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 masking-tape-dark opacity-90 rotate-[-1deg]" />

          {/* Quacking Duck Icon with wobble */}
          <div className="relative inline-block my-4">
            <div
              className="text-6xl sm:text-7xl cursor-pointer hover:scale-110 transition-transform duration-200"
              style={{
                transform: `translateX(${(progress / 100) * 20 - 10}px) rotate(${progress % 2 === 0 ? -3 : 3}deg)`,
              }}
              onClick={() => playQuackSound(420)}
              title="Click the duck to quack!"
            >
              🦆
            </div>
            <div className="absolute -bottom-2 right-0 bg-[#ff9d00] text-stone-950 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border border-black shadow">
              QUACK
            </div>
          </div>

          <h2 className="font-handwritten text-3xl font-bold text-white mb-2">
            The Museum of Broken Builds
          </h2>
          <p className="text-xs font-mono text-[#ff9d00] mb-8 uppercase tracking-widest">
            INITIALIZING EMOTIONAL BUG ENGINE...
          </p>

          {/* Animated Progress Bar Track */}
          <div className="relative w-full h-5 bg-[#121316] rounded-full p-1 border border-[#2d2f36] overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#b45309] via-[#ff9d00] to-[#ffb733] rounded-full transition-all duration-150 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shine highlight animation */}
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-xs text-stone-400 mb-6">
            <span className="truncate max-w-[260px] text-left text-stone-300">
              {loadingMessages[loadingTextIndex]}
            </span>
            <span className="font-bold text-[#ff9d00]">{progress}%</span>
          </div>

          <div className="text-[11px] font-handwritten text-stone-500 italic">
            "Patience is preserved under museum glass..."
          </div>
        </div>
      ) : (
        /* STAGE 2: Museum Ticket Generation & Entrance Pass */
        <div className="relative z-10 w-full max-w-xl bg-[#18191d] p-6 sm:p-8 rounded-3xl border-2 border-[#ff9d00]/80 museum-card-shadow text-white animate-in fade-in zoom-in-95 duration-300">
          
          {/* Masking Tape */}
          <div className="absolute -top-3 left-10 w-32 h-6 masking-tape-dark rotate-[-2deg]" />
          <div className="absolute -top-3 right-10 w-32 h-6 masking-tape-dark rotate-[2deg]" />

          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-[#3d1d07] text-[#ff9d00] rounded-full text-xs font-mono mb-2 border border-[#b45309] font-bold">
              🎟️ ADMISSION CONFIRMED
            </span>
            <h2 className="font-handwritten text-3xl sm:text-4xl font-bold text-white">
              Your Museum Ticket
            </h2>
            <p className="text-xs font-mono text-stone-400 mt-1">
              Personalized entry pass generated for Exhibit Wings access
            </p>
          </div>

          {/* Ticket Body Card */}
          <div className={`relative bg-[#f7f5f0] text-[#2b2927] p-6 rounded-2xl border-2 border-dashed border-[#b45309] shadow-2xl transition-all duration-500 transform ${
            isTicketPrinted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}>
            
            {/* Cutout Notch Left & Right */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#18191d] rounded-full border-r border-[#2d2f36]" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#18191d] rounded-full border-l border-[#2d2f36]" />

            <div className="flex items-center justify-between border-b-2 border-stone-300 pb-4 mb-4">
              <div>
                <div className="font-mono text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                  MUSEUM OF BROKEN BUILDS
                </div>
                <h3 className="font-handwritten text-2xl font-bold text-stone-900">
                  ALL-ACCESS PASS
                </h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-stone-900 block">{ticketNumber}</span>
                <span className="font-mono text-[10px] text-stone-600">Issued: {issueTime}</span>
              </div>
            </div>

            <form onSubmit={handleClaimTicket} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-stone-700 mb-1">
                  Visitor Name / Alias:
                </label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-400 bg-white text-stone-900 text-sm font-handwritten font-bold focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
                  id="input-visitor-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs text-stone-800 bg-stone-200/80 p-3 rounded-xl border border-stone-300">
                <div>
                  <span className="block text-[10px] text-stone-500 font-bold uppercase">GALLERY ADMISSION</span>
                  <span className="font-bold text-emerald-800">UNLIMITED / ALL WINGS</span>
                </div>
                <div>
                  <span className="block text-[10px] text-stone-500 font-bold uppercase">DUCK DEBUGGER ACCESS</span>
                  <span className="font-bold text-amber-800">LEVEL 100 QUACK</span>
                </div>
              </div>

              {/* Barcode Strip */}
              <div className="pt-2 border-t border-stone-300 flex items-center justify-between">
                <div className="font-mono text-xs tracking-[6px] text-stone-900 font-bold">
                  ||||| ||| |||| |||||| ||
                </div>
                <div className="font-handwritten text-xs text-amber-900 font-bold">
                  ✍️ Certified Valid
                </div>
              </div>

              <button
                type="submit"
                id="btn-claim-ticket"
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold px-6 py-3.5 rounded-xl shadow-lg border-2 border-stone-900 transition-transform hover:scale-[1.02] active:scale-95 text-base font-handwritten"
              >
                <span>Enter The Museum of Broken Builds</span>
                <ArrowRight className="w-5 h-5 text-stone-950" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
