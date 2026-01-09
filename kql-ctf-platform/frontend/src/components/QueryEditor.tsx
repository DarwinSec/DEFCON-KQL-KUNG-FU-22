import Editor from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  onReset: () => void;
  isExecuting?: boolean;
}

export function QueryEditor({
  value,
  onChange,
  onExecute,
  onReset,
  isExecuting = false,
}: QueryEditorProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-700 border-b border-slate-600">
        <span className="text-sm font-medium text-slate-300">KQL Query</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="p-2 rounded hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
            title="Reset query"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded font-medium transition-colors ${
              isExecuting
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            <Play size={16} />
            <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 10 },
            suggest: {
              showKeywords: true,
            },
          }}
          onMount={(editor, monaco) => {
            // Add KQL-like keywords for highlighting
            monaco.languages.register({ id: 'kql' });
            monaco.languages.setMonarchTokensProvider('kql', {
              keywords: [
                'where', 'project', 'extend', 'summarize', 'count', 'limit', 'take',
                'order', 'sort', 'by', 'asc', 'desc', 'join', 'union', 'let', 'as',
                'distinct', 'top', 'render', 'parse', 'extract', 'mv-expand',
                'contains', 'has', 'startswith', 'endswith', 'in', 'between', 'and', 'or', 'not',
                'ago', 'now', 'datetime', 'timespan', 'true', 'false', 'null',
              ],
              operators: ['==', '!=', '<', '>', '<=', '>=', '=~', '!~', '|'],
              tokenizer: {
                root: [
                  [/\/\/.*$/, 'comment'],
                  [/"[^"]*"/, 'string'],
                  [/'[^']*'/, 'string'],
                  [/\b\d+\b/, 'number'],
                  [/\|/, 'delimiter'],
                  [
                    /[a-zA-Z_]\w*/,
                    {
                      cases: {
                        '@keywords': 'keyword',
                        '@default': 'identifier',
                      },
                    },
                  ],
                ],
              },
            });

            // Set editor to use KQL language
            const model = editor.getModel();
            if (model) {
              monaco.editor.setModelLanguage(model, 'kql');
            }

            // Add keyboard shortcut for running query
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
              onExecute();
            });
          }}
        />
      </div>

      {/* Keyboard shortcut hint */}
      <div className="px-3 py-1.5 bg-slate-700 border-t border-slate-600 text-xs text-slate-400">
        Press <kbd className="px-1 py-0.5 bg-slate-600 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-slate-600 rounded">Enter</kbd> to run query
      </div>
    </div>
  );
}
