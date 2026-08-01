import React, { useState, useEffect } from 'react';
import { Bird, Sparkles, Volume2, Plus, Trash2, Image as ImageIcon, Upload, RotateCcw, Lock } from 'lucide-react';
import { playQuackSound, playClickSound, playArtifactOpenSound } from '../../lib/sound';

export interface VaultPictureItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  imageUrl?: string; // For uploaded base64 / URL images
  svgType?: 'hesitate_heart' | 'burning_duck' | 'hocus_frog' | 'patience_tombstone' | 'social_404' | 'rubber_debugger' | 'senior_staff';
  isCustom?: boolean;
}

const DEFAULT_VAULT_PICTURES: VaultPictureItem[] = [
  {
    id: 'vault-1',
    title: 'Please Hesitate To Reach Out To Me',
    subtitle: 'Official Boundary Heart Badge',
    category: 'EMOTIONAL BOUNDARIES',
    svgType: 'hesitate_heart',
  },
  {
    id: 'vault-2',
    title: 'Everything Is Fine (Burning Laptop Duck)',
    subtitle: 'Desk Fire Debugger',
    category: 'OFFICE BURNOUT',
    svgType: 'burning_duck',
  },
  {
    id: 'vault-3',
    title: 'Hocus Pocus You Lost Your Focus',
    subtitle: 'Wizard Frog Spell',
    category: 'RABBIT HOLE',
    svgType: 'hocus_frog',
  },
  {
    id: 'vault-4',
    title: 'In Memory Of My Patience',
    subtitle: 'Ghostly Tombstone Memorial',
    category: 'PATIENCE EXHAUSTION',
    svgType: 'patience_tombstone',
  },
  {
    id: 'vault-5',
    title: 'Error 404: Social Skills Not Found',
    subtitle: 'Retro PC Popup Dialog',
    category: 'SYSTEM OVERLOAD',
    svgType: 'social_404',
  },
  {
    id: 'vault-6',
    title: 'The Rubber Debugger',
    subtitle: 'Original Rubber Duck Debugger',
    category: 'DEBUGGER CLASSIC',
    svgType: 'rubber_debugger',
  },
  {
    id: 'vault-7',
    title: 'Senior Staff Duck Engineer',
    subtitle: 'Silent PR Approver',
    category: 'CODE REVIEW',
    svgType: 'senior_staff',
  },
];

interface DuckGalleryProps {
  onUnlockAchievement: (id: string) => void;
}

