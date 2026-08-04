'use client';

import { useRef, useState } from 'react';

/**
 * Listening control that belongs to the paragraph itself — separate from
 * "Ask AI" (understanding). Same playback mechanism as before (pre-generated
 * audioUrl when available, browser TTS otherwise/on failure); this component
 * only relocates that mechanism out of the AI Help popover.
 */
export default function ParagraphPlayButton({
  audioUrl,
  text,
}: {
  audioUrl?: string;
  text: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const hasGeneratedAudio = !!audioUrl && !audioFailed;

  function speakWithBrowserTTS() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }

  function handleAudioError() {
    setAudioFailed(true);
    setIsPlaying(false);
    speakWithBrowserTTS();
  }

  function togglePlay() {
    if (!hasGeneratedAudio) {
      speakWithBrowserTTS();
      return;
    }
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

  return (
    <div className="flex items-center gap-1.5">
      {hasGeneratedAudio && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onError={handleAudioError}
        />
      )}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause paragraph audio' : 'Listen to paragraph'}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white text-sm hover:bg-amber-700 transition-colors shadow-sm"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      {hasGeneratedAudio && (
        <button
          type="button"
          onClick={restart}
          aria-label="Restart paragraph audio"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-amber-200 text-amber-700 text-sm hover:border-amber-400 transition-colors"
        >
          ⟲
        </button>
      )}
    </div>
  );
}
