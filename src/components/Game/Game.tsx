import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGame';
import { useStats } from '../../hooks/useStats';
import { DungeonMap } from '../DungeonMap';
import { ShareModal } from '../ShareModal';
import { HowToPlay } from '../HowToPlay';
import { Stats } from '../Stats';
import { GameHeader } from './GameHeader';
import { GameFooter } from './GameFooter';
import { GameStatus } from './GameStatus';

export function Game() {
  const {
    gameState, currentClue, par, puzzleNumber, isPractice,
    moveToRoom, canMoveTo, isRoomVisible, startPractice, tryAnother, backToDaily,
  } = useGame();

  const { stats, recordWin, hasPlayedToday, averageMoves } = useStats();

  // If game was restored as already won, show modal immediately
  const restoredAsWon = gameState.hasWon && gameState.moveCount > 0;
  const [showShareModal, setShowShareModal] = useState(restoredAsWon);
  const [showHowToPlay, setShowHowToPlay] = useState(() => {
    if (restoredAsWon) return false; // Don't show tutorial over completed game
    const seen = localStorage.getItem('gunud-tutorial-seen');
    if (!seen) {
      localStorage.setItem('gunud-tutorial-seen', 'true');
      return true;
    }
    return false;
  });
  const [showStats, setShowStats] = useState(false);
  const hasRecordedWin = useRef(restoredAsWon);

  // Reset win tracking when dungeon changes (practice mode transitions)
  const dungeonIdRef = useRef(gameState.dungeon);
  useEffect(() => {
    if (gameState.dungeon !== dungeonIdRef.current) {
      dungeonIdRef.current = gameState.dungeon;
      hasRecordedWin.current = false;
    }
  }, [gameState.dungeon]);

  // Handle win (only for fresh wins, not restored)
  useEffect(() => {
    if (gameState.hasWon && !hasRecordedWin.current) {
      if (!isPractice && !hasPlayedToday) {
        recordWin(gameState.moveCount, par);
      }
      hasRecordedWin.current = true;
      if (!isPractice) {
        // Delay showing modal for dramatic effect (let treasure pulse play)
        setTimeout(() => {
          setShowShareModal(true);
        }, 500);
      }
    }
  }, [gameState.hasWon, gameState.moveCount, hasPlayedToday, recordWin, par, isPractice]);

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader
        puzzleNumber={puzzleNumber}
        isPractice={isPractice}
        onShowHelp={() => setShowHowToPlay(true)}
        onShowStats={() => setShowStats(true)}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <DungeonMap
          gameState={gameState}
          onMoveToRoom={moveToRoom}
          canMoveTo={canMoveTo}
          isRoomVisible={isRoomVisible}
        />

        <div className="mt-6 text-center">
          <GameStatus
            hasWon={gameState.hasWon}
            hasLost={gameState.hasLost}
            isPractice={isPractice}
            moveCount={gameState.moveCount}
            visitedCount={gameState.visitedRoomIds.size}
            par={par}
            currentClue={currentClue}
            onShowShareModal={() => setShowShareModal(true)}
            onStartPractice={startPractice}
            onTryAnother={tryAnother}
            onBackToDaily={backToDaily}
          />
        </div>
      </main>

      <GameFooter />

      <ShareModal
        isOpen={showShareModal && gameState.hasWon}
        onClose={() => setShowShareModal(false)}
        puzzleNumber={puzzleNumber}
        moves={gameState.moveCount}
        par={par}
        visitedRoomIds={gameState.visitedRoomIds}
        dungeon={gameState.dungeon}
        clueCount={gameState.visitedRoomIds.size}
      />

      <HowToPlay isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      <Stats
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        averageMoves={averageMoves}
      />
    </div>
  );
}
