// =======================
// Import Daily Logs
// =======================
import { dailyLogs } from './data/dailyLogs.js';

// =======================
// Helpers
// =======================
function getBPCategory(s, d) {
  if (s >= 140 || d >= 90) return { label: "High", code: "H", color: "red" };
  if (s >= 120 || d >= 80) return { label: "Medium", code: "M", color: "orange" };
  return { label: "Low", code: "L", color: "green" };
}

function safe(val, fallback = "—") {
  return val !== undefined && val !== null ? val : fallback;
}

function getSortedDates() {
  return Object.keys(dailyLogs).sort();
}

function getLastNDates(endDate, n) {
  const dates = getSortedDates();
  const idx = dates.indexOf(endDate);
  if (idx === -1) return [];
  return dates.slice(Math.max(0, idx - n + 1), idx + 1);
}

// =======================
// 7‑Day Rolling Averages
// =======================
function get7DayRolling(date) {
  const windowDates = getLastNDates(date, 7);

  let sums = {
    sys: 0, dia: 0, bpCount: 0,
    glucose: 0, glucoseCount: 0,
    walk: 0, treadmill: 0,
    strength: 0, calories: 0,
    hr: 0, hrCount: 0
  };

  windowDates.forEach(d => {
    const day = dailyLogs[d];
    if (!day) return;

    (day.bloodPressure || []).forEach(bp => {
      sums.sys += bp.systolic;
      sums.dia += bp.diastolic;
      sums.bpCount++;
    });

    (day.glucose || []).forEach(g => {
      sums.glucose += g.value ?? g;
      sums.glucoseCount++;
    });

    sums.walk += day.walk || 0;
    (day.treadmill || []).forEach(t => sums.treadmill += t.distance || 0);
    sums.strength += day.strength || 0;
    sums.calories += day.calories || 0;

    if (day.heartRate !== null && day.heartRate !== undefined) {
      sums.hr += day.heartRate;
      sums.hrCount++;
    }
  });

  return {
    bp: sums.bpCount ? `${(sums.sys/sums.bpCount).toFixed(1)}/${(sums.dia/sums.bpCount).toFixed(1)}` : "—",
    glucose: sums.glucoseCount ? (sums.glucose/sums.glucoseCount).toFixed(1) : "—",
    walk: sums.walk,
    treadmill: sums.treadmill.toFixed(2),
    strength: sums.strength,
    calories: sums.calories,
    hr: sums.hrCount ? Math.round(sums.hr/sums.hrCount) : "—"
  };
}

// =======================
// Render Daily Summary
// =======================
export function renderDailySummary(date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];

  if (!d) {
    out.innerHTML = `<pre>No data for ${date}</pre>`;
    return;
  }

  let html = `<pre>
📅 ${date}

====================
Blood Pressure
====================
`;

  if (d.bloodPressure.length) {
    d.bloodPressure.forEach((bp, i) => {
      const cat = getBPCategory(bp.systolic, bp.diastolic);
      html += `#${i+1}  ${bp.systolic}/${bp.diastolic}  HR:${safe(bp.heartRate)}
Category: ${cat.label}
${bp.note ? "Note: " + bp.note : ""}
\n`;
    });
  } else {
    html += "No BP recorded\n\n";
  }

  html += `====================
Glucose
====================
`;

  if (d.glucose.length) {
    d.glucose.forEach(g => {
      html += `${g.value ?? g} mmol/L ${g.time ? "(" + g.time + ")" : ""}\n`;
    });
  } else {
    html += "No glucose recorded\n\n";
  }

  html += `====================
Activity
====================
Walk: ${safe(d.walk, 0)} min
Treadmill: ${
    Array.isArray(d.treadmill) && d.treadmill.length
      ? d.treadmill.map(t => `${t.distance} km (${t.calories} cal)`).join(", ")
      : "0"
}
Strength: ${safe(d.strength, 0)} min
Calories: ${safe(d.calories, 0)}
Avg HR: ${safe(d.heartRate)}
`;

  if (d.notes && d.notes.length) {
    html += `\n====================
Notes
====================
`;
    d.notes.forEach(n => html += `• ${n}\n`);
  }

  const r = get7DayRolling(date);

  html += `\n====================
7‑Day Rolling Avg
====================
BP: ${r.bp}
Glucose: ${r.glucose}
Walk: ${r.walk}
Treadmill: ${r.treadmill}
Strength: ${r.strength}
Calories: ${r.calories}
Avg HR: ${r.hr}
</pre>`;

  out.innerHTML = html;
}

// =======================
// Date Picker Setup
// =======================
function initDatePicker() {
  const picker = document.getElementById("datePicker");
  if (!picker) return;

  const dates = getSortedDates();
  picker.innerHTML = "";

  dates.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    picker.appendChild(opt);
  });

  picker.value = dates[dates.length - 1];
  picker.addEventListener("change", e => renderDailySummary(e.target.value));
}

// =======================
// Init
// =======================
window.renderDailySummary = renderDailySummary;

document.addEventListener("DOMContentLoaded", () => {
  initDatePicker();
  const today = new Date().toISOString().split("T")[0];
  renderDailySummary(dailyLogs[today] ? today : getSortedDates().slice(-1)[0]);
});
