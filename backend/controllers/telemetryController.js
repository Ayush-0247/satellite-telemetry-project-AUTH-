export const getTelemetry = async (req, res) => {
  try {
    const telemetry = {
      status: "CRITICAL",

      core: {
        temperature: 65 + Math.random() * 5,   // °C
        voltage: 1.55 + Math.random() * 5,  // V
        current: 0.45 + Math.random() * 0.1,  // A
      },

      power: {
        power: 0.7 + Math.random() * 10,     // W
        battery: 30 + Math.random() * 10,     // %
      },

      system: {
        signal: -65 + Math.random() * 5,      // dBm
        uptime: "0 s",
        health: 85,
        mode: "ACTIVE",
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
