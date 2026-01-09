import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, BookOpen, Github } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dojo' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-3xl">🥋</span>
            <div>
              <h1 className="text-xl font-bold text-white">KQL Kung Fu</h1>
              <p className="text-xs text-slate-400">Master the query arts</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Github size={18} />
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-slate-400 text-sm">
          <p>KQL Kung Fu CTF - Learn Kusto Query Language through security challenges</p>
          <p className="mt-1">
            Based on the{' '}
            <a href="https://aka.ms/lademo" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
              Azure Log Analytics Demo
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
