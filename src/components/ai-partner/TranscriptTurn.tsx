export interface TranscriptTurnData {
  id: string;
  role: 'student' | 'partner';
  text: string;
}

export type SpeechStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * One turn in the transcript — a plain speaker label and serif text with a
 * hairline rule between turns, matching Reading's textbook visual language.
 * No chat bubbles, no avatars. Only partner turns get a Play control —
 * students don't need their own typed text read back.
 */
export default function TranscriptTurn({
  turn,
  speechStatus,
  isPlaying,
  onPlay,
  onPause,
}: {
  turn: TranscriptTurnData;
  speechStatus?: SpeechStatus;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}) {
  const isPartner = turn.role === 'partner';

  return (
    <div className="py-4 border-b border-slate-100 last:border-b-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        {isPartner ? 'Partner' : 'You'}
      </p>
      <div className="flex items-start gap-3">
        <p className="font-serif text-[1.05rem] leading-[1.8] text-slate-900 flex-1">{turn.text}</p>

        {isPartner && onPlay && (
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            <button
              type="button"
              onClick={isPlaying ? onPause : onPlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              disabled={speechStatus === 'loading'}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-500 text-xs hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40"
            >
              {speechStatus === 'loading' ? '…' : isPlaying ? '⏸' : '▶'}
            </button>
            {speechStatus === 'error' && (
              <span className="text-[11px] text-slate-400 italic">audio unavailable</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
