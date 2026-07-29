'use client';

import { useRef, useState } from 'react';
import type { HelpContext, HelpOption } from '@/lib/aiAssistant';
import { requestAIHelp } from '@/lib/aiAssistant';

export default function ContextualHelpButton({
  helpId,
  activeId,
  onToggle,
  options,
  buildContext,
  label = 'AIに質問する',
}: {
  helpId: string;
  activeId: string | null;
  onToggle: (id: string | null) => void;
  options: HelpOption[];
  buildContext: (helpType: string) => HelpContext;
  label?: string;
}) {
  const isOpen = activeId === helpId;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fallbackSpeak, setFallbackSpeak] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function speakWithBrowserTTS(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }

  async function handleSelect(optionId: string) {
    setLoading(true);
    setResponse(null);
    setAudioUrl(null);
    setIsPlaying(false);
    const result = await requestAIHelp(buildContext(optionId));
    setResponse(result.text);
    setLoading(false);

    if (result.audioUrl) {
      // Pre-generated audio available — play it via the inline controls below.
      // Fall back text is kept in case the file fails to load/play at runtime.
      setAudioUrl(result.audioUrl);
      setFallbackSpeak(result.speak ?? null);
    } else if (result.speak) {
      speakWithBrowserTTS(result.speak);
    }
  }

  function handleAudioError() {
    setAudioUrl(null);
    if (fallbackSpeak) speakWithBrowserTTS(fallbackSpeak);
  }

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
  }

  function restart() {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play();
    setIsPlaying(true);
  }

  function handleToggle() {
    if (isOpen) {
      audioRef.current?.pause();
      setIsPlaying(false);
      onToggle(null);
    } else {
      setResponse(null);
      setAudioUrl(null);
      onToggle(helpId);
    }
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors ${
          isOpen
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'bg-white border-slate-200 text-indigo-600 hover:border-indigo-300'
        }`}
      >
        💡 {label}
      </button>

      {isOpen && (
        <div className="absolute z-20 left-0 mt-2 w-72 max-w-[85vw] bg-white rounded-2xl border border-slate-200 shadow-lg p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">何を知りたいですか？</p>
          <div className="flex flex-col gap-1 mb-3">
            {options.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className="text-left text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {loading && <p className="text-xs text-slate-400 italic">考え中...</p>}

          {response && !loading && (
            <div className="text-sm text-slate-700 leading-relaxed bg-indigo-50 rounded-xl p-3 whitespace-pre-line">
              {response}
            </div>
          )}

          {audioUrl && !loading && (
            <div className="mt-2 flex items-center gap-2 bg-indigo-50 rounded-xl p-2.5">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                onError={handleAudioError}
              />
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                type="button"
                onClick={restart}
                aria-label="Restart"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-indigo-200 text-indigo-600 text-sm hover:border-indigo-400 transition-colors"
              >
                ⟲
              </button>
              <span className="text-xs text-slate-500">読み上げ</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
