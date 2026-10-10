import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { OverviewPage } from './pages/OverviewPage';
import { QuantumExperimentsPage } from './pages/QuantumExperimentsPage';
import { CustodianNetworkPage } from './pages/CustodianNetworkPage';
import { ResultsAnalysisPage } from './pages/ResultsAnalysisPage';
import { ExperimentLogsPage } from './pages/ExperimentLogsPage';
import { MethodologyPage } from './pages/MethodologyPage';

import { apiService } from './services/api';
import { ExperimentRequest, ExperimentResult, HealthResponse } from './types/quantum';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [request, setRequest] = useState<ExperimentRequest>({
    shots: 1024,
    mode: 'ideal',
    noise_rate: 0.05,
    custodians_active: [true, true, true],
    label: 'Interactive GHZ Run'
  });

  const [history, setHistory] = useState<ExperimentResult[]>([]);
  const [latestResult, setLatestResult] = useState<ExperimentResult | null>(null);

  // Check health and load initial history
  const checkBackendHealth = async () => {
    try {
      const h = await apiService.getHealth();
      setHealth(h);
      setBackendOnline(h.status === 'healthy');
      setError(null);

      // Load history
      const hist = await apiService.getHistory();
      setHistory(hist);
      if (hist.length > 0) {
        setLatestResult(hist[0]);
      }
    } catch (err: any) {
      setBackendOnline(false);
      setError('Cannot connect to Qiskit Aer backend at http://127.0.0.1:8000. Please start the backend service.');
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRunExperiment = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setError(null);

    try {
      const result = await apiService.runExperiment(request);
      setLatestResult(result);
      setHistory(prev => [result, ...prev]);
      setBackendOnline(true);
    } catch (err: any) {
      console.error('Simulation execution failed:', err);
      setBackendOnline(false);
      setError('Quantum simulation request failed. Ensure the FastAPI backend server is running and Qiskit Aer is active.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-nex-bg text-nex-textMain">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Navbar
          activeTab={activeTab}
          onRunQuickExperiment={handleRunExperiment}
          isSimulating={isSimulating}
          backendOnline={backendOnline}
          qiskitVersion={health?.qiskit_version}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewPage
                latestResult={latestResult}
                history={history}
                backendOnline={backendOnline}
                health={health}
                onRunExperiment={handleRunExperiment}
                onNavigateTab={setActiveTab}
                isSimulating={isSimulating}
              />
            )}

            {activeTab === 'experiments' && (
              <QuantumExperimentsPage
                request={request}
                setRequest={setRequest}
                latestResult={latestResult}
                onRunExperiment={handleRunExperiment}
                isSimulating={isSimulating}
                backendOnline={backendOnline}
                error={error}
              />
            )}

            {activeTab === 'custodians' && (
              <CustodianNetworkPage
                latestResult={latestResult}
                request={request}
                setRequest={setRequest}
              />
            )}

            {activeTab === 'analysis' && (
              <ResultsAnalysisPage latestResult={latestResult} />
            )}

            {activeTab === 'logs' && (
              <ExperimentLogsPage history={history} />
            )}

            {activeTab === 'methodology' && (
              <MethodologyPage />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
