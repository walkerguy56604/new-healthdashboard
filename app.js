console.log("Health Dashboard 3 is alive 👊");

// Example in-memory data
const healthHistory = {
  "2025-12-30": {
    walks: [{duration: 5, distance: 0.2, avgHR: 107, calories: 12}],
    treadmill: [{duration: 10, distance: 0.24, avgHR: 115, calories: 11}],
    strength: [
      {exercises: [{name:"biceps", sets:3, reps:10}, {name:"laterals", sets:3, reps:10}]}
    ],
    bp: [
      {time: "10:15", systolic: 128, diastolic: 65, pulse: 92, category: "M Hypertension"},
      {time: "10:25", systolic: 130, diastolic: 68, pulse: 95, category: "M Hypertension"}
    ]
  },
  "2025-12-29": {
    walks: [{duration: 10, distance: 0.24, avgHR: 110, calories: 12}],
    treadmill: [],
    strength: [],
    bp: [{time: "08:30", systolic: 126, diastolic: 69, pulse: 90, category: "M Hypertension"}]
  }
};

// --- Render daily summary ---
function renderDailySummary(date) {
  const dashboard = document.getElementById("dailySummaryOutput");
  dashboard.innerHTML = ""; // clear previous content

  const dayData = healthHistory[date];
  if (!dayData) {
    dashboard.innerHTML = `<p>No data for ${date}</p>`;
    return;
  }

  dashboard.appendChild(createDiv(`Daily Summary for ${date}`, true));

  // Walks
  let totalWalkDuration = 0;
  let totalWalkDistance = 0;
  dayData.walks.forEach(w => { totalWalkDuration += w.duration; totalWalkDistance += w.distance || 0; });
  dashboard.appendChild(createDiv(`Walk Duration: ${totalWalkDuration} min (${totalWalkDistance.toFixed(2)} km)`));

  // Treadmill
  let totalTreadmillDuration = 0;
  let totalTreadmillDistance = 0;
  dayData.treadmill.forEach(t => { totalTreadmillDuration += t.duration; totalTreadmillDistance += t.distance || 0; });
  dashboard.appendChild(createDiv(`Treadmill Duration: ${totalTreadmillDuration} min (${totalTreadmillDistance.toFixed(2)} km)`));

  // Strength
  let totalReps = 0;
  dayData.strength.forEach(s => { s.exercises.forEach(ex => totalReps += ex.sets * ex.reps); });
  dashboard.appendChild(createDiv(`Strength Duration: ${totalReps} reps (${dayData.strength.length} exercises)`));

  // Blood Pressure - multiple readings
  if (dayData.bp.length > 0) {
    dashboard.appendChild(createDiv("Blood Pressure Readings:", true));
    dayData.bp
      .sort((a,b) => a.time.localeCompare(b.time)) // sort by time
      .forEach((bp, i) => {
        dashboard.appendChild(createDiv(`BP ${i+1} [${bp.time}]: ${bp.systolic}/${bp.diastolic}/${bp.pulse} ${bp.category}`));
      });
  }

  // Calories and Average HR
  let totalCalories = 0, hrSum = 0, hrCount = 0;
  dayData.walks.concat(dayData.treadmill).forEach(act => {
    if (act.calories) totalCalories += act.calories;
    if (act.avgHR) { hrSum += act.avgHR; hrCount++; }
  });
  dashboard.appendChild(createDiv(`Calories Burned: ${totalCalories}`));
  dashboard.appendChild(createDiv(`Average Heart Rate: ${hrCount ? Math.round(hrSum / hrCount) : "N/A"}`));
}

// --- Helper to create div ---
function createDiv(text, bold=false) {
  const div = document.createElement("div");
  div.textContent = text;
  if (bold) div.style.fontWeight = "bold";
  return div;
}

// --- Date picker listener ---
document.addEventListener("DOMContentLoaded", () => {
  const datePicker = document.getElementById("datePicker");

  // Default to today if data exists
  const today = new Date().toISOString().split("T")[0];
  datePicker.value = today;
  renderDailySummary(today);

  // Update dashboard when date changes
  datePicker.addEventListener("change", (e) => {
    renderDailySummary(e.target.value);
  });
});
