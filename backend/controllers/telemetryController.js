const getTelemetry = async (req, res) => {
  try {
    const temperature = 65 + Math.random() * 30; // °C (65–95)
    const voltage = 1.55 + Math.random() * 3.5;  // V (1.55–5.05)

    let status = "OK";
//
  
    if (temperature > 85 || voltage < 1.3 || voltage > 4.5) {
      status = "CRITICAL";
    } else if (temperature > 75 || voltage < 1.5 || voltage > 4.2) {
      status = "WARNING";
    }
//
    const telemetry = {
      status,

      core: {
        temperature,      // °C
        voltage,          // V
        current: 0.45 + Math.random() * 0.1, // A
      },

      power: {
        power: 0.7 + Math.random() * 10, // W
        battery: 30 + Math.random() * 10, // %
      },

      system: {
        signal: -65 + Math.random() * 5, // dBm
        uptime: "0 s",
        health:
          status === "CRITICAL"
            ? 40
            : status === "WARNING"
            ? 70
            : 90,
        mode:
          status === "CRITICAL"
            ? "SAFE"
            : "ACTIVE",
      },

      timestamp: new Date(),
    };

    res.status(200).json({
      success: true,
      data: telemetry,
    });
  } catch (error) {
    res.status(500).json({ message: "Telemetry fetch failed" });
  }
};

export default getTelemetry;
