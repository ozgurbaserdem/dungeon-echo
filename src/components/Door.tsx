import type { Room } from '../types';

interface DoorProps {
  room1: Room;
  room2: Room;
  isVisible: boolean;
  canTraverse: boolean;
  onClick: () => void;
  scale: number;
}

export function Door({ room1, room2, isVisible, canTraverse, onClick, scale }: DoorProps) {
  if (!isVisible) return null;

  const x1 = room1.x * 100 * scale;
  const y1 = room1.y * 100 * scale;
  const x2 = room2.x * 100 * scale;
  const y2 = room2.y * 100 * scale;

  // Calculate door position (midpoint between rooms)
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Calculate door dimensions based on orientation
  const isHorizontal = Math.abs(room1.y - room2.y) < Math.abs(room1.x - room2.x);
  const doorWidth = isHorizontal ? 8 * scale : 20 * scale;
  const doorHeight = isHorizontal ? 20 * scale : 8 * scale;

  return (
    <g>
      {/* Connection line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#4a4a6a"
        strokeWidth={4 * scale}
        opacity={0.5}
      />

      {/* Door */}
      <rect
        x={midX - doorWidth / 2}
        y={midY - doorHeight / 2}
        width={doorWidth}
        height={doorHeight}
        fill={canTraverse ? '#8b4513' : '#5a4020'}
        stroke={canTraverse ? '#a0522d' : '#4a3010'}
        strokeWidth={1}
        rx={2}
        ry={2}
        onClick={canTraverse ? onClick : undefined}
        style={{ cursor: canTraverse ? 'pointer' : 'default' }}
        className={canTraverse ? 'hover:fill-[#a05020] transition-colors' : ''}
      />

      {/* Door handle */}
      {canTraverse && (
        <circle cx={midX + (isHorizontal ? 0 : 4 * scale)} cy={midY} r={2 * scale} fill="#ffd700" />
      )}
    </g>
  );
}
