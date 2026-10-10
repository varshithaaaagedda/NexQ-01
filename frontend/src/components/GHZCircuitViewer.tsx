import React, { useState } from 'react';
import { Code, Eye } from 'lucide-react';

interface GHZCircuitViewerProps {
  circuitAscii?: string;
  custodiansActive?: boolean[];
}

export const GHZCircuitViewer: React.FC<GHZCircuitViewerProps> = ({
  circuitAscii,
  custodiansActive = [true, true, true]
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'ascii'>('visual');

  return (
    <div className="bg-nex-card border border-nex-border rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-nex-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">3-Qubit GHZ State Circuit</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              |GHZ⟩ = 1/√2 (|000⟩ + |111⟩)
            </span>
          </div>
          <p className="text-xs text-nex-textMuted mt-0.5">
            Initial State |000⟩ → H(q0) → CNOT(q0, q1) → CNOT(q0, q2) → Z-Basis Computational Measurement
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-nex-surface p-1 rounded border border-nex-border text-xs shrink-0">
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'visual' ? 'bg-sky-600 text-white font-medium' : 'text-nex-textMuted hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Diagram</span>
          </button>
          <button
            onClick={() => setViewMode('ascii')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'ascii' ? 'bg-sky-600 text-white font-medium' : 'text-nex-textMuted hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Qiskit Notation</span>
          </button>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <div className="overflow-x-auto py-4 px-3 bg-nex-surface/80 rounded border border-nex-border/80">
          <svg className="w-full min-w-[620px] h-[220px]" viewBox="0 0 640 200" fill="none">
            {/* Background alignment grid */}
            <defs>
              <pattern id="circuit-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-grid)" opacity="0.3" />

            {/* Qubit Rails & Labels */}
            {/* q0 */}
            <g transform="translate(0, 40)">
              <text x="25" y="4" fill="#E2E8F0" fontSize="13" fontFamily="IBM Plex Mono" fontWeight="600">q0</text>
              <text x="60" y="4" fill="#64748B" fontSize="11" fontFamily="IBM Plex Mono">(Cust-0)</text>
              <text x="125" y="4" fill="#94A3B8" fontSize="12" fontFamily="IBM Plex Mono">|0⟩</text>
              <line x1="150" y1="0" x2="600" y2="0" stroke="#334155" strokeWidth="2" />
            </g>

            {/* q1 */}
            <g transform="translate(0, 100)">
              <text x="25" y="4" fill="#E2E8F0" fontSize="13" fontFamily="IBM Plex Mono" fontWeight="600">q1</text>
              <text x="60" y="4" fill="#64748B" fontSize="11" fontFamily="IBM Plex Mono">(Cust-1)</text>
              <text x="125" y="4" fill="#94A3B8" fontSize="12" fontFamily="IBM Plex Mono">|0⟩</text>
              <line x1="150" y1="0" x2="600" y2="0" stroke="#334155" strokeWidth="2" />
            </g>

            {/* q2 */}
            <g transform="translate(0, 160)">
              <text x="25" y="4" fill="#E2E8F0" fontSize="13" fontFamily="IBM Plex Mono" fontWeight="600">q2</text>
              <text x="60" y="4" fill="#64748B" fontSize="11" fontFamily="IBM Plex Mono">(Cust-2)</text>
              <text x="125" y="4" fill="#94A3B8" fontSize="12" fontFamily="IBM Plex Mono">|0⟩</text>
              <line x1="150" y1="0" x2="600" y2="0" stroke="#334155" strokeWidth="2" />
            </g>

            {/* Gate 1: Hadamard on q0 */}
            <g transform="translate(200, 40)">
              <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="0" y="5" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="Inter">H</text>
            </g>

            {/* Gate 2: CNOT q0 -> q1 */}
            <g transform="translate(310, 0)">
              <line x1="0" y1="40" x2="0" y2="100" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="0" cy="40" r="5" fill="#38BDF8" />
              <circle cx="0" cy="100" r="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              <line x1="-8" y1="100" x2="8" y2="100" stroke="#38BDF8" strokeWidth="2" />
              <line x1="0" y1="92" x2="0" y2="108" stroke="#38BDF8" strokeWidth="2" />
            </g>

            {/* Gate 3: CNOT q0 -> q2 */}
            <g transform="translate(420, 0)">
              <line x1="0" y1="40" x2="0" y2="160" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="0" cy="40" r="5" fill="#38BDF8" />
              <circle cx="0" cy="160" r="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              <line x1="-8" y1="160" x2="8" y2="160" stroke="#38BDF8" strokeWidth="2" />
              <line x1="0" y1="152" x2="0" y2="168" stroke="#38BDF8" strokeWidth="2" />
            </g>

            {/* Barrier line */}
            <line x1="495" y1="20" x2="495" y2="180" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Measurements */}
            {/* q0 measurement */}
            <g transform="translate(550, 40)">
              <rect x="-16" y="-16" width="32" height="32" rx="4" fill={custodiansActive[0] ? "#1E293B" : "#0F172A"} stroke={custodiansActive[0] ? "#475569" : "#334155"} strokeWidth="1.5" />
              <path d="M-8 6 A 8 8 0 0 1 8 6" fill="none" stroke={custodiansActive[0] ? "#E2E8F0" : "#475569"} strokeWidth="1.5" />
              <line x1="0" y1="6" x2="6" y2="-4" stroke={custodiansActive[0] ? "#38BDF8" : "#475569"} strokeWidth="1.5" />
            </g>

            {/* q1 measurement */}
            <g transform="translate(550, 100)">
              <rect x="-16" y="-16" width="32" height="32" rx="4" fill={custodiansActive[1] ? "#1E293B" : "#0F172A"} stroke={custodiansActive[1] ? "#475569" : "#334155"} strokeWidth="1.5" />
              <path d="M-8 6 A 8 8 0 0 1 8 6" fill="none" stroke={custodiansActive[1] ? "#E2E8F0" : "#475569"} strokeWidth="1.5" />
              <line x1="0" y1="6" x2="6" y2="-4" stroke={custodiansActive[1] ? "#38BDF8" : "#475569"} strokeWidth="1.5" />
            </g>

            {/* q2 measurement */}
            <g transform="translate(550, 160)">
              <rect x="-16" y="-16" width="32" height="32" rx="4" fill={custodiansActive[2] ? "#1E293B" : "#0F172A"} stroke={custodiansActive[2] ? "#475569" : "#334155"} strokeWidth="1.5" />
              <path d="M-8 6 A 8 8 0 0 1 8 6" fill="none" stroke={custodiansActive[2] ? "#E2E8F0" : "#475569"} strokeWidth="1.5" />
              <line x1="0" y1="6" x2="6" y2="-4" stroke={custodiansActive[2] ? "#38BDF8" : "#475569"} strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      ) : (
        <div className="bg-nex-surface p-4 rounded border border-nex-border/80 font-mono text-xs text-sky-300 overflow-x-auto whitespace-pre">
          {circuitAscii || `
     ┌───┐          ┌─┐   
q_0: ┤ H ├──■────■──┤M├───
     └───┘┌─┴─┐  │  └┴┘┌─┐
q_1: ─────┤ X ├──┼───┼─┤M├
          └───┘┌─┴─┐ │ └┴┘
q_2: ──────────┤ X ├─┼───
               └───┘ └─┘  
          `}
        </div>
      )}
    </div>
  );
};
