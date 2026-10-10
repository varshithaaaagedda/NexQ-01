export type SimulationMode = 'ideal' | 'noisy';

export interface ExperimentRequest {
  shots: number;
  mode: SimulationMode;
  noise_rate: number;
  custodians_active: boolean[];
  label?: string;
}

export interface HistogramEntry {
  state: string;
  count: number;
  frequency: number;
  ideal_frequency: number;
}

export interface CorrelationStats {
  fidelity: number;
  parity_correlation: number;
  consensus_rate: number;
  pair_agreement: Record<string, number>;
  entropy: number;
  noise_level_detected: number;
}

export interface CustodianSummary {
  id: string;
  name: string;
  qubit_index: number;
  active: boolean;
  status: string;
  measured_zeros: number;
  measured_ones: number;
  zero_ratio: number;
}

export interface ExperimentResult {
  id: string;
  timestamp: string;
  shots: number;
  mode: SimulationMode;
  noise_rate: number;
  execution_time_ms: number;
  histogram: HistogramEntry[];
  counts_raw: Record<string, number>;
  stats: CorrelationStats;
  custodians: CustodianSummary[];
  circuit_ascii: string;
  summary_notes: string;
}

export interface HealthResponse {
  status: string;
  product: string;
  version: string;
  qiskit_version: string;
  aer_version: string;
  timestamp: string;
}
