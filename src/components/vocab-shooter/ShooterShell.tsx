'use client';

import { useState } from 'react';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';
import FlashCards from '@/components/vocab-shooter/FlashCards';
import GameArena  from '@/components/vocab-shooter/GameArena';
import FillBlank  from '@/components/vocab-shooter/FillBlank';
import EndScreen  from '@/components/vocab-shooter/EndScreen';

type Stage = 'flashcards' | 'gamearena' | 'fillblank' | 'endscreen';

const STAGE_LABEL: Record<Stage, string> = {
  flashcards: 'Flash Cards',
  gamearena:  'Matching Game',
  fillblank:  'Fill in the Blank',
  endscreen:  'Complete',
};

export default function ShooterShell({
  setWords,
  allWords,
  backHref,
  setNumber,
  level,
  themeId,
}: {
  setWords: VocabEntry[];
  allWords: VocabEntry[];
  backHref: string;
  setNumber: number;
  level: string;
  themeId: string;
}) {
  const [stage,     setStage]     = useState<Stage>('flashcards');
  const [gameScore, setGameScore] = useState(0);
  const [fillScore, setFillScore] = useState(0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          {STAGE_LABEL[stage]} · Set {setNumber} of 4
        </p>
        <h1 className="text-2xl font-bold text-slate-900 capitalize">
          {level} Vocabulary
        </h1>
      </div>

      {stage === 'flashcards' && (
        <FlashCards
          words={setWords}
          backHref={backHref}
          onComplete={() => setStage('gamearena')}
        />
      )}
      {stage === 'gamearena' && (
        <GameArena
          words={setWords}
          allWords={allWords}
          backHref={backHref}
          onComplete={(score) => { setGameScore(score); setStage('fillblank'); }}
        />
      )}
      {stage === 'fillblank' && (
        <FillBlank
          words={setWords}
          backHref={backHref}
          onComplete={(correct) => { setFillScore(correct); setStage('endscreen'); }}
        />
      )}
      {stage === 'endscreen' && (
        <EndScreen
          wordCount={setWords.length}
          gameScore={gameScore}
          fillScore={fillScore}
          themeId={themeId}
          level={level}
          setNumber={setNumber}
        />
      )}
    </div>
  );
}
