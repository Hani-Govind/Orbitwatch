from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import joblib
import numpy as np
import random
import time




app = FastAPI(
    title="OrbitWatch",
    description="Satellite telemetry anomaly detection API",
    version="1.0.0"
)




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



model_data = joblib.load("model.pkl")

model = model_data["model"]
features = model_data["features"]


class Telemetry(BaseModel):
    temperature: float
    battery_voltage: float
    power_consumption: float
    gyro_x: float
    gyro_y: float
    gyro_z: float
    signal_strength: float


@app.get("/")
def root():
    return {
        "system": "ORBITWATCH",
        "status": "ONLINE"
    }



@app.get("/health")
def health():
    return {
        "status": "operational",
        "model": "Isolation Forest",
        "model_loaded": True
    }




@app.get("/telemetry")
def generate_telemetry():

    telemetry = Telemetry(
        temperature=round(random.gauss(40, 4), 2),
        battery_voltage=round(random.gauss(18.5, 0.5), 2),
        power_consumption=round(random.gauss(60, 7), 2),
        gyro_x=round(random.gauss(0, 0.2), 3),
        gyro_y=round(random.gauss(0, 0.2), 3),
        gyro_z=round(random.gauss(0, 0.2), 3),
        signal_strength=round(random.gauss(-70, 6), 2)
    )

    return telemetry


@app.post("/predict")
def predict(telemetry: Telemetry):

    # Convert telemetry into the same feature order
    # used while training the model.

    values = np.array([
        [
            telemetry.temperature,
            telemetry.battery_voltage,
            telemetry.power_consumption,
            telemetry.gyro_x,
            telemetry.gyro_y,
            telemetry.gyro_z,
            telemetry.signal_strength
        ]
    ])


    prediction = model.predict(values)[0]


    anomaly_score = model.decision_function(values)[0]


    risk = int(
        np.clip(
            (0.20 - anomaly_score) / 0.40 * 100,
            0,
            100
        )
    )



    if prediction == -1 or risk >= 75:

        status = "CRITICAL"
        severity = "HIGH"

    elif risk >= 45:

        status = "WARNING"
        severity = "MEDIUM"

    else:

        status = "NORMAL"
        severity = "NOMINAL"


    return {
        "status": status,
        "severity": severity,
        "risk": risk,
        "anomaly_score": round(float(anomaly_score), 4),
        "timestamp": int(time.time())
    }