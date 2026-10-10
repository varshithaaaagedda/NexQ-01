import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from quantum_engine import run_ghz_experiment, build_ghz_circuit, ALL_STATES
from schemas import ExperimentRequest

def test_build_ghz_circuit():
    qc = build_ghz_circuit([True, True, True])
    assert qc.num_qubits == 3
    assert qc.num_clbits == 3

def test_run_ideal_ghz_experiment():
    req = ExperimentRequest(shots=1000, mode="ideal")
    res = run_ghz_experiment(req)
    
    assert res.shots == 1000
    assert res.mode == "ideal"
    assert res.stats.fidelity >= 0.99  # Ideal mode should have near 1.0 fidelity
    
    # Check that 000 and 111 dominate counts
    counts = res.counts_raw
    total_valid = counts.get("000", 0) + counts.get("111", 0)
    assert total_valid == 1000
    assert res.stats.entropy > 0.8  # ~1 bit entropy for 50/50 mix

def test_run_noisy_ghz_experiment():
    req = ExperimentRequest(shots=1000, mode="noisy", noise_rate=0.08)
    res = run_ghz_experiment(req)
    
    assert res.shots == 1000
    assert res.mode == "noisy"
    assert res.stats.fidelity < 1.0  # Noise should reduce fidelity
    assert res.stats.noise_level_detected > 0.0
