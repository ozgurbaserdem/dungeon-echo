import { useState, useCallback, useMemo } from 'react';
import type { GameState, Dungeon } from '../types';
import {
  generateDungeon,
  getTodayDateString,
  calculatePar,
  getPuzzleNumber,
} from '../utils/dungeonGenerator';
import { calculateDistancesToTreasure } from '../utils/pathfinding';

interface UseGameReturn {
  gameState: GameState;
  currentDistance: number;
  par: number;
  puzzleNumber: number;
  moveToRoom: (roomId: number) => void;
  resetGame: () => void;
  canMoveTo: (roomId: number) => boolean;
  isRoomVisible: (roomId: number) => boolean;
}

function createInitialState(dungeon: Dungeon): GameState {
  const distances = calculateDistancesToTreasure(dungeon.rooms, dungeon.treasureId);

  return {
    dungeon,
    currentRoomId: dungeon.entranceId,
    visitedRoomIds: new Set([dungeon.entranceId]),
    moveCount: 0,
    hasWon: dungeon.entranceId === dungeon.treasureId,
    distances,
  };
}

export function useGame(): UseGameReturn {
  const dateString = getTodayDateString();
  const puzzleNumber = getPuzzleNumber(dateString);

  const [dungeon] = useState(() => generateDungeon(dateString));
  const [gameState, setGameState] = useState(() => createInitialState(dungeon));

  const par = useMemo(() => calculatePar(dungeon), [dungeon]);

  const currentDistance = useMemo(() => {
    return gameState.distances.get(gameState.currentRoomId) ?? 0;
  }, [gameState.currentRoomId, gameState.distances]);

  const canMoveTo = useCallback(
    (roomId: number): boolean => {
      if (gameState.hasWon) return false;

      const currentRoom = dungeon.rooms.find((r) => r.id === gameState.currentRoomId);
      if (!currentRoom) return false;

      return currentRoom.connections.includes(roomId);
    },
    [dungeon.rooms, gameState.currentRoomId, gameState.hasWon]
  );

  const isRoomVisible = useCallback(
    (roomId: number): boolean => {
      // Visited rooms are always visible
      if (gameState.visitedRoomIds.has(roomId)) return true;

      // Adjacent rooms to current position are visible
      const currentRoom = dungeon.rooms.find((r) => r.id === gameState.currentRoomId);
      if (!currentRoom) return false;

      return currentRoom.connections.includes(roomId);
    },
    [dungeon.rooms, gameState.currentRoomId, gameState.visitedRoomIds]
  );

  const moveToRoom = useCallback(
    (roomId: number) => {
      if (!canMoveTo(roomId)) return;

      setGameState((prev) => {
        const newVisited = new Set(prev.visitedRoomIds);
        newVisited.add(roomId);

        const hasWon = roomId === dungeon.treasureId;

        return {
          ...prev,
          currentRoomId: roomId,
          visitedRoomIds: newVisited,
          moveCount: prev.moveCount + 1,
          hasWon,
        };
      });
    },
    [canMoveTo, dungeon.treasureId]
  );

  const resetGame = useCallback(() => {
    setGameState(createInitialState(dungeon));
  }, [dungeon]);

  return {
    gameState,
    currentDistance,
    par,
    puzzleNumber,
    moveToRoom,
    resetGame,
    canMoveTo,
    isRoomVisible,
  };
}
