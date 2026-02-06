import type { Stats as StatsType } from '../../types';
import { GRADE_COLORS } from '../gradeColors';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { StatBox } from './StatBox';

interface StatsProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StatsType;
  averageMoves: number;
}

const GRADES = ['S', 'A', 'B', 'C', 'D'] as const;

export function Stats({ isOpen, onClose, stats, averageMoves }: StatsProps) {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const ratingCounts = stats.ratingCounts || { S: 0, A: 0, B: 0, C: 0, D: 0 };
  const maxCount = Math.max(...GRADES.map((g) => ratingCounts[g] || 0), 1);
  const hasAnyRatings = GRADES.some((g) => (ratingCounts[g] || 0) > 0);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dungeon-floor rounded-lg p-6 max-w-sm w-full pixel-border" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-treasure-gold mb-6 text-center">Statistics</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatBox label="Played" value={stats.gamesPlayed} />
          <StatBox label="Won" value={stats.gamesWon} />
          <StatBox label="Current Streak" value={stats.currentStreak} emoji="🔥" />
          <StatBox label="Max Streak" value={stats.maxStreak} emoji="🏆" />
        </div>

        {stats.moveHistory.length > 0 && (
          <div className="bg-dungeon-bg rounded p-4 mb-6">
            <p className="text-center text-text-secondary text-sm mb-1">Average Moves</p>
            <p className="text-center text-2xl font-bold text-treasure-gold">
              {averageMoves.toFixed(1)}
            </p>
          </div>
        )}

        {/* Gunud Ratings Distribution */}
        <p className="text-text-secondary text-sm mb-2 text-center">Gunud Ratings</p>
        <div className="bg-dungeon-bg rounded p-4 mb-6">
          {hasAnyRatings ? (
            GRADES.map((grade) => {
              const count = ratingCounts[grade] || 0;
              return (
                <div key={grade} className="flex items-center gap-2 mb-1">
                  <span
                    className="w-6 text-right font-bold"
                    style={{ color: GRADE_COLORS[grade] }}
                  >
                    {grade}
                  </span>
                  <div className="flex-1">
                    {count > 0 && (
                      <div
                        className="h-5 rounded-sm"
                        style={{
                          backgroundColor: GRADE_COLORS[grade],
                          width: `${(count / maxCount) * 100}%`,
                          minWidth: '8px',
                        }}
                      />
                    )}
                  </div>
                  {count > 0 && (
                    <span className="w-8 text-left text-sm text-text-secondary">{count}</span>
                  )}
                  {count === 0 && <span className="w-8" />}
                </div>
              );
            })
          ) : (
            <p className="text-text-faint text-sm text-center">Play to see your ratings</p>
          )}
        </div>

        {stats.moveHistory.length > 0 && (
          <div className="mb-6">
            <p className="text-text-secondary text-sm mb-2 text-center">Recent Games</p>
            <div className="flex gap-1 justify-center flex-wrap">
              {stats.moveHistory.slice(-10).map((moves, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-dungeon-bg rounded flex items-center justify-center text-sm font-mono"
                  title={`${moves} moves`}
                >
                  {moves}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-dungeon-wall text-white px-6 py-3 rounded font-bold hover:bg-dungeon-wall-light transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
