import React from 'react';
import { 
  Activity, 
  Cpu, 
  Network, 
  BarChart3, 
  History, 
  BookOpen 
} from 'lucide-react';

export type TabType = 'overview' | 'experiments' | 'custodians' | 'analysis' | 'logs' | 'methodology';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  backendOnline: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, backendOnline }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'experiments', label: 'Quantum Experiments', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'custodians', label: 'Custodian Network', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'analysis', label: 'Results & Analysis', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'logs', label: 'Experiment Logs', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'methodology', label: 'Methodology', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside className="w-56 bg-nex-surface border-r border-nex-border flex flex-col h-screen shrink-0 select-none font-sans">
      {/* Brand Header - Minimal geometric icon + NexQ-01 only */}
      <div className="h-14 px-4 flex items-center border-b border-nex-border">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            NexQ-01
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-colors ${
                isActive
                  ? 'bg-nex-card text-white font-medium border-l-2 border-sky-400 pl-2.5'
                  : 'text-nex-textMuted hover:text-slate-100 hover:bg-nex-card/40 border-l-2 border-transparent pl-2.5 font-normal'
              }`}
            >
              <span className={isActive ? 'text-sky-400' : 'text-nex-textDim'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Minimal Footer */}
      <div className="p-3 border-t border-nex-border bg-nex-bg/40 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-nex-textDim">Qiskit Aer</span>
          <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-1.5 py-0.5 rounded border ${
            backendOnline 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {backendOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-nex-textDim">
          <span>Q-Hack India 2026</span>
          <span className="font-mono text-sky-400">Q-SEC</span>
        </div>
      </div>
    </aside>
  );
};
