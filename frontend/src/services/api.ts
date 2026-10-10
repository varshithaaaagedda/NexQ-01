import { ExperimentRequest, ExperimentResult, HealthResponse } from '../types/quantum';

const API_BASE = 'http://127.0.0.1:8000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error (${response.status}): ${errorBody || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const apiService = {
  async getHealth(): Promise<HealthResponse> {
    return request<HealthResponse>('/health');
  },

  async runExperiment(expRequest: ExperimentRequest): Promise<ExperimentResult> {
    return request<ExperimentResult>('/experiments/run', {
      method: 'POST',
      body: JSON.stringify(expRequest),
    });
  },

  async getHistory(): Promise<ExperimentResult[]> {
    return request<ExperimentResult[]>('/experiments/history');
  },

  async getExperimentById(id: string): Promise<ExperimentResult> {
    return request<ExperimentResult>(`/experiments/${id}`);
  }
};
