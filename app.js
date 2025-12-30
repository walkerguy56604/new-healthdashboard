console.log("Health Dashboard 3 is alive 👊");

// =======================
// In-memory store
// =======================
const healthData = {
  walks: [],
  treadmill: [],
  strength: [],
  bp: []
};

// =======================
// Timestamp helper
// =======================
function now() {
  return new Date().toISOString();
}

// =======================
// Log activities
// =======================
function logWalk(date, durationMinutes, distanceKm = 0, avgHR = null, maxHR = null, calories = 0, speed = 0) {
  const entry = { date, durationMinutes, distanceKm, avgHR, maxHR, calories, speed };
  healthData.walks.push(entry);
  console.log("Walk logged:", entry);
  updateHistory();
}

function logTreadmill(date, durationMinutes, distanceKm = 0, avgHR = null, maxHR = null, calories = 0, speed = 0) {
  const entry = { date, durationMinutes, distanceKm, avgHR, maxHR, calories, speed };
  healthData.treadmill.push(entry);
  console.log("Treadmill logged:", entry);
  updateHistory();
}

function logStrength(date, exercises = []) {
  const entry = { date, exercises };
  healthData.strength.push(entry);
  console.log("Strength session logged:", entry);
  updateHistory();
}

function logBP(date, systolic, diastolic, pulse, tag = "") {
  const entry = { date, systolic, diastolic, pulse, tag };
  healthData.bp.push(entry);
  console.log("BP logged:", entry);
  updateHistory();
}

// =======================
// Generate daily summary
// =======================
function getDailySummary(date) {
  const summary = {
    walkDuration: 0,
    treadmillDuration: 0,
    strengthDuration: 0,
    walkDistance: 0,
    treadmillDistance: 0,
    strengthExercises: 0,
    caloriesBurned: 0,
    avgHeartRate: "N/A"
  };

  let hrSum = 0, hrCount = 0;

  healthData.walks.forEach(w => {
    if (w.date === date) {
      summary.walkDuration += w.durationMinutes;
      summary.walkDistance += w.distanceKm;
      summary.caloriesBurned += w.calories;
      if (w.avgHR) { hrSum += w.avgHR; hrCount++; }
    }
  });

  healthData.treadmill.forEach(t => {
    if (t.date === date) {
      summary.treadmillDuration += t.durationMinutes;
      summary.treadmillDistance += t.distanceKm;
      summary.caloriesBurned += t.calories;
      if (t.avgHR) { hrSum += t.avgHR; hrCount++; }
    }
  });

  healthData.strength.forEach(s => {
    if (s.date === date) {
      const totalReps = s.exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps), 0);
      summary.strengthDuration += totalReps;
      summary.strengthExercises += s.exercises.length;
    }
  });

  summary.avgHeartRate = hrCount ? Math.round(hrSum / hrCount) : "N/A";
  return summary;
}

// =======================
// Render daily summary
// =======================
function renderDailySummary(date) {
  const summary = getDailySummary(date);
  const outputDiv = document.getElementById("dailySummaryOutput");
  outputDiv.innerHTML = `
    <h3>Daily Summary for ${date}</h3>
    <div><strong>Walk Duration:</strong> ${summary.walkDuration} min (${summary.walkDistance.toFixed(2)} km)</div>
    <div><strong>Treadmill Duration:</strong> ${summary.treadmillDuration} min (${summary.treadmillDistance.toFixed(2)} km)</div>
    <div><strong>Strength Duration:</strong> ${summary.strengthDuration} reps (${summary.strengthExercises} exercises)</div>
    <div><strong>Calories Burned:</strong> ${summary.caloriesBurned}</div>
    <div><strong>Average Heart Rate:</strong> ${summary.avgHeartRate}</div>
  `;

  // Render BP readings for that date
  healthData.bp.filter(bp => bp.date === date).forEach((bpEntry, i) => {
    const bpDiv = document.createElement("div");
    bpDiv.textContent = `BP ${i + 1}: ${bpEntry.systolic}/${bpEntry.diastolic}/${bpEntry.pulse} ${bpEntry.tag}`;
    outputDiv.appendChild(bpDiv);
  });
}

// =======================
// Render scrollable history
// =======================
function updateHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  historyList.innerHTML = ""; // clear previous

  // Combine all entries into one array with type label
  const allEntries = [];

  healthData.walks.forEach(w => allEntries.push({ type: "Walk", date: w.date, details: w }));
  healthData.treadmill.forEach(t => allEntries.push({ type: "Treadmill", date: t.date, details: t }));
  healthData.strength.forEach(s => allEntries.push({ type: "Strength", date: s.date, details: s }));
  healthData.bp.forEach(bp => allEntries.push({ type: "BP", date: bp.date, details: bp }));

  // Sort by date descending
  allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Create list items
  allEntries.forEach(entry => {
    const div = document.createElement("div");
    div.style.borderBottom = "1px solid #eee";
    div.style.padding = "5px 0";

    if (entry.type === "Walk" || entry.type === "Treadmill") {
      div.textContent = `${entry.date} - ${entry.type}: ${entry.details.durationMinutes} min, ${entry.details.distanceKm} km, HR avg:${entry.details.avgHR || "N/A"}`;
    } else if (entry.type === "Strength") {
      const totalReps = entry.details.exercises.reduce((acc, ex) => acc + ex.sets * ex.reps, 0);
      div.textContent = `${entry.date} - Strength: ${totalReps} reps, ${entry.details.exercises.length} exercises`;
    } else if (entry.type === "BP") {
      div.textContent = `${entry.date} - BP: ${entry.details.systolic}/${entry.details.diastolic}/${entry.details.pulse} ${entry.details.tag}`;
    }

    historyList.appendChild(div);
  });
}

// =======================
// Initialize date picker
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const datePicker = document.getElementById("datePicker");
  const todayStr = new Date().toISOString().split("T")[0];
  datePicker.value = todayStr;

  // Initial render
  renderDailySummary(todayStr);
  updateHistory();

  // Update when date changes
  datePicker.addEventListener("input", (e) => {
    renderDailySummary(e.target.value);
  });
});

// =======================
// Example usage (delete later)
// =======================
logWalk("2025-12-30", 5, 0.2, 107, 117, 12, 1.4);
logTreadmill("2025-12-30", 10, 0.24, 115, 154, 11, 1.4);
logStrength("2025-12-30", [
  { name: "biceps", sets: 3, reps: 10 },
  { name: "laterals", sets: 3, reps: 10 }
]);
logBP("2025-12-30", 128, 65, 92, "M hypertension");
