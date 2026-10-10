import time
import math
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Tuple, Any
import numpy as np

import qiskit
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit_aer.noise import NoiseModel, depolarizing_error, ReadoutError

from schemas import (
    ExperimentRequest,
    ExperimentResult,
    HistogramEntry,
    CorrelationStats,
    CustodianSummary,
)

ALL_STATES = ["000", "001", "010", "011", "100", "101", "110", "111"]

def build_ghz_circuit(custodians_active: List[bool] = [True, True, True]) -> QuantumCircuit:
    """
    Constructs a 3-qubit GHZ state circuit:
    1. Initial state |000>
    2. Hadamard gate on q0: (|0> + |1>) / sqrt(2)
    3. CNOT q0 -> q1: (|00> + |11>) / sqrt(2)
    4. CNOT q0 -> q2: (|000> + |111>) / sqrt(2)
    5. Measure active qubits into classical registers.
    """
    qc = QuantumCircuit(3, 3, name="NexQ-01 GHZ Circuit")
    
    # Hadamard on qubit 0
    qc.h(0)
    # Entangle q0 and q1
    qc.cx(0, 1)
    # Entangle q0 and q2
    qc.cx(0, 2)
    
    # Barrier before measurement for clear circuit layout
    qc.barrier()
    
    # Measure qubits into corresponding classical bits
    for i in range(3):
        if i < len(custodians_active) and custodians_active[i]:
            qc.measure(i, i)
            
    return qc

def build_noise_model(noise_rate: float) -> NoiseModel:
    """
    Creates a physical decoherence & gate depolarization noise model using Qiskit Aer.
    Note: This models physical noise in quantum systems, NOT a cyberattack.
    """
    noise_model = NoiseModel()
    if noise_rate <= 0:
        return noise_model
        
    # Single-qubit gate depolarization
    err_single = depolarizing_error(noise_rate, 1)
    # Two-qubit CNOT gate depolarization
    err_cnot = depolarizing_error(min(noise_rate * 1.5, 0.5), 2)
    # Measurement readout error
    readout_err = ReadoutError([
        [1.0 - noise_rate, noise_rate],
        [noise_rate, 1.0 - noise_rate]
    ])
    
    noise_model.add_all_qubit_quantum_error(err_single, ['h'])
    noise_model.add_all_qubit_quantum_error(err_cnot, ['cx'])
    noise_model.add_all_qubit_readout_error(readout_err)
    
    return noise_model

def normalize_qiskit_counts(raw_counts: Dict[str, int], active: List[bool]) -> Dict[str, int]:
    """
    Qiskit defaults to little-endian bit ordering (c2 c1 c0).
    We map bitstrings so that position 0 = q0, position 1 = q1, position 2 = q2 (q0 q1 q2).
    This ensures scientific readability.
    """
    normalized = {st: 0 for st in ALL_STATES}
    
    for bitstring_qiskit, count in raw_counts.items():
        # Clean bitstring (remove spaces if any)
        bs = bitstring_qiskit.replace(" ", "")
        
        # If Qiskit returns 3 bits: bs[0]=c2, bs[1]=c1, bs[2]=c0
        # Target representation (q0 q1 q2): q0=c0, q1=c1, q2=c2
        if len(bs) == 3:
            q0 = bs[2]
            q1 = bs[1]
            q2 = bs[0]
            norm_key = f"{q0}{q1}{q2}"
        else:
            # Fallback for unexpected lengths
            norm_key = bs.zfill(3)
            
        normalized[norm_key] = normalized.get(norm_key, 0) + count
        
    return normalized

def compute_statistics(counts: Dict[str, int], total_shots: int, noise_rate: float) -> CorrelationStats:
    """
    Computes fidelity, parity correlation, pair agreement, and outcome entropy.
    """
    if total_shots <= 0:
        total_shots = 1
        
    n_000 = counts.get("000", 0)
    n_111 = counts.get("111", 0)
    
    # State fidelity estimate in computational Z-basis
    fidelity = (n_000 + n_111) / float(total_shots)
    consensus_rate = fidelity
    
    # Pairwise custodian agreement rates
    q0_q1_agree = sum(count for st, count in counts.items() if st[0] == st[1]) / float(total_shots)
    q1_q2_agree = sum(count for st, count in counts.items() if st[1] == st[2]) / float(total_shots)
    q0_q2_agree = sum(count for st, count in counts.items() if st[0] == st[2]) / float(total_shots)
    
    # 3-party parity expectation <Z0 Z1 Z2>
    parity_sum = 0
    for st, count in counts.items():
        q0, q1, q2 = int(st[0]), int(st[1]), int(st[2])
        # Z eigenvalue: 0 -> +1, 1 -> -1
        z0 = 1 if q0 == 0 else -1
        z1 = 1 if q1 == 0 else -1
        z2 = 1 if q2 == 0 else -1
        parity_sum += (z0 * z1 * z2) * count
    parity_correlation = parity_sum / float(total_shots)
    
    # Shannon Entropy of measurement outcome distribution
    entropy = 0.0
    for st, count in counts.items():
        if count > 0:
            p = count / float(total_shots)
            entropy -= p * math.log2(p)
            
    noise_level_detected = 1.0 - fidelity
    
    return CorrelationStats(
        fidelity=round(fidelity, 4),
        parity_correlation=round(parity_correlation, 4),
        consensus_rate=round(consensus_rate, 4),
        pair_agreement={
            "q0_q1": round(q0_q1_agree, 4),
            "q1_q2": round(q1_q2_agree, 4),
            "q0_q2": round(q0_q2_agree, 4)
        },
        entropy=round(entropy, 4),
        noise_level_detected=round(noise_level_detected, 4)
    )

