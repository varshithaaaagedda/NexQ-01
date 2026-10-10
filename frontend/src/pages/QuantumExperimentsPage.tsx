import React from 'react';
import { ExperimentRequest, ExperimentResult } from '../types/quantum';
import { GHZCircuitViewer } from '../components/GHZCircuitViewer';
import { ExperimentControlPanel } from '../components/ExperimentControlPanel';
import { CustodianStatus } from '../components/CustodianStatus';
import { MeasurementHistogram } from '../components/MeasurementHistogram';
import { Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

interface QuantumExperimentsPageProps {
  request: ExperimentRequest;
  setRequest: React.Dispatch<React.SetStateAction<ExperimentRequest>>;
  latestResult: ExperimentResult | null;
  onRunExperiment: () => void;
  isSimulating: boolean;
  backendOnline: boolean;
  error?: string | null;
}

export const QuantumExperimentsPage: React.FC<QuantumExperimentsPageProps> = ({
  request,
  setRequest,
  latestResult,
  onRunExperiment,
  isSimulating,
  backendOnline,
  error
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* GHZ Circuit Viewer */}
      <GHZCircuitViewer 
        circuitAscii={latestResult?.circuit_ascii} 
        custodiansActive={request.custodians_active}
      />

      {/* Simulation Controls */}
      <ExperimentControlPanel
        request={request}
        setRequest={setRequest}
        onRun={onRunExperiment}
        isSimulating={isSimulating}
        backendOnline={backendOnline}
        error={error}
      />

      {/* Execution Output State Container */}
      {isSimulating ? (
        <div className="bg-nex-card border border-nex-border rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400 mb-3" />
          <h4 className="text-sm font-semibold text-white font-mono">Executing Qiskit Aer Circuit Simulation...</h4>
          <p className="text-xs text-nex-textMuted mt-1 font-mono">Transpiling GHZ circuit & compiling quantum noise operator matrices</p>
        </div>
      ) : latestResult ? (
        <div className="space-y-6">
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Experiment {latestResult.id} Complete:</strong> Executed {latestResult.shots.toLocaleString()} shots in {latestResult.execution_time_ms.toFixed(1)} ms.
              </span>
            </div>
            <span className="text-emerald-400">
              Target Subspace Ratio: {(latestResult.stats.fidelity * 100).toFixed(1)}%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MeasurementHistogram 
              histogram={latestResult.histogram} 
              shots={latestResult.shots} 
              mode={latestResult.mode} 
            />
            <CustodianStatus custodians={latestResult.custodians} />
          </div>
        </div>
      ) : (
        <div className="bg-nex-card border border-nex-border rounded-lg p-12 text-center text-nex-textMuted">
          <Cpu className="w-10 h-10 text-nex-textDim mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-300 font-mono">Ready to Execute Circuit</h4>
          <p className="text-xs text-nex-textDim mt-1 max-w-md mx-auto font-sans">
            Adjust parameters above and click <strong>Run GHZ Simulation</strong> to compute quantum state vector evolutions.
          </p>
        </div>
      )}
    </div>
  );
};
