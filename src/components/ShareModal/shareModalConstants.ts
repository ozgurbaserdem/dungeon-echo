export const GRADE_SHADOWS: Record<string, string> = {
  S: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
  A: '0 0 15px rgba(240, 192, 64, 0.5), 0 0 30px rgba(240, 192, 64, 0.2)',
  B: '0 0 10px rgba(168, 180, 192, 0.4)',
};

export interface ConfettiConfig {
  count: number;
  emojis: string[];
  duration: string;
  maxDelay: number;
}

export const CONFETTI_CONFIG: Record<string, ConfettiConfig | null> = {
  S: { count: 12, emojis: ['\u2728'], duration: '2.5s', maxDelay: 0.8 },
  A: { count: 8, emojis: ['\u26A1', '\u2728'], duration: '2s', maxDelay: 0.5 },
  B: { count: 4, emojis: ['\uD83D\uDD2E'], duration: '3s', maxDelay: 0.3 },
  C: null,
  D: null,
};

export function getContextMessage(grade: string, moves: number, par: number): string | null {
  const diff = moves - par;
  switch (grade) {
    case 'S': return null;
    case 'A': return 'Perfect navigation.';
    case 'B': return `So close! Just ${diff} step${diff > 1 ? 's' : ''} off.`;
    case 'C': return 'A rough descent...';
    case 'D': return 'Lost in the dark.';
    default: return null;
  }
}
