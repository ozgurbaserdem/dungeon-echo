import type { ConfettiConfig } from './shareModalConstants';

interface ConfettiOverlayProps {
  config: ConfettiConfig;
}

export function ConfettiOverlay({ config }: ConfettiOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(config.count)].map((_, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: `${10 + (i / config.count) * 80}%`,
            '--drift': `${i % 2 === 0 ? -20 : 20}px`,
            '--duration': config.duration,
            '--delay': `${(i / config.count) * config.maxDelay}s`,
          } as React.CSSProperties}
        >
          {config.emojis[i % config.emojis.length]}
        </div>
      ))}
    </div>
  );
}
