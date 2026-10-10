import React from 'react';
import { Play, RefreshCw, AlertTriangle } from 'lucide-react';
import { TabType } from './Sidebar';

interface NavbarProps {
  activeTab: TabType;
  onRunQuickExperiment: () => void;
  isSimulating: boolean;
  backendOnline: boolean;
  qiskitVersion?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onRunQuickExperiment,
  isSimulating,
  backendOnline
}) => {
  const titleMap: Record<TabType, { title: string; desc: string }> = {
    overview: { 
      title: 'Overview', 
      desc: '3-qubit GHZ quantum state simulation telemetry and correlation breakdown.' 
    },
    experiments: { 
      title: 'Quantum Experiments', 
      desc: 'Configure GHZ circuit state preparation, shot limits, and depolarizing noise parameters.' 
    },
    custodians: { 
      title: 'Custodian Network', 
      desc: '3-party qubit distribution topology, measurement compliance, and correlation parity.' 
    },
    analysis: { 
      title: 'Results & Analysis', 
      desc: 'Observed computational measurement outcome histograms versus theoretical ideal expectations.' 
    },
    logs: { 
      title: 'Experiment Logs', 
      desc: 'Audit history of completed Qiskit Aer simulation runs and parameter telemetry.' 
    },
    methodology: { 
      title: 'Methodology', 
      desc: 'Mathematical foundations of 3-qubit GHZ state entanglement and security boundaries.' 
    }
  };

  const current = titleMap[activeTab];

  return (
    <header className="h-14 bg-nex-surface border-b border-nex-border px-6 flex items-center justify-between shrink-0 font-sans">
      <div className="flex items-baseline gap-3 min-w-0">
        <h2 className="text-sm font-semibold text-white tracking-tight shrink-0">
          {current.title}
        </h2>
        <span className="text-xs text-nex-textMuted truncate hidden sm:inline font-normal">
          — {current.desc}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {!backendOnline && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Backend Offline</span>
          </div>
        )}

        <button
          onClick={onRunQuickExperiment}
          disabled={isSimulating || !backendOnline}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium transition-all shadow-sm ${
            isSimulating || !backendOnline
              ? 'bg-nex-card text-nex-textDim border border-nex-border cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-500 text-white border border-sky-400/30 active:scale-[0.98]'
          }`}
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-200" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Experiment</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
