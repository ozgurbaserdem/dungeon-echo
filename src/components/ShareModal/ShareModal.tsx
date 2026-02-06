import { useState, useEffect, useRef } from 'react';
import type { Dungeon } from '../../types';
import { generateShareText, copyToClipboard, getGunudRating } from '../../utils/sharing';
import { GRADE_COLORS } from '../gradeColors';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { GRADE_SHADOWS, CONFETTI_CONFIG, getContextMessage } from './shareModalConstants';
import { ConfettiOverlay } from './ConfettiOverlay';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzleNumber: number;
  moves: number;
  par: number;
  visitedRoomIds: Set<number>;
  dungeon: Dungeon;
  clueCount: number;
}

export function ShareModal({
  isOpen,
  onClose,
  puzzleNumber,
  moves,
  par,
  visitedRoomIds,
  dungeon,
  clueCount,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const rating = getGunudRating(moves, par);
  const confettiConfig = CONFETTI_CONFIG[rating.grade];

  // Manage confetti phase — reset to 'active' each time modal opens
  const [confettiPhase, setConfettiPhase] = useState<'active' | 'shimmer' | 'done'>('done');
  const prevOpen = useRef(false);

  useEffect(() => {
    // Only trigger on open transition (false → true)
    if (isOpen && !prevOpen.current) {
      setConfettiPhase('active');
      const confettiDuration = confettiConfig
        ? parseFloat(confettiConfig.duration) * 1000 + confettiConfig.maxDelay * 1000
        : 0;
      const timer = setTimeout(() => {
        setConfettiPhase(rating.grade === 'S' ? 'shimmer' : 'done');
      }, confettiDuration || 500);
      prevOpen.current = true;
      return () => clearTimeout(timer);
    }
    if (!isOpen) {
      prevOpen.current = false;
    }
  }, [isOpen, rating.grade, confettiConfig]);

  const showConfetti = confettiPhase === 'active';
  const showShimmer = confettiPhase === 'shimmer';

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const { text, emojiGrid } = generateShareText(
    puzzleNumber, moves, par, visitedRoomIds, dungeon, clueCount
  );

  const handleShare = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const gradeColor = GRADE_COLORS[rating.grade];
  const gradeShadow = GRADE_SHADOWS[rating.grade] || 'none';
  const contextMessage = getContextMessage(rating.grade, moves, par);
  const cluesHighlight = clueCount <= moves;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dungeon-floor rounded-lg p-6 max-w-sm w-full text-center pixel-border relative overflow-hidden modal-enter" onClick={e => e.stopPropagation()}>
        {showConfetti && confettiConfig && <ConfettiOverlay config={confettiConfig} />}

        {/* Grade Letter */}
        <div
          className={`text-7xl font-bold grade-reveal ${showShimmer ? 'grade-shimmer' : ''}`}
          style={{
            color: gradeColor,
            textShadow: gradeShadow,
            fontFamily: "'Courier New', monospace",
          }}
        >
          {rating.grade}
        </div>

        {/* Grade Name */}
        <div
          className="mt-1 text-lg uppercase tracking-widest"
          style={{ color: gradeColor, opacity: 0.8 }}
        >
          {rating.name}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-6 mt-4 mb-2">
          <div className="text-center">
            <p className="text-xs text-text-secondary uppercase">Moves</p>
            <p className="text-2xl font-bold" style={{ color: gradeColor }}>{moves}</p>
          </div>
          <div className="w-px h-10 bg-dungeon-wall" />
          <div className="text-center">
            <p className="text-xs text-text-secondary uppercase">Par</p>
            <p className="text-2xl font-bold text-text-secondary">{par}</p>
          </div>
          <div className="w-px h-10 bg-dungeon-wall" />
          <div className="text-center">
            <p className="text-xs text-text-secondary uppercase">Clues</p>
            <p className={`text-2xl font-bold ${cluesHighlight ? 'text-treasure-gold' : 'text-text-secondary'}`}>
              {clueCount}
            </p>
          </div>
        </div>

        {/* Context Message */}
        {contextMessage && (
          <p
            className={`text-sm italic mt-2 mb-4 ${rating.grade === 'B' ? 'text-text-warm' : 'text-text-secondary'}`}
          >
            {contextMessage}
          </p>
        )}

        {/* Emoji Grid */}
        <div className="bg-dungeon-bg rounded p-4 mb-4 mt-4 font-mono text-lg leading-relaxed">
          <div className="whitespace-pre">{emojiGrid}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleShare}
            className="bg-treasure-gold text-dungeon-bg px-6 py-2 rounded font-bold hover:bg-treasure-gold-light transition-colors"
          >
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button
            onClick={onClose}
            className="bg-dungeon-wall text-white px-6 py-2 rounded font-bold hover:bg-dungeon-wall-light transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
