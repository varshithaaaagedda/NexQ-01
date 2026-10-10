# NexQ-01

**NexQ-01** is an enterprise-grade quantum computing research prototype for 3-qubit Greenberger–Horne–Zeilinger (GHZ) state entanglement simulation, computational-basis correlation analysis, and physical noise modeling.

[![Q-Hack India 2026](https://img.shields.io/badge/Q--Hack_India-2026-blue.svg)](https://qhack.ai)
[![Track](https://img.shields.io/badge/Track-Quantum_Security_%26_Cryptography-0284c7.svg)]()
[![Engine](https://img.shields.io/badge/Engine-Qiskit_Aer_v0.17.2-sky.svg)]()
[![Backend](https://img.shields.io/badge/Backend-FastAPI_Python_3.11-emerald.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React_TypeScript_Vite-indigo.svg)]()

---

## 1. Executive Overview

**NexQ-01** provides an interactive research environment for preparing, executing, and evaluating 3-qubit GHZ state entanglement circuits on a local **Qiskit Aer** simulation engine. The application couples a high-performance Python FastAPI backend with an enterprise React/TypeScript dashboard designed for visual circuit inspection, measurement probability analysis, noise decoherence modeling, and multi-party correlation evaluation.

The system is designed as a software research prototype for **Q-Hack India 2026** in the **Quantum Security & Cryptography** track. It allows researchers and jury evaluators to systematically compare ideal quantum state evolutions with noisy simulation channels without requiring access to physical quantum processor hardware or paid cloud quantum backends.

---

## 2. Research Objective & Scope

### Objective
The core objective of NexQ-01 is to evaluate the spatial measurement correlations of a 3-qubit GHZ entangled state across simulated custodian nodes, and to quantify how physical gate depolarization and readout decoherence degrade multi-party quantum consensus.

### Scope & Boundaries
- **Quantum Engine**: Local 3-qubit Qiskit circuit execution on `AerSimulator`.
- **Measurement Basis**: Computational Z-basis measurement ($Z_0 Z_1 Z_2$).
- **Noise Channel**: Controlled single-qubit gate depolarization, two-qubit CNOT gate depolarization, and measurement readout error channels.
- **Topology Simulation**: Mapping of 3 logical custodian nodes to classical measurement registers ($c_0, c_1, c_2$).
- **Out-of-Scope**: Physical fiber-optic QKD hardware deployment, live cloud quantum processor execution, and hardware Bell-state tomography.

---

## 3. Key Capabilities

- **Ideal GHZ Circuit Simulation**: Prepares and samples maximally entangled 3-qubit state $|\text{GHZ}\rangle = \frac{1}{\sqrt{2}}(|000\rangle + |111\rangle)$ with zero decoherence.
- **Controlled Noise Modeling**: Evaluates open quantum system decoherence using Qiskit Aer `NoiseModel` with configurable depolarization rate ($\varepsilon \in [0.01, 0.25]$).
- **Qiskit Bitstring Normalization**: Handles Qiskit's little-endian bit ordering ($c_2 c_1 c_0$) to present standard big-endian bitstrings ($q_0 q_1 q_2$) for scientific transparency.
- **Multi-Party Telemetry**: Computes empirical target-subspace ratio, subspace deviation rate, 3-party parity expectation $\langle Z_0 Z_1 Z_2 \rangle$, pairwise custodian agreement ($q_i \leftrightarrow q_j$), and outcome Shannon entropy ($H$).
- **Execution Audit Logging**: Maintains a persistent local audit history of completed simulation runs with unique UUID execution tags, parameter records, and execution durations.
- **Interactive Visualizations**: Includes high-resolution SVG circuit diagrams (Hadamard gate, CNOT control/target symbols, Z-measurement blocks), Visual/Qiskit ASCII toggles, and measurement outcome histograms.

---

## 4. Scientific Background

### 4.1 Three-Qubit GHZ State
The Greenberger–Horne–Zeilinger (GHZ) state is a maximally entangled 3-qubit quantum state defined as:

$$\mathcal{|\text{GHZ}\rangle} = \frac{|000\rangle + |111\rangle}{\sqrt{2}}$$

In density matrix representation for an uncorrupted state:

$$\rho_{\text{GHZ}} = |\text{GHZ}\rangle\langle\text{GHZ}| = \frac{1}{2} \left( |000\rangle\langle 000| + |000\rangle\langle 111| + |111\rangle\langle 000| + |111\rangle\langle 111| \right)$$

### 4.2 Quantum Circuit Synthesis
State preparation follows a standard 4-step sequence across qubits $q_0, q_1, q_2$:

1. **State Initialization**: All qubits initialized to $|000\rangle$:
   $$|\Psi_0\rangle = |000\rangle$$

2. **Superposition ($q_0$)**: Apply a single-qubit Hadamard gate ($H$) to qubit 0:
   $$|\Psi_1\rangle = (H \otimes I \otimes I) |000\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}} \otimes |00\rangle = \frac{|000\rangle + |100\rangle}{\sqrt{2}}$$

3. **Entanglement ($q_0 \to q_1$)**: Apply a two-qubit Controlled-NOT ($\text{CNOT}$) gate with control $q_0$ and target $q_1$:
   $$|\Psi_2\rangle = \text{CNOT}_{0 \to 1} |\Psi_1\rangle = \frac{|000\rangle + |110\rangle}{\sqrt{2}}$$

4. **Tripartite Entanglement ($q_0 \to q_2$)**: Apply a second $\text{CNOT}$ gate with control $q_0$ and target $q_2$:
   $$|\Psi_3\rangle = \text{CNOT}_{0 \to 2} |\Psi_2\rangle = \frac{|000\rangle + |111\rangle}{\sqrt{2}}$$

### 4.3 Computational-Basis Measurement Expectations
Measuring each qubit in the Z computational basis transforms the state vector into classical probabilities:

- **Target Basis States**: Outcomes $|000\rangle$ and $|111\rangle$ each occur with theoretical probability $P(000) = P(111) = 0.500$ ($50\%$).
- **Non-Target Basis States**: Outcomes $|001\rangle, |010\rangle, |011\rangle, |100\rangle, |101\rangle, |110\rangle$ have theoretical probability $0.000$ ($0\%$).

### 4.4 Noise Model Mechanics
In noisy simulation mode, Qiskit Aer applies three quantum error channels governed by depolarization parameter $\varepsilon$:

1. **Single-Qubit Gate Depolarization**:
   $$\mathcal{E}_1(\rho) = (1 - \varepsilon)\rho + \frac{\varepsilon}{3} (X\rho X + Y\rho Y + Z\rho Z)$$
2. **Two-Qubit CNOT Gate Depolarization**:
   $$\mathcal{E}_2(\rho) = (1 - 1.5\varepsilon)\rho + \frac{1.5\varepsilon}{15} \sum_{i,j \in \{I,X,Y,Z\} \setminus \{II\}} (P_i \otimes P_j) \rho (P_i \otimes P_j)$$
3. **Readout Measurement Error**:
   $$\mathbf{M}_{\text{readout}} = \begin{pmatrix} 1 - \varepsilon & \varepsilon \\ \varepsilon & 1 - \varepsilon \end{pmatrix}$$

This noise model introduces population leakage into the 6 non-target basis states, enabling empirical analysis of quantum state degradation.

---

## 5. System Architecture & Data Flow

NexQ-01 operates via a decoupled client-server architecture:

```
[ User Browser ]
       │
       │ HTTP / REST (JSON)
       ▼
┌─────────────────────────────────────────────────────────┐
│ FastAPI Backend Server (Python 3.11 / Uvicorn)          │
│   ├── main.py (Lifespan management & CORS)              │
│   ├── schemas.py (Pydantic request/response validation) │
│   └── quantum_engine.py                                 │
│         ├── Circuit Construction: build_ghz_circuit()   │
│         ├── Noise Model: build_noise_model()            │
│         ├── Aer Execution: AerSimulator.run()           │
│         ├── Bit Normalization: normalize_counts()       │
│         └── Stats Engine: compute_statistics()          │
└─────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ Qiskit Aer Local Simulation Kernel                      │
│   ├── Transpilation & C++ Execution Kernel              │
│   └── Counts Dictionary Generation                      │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Technology Stack

### Backend
- **Python**: `v3.11.16`
- **Qiskit Core**: `v2.5.2`
- **Qiskit Aer**: `v0.17.2`
- **FastAPI**: `v0.143.0`
- **Uvicorn**: `v0.54.0`
- **Pydantic**: `v2.14.0`
- **NumPy**: `v2.4.6`
- **Pytest**: `v9.1.1`

### Frontend
- **React**: `v18.3.1`
- **TypeScript**: `v5.7.2`
- **Vite**: `v6.0.5`
- **Tailwind CSS**: `v3.4.17`
- **Lucide React**: `v0.469.0`

---

## 7. Directory Structure

```
nexq-01/
├── backend/
│   ├── main.py                 # FastAPI application, CORS, lifespan & endpoints
│   ├── quantum_engine.py        # Qiskit GHZ circuit builder & Aer execution engine
│   ├── schemas.py               # Pydantic data schemas & request validation
│   ├── requirements.txt         # Verified Python dependencies
│   ├── .venv/                   # Python virtual environment (ignored in git)
│   └── tests/
│       ├── test_api.py          # FastAPI endpoint integration tests
│       └── test_quantum_engine.py# Qiskit quantum engine unit tests
├── frontend/
│   ├── index.html               # Main HTML entrypoint
│   ├── package.json             # Frontend Node.js dependencies
│   ├── vite.config.ts           # Vite server & build configuration
│   ├── tailwind.config.js       # Tailwind CSS theme & token config
│   ├── postcss.config.js        # PostCSS plugin config
│   ├── src/
│   │   ├── main.tsx             # React DOM root mounting
│   │   ├── App.tsx              # Root application state & navigation router
│   │   ├── index.css            # Base styles & CSS rules
│   │   ├── vite-env.d.ts        # Vite client type definitions
│   │   ├── services/
│   │   │   └── api.ts           # Typed native fetch API service
│   │   ├── types/
│   │   │   └── quantum.ts       # TypeScript interface definitions
│   │   ├── components/
│   │   │   ├── Sidebar.tsx      # Minimal sidebar navigation (icon + NexQ-01)
│   │   │   ├── Navbar.tsx       # Header with title & primary action button
│   │   │   ├── GHZCircuitViewer.tsx# SVG circuit diagram & ASCII view
│   │   │   ├── MeasurementHistogram.tsx# SVG measurement outcome bar chart
│   │   │   ├── CustodianStatus.tsx # 3-party custodian node cards
│   │   │   └── ExperimentControlPanel.tsx# Form controls & collapsible noise settings
│   │   └── pages/
│   │       ├── OverviewPage.tsx         # Concise 3-metric overview dashboard
│   │       ├── QuantumExperimentsPage.tsx# Experiment execution workspace
│   │       ├── CustodianNetworkPage.tsx # Custodian topology & agreement metrics
│   │       ├── ResultsAnalysisPage.tsx  # Outcome distribution table & stats
│   │       ├── ExperimentLogsPage.tsx   # Audit history table & detail drawer
│   │       └── MethodologyPage.tsx      # Scientific derivation & disclaimers
├── .gitignore                   # Workspace git exclusion rules
└── README.md                    # Project documentation
```

---

## 8. Prerequisites & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on Node `v26.4.0`)
- **Python**: `v3.10` or `v3.11` (tested on Python `v3.11.16`)
- **uv** (Optional, recommended for fast Python environment management)

### Installation Steps

1. **Clone Repository**:
   ```bash
   git clone https://github.com/your-org/nexq-01.git
   cd nexq-01
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   
   # Create Python 3.11 virtual environment using uv or python venv
   uv venv --python 3.11 .venv
   
   # Activate virtual environment
   # On Windows PowerShell:
   .\.venv\Scripts\activate
   
   # Install dependencies
   uv pip install -r requirements.txt
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 9. Local Execution Guide

### 1. Launch FastAPI Backend Server
In the `backend` directory (with virtual environment activated):

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- **Server URL**: `http://127.0.0.1:8000`
- **Interactive Documentation**: `http://127.0.0.1:8000/docs`

### 2. Launch Vite Frontend Server
In the `frontend` directory:

```bash
npm run dev
```
- **Application URL**: `http://localhost:5173`

---

## 10. Backend API Reference

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Returns system operational status, Qiskit version, and Qiskit Aer version.
- **Response Example** (`HTTP 200 OK`):
  ```json
  {
    "status": "healthy",
    "product": "NexQ-01 Quantum Security Platform",
    "version": "1.0.0",
    "qiskit_version": "2.5.2",
    "aer_version": "0.17.2",
    "timestamp": "2026-10-10T00:45:30.781732+00:00"
  }
  ```

### 2. Execute GHZ Simulation Run
- **Endpoint**: `POST /api/experiments/run`
- **Request Body**:
  ```json
  {
    "shots": 1024,
    "mode": "ideal",
    "noise_rate": 0.05,
    "custodians_active": [true, true, true],
    "label": "Interactive GHZ Run"
  }
  ```
- **Validation Rules**: `shots` $\in [100, 10000]$, `mode` $\in \{\text{"ideal"}, \text{"noisy"}\}$, `noise_rate` $\in [0.0, 0.30]$.
- **Response Example** (`HTTP 201 Created`):
  ```json
  {
    "id": "exp-f09097d6",
    "timestamp": "2026-10-10T00:45:35.111703+00:00",
    "shots": 1024,
    "mode": "ideal",
    "noise_rate": 0.05,
    "execution_time_ms": 89.63,
    "histogram": [
      { "state": "000", "count": 518, "frequency": 0.5059, "ideal_frequency": 0.5 },
      { "state": "001", "count": 0, "frequency": 0.0, "ideal_frequency": 0.0 },
      { "state": "010", "count": 0, "frequency": 0.0, "ideal_frequency": 0.0 },
      { "state": "011", "count": 0, "frequency": 0.0, "ideal_frequency": 0.0 },
      { "state": "100", "count": 0, "frequency": 0.0, "ideal_frequency": 0.0 },
      { "state": "101", "count": 0, "frequency": 0.0, "ideal_frequency": 0.0 },
      { "state": "110", "count": 0, "frequency": 0.0, "ideal_frequency": 0.0 },
      { "state": "111", "count": 506, "frequency": 0.4941, "ideal_frequency": 0.5 }
    ],
    "counts_raw": { "000": 518, "111": 506 },
    "stats": {
      "fidelity": 1.0,
      "parity_correlation": 0.0117,
      "consensus_rate": 1.0,
      "pair_agreement": { "q0_q1": 1.0, "q1_q2": 1.0, "q0_q2": 1.0 },
      "entropy": 0.9999,
      "noise_level_detected": 0.0
    },
    "custodians": [
      {
        "id": "custodian_0",
        "name": "Custodian 0 (Alpha - q0)",
        "qubit_index": 0,
        "active": true,
        "status": "ONLINE_SYNCHRONIZED",
        "measured_zeros": 518,
        "measured_ones": 506,
        "zero_ratio": 0.5059
      }
    ],
    "circuit_ascii": "     ┌───┐          ┌─┐   \nq_0: ┤ H ├──■────■──┤M├───\n...",
    "summary_notes": "Executed 1024 shots in ideal simulation mode."
  }
  ```

### 3. Retrieve Experiment History
- **Endpoint**: `GET /api/experiments/history`
- **Description**: Returns list of all completed simulation records sorted by timestamp descending.

### 4. Retrieve Experiment by ID
- **Endpoint**: `GET /api/experiments/{exp_id}`
- **Description**: Returns details for a specific experiment run. Returns `HTTP 404 Not Found` if ID does not exist.

---

## 11. Statistical Formulas & Analysis Metrics

| Metric | Mathematical Definition | Scientific Meaning |
|---|---|---|
| **Target Subspace Ratio ($\mathcal{R}_{\text{target}}$)** | $\frac{N_{000} + N_{111}}{N_{\text{total}}}$ | Fraction of computational Z-basis measurements yielding target GHZ basis states $|000\rangle$ or $|111\rangle$. |
| **Subspace Deviation Rate ($\mathcal{D}_{\text{subspace}}$)** | $1.0 - \mathcal{R}_{\text{target}}$ | Population fraction leaking into non-target basis states due to simulation noise channels. |
| **3-Party Parity Expectation ($\langle Z_0 Z_1 Z_2 \rangle$)** | $\frac{1}{N_{\text{total}}} \sum_{s \in \{0,1\}^3} (z_0 \cdot z_1 \cdot z_2) N_s$ | Expectation value of $Z_0 Z_1 Z_2$ ($z_i = +1$ for $q_i=0$, $-1$ for $q_i=1$). Theoretical target for ideal GHZ is $0.000$. |
| **Pairwise Agreement ($P(q_i = q_j)$)** | $\frac{\sum_{s: s_i = s_j} N_s}{N_{\text{total}}}$ | Fraction of shots where custodian $i$ and custodian $j$ measure identical classical bits. |
| **Outcome Shannon Entropy ($H$)** | $-\sum_{s, P(s)>0} P(s) \log_2 P(s)$ | Shannon entropy of computational measurement outcomes. Ideal GHZ Z-basis superposition reference is $1.000\text{ bit}$. |

---

## 12. Verification & Test Suite

### Backend Pytest Suite
Run backend tests:

```bash
backend\.venv\Scripts\pytest.exe backend/tests/ -v
```

Verified test results (8 passed in 2.32s):
- `test_health_endpoint` — PASSED
- `test_run_experiment_endpoint` — PASSED
- `test_history_endpoint` — PASSED
- `test_get_by_id_endpoint` — PASSED
- `test_get_invalid_id` — PASSED (Returns HTTP 404)
- `test_build_ghz_circuit` — PASSED (3 qubits, 3 classical bits)
- `test_run_ideal_ghz_experiment` — PASSED ($\mathcal{R}_{\text{target}} \ge 0.99$)
- `test_run_noisy_ghz_experiment` — PASSED ($\mathcal{R}_{\text{target}} < 1.0$)

### Frontend Typecheck & Build
Run frontend typecheck and production build:

```bash
cd frontend
npx tsc --noEmit
npx vite build
```

Verified build results:
- `npx tsc --noEmit` passed with 0 errors.
- `npx vite build` succeeded in 1.04s (`dist/index.html` built).

---

## 13. Scientific Disclaimers & Responsible Claims

1. **Simulation vs Hardware**: All results are generated using the local Qiskit Aer simulation kernel. They model quantum circuit mathematics and decoherence operator channels, NOT physical quantum hardware processors.
2. **Secret Sharing Boundaries**: GHZ state entanglement correlations alone do NOT implement a secure threshold secret sharing scheme without classical authentication and basis rotation protocols.
3. **No Tamper Detection Guarantees**: Simulated gate depolarization represents physical decoherence operator channels, NOT a real-time cyberattack detection system.
4. **Classical Cryptography**: Shamir's Secret Sharing is based on polynomial interpolation over finite fields and is NOT broken by Shor's algorithm (which targets integer factorization and discrete logarithms).

---

## 14. Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| `Backend Offline` badge in UI | FastAPI server is not running on port 8000 | Run `python -m uvicorn main:app --reload --port 8000` inside `backend/`. |
| `ImportError: No module named 'quantum_engine'` in tests | `PYTHONPATH` not pointing to `backend/` | Execute pytest using `backend\.venv\Scripts\pytest.exe backend/tests/`. |
| `npm error network ECONNRESET` | Restricted network environment blocking npmjs.org | Use local dependency setup or install via pre-cached node_modules. |
| CORS preflight error | Frontend origin blocked | FastAPI `CORSMiddleware` is configured to allow `*`. Ensure URL is `http://127.0.0.1:8000/api`. |

---

## 15. Proposed Future Research Directions

- **Bell-State Basis Rotations**: Extend measurement configuration to include X-basis ($H$) and Y-basis ($S^\dagger H$) measurement gates to compute Mermin inequality expectation values $\langle M \rangle$.
- **Full Quantum State Tomography**: Reconstruct density matrix $\rho_{\text{empirical}}$ from 27 measurement basis combinations to calculate exact state fidelity $F(\rho_{\text{ideal}}, \rho_{\text{empirical}})$.
- **IBM Quantum Hardware Integration**: Connect FastAPI backend to `qiskit-ibm-runtime` to submit jobs to physical superconducting quantum processors (e.g., `ibm_brisbane`, `ibm_kyoto`).

---

## 16. Licensing & Contribution

This project is open-source research software developed for **Q-Hack India 2026**.

- **License**: MIT License
- **Track**: Quantum Security & Cryptography

---

## 17. Concluding Summary

**NexQ-01** provides a self-contained, reproducible, and mathematically rigorous environment for studying 3-qubit GHZ state entanglement, multi-party computational measurement correlations, and open system decoherence models.
