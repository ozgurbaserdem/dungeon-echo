import type { Dungeon, Room } from '../types';

// Seeded random number generator (Mulberry32)
function createSeededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Convert date string to seed number
function dateToSeed(dateString: string): number {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Get today's date string in YYYY-MM-DD format
export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Calculate puzzle number (days since launch)
export function getPuzzleNumber(dateString: string): number {
  const launchDate = new Date('2026-02-05');
  const currentDate = new Date(dateString);
  const diffTime = currentDate.getTime() - launchDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

// Generate dungeon from date seed
export function generateDungeon(dateString: string): Dungeon {
  const seed = dateToSeed(dateString);
  const random = createSeededRandom(seed);

  // Determine room count (10-14 to ensure enough distance for treasure)
  const roomCount = Math.floor(random() * 5) + 10;

  // Generate room positions in a grid-like layout (larger grid for more spread)
  const rooms: Room[] = [];
  const gridSize = Math.ceil(Math.sqrt(roomCount * 3));
  const usedPositions = new Set<string>();

  for (let i = 0; i < roomCount; i++) {
    let x: number, y: number;
    let attempts = 0;

    do {
      x = Math.floor(random() * gridSize);
      y = Math.floor(random() * gridSize);
      attempts++;
    } while (usedPositions.has(`${x},${y}`) && attempts < 100);

    usedPositions.add(`${x},${y}`);
    rooms.push({ id: i, x, y, connections: [] });
  }

  // Connect rooms to form a connected graph
  // First, create a minimum spanning tree using Prim's algorithm
  const inTree = new Set<number>([0]);
  const edges: Array<{ from: number; to: number; dist: number }> = [];

  while (inTree.size < roomCount) {
    let bestEdge: { from: number; to: number; dist: number } | null = null;

    for (const fromId of inTree) {
      for (let toId = 0; toId < roomCount; toId++) {
        if (inTree.has(toId)) continue;

        const from = rooms[fromId];
        const to = rooms[toId];
        const dist = Math.abs(from.x - to.x) + Math.abs(from.y - to.y);

        if (!bestEdge || dist < bestEdge.dist) {
          bestEdge = { from: fromId, to: toId, dist };
        }
      }
    }

    if (bestEdge) {
      edges.push(bestEdge);
      inTree.add(bestEdge.to);
      rooms[bestEdge.from].connections.push(bestEdge.to);
      rooms[bestEdge.to].connections.push(bestEdge.from);
    }
  }

  // Add a few extra connections for variety (but not too many)
  const extraConnections = Math.floor(random() * 3) + 1;
  for (let i = 0; i < extraConnections; i++) {
    const fromId = Math.floor(random() * roomCount);
    const candidates = rooms.filter((r) => {
      if (r.id === fromId) return false;
      if (rooms[fromId].connections.includes(r.id)) return false;
      const dist = Math.abs(rooms[fromId].x - r.x) + Math.abs(rooms[fromId].y - r.y);
      return dist <= 2; // Only connect nearby rooms
    });

    if (candidates.length > 0) {
      const toRoom = candidates[Math.floor(random() * candidates.length)];
      rooms[fromId].connections.push(toRoom.id);
      rooms[toRoom.id].connections.push(fromId);
    }
  }

  // Entrance is room 0
  const entranceId = 0;

  // Find treasure room: must be at least 4 rooms away from entrance (par 4+)
  const distances = calculateDistances(rooms, entranceId);
  const validTreasureRooms = rooms.filter((r) => {
    const dist = distances.get(r.id);
    return dist !== undefined && dist >= 4;
  });

  // Pick a random valid treasure room, preferring farther rooms
  // Sort by distance (descending) and pick from the farther half
  const sortedValidRooms = validTreasureRooms.sort((a, b) => {
    const distA = distances.get(a.id) || 0;
    const distB = distances.get(b.id) || 0;
    return distB - distA;
  });

  // Pick from top half of farthest rooms for more challenge
  const topHalf = sortedValidRooms.slice(0, Math.max(1, Math.ceil(sortedValidRooms.length / 2)));
  const treasureRoom =
    topHalf[Math.floor(random() * topHalf.length)] ||
    sortedValidRooms[0] ||
    rooms[rooms.length - 1];

  return {
    rooms,
    entranceId,
    treasureId: treasureRoom.id,
  };
}

// BFS to calculate distances from a starting room
export function calculateDistances(rooms: Room[], startId: number): Map<number, number> {
  const distances = new Map<number, number>();
  const queue: number[] = [startId];
  distances.set(startId, 0);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentDist = distances.get(currentId)!;
    const currentRoom = rooms.find((r) => r.id === currentId)!;

    for (const neighborId of currentRoom.connections) {
      if (!distances.has(neighborId)) {
        distances.set(neighborId, currentDist + 1);
        queue.push(neighborId);
      }
    }
  }

  return distances;
}

// Calculate par (optimal moves) for a dungeon
export function calculatePar(dungeon: Dungeon): number {
  const distances = calculateDistances(dungeon.rooms, dungeon.entranceId);
  return distances.get(dungeon.treasureId) || 0;
}
