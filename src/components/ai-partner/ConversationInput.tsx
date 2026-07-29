import type { KeyboardEvent } from 'react';

/**
 * Plain, bordered notebook-style input box — not a rounded chat-pill,
 * matching AI_PARTNER_ACTIVITY_DESIGN.md §8. Shows a quiet turn counter and
 * disables itself the instant the hard turn cap is reached.
 */
export default function ConversationInput({
  value,
  onChange,
  onSubmit,
  disabled,
  isSubmitting,
  studentTurnCount,
  turnTarget,
  hardMax,
}: {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isSubmitting: boolean;
  studentTurnCount: number;
  turnTarget: number;
  hardMax: number;
}) {
  const atCap = studentTurnCount >= hardMax;

  function handleSubmit() {
    if (disabled || isSubmitting || !value.trim()) return;
    onSubmit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="mt-2">
      <p className="text-xs text-slate-400 mb-2">
        {atCap ? 'Conversation limit reached' : `Turn ${Math.min(studentTurnCount + 1, hardMax)} of ${turnTarget}`}
      </p>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={3}
        placeholder={atCap ? 'This conversation has ended.' : 'Type your reply...'}
        className="w-full bg-white rounded-md border border-slate-300 p-4 text-base text-slate-900 leading-relaxed mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-400"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || isSubmitting || !value.trim()}
        className="w-full px-5 py-3 rounded-md font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
