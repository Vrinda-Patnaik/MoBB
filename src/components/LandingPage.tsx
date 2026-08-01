import React from 'react';
import { ArrowRight, Sparkles, Bug, Compass, Award, Shield, CheckCircle2, Star, Zap, Coffee } from 'lucide-react';
import { StickerAsset } from './Stickers';

interface LandingPageProps {
  onEnterMuseum: () => void;
  onOpenTracker: () => void;
  onOpenGenerator: () => void;
  onOpenEasterEggs?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterMuseum,
  onOpenTracker,
  onOpenGenerator,
  onOpenEasterEggs,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      
      {/* Fake System Status Bar */}
      <div className="flex items-center justify-between bg-[#18191d] px-4 py-2 rounded-xl text-xs font-mono text-stone-300 mb-8 border border-[#2d2f36]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#ff9d00] rounded-full animate-ping" />
          <span className="font-bold text-white">System Status:</span>
          <span className="text-[#f59e0b]">99.9% Emotional Downtime (Operational)</span>
        </div>
        <div className="hidden sm:block text-stone-400">
          Build Status: Broken with Pride 🛠️
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative text-center py-12 sm:py-20 bg-[#131417]/95 rounded-3xl border-2 border-[#2d2f36] museum-card-shadow overflow-hidden mb-16">
        
        {/* Top Tape Strips */}
        <div className="absolute -top-3 left-1/4 w-32 h-6 masking-tape-dark rotate-[-2deg]" />
        <div className="absolute -top-3 right-1/4 w-32 h-6 masking-tape-dark rotate-[2deg]" />

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#3d1d07]/90 text-[#f59e0b] rounded-full text-xs font-mono mb-6 border border-[#b45309]/80 font-bold shadow-lg shadow-amber-950/40">
            <span>✨</span>
            THE WORLD'S FIRST EMOTIONAL BUG TRACKING MUSEUM
          </div>

          <h1 className="font-handwritten text-4xl sm:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-md">
            The Museum of Broken Builds
          </h1>

          <p className="font-handwritten text-2xl text-[#ff9d00] mb-8 max-w-lg mx-auto italic">
            Track. Laugh. Recover.
          </p>

          <p className="font-sans text-stone-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            A living digital museum disguised as a fake productivity SaaS, where procrastination, burnout, overthinking, and lost focus are preserved under museum glass.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterMuseum}
              id="btn-hero-enter-museum"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/20 border-2 border-[#ffb733] transition-all hover:scale-105 active:scale-95 text-lg"
            >
              <span>Enter Museum</span>
              <ArrowRight className="w-5 h-5 text-stone-950" />
            </button>

            <button
              onClick={onOpenTracker}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4a0d12] hover:bg-[#5e1117] text-[#fca5a5] font-mono font-bold px-6 py-4 rounded-2xl border-2 border-[#8a1c24] shadow-lg shadow-red-950/40 transition-all hover:scale-105 active:scale-95 text-sm"
            >
              <Bug className="w-4 h-4 text-[#dc2626]" />
              <span>Log Emotional Bug</span>
            </button>

            {onOpenEasterEggs && (
              <button
                onClick={onOpenEasterEggs}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3d1d07] hover:bg-[#52270a] text-[#ff9d00] font-mono font-bold px-6 py-4 rounded-2xl border-2 border-[#b45309] shadow-lg shadow-amber-950/40 transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <span>🥚 Easter Eggs</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticker Exhibit Showcase */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h3 className="font-handwritten text-3xl font-bold text-white">
            Featured Museum Exhibits
          </h3>
          <p className="text-stone-400 text-xs font-mono mt-1">
            Hover over any exhibit card to inspect handwritten curator scribbles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1a120c] p-6 rounded-3xl border-2 border-[#b45309] shadow-lg shadow-amber-950/40 flex flex-col items-center text-center">
            <StickerAsset type="laptop" />
            <h4 className="font-handwritten text-xl font-bold text-amber-200 mt-4">The Burning Laptop</h4>
            <p className="text-xs text-stone-300 mt-1 font-sans">
              Preserved specimen from a 14-container Docker build. Double-click to extinguish.
            </p>
          </div>

          <div className="bg-[#170e24] p-6 rounded-3xl border-2 border-[#7e22ce] shadow-lg shadow-purple-950/40 flex flex-col items-center text-center">
            <StickerAsset type="frog" />
            <h4 className="font-handwritten text-xl font-bold text-purple-200 mt-4">The Distraction Frog</h4>
            <p className="text-xs text-stone-300 mt-1 font-sans">
              Casts ancient cognitive spells turning 5-minute tasks into 3-hour Wikipedia rabbit holes.
            </p>
          </div>

          <div className="bg-[#200c0e] p-6 rounded-3xl border-2 border-[#b91c1c] shadow-lg shadow-red-950/40 flex flex-col items-center text-center">
            <StickerAsset type="patience" />
            <h4 className="font-handwritten text-xl font-bold text-red-200 mt-4">Patience Memorial</h4>
            <p className="text-xs text-stone-300 mt-1 font-sans">
              Dedicated to all patience lost in waiting for npm installs and 'per my last email'.
            </p>
          </div>
        </div>
      </div>

      {/* Fake SaaS Pricing Section */}
      <div className="bg-[#15161a] p-8 sm:p-12 rounded-3xl border border-[#2d2f36] shadow-xl mb-16">
        <div className="text-center mb-10">
          <span className="font-mono text-xs uppercase text-[#ff9d00] font-bold tracking-widest block mb-1">
            TRANSPARENT PRICING
          </span>
          <h3 className="font-handwritten text-3xl font-bold text-white">
            Plans for Every Level of Procrastination
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#e2e1dc] text-stone-900 p-6 rounded-2xl border border-stone-300 shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="font-handwritten text-2xl font-bold text-stone-900">Free Tier</h4>
              <div className="text-3xl font-extrabold font-mono my-2 text-stone-900">$0 <span className="text-xs text-stone-600 font-normal">/ month</span></div>
              <p className="text-xs text-stone-600 mb-4">Paid in emotional bandwidth</p>
              <ul className="space-y-2 text-xs font-sans text-stone-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unlimited open tabs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Occasional duck quacks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free admission to all galleries</li>
              </ul>
            </div>
            <button onClick={onEnterMuseum} className="mt-6 w-full py-2.5 rounded-xl bg-[#d5d4ce] hover:bg-[#c7c6c0] font-bold text-xs text-stone-900 transition-colors">
              Get Started
            </button>
          </div>

          <div className="bg-[#e2e1dc] text-stone-900 p-6 rounded-2xl border-2 border-[#ff9d00] shadow-2xl flex flex-col justify-between relative">
            <div className="absolute -top-3 right-4 bg-[#ff9d00] text-stone-950 font-mono text-[10px] font-bold px-3 py-0.5 rounded-full uppercase border border-[#cc7e00]">
              POPULAR
            </div>
            <div>
              <h4 className="font-handwritten text-2xl font-bold text-amber-900">Procrastinator Pro</h4>
              <div className="text-3xl font-extrabold font-mono my-2 text-amber-800">2 Cups Coffee <span className="text-xs text-stone-600 font-normal">/ day</span></div>
              <p className="text-xs text-stone-600 mb-4">For seasoned overthinkers</p>
              <ul className="space-y-2 text-xs font-sans text-stone-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-700" /> AI Artifact Generator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-700" /> Dr. Quackers Sarcastic AI Curator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-700" /> Museum Passport Stamps</li>
              </ul>
            </div>
            <button onClick={onEnterMuseum} className="mt-6 w-full py-2.5 rounded-xl bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold text-xs transition-colors shadow">
              Enter Museum Now
            </button>
          </div>

          <div className="bg-[#e2e1dc] text-stone-900 p-6 rounded-2xl border border-stone-300 shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="font-handwritten text-2xl font-bold text-stone-900">Enterprise Burnout</h4>
              <div className="text-3xl font-extrabold font-mono my-2 text-stone-900">Custom <span className="text-xs text-stone-600 font-normal">/ year</span></div>
              <p className="text-xs text-stone-600 mb-4">For entire engineering teams</p>
              <ul className="space-y-2 text-xs font-sans text-stone-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dedicated email graveyard</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unlimited coffee stains</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Team-wide 4-7-8 breathing loops</li>
              </ul>
            </div>
            <button onClick={onEnterMuseum} className="mt-6 w-full py-2.5 rounded-xl bg-[#d5d4ce] hover:bg-[#c7c6c0] font-bold text-xs text-stone-900 transition-colors">
              Contact Curator
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16">
        <h3 className="font-handwritten text-3xl font-bold text-center text-white mb-8">
          What Visitors Say
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Alex M.', role: 'Senior React Developer', quote: 'I spent 4 hours watching a duck debug my code. 10/10 experience, my build finally passed.' },
            { name: 'Sarah K.', role: 'Product Designer', quote: 'I finally found where my patience went. It was preserved in Exhibit #0001 under museum glass.' },
            { name: 'David L.', role: 'Computer Science Student', quote: 'This is the most relatable portfolio website I have ever seen in my life.' },
          ].map((t, i) => (
            <div key={i} className="bg-[#fef9c3] text-stone-900 p-6 rounded-2xl border border-yellow-300/80 shadow-lg relative rotate-[-1deg] hover:rotate-0 transition-transform font-handwritten">
              <div className="flex text-[#f59e0b] gap-1 mb-2">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#f59e0b]" />
                ))}
              </div>
              <p className="text-sm font-sans text-stone-800 italic mb-4">
                "{t.quote}"
              </p>
              <div className="font-handwritten font-bold text-base text-stone-900">{t.name}</div>
              <div className="font-mono text-[10px] text-stone-600">{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Wholesome Footer Callout */}
      <div className="text-center py-10 border-t border-[#2d2f36]">
        <p className="font-handwritten text-2xl font-bold text-stone-200 mb-2">
          "You Did The Thing Anyway."
        </p>
        <p className="text-xs font-mono text-stone-400">
          The Museum of Broken Builds • Handcrafted with React, Tailwind, and Google Gemini
        </p>
      </div>

    </div>
  );
};