export const DuckGallery: React.FC<DuckGalleryProps> = ({ onUnlockAchievement }) => {
  // Vault Pictures persistent state
  const [vaultPictures, setVaultPictures] = useState<VaultPictureItem[]>(() => {
    try {
      const stored = localStorage.getItem('museum_secret_vault_pictures');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_VAULT_PICTURES;
  });

  // Add Picture Modal / Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubtitle, setNewSubtitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('SECRET VAULT');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('museum_secret_vault_pictures', JSON.stringify(vaultPictures));
    } catch {}
  }, [vaultPictures]);

  const handleQuackClick = () => {
    playQuackSound(380);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPicture = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = filePreview || newImageUrl.trim();
    if (!newTitle.trim() || !finalImage) return;

    const newItem: VaultPictureItem = {
      id: `vault-custom-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Custom Vault Specimen',
      category: newCategory.trim().toUpperCase() || 'SECRET VAULT',
      imageUrl: finalImage,
      isCustom: true,
    };

    setVaultPictures([newItem, ...vaultPictures]);
    playArtifactOpenSound();
    
    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setNewImageUrl('');
    setSelectedFile(null);
    setFilePreview(null);

    onUnlockAchievement('vault_collector');
  };

  const handleRemovePicture = (id: string) => {
    setVaultPictures((prev) => prev.filter((pic) => pic.id !== id));
    playClickSound();
  };

  const handleResetVault = () => {
    if (window.confirm('Restore all default Secret Vault pictures?')) {
      setVaultPictures(DEFAULT_VAULT_PICTURES);
      playClickSound();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 font-sans animate-in fade-in zoom-in-95 duration-300">
      
      {/* Title Banner */}
      <div className="relative bg-[#131417] text-white p-8 rounded-3xl museum-card-shadow border-2 border-[#ff9d00] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff9d00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-3 left-10 w-32 h-6 masking-tape-dark rotate-[-2deg] opacity-90" />

        <div className="relative z-10 text-center">
          <span className="text-5xl animate-bounce block mb-2">🦆</span>
          <div className="inline-block bg-[#3d1d07] text-[#ff9d00] border border-[#b45309] font-mono text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold mb-2">
            SECRET UNLOCKED • KONAMI VAULT
          </div>
          <h1 className="font-handwritten text-4xl sm:text-5xl font-bold text-white">
            The Secret Duck Gallery & Vault
          </h1>
          <p className="font-handwritten text-lg mt-2 text-stone-300 max-w-2xl mx-auto">
            "Welcome to the sacred vault of rubber duck debugging, iconic developer memes, and emotional recovery stickers. Add or remove specimens to customize your secret collection!"
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleQuackClick}
              className="px-6 py-3 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold rounded-2xl border-2 border-[#ffb733] shadow-xl transition-transform hover:scale-105 active:scale-95 font-mono text-sm inline-flex items-center gap-2"
            >
              <Volume2 className="w-5 h-5 text-stone-950" />
              <span>QUACK SYNTHESIZER!</span>
            </button>

            <button
              onClick={handleResetVault}
              className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs font-bold rounded-2xl border border-stone-600 transition-colors flex items-center gap-2"
              title="Restore original vault pictures"
            >
              <RotateCcw className="w-4 h-4 text-stone-400" />
              <span>Restore Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Add More Pictures to the Secret Vault */}
      <div className="mb-10 bg-[#18191d] p-6 sm:p-8 rounded-3xl border-2 border-[#ff9d00]/70 museum-card-shadow text-white">
        <div className="flex items-center gap-3 mb-4 border-b border-[#2d2f36] pb-4">
          <div className="p-2 bg-[#3d1d07] rounded-xl border border-[#b45309] text-[#ff9d00]">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-handwritten text-2xl font-bold text-white">
              Add New Picture to Secret Vault
            </h3>
            <p className="text-xs font-mono text-stone-400">
              Upload an image file from your device or paste an image URL to preserve in your collection.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddPicture} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-stone-300 mb-1 uppercase font-bold">
                Specimen Title / Caption *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 'Coffee Overflow Error' or 'Senior Dev Cat'..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#2d2f36] bg-[#121316] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
                required
                id="input-vault-title"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-stone-300 mb-1 uppercase font-bold">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="e.g. 'Recovered from 3 AM debug session'..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#2d2f36] bg-[#121316] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
                id="input-vault-subtitle"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Input */}
            <div>
              <label className="block font-mono text-xs text-stone-300 mb-1 uppercase font-bold">
                Option A: Upload Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#ff9d00] file:text-stone-950 hover:file:bg-[#e68d00] cursor-pointer bg-[#121316] p-1.5 rounded-xl border border-[#2d2f36]"
                id="input-vault-file"
              />
            </div>

            {/* Image URL Input */}
            <div>
              <label className="block font-mono text-xs text-stone-300 mb-1 uppercase font-bold">
                Option B: Or Enter Image Web URL
              </label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/my-meme.png..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#2d2f36] bg-[#121316] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
                id="input-vault-url"
              />
            </div>
          </div>

          {/* Image Preview Box */}
          {filePreview && (
            <div className="flex items-center gap-4 bg-[#121316] p-3 rounded-2xl border border-[#2d2f36]">
              <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-stone-700" />
              <div className="text-xs font-mono text-stone-300">
                <span className="text-emerald-400 font-bold block">✓ Image Ready to Deposit</span>
                <span>{selectedFile?.name || 'Uploaded File'}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="btn-[#ff9d00]"
              className="px-6 py-3 bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 font-bold rounded-2xl border-2 border-[#ffb733] shadow-lg font-handwritten text-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5 text-stone-950" />
              <span>Deposit Picture into Vault</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: Secret Vault Picture Gallery */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-handwritten text-3xl font-bold text-white flex items-center gap-2">
            <span>🖼️ Secret Vault Collection</span>
            <span className="text-xs font-mono font-bold bg-[#ff9d00] text-stone-950 px-2.5 py-0.5 rounded-full">
              {vaultPictures.length} Specimen{vaultPictures.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <p className="text-xs font-mono text-stone-400 mt-1">
            Click the trash icon on any card to remove it from your vault.
          </p>
        </div>
      </div>

      {vaultPictures.length === 0 ? (
        <div className="bg-[#18191d] p-12 rounded-3xl border-2 border-dashed border-[#2d2f36] text-center text-stone-400 font-mono">
          <p className="text-base mb-2">The Secret Vault is empty.</p>
          <button
            onClick={handleResetVault}
            className="mt-3 px-4 py-2 bg-[#ff9d00] text-stone-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Default Vault Pictures</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaultPictures.map((item) => (
            <div
              key={item.id}
              className="relative bg-[#18191d] p-5 rounded-3xl border-2 border-[#2d2f36] hover:border-[#ff9d00]/80 museum-card-shadow flex flex-col justify-between text-white group transition-all duration-200"
            >
              {/* Masking tape on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 masking-tape-dark rotate-[-1deg] opacity-80 z-10" />

              {/* Top Bar with Category & Remove Button */}
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-[10px] bg-[#3d1d07] text-[#ff9d00] border border-[#b45309] px-2 py-0.5 rounded font-bold uppercase">
                  {item.category || 'VAULT SPECIMEN'}
                </span>

                <button
                  onClick={() => handleRemovePicture(item.id)}
                  className="p-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-400 hover:text-red-100 border border-red-800/80 transition-colors opacity-90 hover:opacity-100"
                  title="Remove Picture from Vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Main Graphic Container */}
              <div className="w-full h-52 bg-[#121316] rounded-2xl border border-[#2d2f36] flex items-center justify-center p-3 mb-4 overflow-hidden relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain rounded-xl drop-shadow-md"
                  />
                ) : (
                  <RenderVaultSVG type={item.svgType} />
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-handwritten text-xl font-bold text-white group-hover:text-[#ff9d00] transition-colors">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-stone-400 font-sans mt-1 italic">
                    "{item.subtitle}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

/**
 * Render high-fidelity SVG graphic for default vault items
 */
const RenderVaultSVG: React.FC<{ type?: VaultPictureItem['svgType'] }> = ({ type }) => {
  switch (type) {
    case 'hesitate_heart':
      return (
        <svg viewBox="0 0 220 200" className="w-full h-full max-h-48 drop-shadow-md select-none">
          {/* Heart Outer White Border */}
          <path
            d="M 110 185 C 30 135 10 90 40 50 C 70 15 95 40 110 55 C 125 40 150 15 180 50 C 210 90 190 135 110 185 Z"
            fill="#fff"
            stroke="#222"
            strokeWidth="4"
          />
          {/* Heart Pink Fill */}
          <path
            d="M 110 176 C 36 128 18 86 46 48 C 73 17 96 40 110 53 C 124 40 147 17 174 48 C 202 86 184 128 110 176 Z"
            fill="#f472b6"
            stroke="#222"
            strokeWidth="3.5"
          />
          {/* Inner Light Pink Ribbon Outline */}
          <path
            d="M 110 166 C 42 121 26 82 51 48 C 76 21 97 42 110 53 C 123 42 144 21 169 48 C 194 82 178 121 110 166 Z"
            fill="none"
            stroke="#fbcfe8"
            strokeWidth="2.5"
          />
          {/* Sparkles */}
          <path d="M 60 45 L 62 40 L 64 45 L 69 47 L 64 49 L 62 54 L 60 49 L 55 47 Z" fill="#fff" />
          <path d="M 160 55 L 162 50 L 164 55 L 169 57 L 164 59 L 162 64 L 160 59 L 155 57 Z" fill="#fff" />

          {/* Typography */}
          <text x="110" y="72" textAnchor="middle" fill="#18181b" fontSize="22" fontFamily="'Caveat', cursive, sans-serif" fontWeight="bold">
            Please
          </text>
          <text x="110" y="98" textAnchor="middle" fill="#18181b" fontSize="17" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" letterSpacing="0.5">
            HESITATE TO
          </text>
          <text x="110" y="122" textAnchor="middle" fill="#18181b" fontSize="17" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" letterSpacing="0.5">
            REACH OUT
          </text>
          <text x="110" y="146" textAnchor="middle" fill="#18181b" fontSize="17" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" letterSpacing="0.5">
            TO ME
          </text>
        </svg>
      );

    case 'burning_duck':
      return (
        <svg viewBox="0 0 220 200" className="w-full h-full max-h-48 drop-shadow-md select-none">
          {/* Background Smoke Clouds */}
          <circle cx="90" cy="70" r="35" fill="#e4e4e7" opacity="0.6" />
          <circle cx="65" cy="50" r="28" fill="#d4d4d8" opacity="0.5" />
          <circle cx="115" cy="45" r="25" fill="#e4e4e7" opacity="0.6" />

          {/* Inverted Office Chair */}
          <g transform="translate(30, 80) rotate(-140 30 30)">
            <rect x="10" y="10" width="40" height="35" rx="5" fill="#52525b" stroke="#18181b" strokeWidth="2.5" />
            <rect x="12" y="45" width="36" height="12" rx="2" fill="#3f3f46" stroke="#18181b" strokeWidth="2.5" />
            <line x1="30" y1="57" x2="30" y2="75" stroke="#18181b" strokeWidth="4" />
          </g>

          {/* Laptop on Fire */}
          <rect x="100" y="140" width="45" height="28" rx="2" fill="#3f3f46" stroke="#18181b" strokeWidth="2" />
          <path d="M 92 168 L 153 168 L 145 178 L 100 178 Z" fill="#71717a" stroke="#18181b" strokeWidth="2" />

          {/* Flames on Chair and Laptop */}
          <path d="M 45 140 Q 40 100 55 90 Q 60 115 70 95 Q 80 125 75 145 Z" fill="#f97316" stroke="#18181b" strokeWidth="2" />
          <path d="M 52 138 Q 48 115 57 105 Q 62 120 67 110 Q 72 130 70 140 Z" fill="#facc15" />

          <path d="M 110 145 Q 105 115 118 105 Q 123 125 130 110 Q 138 135 133 148 Z" fill="#f97316" stroke="#18181b" strokeWidth="2" />
          <path d="M 115 143 Q 112 125 120 118 Q 124 130 127 122 Q 132 138 130 144 Z" fill="#facc15" />

          {/* Paper Stacks */}
          <rect x="60" y="165" width="35" height="12" fill="#f4f4f5" stroke="#18181b" strokeWidth="1.5" />
          <line x1="65" y1="169" x2="88" y2="169" stroke="#71717a" strokeWidth="1.5" />

          {/* Cute White Duck with Tie Sitting Happily */}
          <g transform="translate(145, 75)">
            {/* Duck Body */}
            <path d="M 25 55 Q 10 35 30 25 Q 50 15 65 30 Q 75 45 70 60 Q 60 80 30 75 Q 10 70 25 55 Z" fill="#fff" stroke="#18181b" strokeWidth="3" />
            {/* Duck Head */}
            <circle cx="48" cy="30" r="18" fill="#fff" stroke="#18181b" strokeWidth="3" />
            {/* Eye */}
            <circle cx="55" cy="27" r="2.5" fill="#18181b" />
            {/* Blush */}
            <ellipse cx="50" cy="34" rx="4" ry="2.5" fill="#f87171" opacity="0.6" />
            {/* Beak */}
            <path d="M 60 30 Q 76 28 73 37 Q 63 40 58 34 Z" fill="#fb923c" stroke="#18181b" strokeWidth="2" />
            {/* Black Tie */}
            <path d="M 46 45 L 50 45 L 53 65 L 48 70 L 43 65 Z" fill="#18181b" />
          </g>
        </svg>
      );

    case 'hocus_frog':
      return (
        <svg viewBox="0 0 220 200" className="w-full h-full max-h-48 drop-shadow-md select-none">
          {/* Frog Body */}
          <ellipse cx="75" cy="125" rx="38" ry="30" fill="#a3e635" stroke="#18181b" strokeWidth="3" />
          {/* Frog Legs */}
          <path d="M 40 135 Q 25 150 35 160 Q 50 155 48 140" fill="#84cc16" stroke="#18181b" strokeWidth="2.5" />
          <path d="M 110 135 Q 125 150 115 160 Q 100 155 102 140" fill="#84cc16" stroke="#18181b" strokeWidth="2.5" />

          {/* Frog Eyes */}
          <circle cx="58" cy="95" r="12" fill="#a3e635" stroke="#18181b" strokeWidth="3" />
          <circle cx="92" cy="95" r="12" fill="#a3e635" stroke="#18181b" strokeWidth="3" />
          <circle cx="58" cy="95" r="4.5" fill="#18181b" />
          <circle cx="92" cy="95" r="4.5" fill="#18181b" />

          {/* Frown Mouth */}
          <path d="M 62 128 Q 75 120 88 128" fill="none" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />

          {/* Wizard Hat */}
          <path d="M 50 88 L 75 30 L 100 88 Z" fill="#8b5cf6" stroke="#18181b" strokeWidth="3" />
          <path d="M 40 88 Q 75 80 110 88 Z" fill="#7c3aed" stroke="#18181b" strokeWidth="3" />
          <polygon points="75,48 78,56 86,56 80,61 82,69 75,64 68,69 70,61 64,56 72,56" fill="#facc15" />

          {/* Hand holding Magic Wand */}
          <path d="M 100 120 Q 115 100 120 80" stroke="#18181b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="120" cy="80" r="3" fill="#fff" stroke="#18181b" strokeWidth="1.5" />

          {/* Sparkles */}
          <path d="M 125 65 L 128 58 L 131 65 L 138 68 L 131 71 L 128 78 L 125 71 L 118 68 Z" fill="#facc15" stroke="#18181b" strokeWidth="1" />
          <path d="M 105 45 L 107 40 L 109 45 L 114 47 L 109 49 L 107 54 L 105 49 L 100 47 Z" fill="#facc15" />

          {/* Text Bubble */}
          <g transform="translate(115, 80)">
            <rect x="0" y="0" width="95" height="75" rx="12" fill="#fff" stroke="#18181b" strokeWidth="2.5" />
            <text x="47" y="24" textAnchor="middle" fill="#18181b" fontSize="11" fontFamily="'Fira Code', monospace" fontWeight="bold">
              HOCUS POCUS
            </text>
            <text x="47" y="42" textAnchor="middle" fill="#18181b" fontSize="11" fontFamily="'Fira Code', monospace" fontWeight="bold">
              YOU LOST
            </text>
            <text x="47" y="60" textAnchor="middle" fill="#18181b" fontSize="11" fontFamily="'Fira Code', monospace" fontWeight="bold">
              YOUR FOCUS
            </text>
          </g>
        </svg>
      );

    case 'patience_tombstone':
      return (
        <svg viewBox="0 0 220 200" className="w-full h-full max-h-48 drop-shadow-md select-none">
          {/* Base Mound */}
          <ellipse cx="110" cy="175" rx="80" ry="12" fill="#e5e7eb" stroke="#18181b" strokeWidth="3" />

          {/* Tombstone */}
          <path d="M 50 170 L 50 70 A 60 60 0 0 1 170 70 L 170 170 Z" fill="#cbd5e1" stroke="#18181b" strokeWidth="3" />
          {/* Cracked detail */}
          <path d="M 75 42 L 80 55 L 75 62" fill="none" stroke="#64748b" strokeWidth="2" />

          {/* Cross Symbol */}
          <path d="M 105 52 L 115 52 M 110 45 L 110 60" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

          {/* Engraving */}
          <text x="110" y="80" textAnchor="middle" fill="#1e293b" fontSize="12" fontFamily="'Fira Code', monospace" fontWeight="bold">
            IN MEMORY
          </text>
          <text x="110" y="98" textAnchor="middle" fill="#1e293b" fontSize="12" fontFamily="'Fira Code', monospace" fontWeight="bold">
            OF MY
          </text>
          <text x="110" y="118" textAnchor="middle" fill="#1e293b" fontSize="13" fontFamily="'Fira Code', monospace" fontWeight="bold" letterSpacing="0.5">
            PATIENCE
          </text>

          {/* Cute Ghost Peeking out */}
          <path d="M 90 170 C 90 140 130 140 130 170 Z" fill="#fff" stroke="#18181b" strokeWidth="2.5" />
          <circle cx="102" cy="154" r="2" fill="#18181b" />
          <circle cx="118" cy="154" r="2" fill="#18181b" />
          <ellipse cx="110" cy="160" rx="3" ry="2" fill="#18181b" />

          {/* Pink Flowers */}
          <circle cx="55" cy="165" r="8" fill="#f472b6" stroke="#18181b" strokeWidth="1.5" />
          <circle cx="55" cy="165" r="3" fill="#fef08a" />
          <circle cx="165" cy="165" r="8" fill="#f472b6" stroke="#18181b" strokeWidth="1.5" />
          <circle cx="165" cy="165" r="3" fill="#fef08a" />
        </svg>
      );

    case 'social_404':
      return (
        <svg viewBox="0 0 220 200" className="w-full h-full max-h-48 drop-shadow-md select-none">
          {/* Retro Window Outer Frame */}
          <rect x="20" y="25" width="180" height="150" rx="10" fill="#fef3c7" stroke="#065f46" strokeWidth="3" />
          {/* Header Bar */}
          <path d="M 20 35 Q 20 25 30 25 L 190 25 Q 200 25 200 35 L 200 55 L 20 55 Z" fill="#047857" stroke="#065f46" strokeWidth="2" />
          
          {/* Warning Icon & Title */}
          <text x="35" y="44" fill="#fef08a" fontSize="14">⚠️</text>
          <text x="55" y="45" fill="#fff" fontSize="14" fontFamily="'Fira Code', monospace" fontWeight="bold">
            Error 404
          </text>
          
          {/* Close Button X */}
          <rect x="175" y="32" width="18" height="18" rx="3" fill="#064e3b" />
          <text x="180" y="45" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="bold">✕</text>

          {/* Retro Monitor Icon */}
          <g transform="translate(35, 75)">
            <rect x="0" y="0" width="40" height="32" rx="4" fill="#6ee7b7" stroke="#065f46" strokeWidth="2" />
            <rect x="5" y="5" width="30" height="22" rx="2" fill="#064e3b" />
            <circle cx="15" cy="14" r="2" fill="#6ee7b7" />
            <circle cx="25" cy="14" r="2" fill="#6ee7b7" />
            <path d="M 13 22 Q 20 26 27 22" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
            <rect x="8" y="32" width="24" height="6" fill="#a7f3d0" stroke="#065f46" strokeWidth="1.5" />
          </g>

          {/* Dialog Text */}
          <text x="88" y="92" fill="#064e3b" fontSize="13" fontFamily="'Fira Code', monospace" fontWeight="bold">
            Social Skills
          </text>
          <text x="88" y="112" fill="#064e3b" fontSize="13" fontFamily="'Fira Code', monospace" fontWeight="bold">
            Not Found
          </text>

          {/* Buttons */}
          <rect x="50" y="135" width="32" height="22" rx="4" fill="#f87171" stroke="#065f46" strokeWidth="1.5" />
          <text x="60" y="150" fill="#fff" fontSize="12" fontWeight="bold">✕</text>

          <rect x="110" y="135" width="55" height="22" rx="4" fill="#a7f3d0" stroke="#065f46" strokeWidth="2" />
          <text x="127" y="150" fill="#064e3b" fontSize="12" fontFamily="'Fira Code', monospace" fontWeight="bold">OK</text>
        </svg>
      );

    case 'senior_staff':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
          <div className="w-24 h-24 bg-[#3d1d07] rounded-3xl flex items-center justify-center text-5xl border-2 border-[#b45309] shadow-inner mb-2">
            🎓
          </div>
          <span className="font-mono text-xs text-[#ff9d00] font-bold">SENIOR STAFF DUCK</span>
        </div>
      );

    case 'rubber_debugger':
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-md">
          <path d="M 25 55 Q 15 35 35 25 Q 55 15 70 30 Q 80 45 75 60 Q 65 80 35 75 Q 15 70 25 55 Z" fill="#facc15" stroke="#2b2927" strokeWidth="2.5" />
          <circle cx="58" cy="38" r="4" fill="#2b2927" />
          <circle cx="60" cy="36" r="1" fill="#fff" />
          <path d="M 70 38 Q 85 36 82 45 Q 72 48 68 42 Z" fill="#f97316" stroke="#2b2927" strokeWidth="2" />
          <path d="M 45 22 L 65 18 M 50 15 L 60 13 L 58 20 Z" fill="#374151" stroke="#2b2927" strokeWidth="1.5" />
        </svg>
      );
  }
};
