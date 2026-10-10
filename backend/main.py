import os
import sys
import qiskit
import qiskit_aer
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import List, Dict, Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    ExperimentRequest,
    ExperimentResult,
    HealthResponse,
)
from quantum_engine import run_ghz_experiment

# In-memory local experiment history store
EXPERIMENT_HISTORY: Dict[str, ExperimentResult] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize baseline runs on startup
    if not EXPERIMENT_HISTORY:
        init_req = ExperimentRequest(shots=1024, mode="ideal", label="Initial Baseline Run")
        res = run_ghz_experiment(init_req)
        EXPERIMENT_HISTORY[res.id] = res
    yield

app = FastAPI(
    title="NexQ-01 Quantum Security Engine API",
    description="Distributed Trust & Quantum State Verification Platform Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        product="NexQ-01 Quantum Security Platform",
        version="1.0.0",
        qiskit_version=getattr(qiskit, "__version__", "unknown"),
        aer_version=getattr(qiskit_aer, "__version__", "unknown"),
        timestamp=datetime.now(timezone.utc).isoformat()
    )

@app.post("/api/experiments/run", response_model=ExperimentResult, status_code=status.HTTP_201_CREATED)
def run_experiment(req: ExperimentRequest):
    try:
        result = run_ghz_experiment(req)
        EXPERIMENT_HISTORY[result.id] = result
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quantum simulation failure: {str(e)}"
        )

@app.get("/api/experiments/history", response_model=List[ExperimentResult])
def get_experiment_history():
    results = list(EXPERIMENT_HISTORY.values())
    results.sort(key=lambda x: x.timestamp, reverse=True)
    return results

@app.get("/api/experiments/{exp_id}", response_model=ExperimentResult)
def get_experiment_by_id(exp_id: str):
    if exp_id not in EXPERIMENT_HISTORY:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Experiment with ID '{exp_id}' not found."
        )
    return EXPERIMENT_HISTORY[exp_id]
