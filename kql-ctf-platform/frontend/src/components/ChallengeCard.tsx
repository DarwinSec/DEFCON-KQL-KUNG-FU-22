import { Link } from 'react-router-dom';
import { CheckCircle, Lock, ChevronRight } from 'lucide-react';
import type { Challenge } from '../types/challenge';
import { BeltBadge } from './BeltBadge';

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export function ChallengeCard({ challenge, isCompleted = false, isLocked = false }: ChallengeCardProps) {
  const CardContent = () => (
    <div
      className={`relative p-4 rounded-lg border transition-all ${
        isLocked
          ? 'bg-slate-800/50 border-slate-700 cursor-not-allowed opacity-60'
          : isCompleted
          ? 'bg-green-900/20 border-green-700 hover:border-green-500'
          : 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-800/80'
      }`}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        {isLocked ? (
          <Lock size={20} className="text-slate-500" />
        ) : isCompleted ? (
          <CheckCircle size={20} className="text-green-500" />
        ) : null}
      </div>

      {/* Belt badge */}
      <div className="mb-2">
        <BeltBadge belt={challenge.belt} size="sm" />
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-lg mb-1 ${isLocked ? 'text-slate-500' : 'text-white'}`}>
        {challenge.title}
      </h3>

      {/* Category and points */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400 capitalize">{challenge.category.replace('-', ' ')}</span>
        <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
          {challenge.points} pts
        </span>
      </div>

      {/* Tables */}
      <div className="mt-3 flex flex-wrap gap-1">
        {challenge.tables.map((table) => (
          <span
            key={table}
            className="px-2 py-0.5 text-xs rounded bg-slate-700 text-slate-300"
          >
            {table}
          </span>
        ))}
      </div>

      {/* Arrow indicator */}
      {!isLocked && (
        <div className="absolute bottom-3 right-3">
          <ChevronRight size={20} className="text-slate-500" />
        </div>
      )}
    </div>
  );

  if (isLocked) {
    return <CardContent />;
  }

  return (
    <Link to={`/challenge/${challenge.id}`}>
      <CardContent />
    </Link>
  );
}
