import React, { useState } from 'react';
import { ExperimentResult } from '../types/quantum';
import { Search, ChevronRight } from 'lucide-react';

interface ExperimentLogsPageProps {
  history: ExperimentResult[];
}

export const ExperimentLogsPage: React.FC<ExperimentLogsPageProps> = ({ history }) => {
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<ExperimentResult | null>(history[0] || null);

  const filtered = history.filter((exp) => {
    const matchesMode = filterMode === 'all' || exp.mode === filterMode;
    const matchesSearch = exp.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.mode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Filter Header */}
      <div className="bg-nex-card border border-nex-border rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-nex-textDim absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Experiment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-nex-surface border border-nex-border rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-nex-textDim font-mono focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-center bg-nex-surface p-1 rounded border border-nex-border text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded transition-colors font-mono ${filterMode === 'all' ? 'bg-sky-600 text-white font-semibold' : 'text-nex-textMuted hover:text-white'}`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterMode('ideal')}
              className={`px-2.5 py-1 rounded transition-colors font-mono ${filterMode === 'ideal' ? 'bg-sky-600 text-white font-semibold' : 'text-nex-textMuted hover:text-white'}`}
            >
              Ideal
            </button>
            <button
              onClick={() => setFilterMode('noisy')}
              className={`px-2.5 py-1 rounded transition-colors font-mono ${filterMode === 'noisy' ? 'bg-amber-600 text-white font-semibold' : 'text-nex-textMuted hover:text-white'}`}
            >
              Noisy
            </button>
          </div>
        </div>

        <div className="text-xs text-nex-textMuted font-mono">
          Recorded Runs: <strong className="text-white">{history.length}</strong>
        </div>
      </div>

      {/* Main Table + Telemetry Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View */}
        <div className="lg:col-span-2 bg-nex-card border border-nex-border rounded-lg p-5">
          <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-4">
            Simulation Audit Log
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-nex-surface text-nex-textMuted font-mono text-[11px] border-b border-nex-border">
                <tr>
                  <th className="py-2.5 px-3">Experiment ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Shots</th>
                  <th className="py-2.5 px-3">Target Subspace</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nex-border/50 font-mono">
                {filtered.map((exp) => {
                  const isSelected = selectedLog?.id === exp.id;
                  return (
                    <tr
                      key={exp.id}
                      onClick={() => setSelectedLog(exp)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-500/15 text-white' : 'hover:bg-nex-surface/40 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-sky-300">{exp.id}</td>
                      <td className="py-2.5 px-3 text-nex-textMuted">
                        {new Date(exp.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          exp.mode === 'ideal' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {exp.mode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{exp.shots.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-semibold">{(exp.stats.fidelity * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-sky-400">
                        <ChevronRight className="w-4 h-4" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Telemetry Inspector */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-5">
          <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-4 pb-2 border-b border-nex-border">
            Run Telemetry Details
          </h4>

          {selectedLog ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-nex-textDim font-mono text-[10px] uppercase block">Experiment ID</span>
                <span className="text-sky-300 font-mono font-bold text-sm">{selectedLog.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-nex-surface p-2 rounded border border-nex-border">
                  <span className="text-nex-textDim block text-[9px]">Timestamp</span>
                  <span className="text-slate-200">{new Date(selectedLog.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="bg-nex-surface p-2 rounded border border-nex-border">
                  <span className="text-nex-textDim block text-[9px]">Execution Time</span>
                  <span className="text-slate-200">{selectedLog.execution_time_ms.toFixed(1)} ms</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-nex-border/60 font-mono">
                <div className="flex justify-between">
                  <span className="text-nex-textMuted">Simulation Mode:</span>
                  <span className="text-white capitalize">{selectedLog.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nex-textMuted">Noise Rate (ε):</span>
                  <span className="text-amber-400">{(selectedLog.noise_rate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nex-textMuted">Shots:</span>
                  <span className="text-sky-400">{selectedLog.shots.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nex-textMuted">Target Subspace:</span>
                  <span className="text-emerald-400 font-bold">{(selectedLog.stats.fidelity * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-nex-border/60">
                <span className="text-nex-textDim font-mono text-[10px] uppercase block mb-1">Execution Summary</span>
                <p className="text-nex-textMuted text-[11px] leading-relaxed bg-nex-surface p-2.5 rounded border border-nex-border font-sans">
                  {selectedLog.summary_notes}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-nex-textDim text-xs font-mono">
              Select a log entry to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
