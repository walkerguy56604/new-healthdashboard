console.log("✅ dashboard.js loaded");

const dailyLogs = {
  "2026-01-02": {
    walk: 0,
    treadmill: 2,
    strength: 29,
    calories: 22,
    heartRate: 92
  },
  "2026-01-03": {
    walk: 5,
    treadmill: 0,
    strength: 0,
    calories: 0,
    heartRate: null
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const out = document.getElementById("dailySummaryOutput");

  out.innerHTML = `
    <h3>2026-01-03</h3>
    <div>Walk: ${dailyLogs["2026-01-03"].walk} min</div>
    <div>Treadmill: ${dailyLogs["2026-01-03"].treadmill}</div>
    <div>Strength: ${dailyLogs["2026-01-03"].strength}</div>
    <div>Calories: ${dailyLogs["2026-01-03"].calories}</div>
    <div>Avg HR: ${dailyLogs["2026-01-03"].heartRate ?? "—"}</div>
  `;
});
