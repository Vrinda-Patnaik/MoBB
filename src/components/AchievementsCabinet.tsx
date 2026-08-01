import React from 'react';
import { Achievement } from '../types';
import { Award, Lock, Sparkles, Flame, Bug, DoorOpen, Eye, Mail, RotateCcw, Bird } from 'lucide-react';

interface AchievementsCabinetProps {
  achievements: Achievement[];
}

export const AchievementsCabinet: React.FC<AchievementsCabinetProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorOpen': return <DoorOpen className="w-6 h-6" />;
      case 'Bug': return <Bug className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Eye': return <Eye className="w-6 h-6" />;
      case 'Mail': return <Mail className="w-6 h-6" />;
      case 'RotateCcw': return <RotateCcw className="w-6 h-6" />;
      case 'Bird': return <Bird className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Header Banner */}
      <div className="relative bg-[#131417]/95 text-white p-6 sm:p-8 rounded-3xl museum-card-shadow border-2 border-[#2d2f36] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9d00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 left-12 w-32 h-6 masking-tape-dark rotate-[-2deg] opacity-90" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3d1d07] text-[#ff9d00] rounded-full text-xs font-mono mb-2 border border-[#b45309] font-bold">
              <Award className="w-3.5 h-3.5 text-[#ff9d00]" />
              MUSEUM TROPHY COLLECTION
            </div>
            <h1 className="font-handwritten text-3xl sm:text-4xl text-white font-bold">
              The Glass Achievement Cabinet
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-xl">
              Every small victory, Easter egg discovery, and emotional recovery in MuseumOS™ is awarded an official museum trophy.
            </p>
          </div>

          <div className="bg-[#ff9d00] text-stone-950 px-5 py-3 rounded-2xl font-bold font-mono text-center shadow-lg border-2 border-[#ffb733]">
            <span className="block text-2xl leading-none">{unlockedCount} / {achievements.length}</span>
            <span className="text-[10px] uppercase tracking-wider">Trophies Unlocked</span>
          </div>
        </div>
      </div>

      {/* Glass Cabinet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`relative p-6 rounded-3xl border transition-all flex flex-col justify-between overflow-hidden text-white ${
              ach.unlocked
                ? 'bg-[#18191d] border-[#ff9d00]/60 museum-card-shadow'
                : 'bg-[#121316]/50 border-[#2d2f36] opacity-60'
            }`}
          >
            {/* Top Tape */}
            <div className="absolute -top-2 left-6 w-16 h-4 masking-tape-dark opacity-80 rotate-[2deg]" />

            <div>
              {/* Icon & Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                    ach.unlocked
                      ? 'bg-[#ff9d00] text-stone-950 border-2 border-[#ffb733]'
                      : 'bg-[#282a30] text-stone-500 border border-[#2d2f36]'
                  }`}
                >
                  {ach.unlocked ? renderIcon(ach.iconName) : <Lock className="w-5 h-5" />}
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    ach.unlocked
                      ? 'bg-[#3d1d07] text-[#ff9d00] border-[#b45309]'
                      : 'bg-[#282a30] text-stone-400 border-[#2d2f36]'
                  }`}
                >
                  {ach.unlocked ? 'UNLOCKED' : ach.secret ? 'SECRET' : 'LOCKED'}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-handwritten text-xl font-bold text-white">
                {ach.unlocked || !ach.secret ? ach.title : '??? Secret Trophy ???'}
              </h3>

              {/* Description */}
              <p className="text-xs text-stone-300 mt-2 font-sans leading-relaxed">
                {ach.unlocked || !ach.secret ? ach.description : 'Explore the museum galleries and easter eggs to discover this trophy.'}
              </p>
            </div>

            {/* Footer Date */}
            {ach.unlocked && ach.unlockedAt && (
              <div className="mt-4 pt-3 border-t border-[#2d2f36] text-[10px] font-mono text-[#ff9d00] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ff9d00]" />
                <span>Unlocked: {ach.unlockedAt}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
