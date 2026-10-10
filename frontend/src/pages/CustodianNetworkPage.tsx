import React from 'react';
import { ExperimentResult, ExperimentRequest } from '../types/quantum';
import { CustodianStatus } from '../components/CustodianStatus';
import { Network, Info } from 'lucide-react';

interface CustodianNetworkPageProps {
  latestResult: ExperimentResult | null;
  request: ExperimentRequest;
  setRequest: React.Dispatch<React.SetStateAction<ExperimentRequest>>;
}

export const CustodianNetworkPage: React.FC<CustodianNetworkPageProps> = ({
  latestResult,
  request,
  setRequest
}) => {
  const handleToggle = (index: number) => {
    setRequest(prev => {
      const active = [...prev.custodians_active];
      active[index] = !active[index];
      return { ...prev, custodians_active: active };
    });
  };

  const agreement = latestResult?.stats.pair_agreement || {
    q0_q1: 1.0,
    q1_q2: 1.0,
    q0_q2: 1.0
  };

  const consensusRate = latestResult?.stats.consensus_rate ?? 1.0;

  return (
    <div className="space-y-6 pb-12">
      {/* Topology Header */}
      <div className="bg-nex-card border border-nex-border rounded-lg p-5">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-nex-border">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Network className="w-4 h-4 text-sky-400" />
              <span>Simulated 3-Party Custodian Architecture</span>
            </h3>
            <p className="text-xs text-nex-textMuted mt-0.5">
              Logical qubit distribution model across 3 simulated participant nodes (q0, q1, q2)
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Consensus: {(consensusRate * 100).toFixed(1)}%
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          In this 3-party research architecture, each custodian node holds a single qubit of the entangled GHZ state 
          <strong className="text-sky-300 font-mono"> 1/√2 (|000⟩ + |111⟩)</strong>. Measuring any individual qubit yields a random 0 or 1 with 50% probability, 
          yet when all three custodians compare their computational basis measurements under ideal conditions, their outcomes match perfectly with 100% consensus.
        </p>
      </div>

      {/* Custodian Node Cards Grid */}
      <CustodianStatus
        custodians={latestResult?.custodians}
        onToggleCustodian={handleToggle}
        interactive={true}
      />

      {/* Inter-Custodian Agreement Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-nex-card border border-nex-border rounded-lg p-5">
          <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-4">
            Pairwise Custodian Agreement
          </h4>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5">
                <span>Custodian 0 (q0) ↔ Custodian 1 (q1)</span>
                <span className="text-sky-400 font-bold">{(agreement.q0_q1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-nex-surface rounded-full h-2 overflow-hidden border border-nex-border">
                <div 
                  className="bg-sky-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${agreement.q0_q1 * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1.5">
                <span>Custodian 1 (q1) ↔ Custodian 2 (q2)</span>
                <span className="text-sky-400 font-bold">{(agreement.q1_q2 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-nex-surface rounded-full h-2 overflow-hidden border border-nex-border">
                <div 
                  className="bg-sky-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${agreement.q1_q2 * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1.5">
                <span>Custodian 0 (q0) ↔ Custodian 2 (q2)</span>
                <span className="text-sky-400 font-bold">{(agreement.q0_q2 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-nex-surface rounded-full h-2 overflow-hidden border border-nex-border">
                <div 
                  className="bg-sky-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${agreement.q0_q2 * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Verification Telemetry */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-4">
              Tri-Party Consensus Telemetry
            </h4>

            <div className="bg-nex-surface p-4 rounded border border-nex-border space-y-2.5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-nex-textMuted">Overall Consensus Rate:</span>
                <span className="font-mono text-emerald-400 font-bold">{(consensusRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nex-textMuted">Z-Parity Expectation &lt;Z0 Z1 Z2&gt;:</span>
                <span className="font-mono text-sky-400 font-bold">{latestResult?.stats.parity_correlation.toFixed(3) ?? "1.000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nex-textMuted">Simulated Error Rate:</span>
                <span className="font-mono text-amber-400 font-bold">{((latestResult?.stats.noise_level_detected ?? 0) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded bg-nex-surface border border-nex-border text-[11px] text-sky-300 flex items-center gap-2 font-sans">
            <Info className="w-4 h-4 shrink-0 text-sky-400" />
            <span>Simulated nodes execute on local Qiskit Aer backend. They model quantum state correlation without physical network hardware.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
