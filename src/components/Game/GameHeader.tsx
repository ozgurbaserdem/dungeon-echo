import { CircleHelp, BarChart3 } from 'lucide-react';

interface GameHeaderProps {
  puzzleNumber: number;
  isPractice: boolean;
  onShowHelp: () => void;
  onShowStats: () => void;
}

export function GameHeader({ puzzleNumber, isPractice, onShowHelp, onShowStats }: GameHeaderProps) {
  return (
    <header className="border-b border-dungeon-wall/40">
      <div className="flex items-center justify-between max-w-md mx-auto px-4 py-4">
        <button
          onClick={onShowHelp}
          className="text-text-muted hover:text-treasure-gold transition-colors"
          title="How to Play"
        >
          <CircleHelp size={24} strokeWidth={1.5} />
        </button>

        <div className="text-center">
          <h1
            className="text-2xl font-bold text-treasure-gold tracking-[0.15em]"
            style={{ textShadow: '0 0 24px rgba(255,215,0,0.25)' }}
          >
            /ˈɡunʊd/
          </h1>
          <p className="text-[10px] text-text-muted tracking-[0.25em] mt-0.5">
            {isPractice ? 'PRACTICE' : `PUZZLE #${puzzleNumber}`}
          </p>
        </div>

        <button
          onClick={onShowStats}
          className="text-text-muted hover:text-treasure-gold transition-colors"
          title="Statistics"
        >
          <BarChart3 size={24} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
