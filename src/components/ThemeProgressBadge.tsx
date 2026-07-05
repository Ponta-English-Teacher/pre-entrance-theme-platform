'use client';

import { useState, useEffect } from 'react';
import { getThemeProgress } from '@/lib/store';
import LevelBadge from '@/components/LevelBadge';
import type { Level } from '@/types';

export default function ThemeProgressBadge({ themeId }: { themeId: string }) {
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    setLevel(getThemeProgress(themeId).chosenLevel);
  }, [themeId]);

  if (!level) return null;
  return <LevelBadge level={level} />;
}
