import type { Clue } from '../../types';

interface GameStatusProps {
  hasWon: boolean;
  hasLost: boolean;
  isPractice: boolean;
  moveCount: number;
  visitedCount: number;
  par: number;
  currentClue: Clue | null;
  onShowShareModal: () => void;
  onStartPractice: () => void;
  onTryAnother: () => void;
  onBackToDaily: () => void;
}

export function GameStatus({
  hasWon,
  hasLost,
  isPractice,
  moveCount,
  visitedCount,
  par,
  currentClue,
  onShowShareModal,
  onStartPractice,
  onTryAnother,
  onBackToDaily,
}: GameStatusProps) {
  if (hasLost) {
    return (
      <div>
        <p className="text-2xl font-bold text-danger mb-2 win-text-reveal">🐉 The Dragon Got You!</p>
        {isPractice ? (
          <div className="flex gap-3 win-button-reveal">
            <button
              onClick={onTryAnother}
              className="bg-danger text-dungeon-bg px-6 py-2 rounded font-bold hover:bg-danger-light transition-colors"
            >
              Try Another
            </button>
            <button
              onClick={onBackToDaily}
              className="border border-dungeon-wall text-text-secondary px-6 py-2 rounded font-bold hover:border-treasure-gold hover:text-treasure-gold transition-colors"
            >
              Back to Daily
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 win-button-reveal">
            <button
              onClick={onStartPractice}
              className="bg-treasure-gold text-dungeon-bg px-6 py-2 rounded font-bold hover:bg-treasure-gold-light transition-colors"
            >
              Practice Mode
            </button>
          </div>
        )}
      </div>
    );
  }

  if (hasWon) {
    return (
      <div>
        <p className="text-2xl font-bold text-treasure-gold mb-2 win-text-reveal">💎 Gem Found!</p>
        {isPractice ? (
          <div className="flex gap-3 win-button-reveal">
            <button
              onClick={onTryAnother}
              className="bg-treasure-gold text-dungeon-bg px-6 py-2 rounded font-bold hover:bg-treasure-gold-light transition-colors"
            >
              Try Another
            </button>
            <button
              onClick={onBackToDaily}
              className="border border-dungeon-wall text-text-secondary px-6 py-2 rounded font-bold hover:border-treasure-gold hover:text-treasure-gold transition-colors"
            >
              Back to Daily
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 win-button-reveal">
            <button
              onClick={onShowShareModal}
              className="bg-treasure-gold text-dungeon-bg px-6 py-2 rounded font-bold hover:bg-treasure-gold-light transition-colors"
            >
              Share Result
            </button>
            <button
              onClick={onStartPractice}
              className="text-text-dim text-base hover:text-treasure-gold transition-colors"
            >
              Practice Mode
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mb-2">
        <div className="text-center">
          <p className="text-xs text-text-secondary">CLUES</p>
          <p className="text-3xl font-bold text-treasure-gold torch-glow">
            {visitedCount}
          </p>
        </div>
        <div className="w-px h-10 bg-dungeon-wall" />
        <div className="text-center">
          <p className="text-xs text-text-secondary">MOVES</p>
          <p className="text-3xl font-bold">{moveCount}</p>
        </div>
        <div className="w-px h-10 bg-dungeon-wall" />
        <div className="text-center">
          <p className="text-xs text-text-secondary">PAR</p>
          <p className="text-3xl font-bold text-text-secondary">{par}</p>
        </div>
      </div>

      {currentClue && (
        <p className="text-base text-treasure-gold font-bold mb-2 clue-reveal">
          {currentClue.icon} {currentClue.text}
        </p>
      )}

      <p className="text-sm text-text-secondary">Collect clues to find the gem</p>
    </>
  );
}
