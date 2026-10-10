import React from 'react';
import { ExperimentResult, HealthResponse } from '../types/quantum';
import { GHZCircuitViewer } from '../components/GHZCircuitViewer';
import { MeasurementHistogram } from '../components/MeasurementHistogram';
import { ArrowUpRight } from 'lucide-react';

interface OverviewPageProps {
  latestResult: ExperimentResult | null;
  history: ExperimentResult[];
  backendOnline: boolean;
  health: HealthResponse | null;
  onRunExperiment: () => void;
  onNavigateTab: (tab: any) => void;
  isSimulating: boolean;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  latestResult,
  history,
  backendOnline,
  health,
  onNavigateTab
}) => {
  const shots = latestResult ? latestResult.shots : 1024;
  const correlationRatio = latestResult ? latestResult.stats.fidelity : 1.0;
  const mode = latestResult ? latestResult.mode : 'ideal';
  const execTime = latestResult ? latestResult.execution_time_ms : 0;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 3 Compact Metrics Bar - Clean, restrained, aligned */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-nex-surface p-4 rounded-lg border border-nex-border">
        {/* Metric 1: System Status */}
        <div className="flex flex-col justify-between pr-4 border-r border-nex-border/60 last:border-r-0">
          <div className="flex items-center justify-between text-xs text-nex-textMuted">
            <span>System Status</span>
            <div className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-white tracking-tight">
              {backendOnline ? 'Operational' : 'Offline'}
            </span>
            <span className="text-[11px] text-nex-textDim font-mono">
              Qiskit Aer {health?.aer_version ? `v${health.aer_version}` : ''}
            </span>
          </div>
        </div>

        {/* Metric 2: Shots */}
        <div className="flex flex-col justify-between px-2 sm:px-4 border-r border-nex-border/60 last:border-r-0">
          <div className="flex items-center justify-between text-xs text-nex-textMuted">
            <span>Executed Shots</span>
            <span className="text-[10px] font-mono text-nex-textDim">{execTime.toFixed(1)} ms</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-white font-mono">
              {shots.toLocaleString()}
            </span>
            <span className="text-xs text-sky-400 font-mono">shots</span>
          </div>
        </div>

        {/* Metric 3: Measurement Correlation */}
        <div className="flex flex-col justify-between pl-2 sm:pl-4">
          <div className="flex items-center justify-between text-xs text-nex-textMuted">
            <span>Measurement Correlation</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              mode === 'ideal' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {mode}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-white font-mono">
              {(correlationRatio * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-nex-textDim font-mono">P(|000⟩ + |111⟩)</span>
          </div>
        </div>
      </div>

      {/* Main Visual Content: Two-Column Aligned Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <GHZCircuitViewer circuitAscii={latestResult?.circuit_ascii} />
        <MeasurementHistogram histogram={latestResult?.histogram} shots={shots} mode={mode} />
      </div>

      {/* Recent Experiment History Audit Table */}
      <div className="bg-nex-card border border-nex-border rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-nex-border">
          <div>
            <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">Experiment Audit History</h3>
            <p className="text-xs text-nex-textMuted mt-0.5 font-sans">Recent Qiskit Aer simulation execution records</p>
          </div>
          <button
            onClick={() => onNavigateTab('logs')}
            className="text-xs text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-nex-surface text-nex-textMuted text-[11px] border-b border-nex-border">
              <tr>
                <th className="py-2.5 px-3 font-medium">Experiment ID</th>
                <th className="py-2.5 px-3 font-medium">Timestamp</th>
                <th className="py-2.5 px-3 font-medium">Mode</th>
                <th className="py-2.5 px-3 font-medium">Shots</th>
                <th className="py-2.5 px-3 font-medium">Correlation Ratio</th>
                <th className="py-2.5 px-3 font-medium">Execution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nex-border/40 text-slate-300">
              {history.slice(0, 5).map((exp) => (
                <tr key={exp.id} className="hover:bg-nex-surface/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-sky-300">{exp.id}</td>
                  <td className="py-2.5 px-3 text-nex-textMuted">{new Date(exp.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      exp.mode === 'ideal' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {exp.mode}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{exp.shots.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-400">{(exp.stats.fidelity * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-nex-textDim">{exp.execution_time_ms.toFixed(1)} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
