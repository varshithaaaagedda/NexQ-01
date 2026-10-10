import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Overview Card */}
      <div className="bg-nex-card border border-nex-border rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Scientific Foundations & Quantum Circuit Methodology
          </h3>
        </div>
        <p className="text-xs text-nex-textMuted leading-relaxed font-sans">
          NexQ-01 is a quantum-security research prototype built for Q-Hack India 2026. It models 3-qubit Greenberger-Horne-Zeilinger (GHZ) state entanglement and quantum correlation verification on a local Qiskit Aer quantum simulator.
        </p>
      </div>

      {/* Grid: Mathematical Derivation & Gate Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: GHZ Preparation */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-5 space-y-3">
          <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider text-sky-300">
            1. GHZ State Circuit Synthesis
          </h4>
          <div className="bg-nex-surface p-3 rounded border border-nex-border text-xs font-mono space-y-2 text-slate-300">
            <div><strong>Step 1 (Initialization):</strong> |Ψ₀⟩ = |000⟩</div>
            <div><strong>Step 2 (Hadamard on q0):</strong> |Ψ₁⟩ = 1/√2 (|0⟩ + |1⟩) ⊗ |00⟩</div>
            <div><strong>Step 3 (CNOT q0→q1):</strong> |Ψ₂⟩ = 1/√2 (|000⟩ + |110⟩)</div>
            <div><strong>Step 4 (CNOT q0→q2):</strong> |Ψ₃⟩ = 1/√2 (|000⟩ + |111⟩)</div>
          </div>
          <p className="text-xs text-nex-textMuted leading-relaxed font-sans">
            The Hadamard gate transforms qubit 0 into an equal superposition. Subsequent CNOT operations entangle qubits 1 and 2, producing a maximally entangled 3-qubit state.
          </p>
        </div>

        {/* Card 2: Correlation Evaluation */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-5 space-y-3">
          <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider text-sky-300">
            2. Quantum Correlation Metrics
          </h4>
          <div className="bg-nex-surface p-3 rounded border border-nex-border text-xs font-mono space-y-2 text-slate-300">
            <div><strong>Target Subspace Ratio:</strong> P(000) + P(111)</div>
            <div><strong>3-Party Parity:</strong> ⟨Z₀ Z₁ Z₂⟩ = ∑ (-1)^(q0+q1+q2) P(q0q1q2)</div>
            <div><strong>Pairwise Agreement:</strong> P(q_i = q_j) = 1.0 (Ideal)</div>
          </div>
          <p className="text-xs text-nex-textMuted leading-relaxed font-sans">
            Z-basis computational measurements evaluate the spatial agreement between the 3 custodians. Any single custodian measures a random 0 or 1 with 50% probability, but all three match with 100% consensus in ideal conditions.
          </p>
        </div>
      </div>

      {/* Demonstrations vs Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Simulator Demonstrates */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider">
              What the Simulator Demonstrates
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside font-sans">
            <li>Execution of a 3-qubit GHZ quantum circuit on local Qiskit Aer.</li>
            <li>Quantum state superposition and entangling gate operation.</li>
            <li>Statistical correlation of 3-party computational basis measurements.</li>
            <li>Modelling of depolarizing decoherence and readout error channels.</li>
            <li>Telemetry computation from local Qiskit Aer simulation outcome counts.</li>
          </ul>
        </div>

        {/* What Prototype Does Not Prove */}
        <div className="bg-nex-card border border-nex-border rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider">
              What the Prototype Does NOT Prove
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside font-sans">
            <li>Physical quantum hardware advantage over classical systems.</li>
            <li>Physical fiber-optic quantum key distribution (QKD) hardware.</li>
            <li>Distributed network server synchronization across physical continents.</li>
            <li>Full non-locality verification (requires Bell inequality basis switches).</li>
          </ul>
        </div>
      </div>

      {/* Critical Scientific Disclaimers Banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <ShieldAlert className="w-5 h-5" />
          <h4 className="text-xs font-semibold font-mono uppercase tracking-wider">
            Mandatory Scientific Accuracy Disclaimers
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-sans">
          <div className="p-3 rounded bg-nex-surface border border-nex-border">
            <strong className="text-amber-300 block mb-1 font-mono">Secret Sharing Boundaries:</strong>
            A basic GHZ state does not automatically implement a secure threshold secret sharing scheme without classical authentication and basis rotation protocols.
          </div>
          <div className="p-3 rounded bg-nex-surface border border-nex-border">
            <strong className="text-amber-300 block mb-1 font-mono">Eavesdropping Information:</strong>
            Measuring one qubit in an unauthenticated network does not strictly guarantee zero information leak under arbitrary attack vectors.
          </div>
          <div className="p-3 rounded bg-nex-surface border border-nex-border">
            <strong className="text-amber-300 block mb-1 font-mono">Interception Alerts:</strong>
            Simulated noise represents physical gate decoherence, NOT a guaranteed real-time cyberattack detection system.
          </div>
          <div className="p-3 rounded bg-nex-surface border border-nex-border">
            <strong className="text-amber-300 block mb-1 font-mono">Classical Cryptography:</strong>
            Shamir's Secret Sharing is based on polynomial interpolation and is NOT broken by Shor's algorithm (which targets RSA/ECC factoring & discrete log).
          </div>
        </div>
      </div>
    </div>
  );
};
