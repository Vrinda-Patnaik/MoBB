import React, { useState, useEffect, useRef } from 'react';
import { CuratorChatMessage, GalleryId } from '../types';
import { MessageSquare, X, Send, Sparkles, Bot, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { playArtifactOpenSound, playQuackSound as triggerQuack } from '../lib/sound';
import { askCurator } from '../lib/api';

interface AICuratorProps {
  currentGallery: GalleryId;
  userBugsCount: number;
  onOpenGeneratorWithPrompt?: (prompt: string) => void;
}

export const AICurator: React.FC<AICuratorProps> = ({
  currentGallery,
  userBugsCount,
  onOpenGeneratorWithPrompt,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [messages, setMessages] = useState<CuratorChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'curator',
      text: "Welcome to The Museum of Broken Builds! I'm your Museum Guide. Ask me about artifacts, hidden easter eggs, or the history of broken builds.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Quack sound effect synthesizer via Web Audio API
  const playQuackSound = () => {
    if (!soundEnabled) return;
    triggerQuack(350);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: CuratorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const data = await askCurator({
        message: query,
        gallery: currentGallery,
        context: { userBugsCount },
      });

      playQuackSound();

      const curatorMsg: CuratorChatMessage = {
        id: `curator-${Date.now()}`,
        sender: 'curator',
        text: data.reply || "As curator, I'm currently pondering the metaphysical nature of 404 errors. *Quack*",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, curatorMsg]);
    } catch (e) {
      console.error(e);
      playQuackSound();
      setMessages((prev) => [
        ...prev,
        {
          id: `curator-err-${Date.now()}`,
          sender: 'curator',
          text: "The curator's Wi-Fi dropped momentarily, but here is my timeless advice: Hydrate, close 10 browser tabs, and take a deep breath. *Quack*",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* Expanded Curator Chatbot Window */}
      <div
        className={`w-[360px] sm:w-[420px] h-[520px] bg-[#131417] text-white rounded-2xl border-2 border-[#2d2f36] museum-card-shadow flex flex-col overflow-hidden transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto shadow-2xl'
            : 'opacity-0 scale-90 translate-y-8 pointer-events-none absolute bottom-0 right-0'
        }`}
      >
        {/* Header */}
        <div className="bg-[#18191d] text-white p-4 flex items-center justify-between border-b border-[#2d2f36] relative">
          {/* Top Tape */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-4 masking-tape-dark opacity-90" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3d1d07] rounded-full flex items-center justify-center text-xl border border-[#b45309]">
              🦆
            </div>
            <div>
              <div className="font-bold text-base flex items-center gap-1.5 text-white">
                Museum Guide
                <span className="text-[10px] bg-[#3d1d07] text-[#ff9d00] px-2 py-0.5 rounded-full font-mono border border-[#b45309] font-bold">
                  AI Guide
                </span>
              </div>
              <p className="text-xs text-stone-300 font-handwritten">
                Dr. Quackers • Curator & Build Historian
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Quacks' : 'Enable Quacks'}
              className="text-stone-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              id="btn-close-curator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="bg-[#121316] p-2 border-b border-[#2d2f36] flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => handleSendMessage(`Explain the gallery: ${currentGallery}`)}
            className="px-2.5 py-1 bg-[#18191d] hover:bg-[#282a30] text-stone-200 rounded-full border border-[#2d2f36] whitespace-nowrap transition-colors font-handwritten"
          >
            🏛️ Explain Gallery
          </button>
          <button
            onClick={() => handleSendMessage('Analyze my current emotional bugs')}
            className="px-2.5 py-1 bg-[#18191d] hover:bg-[#282a30] text-stone-200 rounded-full border border-[#2d2f36] whitespace-nowrap transition-colors font-handwritten"
          >
            📊 Analyze My Bugs
          </button>
          <button
            onClick={() => handleSendMessage('Give me witty advice for procrastination')}
            className="px-2.5 py-1 bg-[#18191d] hover:bg-[#282a30] text-stone-200 rounded-full border border-[#2d2f36] whitespace-nowrap transition-colors font-handwritten"
          >
            💡 Witty Advice
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#121316]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-md relative ${
                  msg.sender === 'user'
                    ? 'bg-[#ff9d00] text-stone-950 font-medium rounded-br-none'
                    : 'bg-[#18191d] text-white border border-[#2d2f36] rounded-bl-none font-sans'
                }`}
              >
                {msg.sender === 'curator' && (
                  <div className="font-handwritten text-xs text-[#ff9d00] font-bold mb-1 flex items-center justify-between">
                    <span>Museum Guide</span>
                    {msg.source && (
                      <span className="text-[9px] uppercase tracking-wider font-mono opacity-70 text-stone-400">
                        {msg.source}
                      </span>
                    )}
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[10px] mt-1 block text-right font-mono opacity-70 ${
                    msg.sender === 'user' ? 'text-stone-900' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-[#ff9d00] text-xs font-handwritten bg-[#18191d] p-2.5 rounded-xl border border-[#2d2f36] w-max animate-pulse">
              <span>🦆 Museum Guide is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#121316] border-t border-[#2d2f36] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your Museum Guide..."
            className="flex-1 bg-[#18191d] text-white px-3.5 py-2 rounded-xl text-sm border border-[#2d2f36] focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
            id="input-curator-chat"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#ff9d00] hover:bg-[#e68d00] text-stone-950 p-2.5 rounded-xl disabled:opacity-40 transition-colors shadow-sm font-bold"
            id="btn-curator-send"
          >
            <Send className="w-4 h-4 text-stone-950" />
          </button>
        </form>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playQuackSound();
          playArtifactOpenSound();
        }}
        id="btn-curator-toggle"
        className={`group relative flex items-center gap-3 bg-[#131417] hover:bg-[#18191d] text-white px-5 py-3.5 rounded-full museum-card-shadow border-2 border-[#2d2f36] transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? 'opacity-0 scale-75 pointer-events-none translate-y-4'
            : 'opacity-100 scale-100 pointer-events-auto translate-y-0 hover:scale-105 active:scale-95'
        }`}
      >
        <div className="relative">
          <span className="text-2xl animate-bounce inline-block">🦆</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#131417]" />
        </div>
        <div className="text-left pr-1">
          <div className="font-handwritten text-xs text-[#ff9d00] leading-none">AI Museum Guide</div>
          <div className="font-bold text-sm leading-tight text-white">Dr. Quackers</div>
        </div>
        <Sparkles className="w-4 h-4 text-[#ff9d00] group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