def build_custodian_summaries(counts: Dict[str, int], total_shots: int, active: List[bool], mode: str) -> List[CustodianSummary]:
    custodians = []
    names = ["Custodian 0 (Alpha - q0)", "Custodian 1 (Beta - q1)", "Custodian 2 (Gamma - q2)"]
    
    for idx in range(3):
        is_act = active[idx] if idx < len(active) else True
        if not is_act:
            status = "INACTIVE"
            zeros = 0
            ones = 0
            ratio = 0.0
        else:
            zeros = sum(count for st, count in counts.items() if st[idx] == '0')
            ones = sum(count for st, count in counts.items() if st[idx] == '1')
            ratio = zeros / float(total_shots) if total_shots > 0 else 0.0
            status = "ONLINE_SYNCHRONIZED" if mode == "ideal" else "DEGRADED_NOISE"
            
        custodians.append(CustodianSummary(
            id=f"custodian_{idx}",
            name=names[idx],
            qubit_index=idx,
            active=is_act,
            status=status,
            measured_zeros=zeros,
            measured_ones=ones,
            zero_ratio=round(ratio, 4)
        ))
        
    return custodians

def run_ghz_experiment(req: ExperimentRequest) -> ExperimentResult:
    """
    Executes a 3-qubit GHZ state experiment on the local Qiskit Aer simulator.
    Supports both ideal and noisy simulation modes.
    """
    start_time = time.perf_counter()
    
    # 1. Build circuit
    qc = build_ghz_circuit(req.custodians_active)
    
    # 2. Select backend & noise model
    if req.mode.lower() == "noisy":
        noise_model = build_noise_model(req.noise_rate)
        simulator = AerSimulator(noise_model=noise_model)
    else:
        simulator = AerSimulator()
        
    # 3. Transpile and execute
    compiled_qc = transpile(qc, simulator)
    job = simulator.run(compiled_qc, shots=req.shots)
    result = job.result()
    raw_counts = result.get_counts(compiled_qc)
    
    # If counts is returned as single dict or count object
    if isinstance(raw_counts, list):
        raw_counts = raw_counts[0]
        
    # 4. Normalize Qiskit bitstring order
    normalized_counts = normalize_qiskit_counts(raw_counts, req.custodians_active)
    
    # 5. Build Histogram Entries
    histogram = []
    for st in ALL_STATES:
        cnt = normalized_counts.get(st, 0)
        freq = cnt / float(req.shots)
        ideal_freq = 0.5 if st in ["000", "111"] else 0.0
        histogram.append(HistogramEntry(
            state=st,
            count=cnt,
            frequency=round(freq, 4),
            ideal_frequency=ideal_freq
        ))
        
    # 6. Statistics & Custodian summaries
    stats = compute_statistics(normalized_counts, req.shots, req.noise_rate)
    custodians = build_custodian_summaries(normalized_counts, req.shots, req.custodians_active, req.mode)
    
    execution_time_ms = (time.perf_counter() - start_time) * 1000.0
    
    # Generate ASCII diagram string
    circuit_ascii = str(qc.draw(output='text'))
    
    # Summary note
    if req.mode.lower() == "ideal":
        note = (
            f"Executed {req.shots} shots in ideal simulation mode. "
            f"Observed state fidelity of {stats.fidelity * 100:.1f}%. "
            f"Outcomes 000 and 111 occur with equal theoretical expectation (50% each)."
        )
    else:
        note = (
            f"Executed {req.shots} shots in noisy simulation mode (noise rate {req.noise_rate:.2f}). "
            f"Observed state fidelity of {stats.fidelity * 100:.1f}% with {stats.noise_level_detected * 100:.1f}% error rate. "
            f"Simulated gate depolarization and readout errors."
        )
        
    exp_id = f"exp-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    
    return ExperimentResult(
        id=exp_id,
        timestamp=now_iso,
        shots=req.shots,
        mode=req.mode,
        noise_rate=req.noise_rate,
        execution_time_ms=round(execution_time_ms, 2),
        histogram=histogram,
        counts_raw=normalized_counts,
        stats=stats,
        custodians=custodians,
        circuit_ascii=circuit_ascii,
        summary_notes=note
    )
