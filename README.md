# OrbitWatch

### Satellite Telemetry Anomaly Detection using Machine Learning

OrbitWatch is a machine learning powered satellite monitoring system that analyzes spacecraft telemetry and detects unusual behavior in real time.

The system uses **Isolation Forest**, an unsupervised anomaly detection algorithm, to identify potentially abnormal satellite conditions without requiring labeled failure data.

---

## Overview

Spacecraft continuously generate telemetry from multiple onboard systems. Detecting unusual patterns early can help identify potential system instability before it becomes a critical failure.

OrbitWatch simulates satellite telemetry and analyzes:

* Temperature
* Battery voltage
* Power consumption
* Gyroscope X, Y and Z
* Signal strength

The telemetry is passed through a trained Isolation Forest model, which produces an anomaly score and system risk level.

---

## How It Works

```text
Satellite Telemetry
        |
        v
Telemetry Simulation
        |
        v
Feature Processing
        |
        v
Isolation Forest
        |
        v
Anomaly Score
        |
        v
Risk Assessment
        |
        v
Mission Control Dashboard
```

---

## Machine Learning

### Algorithm

**Isolation Forest**

Isolation Forest is an unsupervised learning algorithm designed for anomaly detection.

It works by isolating unusual observations from normal observations using randomized decision trees.

This makes it suitable for simulated spacecraft telemetry where large labeled datasets of real satellite failures are not readily available.

### Model Pipeline

```text
Telemetry Dataset
       |
       v
StandardScaler
       |
       v
Isolation Forest
       |
       v
Anomaly Detection
```

The trained model is saved as `model.pkl` and loaded by the FastAPI backend during runtime.

---

## Tech Stack

### Machine Learning

* Python
* Scikit-learn
* NumPy
* Pandas
* Joblib

### Backend

* FastAPI
* Pydantic
* Uvicorn

### Frontend

* React
* Vite
* JavaScript
* CSS

### API

* REST API
* JSON

---

## Project Structure

```text
OrbitWatch/
│
├── backend/
│   ├── main.py
│   ├── train.py
│   ├── generate_data.py
│   ├── model.pkl
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Features

* Real-time simulated satellite telemetry
* Machine learning based anomaly detection
* Isolation Forest inference
* Anomaly scoring
* 0–100 risk assessment
* Satellite health monitoring
* FastAPI REST API
* Interactive mission-control style dashboard
* Live telemetry updates

---

## API Endpoints

### Health Check

```http
GET /health
```

Returns the backend and ML model status.

### Telemetry

```http
GET /telemetry
```

Generates simulated satellite telemetry.

### Prediction

```http
POST /predict
```

Accepts telemetry values and returns the ML anomaly prediction.

Example request:

```json
{
  "temperature": 40,
  "battery_voltage": 18.5,
  "power_consumption": 60,
  "gyro_x": 0.1,
  "gyro_y": -0.1,
  "gyro_z": 0.05,
  "signal_strength": -70
}
```

Example response:

```json
{
  "status": "NORMAL",
  "severity": "NOMINAL",
  "risk": 12,
  "anomaly_score": 0.15,
  "timestamp": 1789491073
}
```

---

## Running Locally

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/OrbitWatch.git
cd OrbitWatch
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Testing the Model

Normal telemetry should generally produce a low-risk result.

Example abnormal telemetry:

```json
{
  "temperature": 95,
  "battery_voltage": 8,
  "power_consumption": 180,
  "gyro_x": 8,
  "gyro_y": 7,
  "gyro_z": 9,
  "signal_strength": -110
}
```

The model should identify this as an anomalous telemetry pattern and produce a significantly higher risk score.

---

