import type { Room as RoomType } from '../types';

interface RoomProps {
  room: RoomType;
  distance: number;
  isCurrent: boolean;
  isVisited: boolean;
  isVisible: boolean;
  isTreasure: boolean;
  onClick: () => void;
  canClick: boolean;
  scale: number;
}

export function Room({
  room,
  distance,
  isCurrent,
  isVisited,
  isVisible,
  isTreasure,
  onClick,
  canClick,
  scale,
}: RoomProps) {
  const size = 60 * scale;
  const x = room.x * 100 * scale;
  const y = room.y * 100 * scale;

  // Determine room appearance
  let fillColor = '#2d2d44'; // Default dark
  let strokeColor = '#4a4a6a';
  let strokeWidth = 2;
  let opacity = 0.3;

  if (!isVisible) {
    opacity = 0;
  } else if (isCurrent) {
    fillColor = '#3d3d54';
    strokeColor = '#ffd700';
    strokeWidth = 3;
    opacity = 1;
  } else if (isVisited) {
    fillColor = '#2d2d44';
    strokeColor = '#6a6a8a';
    opacity = 0.7;
  } else {
    // Visible but not visited (adjacent)
    fillColor = '#252538';
    strokeColor = '#5a5a7a';
    opacity = 0.5;
  }

  // Treasure room glow
  if (isTreasure && (isVisited || isCurrent)) {
    fillColor = '#3d3520';
    strokeColor = '#ffd700';
  }

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={canClick ? onClick : undefined}
      style={{ cursor: canClick ? 'pointer' : 'default' }}
      className={isCurrent ? 'current-room' : ''}
    >
      {/* Room background */}
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        rx={4}
        ry={4}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />

      {/* Room content - ONLY show distance on CURRENT room */}
      {isVisible && (
        <>
          {/* Treasure icon when found */}
          {isTreasure && isCurrent ? (
            <text
              x={0}
              y={6}
              textAnchor="middle"
              fontSize={24 * scale}
              fill="#ffd700"
              className="torch-glow"
            >
              💎
            </text>
          ) : isCurrent ? (
            // Only show distance number on CURRENT room
            <text
              x={0}
              y={8 * scale}
              textAnchor="middle"
              fontSize={24 * scale}
              fontFamily="'Courier New', monospace"
              fontWeight="bold"
              fill="#ffd700"
            >
              {distance}
            </text>
          ) : (
            // All other rooms (visited or adjacent) show "?" - you must remember!
            <text
              x={0}
              y={8 * scale}
              textAnchor="middle"
              fontSize={24 * scale}
              fontFamily="'Courier New', monospace"
              fontWeight="bold"
              fill={isVisited ? '#707080' : '#505060'}
            >
              ?
            </text>
          )}

          {/* "You" indicator for current room */}
          {isCurrent && !isTreasure && (
            <text
              x={0}
              y={-20 * scale}
              textAnchor="middle"
              fontSize={10 * scale}
              fill="#ffd700"
              fontFamily="'Courier New', monospace"
            >
              YOU
            </text>
          )}
        </>
      )}

      {/* Hover effect for clickable rooms */}
      {canClick && (
        <rect
          x={-size / 2}
          y={-size / 2}
          width={size}
          height={size}
          rx={4}
          ry={4}
          fill="transparent"
          stroke="#ffd700"
          strokeWidth={2}
          opacity={0}
          className="hover:opacity-30 transition-opacity"
        />
      )}
    </g>
  );
}
