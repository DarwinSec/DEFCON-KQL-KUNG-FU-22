import { challenges } from '../data/challenges';
import { ChallengeCard } from '../components/ChallengeCard';
import { BeltBadge } from '../components/BeltBadge';
import type { BeltLevel } from '../types/challenge';
import { BELT_ORDER, BELT_CONFIG } from '../types/challenge';
import { Trophy, Target, Flame } from 'lucide-react';

export function HomePage() {
  // Group challenges by belt
  const challengesByBelt = BELT_ORDER.reduce((acc, belt) => {
    acc[belt] = challenges.filter((c) => c.belt === belt);
    return acc;
  }, {} as Record<BeltLevel, typeof challenges>);

  // Mock user progress (in production, this would come from state/API)
  const solvedChallenges = new Set<string>();
  const userPoints = 0;
  const userBelt: BeltLevel = 'white';

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-xl p-8 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to the Dojo
            </h1>
            <p className="text-slate-400 max-w-xl">
              Master the art of Kusto Query Language through progressively challenging
              security scenarios. Hunt for flags hidden in Azure log data and earn your belts!
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/20 mb-2 mx-auto">
                <Trophy className="text-yellow-500" size={24} />
              </div>
              <div className="text-2xl font-bold text-white">{userPoints}</div>
              <div className="text-xs text-slate-400">Points</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-2 mx-auto">
                <Target className="text-green-500" size={24} />
              </div>
              <div className="text-2xl font-bold text-white">{solvedChallenges.size}/{challenges.length}</div>
              <div className="text-xs text-slate-400">Solved</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 mb-2 mx-auto">
                <Flame className="text-orange-500" size={24} />
              </div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Current belt */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400">Current Rank:</span>
            <BeltBadge belt={userBelt} size="lg" />
          </div>
        </div>
      </div>

      {/* Belt progression */}
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {BELT_ORDER.map((belt, index) => {
          const config = BELT_CONFIG[belt];
          const beltChallenges = challengesByBelt[belt] || [];
          const solvedInBelt = beltChallenges.filter((c) => solvedChallenges.has(c.id)).length;
          const isUnlocked = index === 0 || BELT_ORDER.slice(0, index).every((b) => {
            const prevChallenges = challengesByBelt[b] || [];
            const prevSolved = prevChallenges.filter((c) => solvedChallenges.has(c.id)).length;
            return prevSolved >= Math.ceil(prevChallenges.length * 0.8);
          });

          return (
            <div
              key={belt}
              className={`flex flex-col items-center px-4 ${!isUnlocked ? 'opacity-50' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${config.bgColor}`}
              >
                {config.emoji}
              </div>
              <span className="text-xs text-slate-400 mt-1">{config.label}</span>
              <span className="text-xs text-slate-500">
                {solvedInBelt}/{beltChallenges.length}
              </span>
            </div>
          );
        })}
      </div>

      {/* Challenges by belt */}
      {BELT_ORDER.map((belt) => {
        const beltChallenges = challengesByBelt[belt] || [];
        if (beltChallenges.length === 0) return null;

        const config = BELT_CONFIG[belt];

        return (
          <section key={belt}>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{config.emoji}</span>
              <h2 className="text-xl font-semibold text-white">{config.label}</h2>
              <span className="text-slate-500">
                ({beltChallenges.length} challenges)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beltChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={solvedChallenges.has(challenge.id)}
                  isLocked={false}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Coming soon placeholder for empty belts */}
      {BELT_ORDER.filter((belt) => (challengesByBelt[belt] || []).length === 0).length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BELT_ORDER.filter((belt) => (challengesByBelt[belt] || []).length === 0).map((belt) => {
              const config = BELT_CONFIG[belt];
              return (
                <div
                  key={belt}
                  className="p-6 rounded-lg border border-dashed border-slate-700 bg-slate-800/30 text-center"
                >
                  <span className="text-3xl">{config.emoji}</span>
                  <p className="text-slate-400 mt-2">{config.label} challenges</p>
                  <p className="text-xs text-slate-500">In development</p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
