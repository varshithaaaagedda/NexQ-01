import React, { useState } from 'react';
import { ExperimentRequest, SimulationMode } from '../types/quantum';
import { Play, Sliders, Shield, Zap, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface ExperimentControlPanelProps {
  request: ExperimentRequest;
  setRequest: React.Dispatch<React.SetStateAction<ExperimentRequest>>;
  onRun: () => void;
  isSimulating: boolean;
  backendOnline: boolean;
  error?: string | null;
}

export const ExperimentControlPanel: React.FC<ExperimentControlPanelProps> = ({
  request,
  setRequest,
  onRun,
  isSimulating,
  backendOnline,
  error
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleShotsChange = (val: number) => {
    setRequest(prev => ({ ...prev, shots: val }));
  };

  const handleModeChange = (mode: SimulationMode) => {
    setRequest(prev => ({ ...prev, mode }));
  };

  const handleNoiseChange = (rate: number) => {
    setRequest(prev => ({ ...prev, noise_rate: rate }));
  };

  const handleToggleCustodian = (index: number) => {
    setRequest(prev => {
      const active = [...prev.custodians_active];
      active[index] = !active[index];
      return { ...prev, custodians_active: active };
    });
  };

  return (
    <div className="bg-nex-card border border-nex-border rounded-lg p-5 font-sans">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-nex-border">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Simulation Parameters</span>
          </h3>
          <p className="text-xs text-nex-textMuted mt-0.5">
            Configure simulation mode, shot limits, and noise models
          </p>
        </div>
      </div>

      {/* Main Parameters Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Simulation Mode */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-200 block">Simulation Mode</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-nex-surface rounded border border-nex-border">
            <button
              type="button"
              onClick={() => handleModeChange('ideal')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-medium transition-all ${
                request.mode === 'ideal'
                  ? 'bg-sky-600 text-white font-semibold shadow-sm'
                  : 'text-nex-textMuted hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Ideal</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('noisy')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-medium transition-all ${
                request.mode === 'noisy'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-nex-textMuted hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Noisy Model</span>
            </button>
          </div>
          <p className="text-[11px] text-nex-textDim">
            {request.mode === 'ideal' 
              ? 'Zero decoherence. Exact state vector amplitude sampling.' 
              : 'Simulates gate depolarization & readout errors.'}
          </p>
        </div>

        {/* 2. Shots Config */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-slate-200">Shots Count (N)</label>
            <span className="font-mono text-sky-400 font-semibold text-xs">{request.shots.toLocaleString()} shots</span>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={request.shots}
            onChange={(e) => handleShotsChange(parseInt(e.target.value))}
            className="w-full accent-sky-400 bg-nex-surface rounded h-1.5 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-nex-textDim">
            <span>100</span>
            <span>1,024</span>
            <span>5,000</span>
            <span>10,000</span>
          </div>
        </div>
      </div>

      {/* Collapsible Advanced Settings Section */}
      <div className="mt-4 pt-3 border-t border-nex-border/60">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-nex-textMuted hover:text-white transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>Advanced Settings & Channel Noise Configuration</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 rounded bg-nex-surface border border-nex-border space-y-4">
            {/* Depolarization Rate */}
            <div className={`space-y-2 transition-opacity ${request.mode === 'noisy' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-200">Depolarization Rate (ε)</label>
                <span className="font-mono text-amber-400 font-semibold text-xs">{(request.noise_rate * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.25"
                step="0.01"
                value={request.noise_rate}
                disabled={request.mode !== 'noisy'}
                onChange={(e) => handleNoiseChange(parseFloat(e.target.value))}
                className="w-full accent-amber-400 bg-nex-surface rounded h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-nex-textDim">
                <span>1% (Low)</span>
                <span>10% (Medium)</span>
                <span>25% (High)</span>
              </div>
            </div>

            {/* Active Custodians */}
            <div className="pt-2 border-t border-nex-border/60">
              <label className="text-xs font-medium text-slate-200 block mb-2">Active Custodian Registers</label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((idx) => {
                  const isActive = request.custodians_active[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleCustodian(idx)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
                        isActive
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-nex-card text-nex-textDim border-nex-border'
                      }`}
                    >
                      q{idx} (Cust-{idx}): {isActive ? 'Active' : 'Disabled'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message banner */}
      {error && (
        <div className="mt-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-nex-border flex items-center justify-between">
        <div className="text-xs text-nex-textMuted font-mono flex items-center gap-2">
          <span>Target Backend:</span>
          <span className="text-sky-300 font-medium">Local Qiskit Aer Simulator</span>
        </div>

        <button
          onClick={onRun}
          disabled={isSimulating || !backendOnline}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold tracking-wide transition-all shadow-sm ${
            isSimulating || !backendOnline
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-500 text-white border border-sky-400/30 active:scale-[0.98]'
          }`}
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-sky-200" />
              <span>Executing Simulation...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run GHZ Simulation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
