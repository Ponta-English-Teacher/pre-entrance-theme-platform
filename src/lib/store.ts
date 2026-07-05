import type { Level, ActivityType, ThemeProgress } from '@/types';

const STORAGE_KEY = 'etp-progress';

function readAll(): Record<string, ThemeProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ThemeProgress>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, ThemeProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getThemeProgress(themeId: string): ThemeProgress {
  return readAll()[themeId] ?? { chosenLevel: null, completedActivities: [], startedAt: null };
}

export function setChosenLevel(themeId: string, level: Level): void {
  const all = readAll();
  all[themeId] = {
    ...getThemeProgress(themeId),
    chosenLevel: level,
    startedAt: all[themeId]?.startedAt ?? new Date().toISOString(),
  };
  writeAll(all);
}

export function markActivityComplete(themeId: string, type: ActivityType): void {
  const all = readAll();
  const progress = getThemeProgress(themeId);
  if (!progress.completedActivities.includes(type)) {
    progress.completedActivities = [...progress.completedActivities, type];
  }
  all[themeId] = progress;
  writeAll(all);
}

export function getAllProgress(): Record<string, ThemeProgress> {
  return readAll();
}
