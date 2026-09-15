import numpy as np
import pandas as pd

np.random.seed(42)

n = 2000

temperature = np.random.normal(40, 5, n)
battery_voltage = np.random.normal(18.5, 0.7, n)
power_consumption = np.random.normal(60, 8, n)

gyro_x = np.random.normal(0, 0.25, n)
gyro_y = np.random.normal(0, 0.25, n)
gyro_z = np.random.normal(0, 0.25, n)

signal_strength = np.random.normal(-70, 8, n)

data = pd.DataFrame({
    "temperature": temperature,
    "battery_voltage": battery_voltage,
    "power_consumption": power_consumption,
    "gyro_x": gyro_x,
    "gyro_y": gyro_y,
    "gyro_z": gyro_z,
    "signal_strength": signal_strength
})

# Inject abnormal telemetry
anomaly_indices = np.random.choice(n, 100, replace=False)

data.loc[anomaly_indices, "temperature"] += np.random.uniform(20, 35, 100)
data.loc[anomaly_indices, "power_consumption"] += np.random.uniform(30, 60, 100)
data.loc[anomaly_indices, "signal_strength"] -= np.random.uniform(20, 40, 100)

data.to_csv("telemetry.csv", index=False)

print("Telemetry dataset generated.")