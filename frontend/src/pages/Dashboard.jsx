import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [paused, setPaused] = useState(false);

  const navigate = useNavigate();

 useEffect(() => {
  if (paused) return;

  const fetchTelemetry = async () => {
    const res = await api.get("/telemetry");
    const d = res.data.data;

    setTelemetry(d);

    setHistory((prev) => [
      ...prev.slice(-7),
      {
        time: new Date().toLocaleTimeString(),
        temperature: d.core.temperature,
        voltage: d.core.voltage,
        battery: d.power.battery,
        power: d.power.power,
      },
    ]);
  };

  fetchTelemetry();
  const interval = setInterval(fetchTelemetry, 1500);

  return () => clearInterval(interval);
}, [paused]);


  // ✅ ONLY NEW FEATURE: LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!telemetry) return <div className="loading">Connecting…</div>;

  return (
    <div className="mc-root">
      {/* Top Bar */}
      <div className="mc-topbar">
        <div className="mc-title">Mission Control Dashboard</div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
  className="pause-btn"
  onClick={() => setPaused((p) => !p)}
>
  {paused ? "▶ RESUME SYSTEM" : "⏸ PAUSE SYSTEM"}
</button>

          <button className="logout-btn" onClick={handleLogout}>
            ⎋ LOG OUT
          </button>
        </div>
      </div>

      <div className="mc-body">
        {/* LEFT PANEL */}
        <div className="mc-left">
          <div className="status-pill critical">
            SYSTEM STATUS: {telemetry.status}
          </div>

          <Section title="CORE">
            <Row
              label="Temperature"
              value={`${telemetry.core.temperature.toFixed(0)} °C`}
            />
            <Row
              label="Voltage"
              value={`${telemetry.core.voltage.toFixed(2)} V`}
            />
            <Row
              label="Current"
              value={`${telemetry.core.current.toFixed(2)} A`}
            />
          </Section>

          <Section title="POWER">
            <Row
              label="Power"
              value={`${telemetry.power.power.toFixed(2)} W`}
            />
            <Row
              label="Battery"
              value={`${telemetry.power.battery.toFixed(0)} %`}
            />
          </Section>

          <Section title="SYSTEM">
            <Row
              label="Signal"
              value={`${telemetry.system.signal.toFixed(0)} dBm`}
            />
            <Row label="Uptime" value={telemetry.system.uptime} />
            <Row label="Health" value={telemetry.system.health} />
            <Row label="Mode" value={telemetry.system.mode} />
          </Section>

          <div className="alerts">
            <div className="alerts-title">Alerts</div>
            <div className="alert-item">High temperature</div>
            <div className="alert-time">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* RIGHT CHARTS */}
        <div className="mc-right">
          <Chart
            title="Temperature (°C)"
            color="#f97316"
            dataKey="temperature"
            data={history}
          />
          <Chart
            title="Voltage (V)"
            color="#38bdf8"
            dataKey="voltage"
            data={history}
          />
          <Chart
            title="Battery Level (%)"
            color="#4ade80"
            dataKey="battery"
            data={history}
          />
          <Chart
            title="Power (W)"
            color="#c084fc"
            dataKey="power"
            data={history}
          />
        </div>
      </div>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const Section = ({ title, children }) => (
  <div className="section">
    <div className="section-title">{title}</div>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div className="row">
    <span className="row-label">{label}</span>
    <span className="row-value">{value}</span>
  </div>
);

const Chart = ({ title, data, dataKey, color }) => (
  <div className="chart-box">
    <div className="chart-title">{title}</div>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="time" hide />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default Dashboard;
