const ARROW_CHARS = /^[←→↑↓↕↔|—]/;

export function ClueCompact({ text, scale, fill, className }: { text: string; scale: number; fill: string; className?: string }) {
  const match = text.match(ARROW_CHARS);
  if (match) {
    return (
      <text x={0} y={18 * scale} textAnchor="middle" fontSize={13 * scale}
        fontFamily="'Courier New', monospace" fill={fill} fontWeight="bold" className={className}>
        <tspan fontSize={22 * scale} strokeWidth={1.5 * scale} stroke={fill}>{match[0]}</tspan>
        {text.slice(match[0].length)}
      </text>
    );
  }
  return (
    <text x={0} y={18 * scale} textAnchor="middle" fontSize={13 * scale}
      fontFamily="'Courier New', monospace" fill={fill} fontWeight="bold" className={className}>
      {text}
    </text>
  );
}
