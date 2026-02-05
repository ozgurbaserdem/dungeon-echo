import { useState, useCallback, useEffect } from 'react';
import type { Stats } from '../types';
import { getTodayDateString } from '../utils/dungeonGenerator';

const STATS_KEY = 'dungeon-echo-stats';

const DEFAULT_STATS: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastPlayedDate: null,
  moveHistory: [],
};

function loadStats(): Stats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors
  }
  return { ...DEFAULT_STATS };
}

function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore errors
  }
}

interface UseStatsReturn {
  stats: Stats;
  recordWin: (moves: number) => void;
  hasPlayedToday: boolean;
  averageMoves: number;
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<Stats>(loadStats);

  const todayString = getTodayDateString();
  const hasPlayedToday = stats.lastPlayedDate === todayString;

  const averageMoves =
    stats.moveHistory.length > 0
      ? stats.moveHistory.reduce((a, b) => a + b, 0) / stats.moveHistory.length
      : 0;

  const recordWin = useCallback(
    (moves: number) => {
      if (hasPlayedToday) return; // Already played today

      setStats((prev) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        const isConsecutive = prev.lastPlayedDate === yesterdayString;
        const newStreak = isConsecutive ? prev.currentStreak + 1 : 1;

        const newStats: Stats = {
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: prev.gamesWon + 1,
          currentStreak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak),
          lastPlayedDate: todayString,
          moveHistory: [...prev.moveHistory.slice(-29), moves], // Keep last 30 games
        };

        saveStats(newStats);
        return newStats;
      });
    },
    [hasPlayedToday, todayString]
  );

  // Sync stats on mount and when localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      setStats(loadStats());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    stats,
    recordWin,
    hasPlayedToday,
    averageMoves,
  };
}
