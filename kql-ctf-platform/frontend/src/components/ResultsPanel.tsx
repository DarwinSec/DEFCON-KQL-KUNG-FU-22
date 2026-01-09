import type { QueryResult } from '../types/challenge';
import { AlertCircle, CheckCircle, Clock, Table } from 'lucide-react';

interface ResultsPanelProps {
  result: QueryResult | null;
  isLoading?: boolean;
}

export function ResultsPanel({ result, isLoading = false }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-slate-800 rounded-lg border border-slate-700">
        <div className="px-3 py-2 bg-slate-700 border-b border-slate-600">
          <span className="text-sm font-medium text-slate-300">Results</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-500 border-t-blue-500"></div>
            <span>Executing query...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col h-full bg-slate-800 rounded-lg border border-slate-700">
        <div className="px-3 py-2 bg-slate-700 border-b border-slate-600">
          <span className="text-sm font-medium text-slate-300">Results</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <Table size={48} className="mx-auto mb-2 opacity-50" />
            <p>Run a query to see results</p>
          </div>
        </div>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="flex flex-col h-full bg-slate-800 rounded-lg border border-slate-700">
        <div className="px-3 py-2 bg-slate-700 border-b border-slate-600 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Results</span>
          <span className="text-xs text-red-400 flex items-center space-x-1">
            <AlertCircle size={14} />
            <span>Error</span>
          </span>
        </div>
        <div className="flex-1 p-4">
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="font-medium text-red-400">Query Error</p>
                <p className="text-sm text-red-300 mt-1">{result.error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="px-3 py-2 bg-slate-700 border-b border-slate-600 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Results</span>
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <CheckCircle size={14} className="text-green-500" />
            <span>{result.rowCount} rows</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{result.executionTime.toFixed(2)}ms</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {result.rows.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>No results returned</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-700/50 sticky top-0">
              <tr>
                {result.columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-slate-600"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {result.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-700/30">
                  {result.columns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2 text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                    >
                      {formatValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
