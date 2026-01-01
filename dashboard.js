// ===== IMPORTS (MUST BE AT TOP) =====
import { dailyLogs } from "./data/dailyLogs.js";

// ===== DEBUG (SAFE TO KEEP FOR NOW) =====
console.log("Dashboard loaded");
console.log("Daily logs:", dailyLogs);

// ===== UTILITIES =====
function getBPCategory(s, d) {
  if (s >= 140 || d >= 90) return "High";
  if (s >= 120 || d >= 80) return "Medium";
  return "Low";
}

// ===== RENDER DAILY SUMMARY =====
export function renderDailySummary(date) {
  const output = document.getElementById("dailySummaryOutput");
  const day = dailyLogs[date];

  if (!day) {
    output.innerHTML = `<div>No data for ${date}</div>`;
    return;
  }

  let html = `<h3>${date}</h3>`;

  // ---- Blood Pressure ----
  html += `<h4>Blood Pressure</h4>`;
  if (day.bloodPressure && day.bloodPressure.length) {
    day.bloodPressure.forEach((bp, i) => {
      const cat = getBPCategory(bp.systolic, bp.diastolic);
      html += `
        <div>
          BP #${i + 1}: ${bp.systolic}/${bp.diastolic}
          HR: ${bp.heartRate ?? "—"}
          (${cat})
        </div>`;
    });
  } else {
    html += `<div>No BP recorded</div>`;
  }

  // ---- Glucose ----
  html += `<h4>Glucose</h4>`;
  if (day.glucose && day.glucose.length) {
    day.glucose.forEach(g => {
      html += `<div>${g.value ?? g} mmol/L</div>`;
    });
  } else {
    html += `<div>No glucose recorded</div>`;
  }

  // ---- Activity ----
  html += `<h4>Activity</h4>
    <div>Walk: ${day.walk ?? 0} min</div>
    <div>Treadmill: ${day.treadmill ?? 0} min</div>
    <div>Strength: ${day.strength ?? 0}</div>
    <div>Calories: ${day.calories ?? 0}</div>
    <div>Avg HR: ${day.heartRate ?? "—"}</div>
  `;

  output.innerHTML = html;
}

// ===== INIT =====
const picker = document.getElementById("datePicker");
const today = Object.keys(dailyLogs).sort().at(-1);

picker.value = today;
renderDailySummary(today);

picker.addEventListener("change", e => {
  renderDailySummary(e.target.value);
});
