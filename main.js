// =======================
// Config
// =======================

// If you're testing locally, keep the relative path:
const DATA_URL = "./dailylogs.json";

// If hosted remotely (GitHub raw), it could be like:
// const DATA_URL = "https://raw.githubusercontent.com/yourusername/yourrepo/main/dailylogs.json";

let dailyLogs = {};

// =======================
// Load JSON Data
// =======================
async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Failed to load JSON: ${res.status}`);
    dailyLogs = await res.json();

    populateDatePicker();
  } catch (err) {
    console.error(err);
    const out = document.getElementById("dailySummaryOutput");
    out.innerHTML = "<p style='color:red'>Error loading data</p>";
  }
}

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
    render(picker.value);
  }
}

// =======================
// Render Dashboard
// =======================
function render(date) {
  const out = document.getElementById("dailySummaryOutput");
  const d = dailyLogs[date];

  if (!d) {
    out.innerHTML = "<p>No data for this date</p>";
    return;
  }

  out.innerHTML = `
    <h3>${date}</h3>

    <div><b>Walk:</b> ${d.walk} min</div>
    <div><b>Strength:</b> ${d.strength} min</div>
    <div><b>Treadmill:</b> ${d.treadmill} min</div>
    <div><b>Calories:</b> ${d.calories}</div>
    <div><b>Heart Rate:</b> ${d.heartRate ?? "—"}</div>

    <h4>Blood Pressure</h4>
    ${
      d.bloodPressure.length
        ? d.bloodPressure
            .map(bp => `${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) – ${bp.note}`)
            .join("<br>")
        : "No BP readings"
    }

    <h4>Notes</h4>
    ${
      d.notes.length
        ? d.notes.map(n => `• ${n}`).join("<br>")
        : "No notes"
    }
  `;
}

// =======================
// Event Listener
// =======================
document.getElementById("datePicker")
  .addEventListener("change", e => render(e.target.value));

// =======================
// Initialize
// =======================
loadData();
