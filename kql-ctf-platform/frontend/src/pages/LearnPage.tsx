import { BookOpen, ExternalLink, Video, FileText, Code } from 'lucide-react';

const resources = [
  {
    category: 'Official Documentation',
    items: [
      {
        title: 'KQL Quick Reference',
        description: 'Official Microsoft KQL syntax reference',
        url: 'https://docs.microsoft.com/en-us/azure/data-explorer/kql-quick-reference',
        icon: FileText,
      },
      {
        title: 'Log Analytics Demo',
        description: 'Practice KQL with real Azure log data',
        url: 'https://aka.ms/lademo',
        icon: Code,
      },
      {
        title: 'Azure Data Explorer Docs',
        description: 'Comprehensive KQL documentation',
        url: 'https://docs.microsoft.com/en-us/azure/data-explorer/',
        icon: BookOpen,
      },
    ],
  },
  {
    category: 'Training & Tutorials',
    items: [
      {
        title: 'Microsoft Sentinel Ninja',
        description: 'Free comprehensive training program',
        url: 'https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/become-a-microsoft-sentinel-ninja-the-complete-level-400/ba-p/1246310',
        icon: Video,
      },
      {
        title: 'KQL for Security Operations',
        description: 'Security-focused KQL tutorials',
        url: 'https://docs.microsoft.com/en-us/azure/sentinel/hunting',
        icon: BookOpen,
      },
      {
        title: 'Pluralsight KQL Course',
        description: 'Video-based KQL training',
        url: 'https://www.pluralsight.com/courses/kusto-query-language-kql-from-scratch',
        icon: Video,
      },
    ],
  },
  {
    category: 'Community Resources',
    items: [
      {
        title: 'KQL Cheat Sheet',
        description: 'SQL to KQL translation guide',
        url: 'https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/sqlcheatsheet',
        icon: FileText,
      },
      {
        title: 'GitHub: Azure Sentinel',
        description: 'Community detection rules and queries',
        url: 'https://github.com/Azure/Azure-Sentinel',
        icon: Code,
      },
      {
        title: 'Must Learn KQL',
        description: 'Community KQL learning resources',
        url: 'https://github.com/rod-trent/MustLearnKQL',
        icon: BookOpen,
      },
    ],
  },
];

const kqlBasics = [
  {
    operator: 'where',
    description: 'Filter rows based on conditions',
    example: 'SigninLogs | where ResultType != 0',
  },
  {
    operator: 'project',
    description: 'Select specific columns',
    example: 'SigninLogs | project UserPrincipalName, IPAddress',
  },
  {
    operator: 'summarize',
    description: 'Aggregate data',
    example: 'SigninLogs | summarize count() by UserPrincipalName',
  },
  {
    operator: 'order by',
    description: 'Sort results',
    example: 'SigninLogs | order by TimeGenerated desc',
  },
  {
    operator: 'limit / take',
    description: 'Restrict number of rows',
    example: 'SigninLogs | limit 10',
  },
  {
    operator: 'distinct',
    description: 'Get unique values',
    example: 'SigninLogs | distinct UserPrincipalName',
  },
  {
    operator: 'join',
    description: 'Combine tables',
    example: 'Table1 | join kind=inner Table2 on CommonColumn',
  },
  {
    operator: 'extend',
    description: 'Add calculated columns',
    example: 'SigninLogs | extend Hour = hourofday(TimeGenerated)',
  },
];

export function LearnPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
          <BookOpen size={28} />
          <span>Learn KQL</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Resources to help you master Kusto Query Language
        </p>
      </div>

      {/* Quick reference */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">KQL Quick Reference</h2>
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                  Operator
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                  Example
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {kqlBasics.map((item) => (
                <tr key={item.operator} className="hover:bg-slate-700/50">
                  <td className="px-4 py-3">
                    <code className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded">
                      {item.operator}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{item.description}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-slate-400">{item.example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Resources by category */}
      {resources.map((category) => (
        <section key={category.category}>
          <h2 className="text-xl font-semibold text-white mb-4">{category.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.items.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <item.icon className="text-blue-400" size={24} />
                  <ExternalLink
                    size={16}
                    className="text-slate-500 group-hover:text-blue-400 transition-colors"
                  />
                </div>
                <h3 className="font-medium text-white mt-3">{item.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{item.description}</p>
              </a>
            ))}
          </div>
        </section>
      ))}

      {/* Tips */}
      <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Pro Tips</h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">1.</span>
            <span>
              Always start with a table name. KQL queries flow from left to right, top to bottom.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">2.</span>
            <span>
              Use <code className="px-1 bg-slate-700 rounded">has</code> instead of{' '}
              <code className="px-1 bg-slate-700 rounded">contains</code> when searching for whole
              words - it's faster because it can use indexes.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">3.</span>
            <span>
              Filter early! Put <code className="px-1 bg-slate-700 rounded">where</code> clauses as
              close to the table as possible to reduce data processed.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">4.</span>
            <span>
              Use <code className="px-1 bg-slate-700 rounded">let</code> statements to make complex
              queries more readable and reusable.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-400">5.</span>
            <span>
              The <code className="px-1 bg-slate-700 rounded">ago()</code> function is your friend
              for time-based filtering: <code className="px-1 bg-slate-700 rounded">ago(1h)</code>,{' '}
              <code className="px-1 bg-slate-700 rounded">ago(7d)</code>.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
