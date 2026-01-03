// =======================
// Import Daily Logs
// =======================
import { dailyLogs } from './data/dailyLogs.js'; // make sure this path matches your setup

// =======================
// Helpers
// =======================
function getBPCategory(s, d) {
  if (s >= 140 || d >= 90) return "H";
  if (s >= 120 || d >= 80) return "M";
  return "L";
}

function getBPColor(cat) {
  return cat === "H" ? "red" : cat === "M" ? "orange" : "green";
}

function getLastNDates(endDate, n) {
  const allDates = Object.keys(dailyLogs).sort();
  const idx = allDates.indexOf(endDate);
  if (idx === -1) return [];
  return allDates.slice(Math.max(0, idx - n + 1), idx + 1);
}

function get7DayRolling(date) {
  const windowDates = getLastNDates(date, 7);
  let sums = { sys: 0, dia: 0, bpCount: 0, glucose: 0, glucoseCount: 0, walk: 0, treadmill: 0, strength: 0, calories: 0, heartRate: 0, hrCount: 0 };
  
  windowDates.forEach(d => {
    const day = dailyLogs[d];
    if (!day) return;
    
    day.bloodPressure.forEach(bp => { sums.sys += bp.systolic; sums.dia += bp.diastolic; sums.bpCount++; });
    day.glucose.forEach(g => { sums.glucose += g.value !== undefined ? g.value : g; sums.glucoseCount++; });
    sums.walk += day.walk || 0;
    if (Array.isArray(day.treadmill)) day.treadmill.forEach(t => sums.treadmill += t.distance || 0);
    sums.strength += day.strength || 0;
    sums.calories += day.calories || 0;
    if (day.heartRate !== undefined && day.heartRate !== null) { sums.heartRate += day.heartRate; sums.hrCount++; }
  });

  return {
    bpSys: sums.bpCount ? (sums.sys / sums.bpCount).toFixed(1) : "—",
    bpDia: sums.bpCount ? (sums.dia / sums.bpCount).toFixed(1) : "—",
    glucose: sums.glucoseCount ? (sums.glucose / sums.glucoseCount).toFixed(1) : "—",
    walk: sums.walk,
    treadmill: sums.treadmill,
    strength: sums.strength,
    calories: sums.calories,
    heartRate: sums.hrCount ? (sums.heartRate / sums.hrCount).toFixed(0) : "—"
  };
}

// =======================
// Render Daily Summary
// =======================
export function renderDailySummary(date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];
  if (!d) { out.innerHTML = `<div>No data for ${date}</div>`; return; }

  let html = `<h3>${date}</h3><h4>Blood Pressure</h4>`;
  if (d.bloodPressure.length) {
    d.bloodPressure.forEach((bp, i) => {
      const cat = getBPCategory(bp.systolic, bp.diastolic);
      const catText = cat === "H" ? "High" : cat === "M" ? "Medium" : "Low";
      html += `<div style="color:${getBPColor(cat)}">BP #${i+1}: ${bp.systolic}/${bp.diastolic} HR:${bp.heartRate} (${catText})${bp.note ? " – " + bp.note : ""}</div>`;
    });
  } else html += "<div>No BP recorded</div>";

  html += `<h4>Glucose</h4>`;
  if (d.glucose.length) {
    d.glucose.forEach(g => html += `<div>${g.value !== undefined ? g.value : g} mmol/L${g.time ? " (" + g.time + ")" : ""}</div>`);
  } else html += "<div>No glucose</div>";

  html += `<h4>Activity</h4>
    <div>Walk: ${d.walk || 0} min</div>
    <div>Treadmill: ${
      Array.isArray(d.treadmill) && d.treadmill.length
        ? d.treadmill.map(t => `${t.distance} km (${t.calories} cal)`).join(", ")
        : 0
    }</div>
    <div>Strength: ${d.strength || 0} min</div>
    <div>Calories: ${d.calories || 0}</div>
    <div>Avg HR: ${d.heartRate !== null && d.heartRate !== undefined ? d.heartRate : "—"}</div>`;

  // Optional notes
  if (d.notes && d.notes.length) {
    html += `<h4>Notes</h4><ul>`;
    d.notes.forEach(note => html += `<li>${note}</li>`);
    html += `</ul>`;
  }

  const r = get7DayRolling(date);
  html += `<h4>7-Day Rolling Averages</h4>
    <div>BP: ${r.bpSys}/${r.bpDia}</div>
    <div>Glucose: ${r.glucose}</div>
    <div>Walk: ${r.walk}</div>
    <div>Treadmill: ${r.treadmill}</div>
    <div>Strength: ${r.strength}</div>
    <div>Calories: ${r.calories}</div>
    <div>Avg HR: ${r.heartRate}</div>`;

  out.innerHTML = html;
}

// =======================
// Initialize
// =======================
window.renderDailySummary = renderDailySummary;

// Example: render today's summary
const today = new Date().toISOString().split('T')[0];
if (!dailyLogs[today]) dailyLogs[today] = { bloodPressure: [], glucose: [], walk:0, treadmill:[], strength:0, calories:0, heartRate:null, notes:[] };
renderDailySummary(today);
