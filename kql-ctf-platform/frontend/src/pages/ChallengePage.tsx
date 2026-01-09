import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Database, Target } from 'lucide-react';
import { getChallengeById } from '../data/challenges';
import { QueryEditor } from '../components/QueryEditor';
import { ResultsPanel } from '../components/ResultsPanel';
import { FlagSubmission } from '../components/FlagSubmission';
import { BeltBadge } from '../components/BeltBadge';
import { executeQuery } from '../lib/mockQueryEngine';
import type { QueryResult } from '../types/challenge';

export function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const challenge = getChallengeById(id || '');

  const [query, setQuery] = useState('// Write your KQL query here\n');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Challenge Not Found</h1>
        <Link to="/" className="text-blue-400 hover:underline">
          Return to Dojo
        </Link>
      </div>
    );
  }

  const handleExecute = async () => {
    setIsExecuting(true);
    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 300));
    const queryResult = executeQuery(query);
    setResult(queryResult);
    setIsExecuting(false);
  };

  const handleReset = () => {
    setQuery('// Write your KQL query here\n' + challenge.tables[0] + '\n| ');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
              <BeltBadge belt={challenge.belt} size="sm" />
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
              <span className="capitalize">{challenge.category.replace('-', ' ')}</span>
              <span>|</span>
              <span className="text-yellow-400 font-medium">{challenge.points} pts</span>
            </div>
          </div>
        </div>

        {isSolved && (
          <div className="px-4 py-2 bg-green-900/30 border border-green-700 rounded-lg text-green-400 font-medium">
            Solved!
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Scenario & Flag submission */}
        <div className="lg:col-span-1 space-y-4">
          {/* Scenario */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center space-x-2 text-slate-300 mb-3">
              <BookOpen size={18} />
              <span className="font-medium">Scenario</span>
            </div>
            <div className="text-slate-300 text-sm whitespace-pre-line">
              {challenge.scenario}
            </div>
          </div>

          {/* Objective */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center space-x-2 text-slate-300 mb-3">
              <Target size={18} />
              <span className="font-medium">Objective</span>
            </div>
            <p className="text-slate-300 text-sm">{challenge.objective}</p>
          </div>

          {/* Available tables */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center space-x-2 text-slate-300 mb-3">
              <Database size={18} />
              <span className="font-medium">Available Tables</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {challenge.tables.map((table) => (
                <button
                  key={table}
                  onClick={() => setQuery((q) => q + (q.endsWith('\n') ? '' : '\n') + table)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300 transition-colors"
                >
                  {table}
                </button>
              ))}
            </div>
          </div>

          {/* Flag submission */}
          <FlagSubmission
            challenge={challenge}
            onCorrect={() => setIsSolved(true)}
          />

          {/* Learning objectives */}
          {challenge.learningObjectives.length > 0 && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <div className="text-sm font-medium text-slate-300 mb-2">
                Learning Objectives
              </div>
              <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                {challenge.learningObjectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* MITRE ATT&CK */}
          {challenge.mitreAttack && challenge.mitreAttack.length > 0 && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <div className="text-sm font-medium text-slate-300 mb-2">
                MITRE ATT&CK
              </div>
              <div className="flex flex-wrap gap-2">
                {challenge.mitreAttack.map((technique) => (
                  <a
                    key={technique}
                    href={`https://attack.mitre.org/techniques/${technique.replace('.', '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-red-900/30 border border-red-800 rounded text-xs text-red-400 hover:bg-red-900/50 transition-colors"
                  >
                    {technique}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Query editor & Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Query Editor */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden h-80">
            <QueryEditor
              value={query}
              onChange={setQuery}
              onExecute={handleExecute}
              onReset={handleReset}
              isExecuting={isExecuting}
            />
          </div>

          {/* Results */}
          <div className="h-80">
            <ResultsPanel result={result} isLoading={isExecuting} />
          </div>
        </div>
      </div>
    </div>
  );
}
