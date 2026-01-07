// =======================
// main.js - Dynamic Health Dashboard
// =======================

// =======================
// Daily Logs Data
// =======================
const dailyLogs = {
  "2026-01-02": { walk: 0, strength: 29, treadmill: 20, calories: 22, heartRate: 92, weight: 70, glucose: 95, sleep: 7, HRV: 55, mood: "😊", bloodPressure: [ { systolic: 127, diastolic: 57, heartRate: 91, note: "Post AM strength" }, { systolic: 128, diastolic: 72, heartRate: 97, note: "Post treadmill" }, { systolic: 136, diastolic: 67, heartRate: 93, note: "Post PM strength" }, { systolic: 116, diastolic: 64, heartRate: 92, note: "Post PM treadmill" } ], notes: [] },
  "2026-01-03": { walk: 5, strength: 0, treadmill: 0, calories: 0, heartRate: null, weight: 70, glucose: 92, sleep: 6.5, HRV: 57, mood: "😐", bloodPressure: [], notes: ["Morning 5-minute walk, non-Siri"] },
  "2026-01-04": { walk: 35, strength: 30, treadmill: 10, calories: 12, heartRate: 102, weight: 71, glucose: 99, sleep: 8, HRV: 60, mood: "😄", bloodPressure: [{ systolic: 132, diastolic: 80, heartRate: 66, note: "Post strength training" }], notes: ["Morning Siri walk", "Afternoon treadmill"] },
  "2026-01-05": { walk: 10, strength: 18, treadmill: 10, calories: 160, heartRate: 85, weight: 70.5, glucose: 97, sleep: 7.5, HRV: 58, mood: "😊", bloodPressure: [ { systolic: 139, diastolic: 70, heartRate: 84, note: "Post strength" }, { systolic: 131, diastolic: 67, heartRate: 85, note: "Post treadmill" } ], notes: ["Morning Siri walk", "Morning non-Siri walk"] }
};

// =======================
// Populate Date Picker
// =======================
function populateDatePicker() {
  const picker = document.getElementById("datePicker");
  picker.innerHTML = "";
  const dates = Object.keys(dailyLogs).sort();
  dates.forEach(date => {
    const opt = document.createElement("option");
    opt.value = date;
    opt.textContent = date;
    picker.appendChild(opt);
  });
  if (dates.length > 0) {
    picker.value = dates[dates.length - 1];
    render(dates[dates.length - 1]);
    renderCharts();
  }
}

// =======================
// Render Daily Summary
// =======================
function render(date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];
  if (!d) {
    out.innerHTML = "<p>No data</p>";
    return;
  }

  out.innerHTML = `
    <h3>${date}</h3>
    <div style="color: green;"><b>Walk:</b> ${d.walk} min</div>
    <div style="color: green;"><b>Strength:</b> ${d.strength} min</div>
    <div style="color: green;"><b>Treadmill:</b> ${d.treadmill} min</div>
    <div style="color: green;"><b>Calories:</b> ${d.calories}</div>
    <div><b>Heart Rate:</b> ${d.heartRate ?? "—"}</div>
    <div style="color: orange;"><b>Weight:</b> ${d.weight} kg</div>
    <div style="color: red;"><b>Glucose:</b> ${d.glucose} mg/dL</div>
    <div style="color: cyan;"><b>Sleep:</b> ${d.sleep} hrs</div>
    <div style="color: purple;"><b>HRV:</b> ${d.HRV}</div>
    <div style="color: pink;"><b>Mood:</b> ${d.mood}</div>

    <h4 style="color: blue;">Blood Pressure</h4>
    ${d.bloodPressure.length ? d.bloodPressure.map(bp => `${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) – ${bp.note}`).join("<br>") : "No BP readings"}

    <h4>Notes</h4>
    ${d.notes.length ? d.notes.map(n => `• ${n}`).join("<br>") : "No notes"}
  `;
}

// =======================
// Render Charts
// =======================
function renderCharts() {
  const dates = Object.keys(dailyLogs).sort();
  const walks = dates.map(d => dailyLogs[d].walk);
  const strengths = dates.map(d => dailyLogs[d].strength);
  const treadmills = dates.map(d => dailyLogs[d].treadmill);
  const calories = dates.map(d => dailyLogs[d].calories);
  const weights = dates.map(d => dailyLogs[d].weight);
  const glucoses = dates.map(d => dailyLogs[d].glucose);
  const sleeps = dates.map(d => dailyLogs[d].sleep);
  const HRVs = dates.map(d => dailyLogs[d].HRV);

  // Remove old canvas if exists
  const oldCanvas = document.getElementById("dashboardChart");
  if (oldCanvas) oldCanvas.remove();

  const canvas = document.createElement("canvas");
  canvas.id = "dashboardChart";
  document.getElementById("chartsOutput").appendChild(canvas);

  new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        { label: "Walk (min)", data: walks, borderColor: "green", fill: false },
        { label: "Strength (min)", data: strengths, borderColor: "darkgreen", fill: false },
        { label: "Treadmill (min)", data: treadmills, borderColor: "lightgreen", fill: false },
        { label: "Calories", data: calories, borderColor: "lime", fill: false },
        { label: "Weight (kg)", data: weights, borderColor: "orange", fill: false },
        { label: "Glucose (mg/dL)", data: glucoses, borderColor: "red", fill: false },
        { label: "Sleep (hrs)", data: sleeps, borderColor: "cyan", fill: false },
        { label: "HRV", data: HRVs, borderColor: "purple", fill: false }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// =======================
// Event Listeners
// =======================
document.getElementById("datePicker").addEventListener("change", e => {
  render(e.target.value);
});

// =======================
// Initialize
// =======================
populateDatePicker();
