// =======================
// Imports
// =======================
import { dailyLogs } from "./dailylogs.js";

// =======================
// DOM Ready Guard
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const datePicker = document.getElementById("datePicker");
  const output = document.getElementById("dailySummaryOutput");

  if (!datePicker) {
    output.innerHTML = "❌ datePicker element not found";
    return;
  }

  const dates = Object.keys(dailyLogs || {}).sort();

  if (!dates.length) {
    output.innerHTML = "❌ dailyLogs loaded but contains no dates";
    return;
  }

  // Populate dropdown
  dates.forEach(date => {
    const opt = document.createElement("option");
    opt.value = date;
    opt.textContent = date;
    datePicker.appendChild(opt);
  });

  // Render function
  function render(date) {
    const d = dailyLogs[date];
    if (!d) {
      output.innerHTML = `<h3>${date}</h3><div>No data</div>`;
      return;
    }

    output.innerHTML = `
      <h3>${date}</h3>
      <div><strong>Walk:</strong> ${d.walk ?? 0} min</div>
      <div><strong>Strength:</strong> ${d.strength ?? 0} min</div>
      <div><strong>Calories:</strong> ${d.calories ?? "—"}</div>
      <div><strong>Avg HR:</strong> ${d.heartRate ?? "—"}</div>
    `;
  }

  // Initial render
  render(dates[0]);

  // Change handler
  datePicker.addEventListener("change", e => {
    render(e.target.value);
  });
});
