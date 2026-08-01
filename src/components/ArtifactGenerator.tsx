import React, { useState } from 'react';
import { Artifact, EmotionalBug } from '../types';
import { Sparkles, Library, FileText, Share2, Check, ArrowRight, BookmarkCheck, Box, Trash2 } from 'lucide-react';
import { StickerAsset } from './Stickers';
import { playArtifactOpenSound } from '../lib/sound';
import { generateArtifact } from '../lib/api';

interface ArtifactGeneratorProps {
  initialPrompt?: string;
  artifacts: Artifact[];
  onArtifactGenerated: (artifact: Artifact) => void;
  onDeleteArtifact?: (id: string) => void;
  onUnlockAchievement: (id: string) => void;
}

export const ArtifactGenerator: React.FC<ArtifactGeneratorProps> = ({
  initialPrompt = '',
  artifacts,
  onArtifactGenerated,
  onDeleteArtifact,
  onUnlockAchievement,
}) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [category, setCategory] = useState<string>('General');
  const [loading, setLoading] = useState<boolean>(false);
  const [latestGenerated, setLatestGenerated] = useState<Artifact | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);

    try {
      const data = await generateArtifact({
        bugDescription: prompt,
        category,
      });

      // Determine sticker type based on content keywords
      let stickerType: 'laptop' | 'frog' | 'patience' | 'email' | 'social' | 'heart' | 'duck' = 'laptop';
      const lower = prompt.toLowerCase();
      if (lower.includes('focus') || lower.includes('distract') || lower.includes('tab')) stickerType = 'frog';
      else if (lower.includes('patience') || lower.includes('wait') || lower.includes('email')) stickerType = 'patience';
      else if (lower.includes('email') || lower.includes('inbox') || lower.includes('slack')) stickerType = 'email';
      else if (lower.includes('social') || lower.includes('people') || lower.includes('battery')) stickerType = 'social';
      else if (lower.includes('duck') || lower.includes('quack') || lower.includes('code')) stickerType = 'duck';

      const newArtifact: Artifact = {
        id: `art-${Date.now()}`,
        artifactNumber: data.artifactNumber || `ART-${Math.floor(1000 + Math.random() * 9000)}`,
        title: data.title || `Preserved Specimen: ${prompt.slice(0, 30)}`,
        discoveryDate: data.discoveryDate || `Circa ${new Date().getFullYear()}`,
        classification: data.classification || 'Emotional Glitch Specimen',
        severity: (data.severity as any) || 'Critical',
        recoveredFrom: data.recoveredFrom || 'Under 42 unread browser tabs',
        curatorNotes: data.curatorNotes || 'Specimen preserved under museum glass for future generations.',
        achievementUnlocked: data.achievementUnlocked || 'Museum Artifact Donor',
        stickerType,
        timestamp: new Date().toLocaleString(),
      };

      setLatestGenerated(newArtifact);
      onArtifactGenerated(newArtifact);
      playArtifactOpenSound();
      onUnlockAchievement('museum_donor');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyPlacardText = (art: Artifact) => {
    const text = `🏛️ The Museum of Broken Builds Artifact Placard [${art.artifactNumber}]\n\nTitle: ${art.title}\nClassification: ${art.classification}\nSeverity: ${art.severity}\nRecovered From: ${art.recoveredFrom}\nCurator Notes: ${art.curatorNotes}\n\nTracked in The Museum of Broken Builds`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Header Banner */}
      <div className="relative bg-[#131417]/95 text-white p-6 sm:p-8 rounded-3xl museum-card-shadow border-2 border-[#2d2f36] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9d00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 left-10 w-32 h-6 masking-tape-dark rotate-[2deg] opacity-90" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3d1d07] text-[#ff9d00] rounded-full text-xs font-mono mb-2 border border-[#b45309] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#ff9d00]" />
            AI MUSEUM ARTIFACT GENERATOR
          </div>
          <h1 className="font-handwritten text-3xl sm:text-4xl text-white font-bold">
            Donate an Emotional Bug to the Museum Archive
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-2xl">
            Type any personal struggle, procrastination habit, or coding disaster. Our AI Museum Preservation Engine will catalog it into an official museum artifact with a formal display placard and handwritten curator notes.
          </p>
        </div>
      </div>

      {/* Input Generator Form */}
      <div className="bg-[#18191d] p-6 rounded-3xl border border-[#2d2f36] shadow-xl mb-10 relative text-white">
        <div className="absolute -top-3 right-8 w-24 h-5 masking-tape-dark rotate-[-2deg]" />

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-300 mb-1.5 font-bold">
              Describe your struggle or emotional bug:
            </label>
            <textarea
              required
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'I spent 3 hours searching for the perfect VS Code theme instead of writing my thesis proposal...'"
              className="w-full px-4 py-3 rounded-2xl border border-[#2d2f36] bg-[#121316] text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9d00] font-sans resize-none"
              id="textarea-artifact-prompt"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-stone-400">Preset Samples:</span>
              <button
                type="button"
                onClick={() => setPrompt("I keep opening 50 Wikipedia tabs every time I sit down to do tax returns.")}
                className="text-xs font-handwritten px-2.5 py-1 bg-[#282a30] hover:bg-[#343740] rounded-lg text-stone-200 transition-colors"
              >
                🌐 Wikipedia Tabs
              </button>
              <button
                type="button"
                onClick={() => setPrompt("Re-reading my 2-line slack message 8 times before hitting send.")}
                className="text-xs font-handwritten px-2.5 py-1 bg-[#282a30] hover:bg-[#343740] rounded-lg text-stone-200 transition-colors"
              >
                💬 Slack Anxiety
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              id="btn-generate-artifact"
              className="flex items-center gap-2 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold px-6 py-3 rounded-2xl border-2 border-[#ffb733] shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 text-sm"
            >
              <Sparkles className="w-4 h-4 text-stone-950 animate-spin-slow" />
              <span>{loading ? 'Preserving Artifact...' : 'Preserve Under Museum Glass'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Display Generated Artifact Placard (If available) */}
      {latestGenerated && (
        <div className="mb-12 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center font-handwritten text-[#ff9d00] text-lg mb-2 flex items-center justify-center gap-2">
            <span>✨</span>
            <span>New Museum Specimen Preserved!</span>
            <span>✨</span>
          </div>

          {/* Museum Placard Display */}
          <div className="relative max-w-2xl mx-auto bg-[#131417] p-8 rounded-3xl border-2 border-[#2d2f36] museum-card-shadow overflow-hidden text-white">
            
            {/* Top Tape Strips */}
            <div className="absolute -top-3 left-10 w-28 h-6 masking-tape-dark rotate-[-3deg]" />
            <div className="absolute -top-3 right-10 w-28 h-6 masking-tape-dark rotate-[3deg]" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              
              {/* Sticker Illustration */}
              <div className="shrink-0">
                <StickerAsset type={latestGenerated.stickerType || 'laptop'} showAnnotations={false} />
              </div>

              {/* Placard Specs */}
              <div className="flex-1 space-y-3 text-white">
                
                <div className="flex items-center justify-between border-b border-[#2d2f36] pb-2">
                  <span className="font-mono text-xs font-bold text-[#ff9d00] uppercase tracking-widest">
                    MUSEUM CATALOG #{latestGenerated.artifactNumber}
                  </span>
                  <span className="font-mono text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">
                    SEVERITY: {latestGenerated.severity}
                  </span>
                </div>

                <h2 className="font-handwritten text-2xl font-bold text-white">
                  {latestGenerated.title}
                </h2>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-stone-300 bg-[#18191d] p-3 rounded-xl border border-[#2d2f36]">
                  <div>
                    <span className="block text-stone-500 text-[10px]">CLASSIFICATION</span>
                    <span className="font-bold text-white">{latestGenerated.classification}</span>
                  </div>
                  <div>
                    <span className="block text-stone-500 text-[10px]">DISCOVERY</span>
                    <span className="font-bold text-white">{latestGenerated.discoveryDate}</span>
                  </div>
                </div>

                <div className="text-xs font-sans">
                  <span className="font-mono text-stone-400 font-bold block text-[10px] uppercase">RECOVERED FROM:</span>
                  <p className="text-stone-300 font-medium italic mt-0.5">
                    "{latestGenerated.recoveredFrom}"
                  </p>
                </div>

                {/* Curator Handwritten Scribble Note */}
                <div className="bg-[#3d1d07]/90 p-3.5 rounded-2xl border border-[#b45309] text-xs font-handwritten leading-relaxed relative">
                  <span className="font-bold text-[#ff9d00] block mb-0.5">
                    ✍️ Curator's Note:
                  </span>
                  <p className="text-amber-100">
                    {latestGenerated.curatorNotes}
                  </p>
                </div>

                {/* Share / Copy Button */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#ff9d00] flex items-center gap-1">
                    <BookmarkCheck className="w-3.5 h-3.5 text-[#ff9d00]" />
                    Achievement: {latestGenerated.achievementUnlocked}
                  </span>

                  <button
                    onClick={() => copyPlacardText(latestGenerated)}
                    className="flex items-center gap-1.5 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-stone-950" /> : <Share2 className="w-3.5 h-3.5 text-stone-950" />}
                    <span>{copied ? 'Placard Copied!' : 'Copy Placard'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Previously Preserved Museum Artifacts Gallery */}
      <div className="mt-12">
        <h3 className="font-handwritten text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Library className="w-5 h-5 text-[#ff9d00]" />
          <span>Preserved Artifacts Archive ({artifacts.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artifacts.map((art) => (
            <div
              key={art.id}
              className="bg-[#18191d] p-5 rounded-2xl border border-[#2d2f36] shadow-md flex flex-col justify-between text-white relative group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1">
                  <span>#{art.artifactNumber}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#282a30] text-stone-300 px-2 py-0.5 rounded">
                      {art.classification}
                    </span>
                    {onDeleteArtifact && (
                      <button
                        type="button"
                        onClick={() => onDeleteArtifact(art.id)}
                        className="p-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-red-200 border border-red-800 transition-colors"
                        title="Delete Artifact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <h4 className="font-handwritten text-lg font-bold text-white pr-2">
                  {art.title}
                </h4>
                <p className="text-xs font-sans text-stone-300 mt-2 line-clamp-2 italic">
                  "{art.curatorNotes}"
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#2d2f36] text-[10px] font-mono text-stone-400 flex items-center justify-between">
                <span>Recovered: {art.recoveredFrom.slice(0, 30)}...</span>
                <span>{art.discoveryDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
