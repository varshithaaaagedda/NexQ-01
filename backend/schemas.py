from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class ExperimentRequest(BaseModel):
    shots: int = Field(default=1024, ge=100, le=10000, description="Number of quantum simulation shots")
    mode: str = Field(default="ideal", description="Simulation mode: 'ideal' or 'noisy'")
    noise_rate: float = Field(default=0.05, ge=0.0, le=0.30, description="Depolarizing/readout noise rate for noisy mode")
    custodians_active: List[bool] = Field(default=[True, True, True], description="Activity flag for Custodians 0, 1, 2")
    label: Optional[str] = Field(default="GHZ Verification Run", description="Optional label for the run")

class HistogramEntry(BaseModel):
    state: str
    count: int
    frequency: float
    ideal_frequency: float

class CorrelationStats(BaseModel):
    fidelity: float
    parity_correlation: float
    consensus_rate: float
    pair_agreement: Dict[str, float]
    entropy: float
    noise_level_detected: float

class CustodianSummary(BaseModel):
    id: str
    name: str
    qubit_index: int
    active: bool
    status: str
    measured_zeros: int
    measured_ones: int
    zero_ratio: float

class ExperimentResult(BaseModel):
    id: str
    timestamp: str
    shots: int
    mode: str
    noise_rate: float
    execution_time_ms: float
    histogram: List[HistogramEntry]
    counts_raw: Dict[str, int]
    stats: CorrelationStats
    custodians: List[CustodianSummary]
    circuit_ascii: str
    summary_notes: str

class HealthResponse(BaseModel):
    status: str
    product: str
    version: str
    qiskit_version: str
    aer_version: str
    timestamp: str
