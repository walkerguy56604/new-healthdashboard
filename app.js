// Baseline for comparison (October 29, 2024)
const baselineDate = "2024-10-29";

// Helper to determine BP category
function getBPCategory(systolic, diastolic) {
  if (systolic >= 140 || diastolic >= 90) return "H"; // High
  if (systolic >= 120 || diastolic >= 80) return "M"; // Medium
  return "L"; // Low / Normal
}

// Helper to get color for BP category
function getBPColor(category) {
  switch(category) {
    case "H": return "red";
    case "M": return "orange";
    case "L": return "green";
    default: return "black";
  }
}

// Render daily summary
function renderDailySummary(date) {
  const dailySummaryOutput = document.getElementById('dailySummaryOutput');
  const summary = dailyLogs[date] || { bloodPressure: [], glucose: [] };
  const baseline = dailyLogs[baselineDate] || { bloodPressure: [], glucose: [] };

  let html = `<h3>Daily Summary for ${date}</h3>`;

  // Blood Pressure Section
  if (summary.bloodPressure.length > 0) {
    html += `<h4>Blood Pressure</h4>`;
    summary.bloodPressure.forEach((bp, idx) => {
      const category = getBPCategory(bp.systolic, bp.diastolic);
      html += `<div style="color:${getBPColor(category)}">
        BP #${idx + 1}: ${bp.systolic}/${bp.diastolic} mmHg, HR: ${bp.heartRate} ${bp.note ? "(" + bp.note + ")" : ""} - ${category} hypertension
      </div>`;
    });

    // Optional: compare to baseline (first BP)
    if (baseline.bloodPressure.length > 0) {
      const baseBP = baseline.bloodPressure[0];
      html += `<div style="margin-top:5px; font-style:italic; color:blue;">
        Comparison to ${baselineDate}: First BP was ${baseBP.systolic}/${baseBP.diastolic} mmHg
      </div>`;
    }
  } else {
    html += `<div>No blood pressure readings</div>`;
  }

  // Glucose Section
  if (summary.glucose.length > 0) {
    html += `<h4>Glucose</h4>`;
    summary.glucose.forEach((g, idx) => {
      if (typeof g === "object") {
        html += `<div>Glucose #${idx + 1}: ${g.value} mmol/L (Time: ${g.time})</div>`;
      } else {
        html += `<div>Glucose #${idx + 1}: ${g} mmol/L</div>`;
      }
    });
  } else {
    html += `<div>No glucose readings</div>`;
  }

  dailySummaryOutput.innerHTML = html;
}

// History list logic
const historyList = document.getElementById('historyList');
const datePicker = document.getElementById('datePicker');

datePicker.addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  renderDailySummary(selectedDate);

  // Add button to history if it doesn't exist
  if (![...historyList.children].some(btn => btn.dataset.date === selectedDate)) {
    const btn = document.createElement('button');
    btn.textContent = selectedDate;
    btn.dataset.date = selectedDate;
    btn.addEventListener('click', () => renderDailySummary(selectedDate));
    historyList.prepend(btn); // newest on top
  }
});
// =======================
// CSV Export
// =======================
function convertDailyLogToCSV(date) {
  const summary = dailyLogs[date];
  if (!summary) return null;

  let csv = "Type,Value,Time,Note\n";

  // Blood Pressure
  summary.bloodPressure.forEach((bp, idx) => {
    csv += `BP,${bp.systolic}/${bp.diastolic},${bp.heartRate || ""},${bp.note || ""}\n`;
  });

  // Glucose
  summary.glucose.forEach((g, idx) => {
    if (typeof g === "object") {
      csv += `Glucose,${g.value},${g.time || ""},${g.note || ""}\n`;
    } else {
      csv += `Glucose,${g},,,\n`;
    }
  });

  return csv;
}

function downloadCSV(csv, date) {
  if (!csv) return;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `HealthDashboard_${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Add export button dynamically
function addExportButton(date) {
  const dailySummaryOutput = document.getElementById('dailySummaryOutput');
  let existingBtn = document.getElementById("exportCSVButton");
  if (existingBtn) existingBtn.remove();

  const btn = document.createElement("button");
  btn.id = "exportCSVButton";
  btn.textContent = "Export CSV for Doctors";
  btn.style.marginTop = "10px";
  btn.addEventListener("click", () => {
    const csv = convertDailyLogToCSV(date);
    if (csv) downloadCSV(csv, date);
    else alert("No data to export for this date.");
  });

  dailySummaryOutput.appendChild(btn);
}

// Hook export button whenever a date is selected
datePicker.addEventListener("change", (e) => {
  const selectedDate = e.target.value;
  addExportButton(selectedDate);
});
