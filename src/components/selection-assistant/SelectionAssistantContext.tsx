'use client';

import { createContext, useContext, useEffect, useId, useRef } from 'react';
import type { SelectionScopeMeta } from '@/lib/selectionAssistant/types';

export interface SelectionAssistantContextValue {
  registerScope: (id: string, el: HTMLElement, meta: SelectionScopeMeta) => void;
  unregisterScope: (id: string) => void;
}

export const SelectionAssistantContext = createContext<SelectionAssistantContextValue | null>(null);

/** Internal — used by `SelectableContent` to opt an element into the
 *  assistant. Not exported for direct use; activities should wrap content
 *  in `<SelectableContent>` instead of calling this themselves. */
export function useRegisterSelectableScope(
  ref: React.RefObject<HTMLElement | null>,
  meta: SelectionScopeMeta
) {
  const ctx = useContext(SelectionAssistantContext);
  const id = useId();

  useEffect(() => {
    if (!ctx || !ref.current) return;
    ctx.registerScope(id, ref.current, meta);
    return () => ctx.unregisterScope(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, id, meta.activityType, meta.themeId, meta.level, meta.label]);
}

export function useSelectionAssistantAvailable(): boolean {
  return useContext(SelectionAssistantContext) !== null;
}
