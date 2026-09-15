import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [scanning, setScanning] = useState(false);

  const analyze = async () => {
    try {
      setScanning(true);

      const telemetryResponse = await fetch(`${API}/telemetry`);
      const telemetryData = await telemetryResponse.json();

      setTelemetry(telemetryData);

      const predictionResponse = await fetch(`${API}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telemetryData),
      });

      const predictionData = await predictionResponse.json();

      setPrediction(predictionData);

      setHistory((previous) => [
        ...previous.slice(-7),
        {
          value: predictionData.risk,
          status: predictionData.status,
        },
      ]);

      setTimeout(() => setScanning(false), 500);
    } catch (error) {
      console.error(error);
      setScanning(false);
    }
  };

  useEffect(() => {
    analyze();

    const interval = setInterval(analyze, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!telemetry || !prediction) {
    return (
      <div className="loading">
        <div className="crawl">
          ORBITWATCH
        </div>
        <p>ESTABLISHING DEEP SPACE TELEMETRY LINK...</p>
      </div>
    );
  }

  return (
    <div className="app">

      <header className="topbar">

        <div className="brand">
          <div className="logo">OW</div>

          <div>
            <h1>ORBITWATCH</h1>
            <span>SPACECRAFT TELEMETRY INTELLIGENCE</span>
          </div>
        </div>

        <div className="mission-info">
          <div>
            <small>VESSEL</small>
            <strong>OW–01</strong>
          </div>

          <div>
            <small>MISSION</small>
            <strong>DEEP SPACE</strong>
          </div>

          <div className="live">
            <i></i>
            LIVE
          </div>
        </div>

      </header>

      <main>

        <section className="hero">

          <div>
            <p className="eyebrow">
              DEEP SPACE TELEMETRY SYSTEM
            </p>

            <h2>
              SYSTEM
              <br />
              <span>MONITORING</span>
            </h2>

            <p className="description">
              Machine-learning powered anomaly detection
              for spacecraft telemetry.
            </p>
          </div>

          <div className="system-status">

            <div className="status-ring">
              <div>
                <strong>{prediction.risk}%</strong>
                <span>RISK</span>
              </div>
            </div>

            <div>
              <small>SYSTEM STATUS</small>

              <h3
                className={
                  prediction.status === "ANOMALY"
                    ? "danger"
                    : "normal"
                }
              >
                {prediction.status}
              </h3>

              <p>
                {prediction.severity}
              </p>
            </div>

          </div>

        </section>


        <section className="telemetry-grid">

          <Metric
            label="THERMAL"
            value={telemetry.temperature}
            unit="°C"
            warning={telemetry.temperature > 55}
          />

          <Metric
            label="BATTERY"
            value={telemetry.battery_voltage}
            unit="V"
            warning={telemetry.battery_voltage < 17}
          />

          <Metric
            label="POWER DRAW"
            value={telemetry.power_consumption}
            unit="W"
            warning={telemetry.power_consumption > 85}
          />

          <Metric
            label="SIGNAL"
            value={telemetry.signal_strength}
            unit="dBm"
            warning={telemetry.signal_strength < -90}
          />

        </section>


        <section className="dashboard-grid">

          <div className="panel">

            <div className="panel-header">
              <span>TELEMETRY STREAM</span>
              <span>LIVE FEED</span>
            </div>

            <div className="chart">

              {history.map((item, index) => (
                <div
                  key={index}
                  className={`bar ${
                    item.status === "ANOMALY"
                      ? "bar-danger"
                      : ""
                  }`}
                  style={{
                    height: `${Math.max(
                      item.value + 8,
                      12
                    )}%`,
                  }}
                />
              ))}

              <div className="chart-line"></div>

            </div>

            <div className="chart-labels">
              <span>−30s</span>
              <span>−20s</span>
              <span>−10s</span>
              <span>NOW</span>
            </div>

          </div>


          <div className="panel">

            <div className="panel-header">
              <span>ML ANALYSIS</span>
              <span>ISOLATION FOREST</span>
            </div>

            <div className="ml-score">

              <div>
                <small>ANOMALY SCORE</small>

                <strong>
                  {prediction.anomaly_score}
                </strong>
              </div>

              <div>
                <small>MODEL</small>

                <strong>
                  ISOLATION FOREST
                </strong>
              </div>

            </div>

            <div className="model-description">
              Unsupervised anomaly detection identifies
              telemetry observations that deviate from
              learned spacecraft operating patterns.
            </div>

          </div>

        </section>


        <section className="lower-grid">

          <div className="panel">

            <div className="panel-header">
              <span>ATTITUDE TELEMETRY</span>
              <span>DEGREES / SEC</span>
            </div>

            <div className="gyro-grid">

              <Gyro
                name="GYRO X"
                value={telemetry.gyro_x}
              />

              <Gyro
                name="GYRO Y"
                value={telemetry.gyro_y}
              />

              <Gyro
                name="GYRO Z"
                value={telemetry.gyro_z}
              />

            </div>

          </div>


          <div className="panel event-panel">

            <div className="panel-header">
              <span>MISSION LOG</span>
              <span>RECENT EVENTS</span>
            </div>

            <div className="event">
              <i></i>
              <span>Telemetry packet received</span>
              <time>NOW</time>
            </div>

            <div className="event">
              <i></i>
              <span>Isolation Forest inference complete</span>
              <time>NOW</time>
            </div>

            <div className="event">
              <i></i>
              <span>
                {prediction.status === "ANOMALY"
                  ? "Anomaly detected"
                  : "Operating parameters nominal"}
              </span>
              <time>NOW</time>
            </div>

          </div>

        </section>


        <button
          className={`scan-button ${
            scanning ? "scanning" : ""
          }`}
          onClick={analyze}
        >
          {scanning
            ? "ANALYZING TELEMETRY..."
            : "RUN ML DIAGNOSTIC"}
        </button>

      </main>

      <footer>
        ORBITWATCH // AUTONOMOUS TELEMETRY ANALYSIS SYSTEM
        <span>ML ENGINE ONLINE</span>
      </footer>

    </div>
  );
}


function Metric({ label, value, unit, warning }) {

  return (
    <div className={`metric ${warning ? "warning" : ""}`}>

      <div className="metric-top">
        <span>{label}</span>

        <i className="indicator"></i>
      </div>

      <strong>
        {value}
        <small>{unit}</small>
      </strong>

      <div className="metric-line"></div>

    </div>
  );
}


function Gyro({ name, value }) {

  return (
    <div className="gyro">

      <span>{name}</span>

      <strong>
        {value.toFixed(3)}
      </strong>

      <div className="gyro-bar">
        <div
          style={{
            width: `${Math.min(
              Math.abs(value) * 30 + 5,
              100
            )}%`,
          }}
        />
      </div>

    </div>
  );
}


export default App;