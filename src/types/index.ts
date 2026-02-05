export interface Room {
  id: number;
  x: number;
  y: number;
  connections: number[]; // IDs of connected rooms
}

export interface Dungeon {
  rooms: Room[];
  entranceId: number;
  treasureId: number;
}

export interface GameState {
  dungeon: Dungeon;
  currentRoomId: number;
  visitedRoomIds: Set<number>;
  moveCount: number;
  hasWon: boolean;
  distances: Map<number, number>; // roomId -> distance to treasure
}

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  moveHistory: number[]; // moves taken to win each game
}

export interface ShareData {
  puzzleNumber: number;
  moves: number;
  par: number;
  visitedPath: number[];
  dungeon: Dungeon;
}
