import pandas as pd
import joblib

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

data = pd.read_csv("telemetry.csv")

features = [
    "temperature",
    "battery_voltage",
    "power_consumption",
    "gyro_x",
    "gyro_y",
    "gyro_z",
    "signal_strength"
]

X = data[features]

model = Pipeline([
    ("scaler", StandardScaler()),
    (
        "isolation_forest",
        IsolationForest(
            n_estimators=200,
            contamination=0.05,
            random_state=42
        )
    )
])

model.fit(X)

joblib.dump(
    {
        "model": model,
        "features": features
    },
    "model.pkl"
)

print("OrbitWatch ML model trained.")