import React from 'react';
import { ExperimentResult } from '../types/quantum';
import { MeasurementHistogram } from '../components/MeasurementHistogram';
import { BarChart3, Shield, Activity, Layers, AlertTriangle } from 'lucide-react';

interface ResultsAnalysisPageProps {
  latestResult: ExperimentResult | null;
}

export const ResultsAnalysisPage: React.FC<ResultsAnalysisPageProps> = ({ latestResult }) => {
  if (!latestResult) {
    return (
      <div className="bg-nex-card border border-nex-border rounded-lg p-12 text-center text-nex-textMuted">
        <BarChart3 className="w-10 h-10 text-nex-textDim mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-slate-300 font-mono">No Experiment Data Available</h4>
        <p className="text-xs text-nex-textDim mt-1">Execute a simulation run first to inspect quantum correlation telemetry.</p>
      </div>
    );
  }

  const { stats, histogram, mode, shots, noise_rate, execution_time_ms, summary_notes } = latestResult;

  return (
    <div className="space-y-6 pb-12">
      {/* Histogram View */}
      <MeasurementHistogram histogram={histogram} shots={shots} mode={mode} />

      {/* Correlation Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Target Subspace Ratio */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-nex-textMuted font-mono">
            <span>Target Subspace Ratio</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {(stats.fidelity * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-nex-textDim mt-1 font-mono">
            P(|000⟩) + P(|111⟩)
          </p>
        </div>

        {/* Metric 2: 3-Party Parity Expectation <Z0 Z1 Z2> */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-nex-textMuted font-mono">
            <span>Parity &lt;Z0 Z1 Z2&gt;</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {stats.parity_correlation.toFixed(3)}
          </div>
          <p className="text-[11px] text-nex-textDim mt-1 font-mono">
            Theoretical Target: 0.000
          </p>
        </div>

        {/* Metric 3: Shannon Entropy */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-nex-textMuted font-mono">
            <span>Outcome Entropy (H)</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {stats.entropy.toFixed(3)} <span className="text-xs font-normal text-nex-textMuted">bits</span>
          </div>
          <p className="text-[11px] text-nex-textDim mt-1 font-mono">
            Ideal Reference: 1.000 bit
          </p>
        </div>

        {/* Metric 4: Target-Subspace Deviation Rate */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-nex-textMuted font-mono">
            <span>Subspace Deviation</span>
            <AlertTriangle className={`w-4 h-4 ${stats.noise_level_detected > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {(stats.noise_level_detected * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-nex-textDim mt-1 font-mono">
            1 - Target Subspace Ratio
          </p>
        </div>
      </div>

      {/* Analytical Breakdown & Table */}
      <div className="bg-nex-card border border-nex-border rounded-lg p-5 space-y-4">
        <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
          Statistical Evaluation & Outcome Distribution Table
        </h4>

        <div className="p-4 rounded bg-nex-surface border border-nex-border text-xs text-slate-300 leading-relaxed font-sans space-y-2">
          <p>{summary_notes}</p>
          <div className="pt-2 border-t border-nex-border/60 flex items-center justify-between text-[11px] font-mono text-nex-textDim">
            <span>Execution Duration: {execution_time_ms.toFixed(1)} ms</span>
            <span>Local Qiskit Aer Engine</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-nex-surface text-nex-textMuted text-[11px] border-b border-nex-border">
              <tr>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Observed Count</th>
                <th className="py-2.5 px-3">Observed Frequency</th>
                <th className="py-2.5 px-3">Theoretical Target</th>
                <th className="py-2.5 px-3">Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nex-border/50 text-slate-300">
              {histogram.map((item) => {
                const delta = item.frequency - item.ideal_frequency;

                return (
                  <tr key={item.state} className="hover:bg-nex-surface/40">
                    <td className="py-2.5 px-3 font-semibold text-sky-300">|{item.state}⟩</td>
                    <td className="py-2.5 px-3 text-slate-200">{item.count}</td>
                    <td className="py-2.5 px-3 text-slate-200">{(item.frequency * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-3 text-nex-textMuted">{(item.ideal_frequency * 100).toFixed(1)}%</td>
                    <td className={`py-2.5 px-3 ${Math.abs(delta) < 0.02 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {delta >= 0 ? `+${(delta * 100).toFixed(2)}%` : `${(delta * 100).toFixed(2)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
