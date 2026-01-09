import { useState } from 'react';
import { Flag, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import type { Challenge, Hint } from '../types/challenge';

interface FlagSubmissionProps {
  challenge: Challenge;
  onCorrect: () => void;
}

export function FlagSubmission({ challenge, onCorrect }: FlagSubmissionProps) {
  const [flagInput, setFlagInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hintsRevealed, setHintsRevealed] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isCorrect = checkFlag(flagInput, challenge.flag);

    if (isCorrect) {
      setStatus('correct');
      onCorrect();
    } else {
      setStatus('incorrect');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const revealHint = (index: number) => {
    if (!hintsRevealed.includes(index)) {
      setHintsRevealed([...hintsRevealed, index]);
    }
  };

  const totalHintCost = hintsRevealed.reduce(
    (sum, idx) => sum + (challenge.hints[idx]?.cost || 0),
    0
  );

  const finalPoints = Math.max(0, challenge.points - totalHintCost - (showSolution ? challenge.points : 0));

  return (
    <div className="space-y-4">
      {/* Flag submission */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">
            <div className="flex items-center space-x-2 mb-2">
              <Flag size={16} />
              <span>Submit Flag</span>
            </div>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="FLAG{...}"
              disabled={status === 'correct'}
              className={`flex-1 px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                status === 'correct'
                  ? 'border-green-500 bg-green-900/30'
                  : status === 'incorrect'
                  ? 'border-red-500 bg-red-900/30'
                  : 'border-slate-600 focus:ring-blue-500'
              }`}
            />
            <button
              type="submit"
              disabled={status === 'correct' || !flagInput.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                status === 'correct'
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-600 disabled:cursor-not-allowed'
              }`}
            >
              {status === 'correct' ? (
                <CheckCircle size={20} />
              ) : (
                'Submit'
              )}
            </button>
          </div>

          {/* Status message */}
          {status === 'correct' && (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle size={18} />
              <span>Correct! You earned {finalPoints} points!</span>
            </div>
          )}
          {status === 'incorrect' && (
            <div className="flex items-center space-x-2 text-red-400">
              <XCircle size={18} />
              <span>Incorrect flag. Try again!</span>
            </div>
          )}
        </form>
      </div>

      {/* Hints section */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-slate-300">
            <Lightbulb size={16} />
            <span className="font-medium">Hints</span>
          </div>
          <span className="text-sm text-slate-400">
            Points available: <span className="text-yellow-400 font-medium">{finalPoints}</span>
          </span>
        </div>

        <div className="space-y-2">
          {challenge.hints.map((hint, index) => (
            <HintItem
              key={index}
              hint={hint}
              index={index}
              isRevealed={hintsRevealed.includes(index)}
              isLocked={index > 0 && !hintsRevealed.includes(index - 1)}
              onReveal={() => revealHint(index)}
            />
          ))}
        </div>

        {/* Show solution button */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          {!showSolution ? (
            <button
              onClick={() => setShowSolution(true)}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              Show solution (forfeit all points)
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-medium">Solution:</p>
              <pre className="p-3 bg-slate-900 rounded text-sm text-slate-300 overflow-x-auto">
                {challenge.solution.query}
              </pre>
              <p className="text-sm text-slate-400 mt-2">{challenge.solution.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface HintItemProps {
  hint: Hint;
  index: number;
  isRevealed: boolean;
  isLocked: boolean;
  onReveal: () => void;
}

function HintItem({ hint, index, isRevealed, isLocked, onReveal }: HintItemProps) {
  if (isRevealed) {
    return (
      <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-400">Hint {index + 1}</span>
          <span className="text-xs text-red-400">-{hint.cost} pts</span>
        </div>
        <p className="text-sm text-slate-300">{hint.text}</p>
      </div>
    );
  }

  return (
    <button
      onClick={onReveal}
      disabled={isLocked}
      className={`w-full p-3 rounded-lg border text-left transition-colors ${
        isLocked
          ? 'bg-slate-800 border-slate-700 cursor-not-allowed opacity-50'
          : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {isLocked ? '🔒 ' : ''}Hint {index + 1}
        </span>
        <span className="text-xs text-yellow-400">-{hint.cost} pts</span>
      </div>
    </button>
  );
}

function checkFlag(input: string, flag: { value: string; format: string }): boolean {
  const cleanInput = input.trim();

  switch (flag.format) {
    case 'exact':
      return cleanInput === flag.value;
    case 'case-insensitive':
      return cleanInput.toLowerCase() === flag.value.toLowerCase();
    case 'regex':
      try {
        const regex = new RegExp(flag.value);
        return regex.test(cleanInput);
      } catch {
        return false;
      }
    default:
      return cleanInput === flag.value;
  }
}
