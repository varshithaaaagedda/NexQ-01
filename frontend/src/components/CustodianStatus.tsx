import React from 'react';
import { CustodianSummary } from '../types/quantum';
import { CheckCircle2, AlertCircle, Slash, Info } from 'lucide-react';

interface CustodianStatusProps {
  custodians?: CustodianSummary[];
  onToggleCustodian?: (index: number) => void;
  interactive?: boolean;
}

export const CustodianStatus: React.FC<CustodianStatusProps> = ({
  custodians = [],
  onToggleCustodian,
  interactive = false
}) => {
  const defaults: CustodianSummary[] = [
    { id: 'c0', name: 'Custodian 0 (Alpha - q0)', qubit_index: 0, active: true, status: 'ONLINE_SYNCHRONIZED', measured_zeros: 512, measured_ones: 512, zero_ratio: 0.5 },
    { id: 'c1', name: 'Custodian 1 (Beta - q1)', qubit_index: 1, active: true, status: 'ONLINE_SYNCHRONIZED', measured_zeros: 512, measured_ones: 512, zero_ratio: 0.5 },
    { id: 'c2', name: 'Custodian 2 (Gamma - q2)', qubit_index: 2, active: true, status: 'ONLINE_SYNCHRONIZED', measured_zeros: 512, measured_ones: 512, zero_ratio: 0.5 }
  ];

  const list = custodians.length === 3 ? custodians : defaults;

  const locations = [
    'Geneva Node (Simulated)',
    'Zurich Node (Simulated)',
    'Tokyo Node (Simulated)'
  ];

  return (
    <div className="bg-nex-card border border-nex-border rounded-lg p-5">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-nex-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">3-Party Custodian Network</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              SIMULATED PARTICIPANTS
            </span>
          </div>
          <p className="text-xs text-nex-textMuted mt-0.5">
            Logical custodian measurement registers mapped to qubits q0, q1, and q2 in Qiskit Aer
          </p>
        </div>
      </div>

      {/* 3 Node Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((cust, idx) => {
          return (
            <div
              key={cust.id}
              className={`p-4 rounded-lg border transition-all ${
                cust.active 
                  ? 'bg-nex-surface border-nex-border shadow-sm' 
                  : 'bg-nex-surface/40 border-nex-border/50 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-nex-border/60">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold ${
                    cust.active ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    q{cust.qubit_index}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-tight">{cust.name}</h4>
                    <span className="text-[10px] font-mono text-nex-textDim block">{locations[idx]}</span>
                  </div>
                </div>

                {interactive && onToggleCustodian && (
                  <button
                    onClick={() => onToggleCustodian(idx)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                      cust.active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400'
                    }`}
                  >
                    {cust.active ? 'Enabled' : 'Disabled'}
                  </button>
                )}
              </div>

              {/* Node Body */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-nex-textMuted">
                  <span>Status:</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
                    cust.status === 'ONLINE_SYNCHRONIZED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : cust.status === 'DEGRADED_NOISE'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {cust.status === 'ONLINE_SYNCHRONIZED' && <CheckCircle2 className="w-3 h-3" />}
                    {cust.status === 'DEGRADED_NOISE' && <AlertCircle className="w-3 h-3" />}
                    {cust.status === 'INACTIVE' && <Slash className="w-3 h-3" />}
                    {cust.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-nex-textMuted">
                  <span>Basis:</span>
                  <span className="font-mono text-sky-300">Computational [Z]</span>
                </div>

                <div className="pt-2 border-t border-nex-border/40 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-nex-card p-2 rounded border border-nex-border/60">
                    <span className="text-nex-textDim block text-[9px] uppercase">Measured |0⟩</span>
                    <span className="text-slate-200 font-semibold text-sm">{cust.measured_zeros}</span>
                  </div>
                  <div className="bg-nex-card p-2 rounded border border-nex-border/60">
                    <span className="text-nex-textDim block text-[9px] uppercase">Measured |1⟩</span>
                    <span className="text-slate-200 font-semibold text-sm">{cust.measured_ones}</span>
                  </div>
                </div>

                <div className="text-[10px] text-nex-textDim flex justify-between font-mono pt-1">
                  <span>Zero Ratio:</span>
                  <span className="text-sky-400 font-semibold">{(cust.zero_ratio * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Infrastructure Disclaimer */}
      <div className="mt-4 p-2.5 rounded bg-nex-surface border border-nex-border text-[11px] text-nex-textDim flex items-center gap-2 font-sans">
        <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>Nodes represent simulated participants in local Qiskit Aer memory, not remote physical server hardware.</span>
      </div>
    </div>
  );
};
