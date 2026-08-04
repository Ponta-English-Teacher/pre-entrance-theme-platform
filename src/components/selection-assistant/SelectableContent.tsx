'use client';

import { useRef } from 'react';
import { useRegisterSelectableScope } from './SelectionAssistantContext';
import type { Level } from '@/types';

/**
 * Opt a piece of educational content into the Selection Assistant. Wrap
 * any static learning material (a reading passage, a vocabulary
 * definition, a question, an instruction) in this — never a text input,
 * textarea, or interactive control. That's the entire integration
 * surface: no other page needs custom selection-handling logic.
 *
 * @example
 * <SelectableContent activityType="reading" themeId={themeId} level={level}>
 *   <p>{paragraph.english}</p>
 * </SelectableContent>
 */
export default function SelectableContent({
  activityType,
  themeId,
  level,
  label,
  className,
  children,
}: {
  /** Free-form activity identifier — 'reading', 'vocabulary', 'ai-talk',
   *  'mission-check', 'writing-prompt', 'grammar', 'review', etc. */
  activityType: string;
  themeId?: string;
  level?: Level;
  /** Optional human-readable sub-label, e.g. "Reading Passage". */
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useRegisterSelectableScope(ref, { activityType, themeId, level, label });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
