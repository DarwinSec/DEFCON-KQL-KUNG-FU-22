import type { BeltLevel } from '../types/challenge';
import { BELT_CONFIG } from '../types/challenge';

interface BeltBadgeProps {
  belt: BeltLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function BeltBadge({ belt, size = 'md', showLabel = true }: BeltBadgeProps) {
  const config = BELT_CONFIG[belt];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeClasses[size]}`}
    >
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
