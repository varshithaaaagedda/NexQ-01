import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["product"] == "NexQ-01 Quantum Security Platform"
    assert "qiskit_version" in data

def test_run_experiment_endpoint():
    payload = {
        "shots": 500,
        "mode": "ideal",
        "noise_rate": 0.0,
        "custodians_active": [True, True, True]
    }
    response = client.post("/api/experiments/run", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["shots"] == 500
    assert data["mode"] == "ideal"
    assert "id" in data
    assert len(data["histogram"]) == 8

def test_history_endpoint():
    response = client.get("/api/experiments/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_get_by_id_endpoint():
    # First create an experiment
    res = client.post("/api/experiments/run", json={"shots": 200, "mode": "ideal"}).json()
    exp_id = res["id"]
    
    # Get by ID
    get_res = client.get(f"/api/experiments/{exp_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == exp_id

def test_get_invalid_id():
    response = client.get("/api/experiments/exp-invalid999")
    assert response.status_code == 404
