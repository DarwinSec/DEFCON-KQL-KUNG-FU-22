export type BeltLevel = 'white' | 'yellow' | 'orange' | 'green' | 'blue' | 'brown' | 'black';

export type ChallengeCategory =
  | 'identity'
  | 'network'
  | 'activity-logs'
  | 'security-alerts'
  | 'resource-graph'
  | 'multi-table'
  | 'misc';

export interface Hint {
  cost: number;
  text: string;
}

export interface Flag {
  value: string;
  format: 'exact' | 'regex' | 'case-insensitive';
  location?: string;
}

export interface Solution {
  query: string;
  explanation: string;
}

export interface Challenge {
  id: string;
  title: string;
  belt: BeltLevel;
  points: number;
  category: ChallengeCategory;
  scenario: string;
  objective: string;
  tables: string[];
  flag: Flag;
  hints: Hint[];
  solution: Solution;
  learningObjectives: string[];
  mitreAttack?: string[];
  author?: string;
  version?: string;
}

export interface UserProgress {
  odid: string;
  odsolvedChallenges: string[];
  totalPoints: number;
  currentBelt: BeltLevel;
  hintsUsed: Record<string, number[]>; // challengeId -> hint indices used
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;
  error?: string;
}

export const BELT_CONFIG: Record<BeltLevel, { color: string; bgColor: string; label: string; emoji: string }> = {
  white: { color: 'text-gray-800', bgColor: 'bg-gray-100', label: 'White Belt', emoji: '⬜' },
  yellow: { color: 'text-yellow-800', bgColor: 'bg-yellow-400', label: 'Yellow Belt', emoji: '🟨' },
  orange: { color: 'text-orange-800', bgColor: 'bg-orange-500', label: 'Orange Belt', emoji: '🟧' },
  green: { color: 'text-green-800', bgColor: 'bg-green-500', label: 'Green Belt', emoji: '🟩' },
  blue: { color: 'text-blue-800', bgColor: 'bg-blue-500', label: 'Blue Belt', emoji: '🟦' },
  brown: { color: 'text-amber-100', bgColor: 'bg-amber-800', label: 'Brown Belt', emoji: '🟫' },
  black: { color: 'text-gray-100', bgColor: 'bg-gray-900', label: 'Black Belt', emoji: '⬛' },
};

export const BELT_ORDER: BeltLevel[] = ['white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black'];
