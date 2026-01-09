import { Trophy, Medal, Award } from 'lucide-react';
import { BeltBadge } from '../components/BeltBadge';
import type { BeltLevel } from '../types/challenge';

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, username: 'query_ninja', points: 2450, belt: 'green' as BeltLevel, solved: 15 },
  { rank: 2, username: 'azure_hunter', points: 2100, belt: 'green' as BeltLevel, solved: 13 },
  { rank: 3, username: 'kql_master', points: 1850, belt: 'yellow' as BeltLevel, solved: 12 },
  { rank: 4, username: 'log_detective', points: 1500, belt: 'yellow' as BeltLevel, solved: 10 },
  { rank: 5, username: 'threat_hunter42', points: 1200, belt: 'yellow' as BeltLevel, solved: 8 },
  { rank: 6, username: 'soc_analyst', points: 950, belt: 'white' as BeltLevel, solved: 7 },
  { rank: 7, username: 'security_newbie', points: 750, belt: 'white' as BeltLevel, solved: 6 },
  { rank: 8, username: 'blue_team_bob', points: 500, belt: 'white' as BeltLevel, solved: 5 },
  { rank: 9, username: 'incident_responder', points: 350, belt: 'white' as BeltLevel, solved: 4 },
  { rank: 10, username: 'log_lover', points: 200, belt: 'white' as BeltLevel, solved: 3 },
];

export function LeaderboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Trophy className="text-yellow-500" size={28} />
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {/* 2nd place */}
        <div className="flex flex-col items-center pt-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
              {mockLeaderboard[1]?.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
              <Medal size={14} className="text-gray-900" />
            </div>
          </div>
          <p className="mt-2 font-medium text-white truncate max-w-full">
            {mockLeaderboard[1]?.username}
          </p>
          <p className="text-yellow-400 font-bold">{mockLeaderboard[1]?.points} pts</p>
          <div className="h-24 w-full bg-gray-500 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">2</span>
          </div>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl">
              {mockLeaderboard[0]?.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center">
              <Trophy size={16} className="text-yellow-900" />
            </div>
          </div>
          <p className="mt-2 font-medium text-white truncate max-w-full">
            {mockLeaderboard[0]?.username}
          </p>
          <p className="text-yellow-400 font-bold">{mockLeaderboard[0]?.points} pts</p>
          <div className="h-32 w-full bg-yellow-600 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">1</span>
          </div>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center pt-12">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-xl">
              {mockLeaderboard[2]?.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 flex items-center justify-center">
              <Award size={12} className="text-amber-300" />
            </div>
          </div>
          <p className="mt-2 font-medium text-white truncate max-w-full">
            {mockLeaderboard[2]?.username}
          </p>
          <p className="text-yellow-400 font-bold">{mockLeaderboard[2]?.points} pts</p>
          <div className="h-16 w-full bg-amber-700 rounded-t-lg mt-2 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">3</span>
          </div>
        </div>
      </div>

      {/* Full leaderboard table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Player
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                Belt
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase">
                Solved
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {mockLeaderboard.map((player) => (
              <tr
                key={player.rank}
                className={`hover:bg-slate-700/50 ${
                  player.rank <= 3 ? 'bg-slate-700/30' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {player.rank === 1 && <Trophy size={16} className="text-yellow-500" />}
                    {player.rank === 2 && <Medal size={16} className="text-gray-400" />}
                    {player.rank === 3 && <Award size={16} className="text-amber-600" />}
                    <span
                      className={`font-medium ${
                        player.rank <= 3 ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      #{player.rank}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-white">{player.username}</span>
                </td>
                <td className="px-4 py-3">
                  <BeltBadge belt={player.belt} size="sm" />
                </td>
                <td className="px-4 py-3 text-right text-slate-300">
                  {player.solved}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-bold text-yellow-400">{player.points}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info note */}
      <p className="text-center text-slate-500 text-sm">
        Leaderboard updates in real-time. Rankings are based on total points earned.
      </p>
    </div>
  );
}
