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
}

function logTreadmill(date, durationMinutes, distanceKm = 0, avgHR = null, maxHR = null, calories = 0, speed = 0) {
  const entry = { date, durationMinutes, distanceKm, avgHR, maxHR, calories, speed };
  healthData.treadmill.push(entry);
  console.log("Treadmill logged:", entry);
}

function logStrength(date, exercises = []) {
  const entry = { date, exercises };
  healthData.strength.push(entry);
  console.log("Strength session logged:", entry);
}

// =======================
// Log blood pressure
// =======================
function logBP(date, systolic, diastolic, pulse, tag = "") {
  const entry = { date, systolic, diastolic, pulse, tag };
  healthData.bp.push(entry);
  console.log("BP logged:", entry);
}

// =======================
// Daily Summary
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
    avgHeartRate: null
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
      summary.strengthDuration += s.exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps), 0);
      summary.strengthExercises += s.exercises.length;
    }
  });

  summary.avgHeartRate = hrCount ? Math.round(hrSum / hrCount) : "N/A";
  return summary;
}

// =======================
// Render Dashboard
// =======================
function renderDashboard(date = new Date().toISOString().split("T")[0]) {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) return;
  dashboard.innerHTML = ''; // Clear previous content

  const summary = getDailySummary(date);

  const summaryTitle = document.createElement("h2");
  summaryTitle.textContent = `Daily Summary for ${date}`;
  dashboard.appendChild(summaryTitle);

  const walkDiv = document.createElement("div");
  walkDiv.textContent = `Walk Duration: ${summary.walkDuration} min (${summary.walkDistance.toFixed(2)} km)`;
  dashboard.appendChild(walkDiv);

  const treadmillDiv = document.createElement("div");
  treadmillDiv.textContent = `Treadmill Duration: ${summary.treadmillDuration} min (${summary.treadmillDistance.toFixed(2)} km)`;
  dashboard.appendChild(treadmillDiv);

  const strengthDiv = document.createElement("div");
  strengthDiv.textContent = `Strength Duration: ${summary.strengthDuration} reps (${summary.strengthExercises} exercises)`;
  dashboard.appendChild(strengthDiv);

  const caloriesDiv = document.createElement("div");
  caloriesDiv.textContent = `Calories Burned: ${summary.caloriesBurned}`;
  dashboard.appendChild(caloriesDiv);

  const hrDiv = document.createElement("div");
  hrDiv.textContent = `Average Heart Rate: ${summary.avgHeartRate}`;
  dashboard.appendChild(hrDiv);

  // Blood pressures
  const bpTitle = document.createElement("h3");
  bpTitle.textContent = "Blood Pressure Readings:";
  dashboard.appendChild(bpTitle);

  healthData.bp
    .filter(bp => bp.date === date)
    .forEach((bpEntry, i) => {
      const bpDiv = document.createElement("div");
      bpDiv.textContent = `BP ${i + 1}: ${bpEntry.systolic}/${bpEntry.diastolic}/${bpEntry.pulse} ${bpEntry.tag}`;
      dashboard.appendChild(bpDiv);
    });
}

// =======================
// Scrollable History
// =======================
function renderHistory() {
  const historyContainer = document.getElementById("history");
  if (!historyContainer) return;

  historyContainer.innerHTML = '';

  const allDates = new Set();
  [...healthData.walks, ...healthData.treadmill, ...healthData.strength, ...healthData.bp]
    .forEach(entry => allDates.add(entry.date));

  const sortedDates = Array.from(allDates).sort((a,b) => new Date(b) - new Date(a));

  sortedDates.forEach(date => {
    const btn = document.createElement("button");
    btn.textContent = date;
    btn.addEventListener("click", () => renderDashboard(date));
    historyContainer.appendChild(btn);
  });
}

// =======================
// Initialize
// =======================
document.addEventListener("DOMContentLoaded", () => {
  renderDashboard(); // today
  renderHistory();   // past days
});

// =======================
// Example usage
// =======================
logWalk("2025-12-30", 5, 0.2, 107, 117, 12, 1.4);
logTreadmill("2025-12-30", 10, 0.24, 115, 154, 11, 1.4);
logStrength("2025-12-30", [
  { name: "biceps", sets: 3, reps: 10 },
  { name: "laterals", sets: 3, reps: 10 }
]);
logBP("2025-12-30", 128, 65, 92, "M hypertension");

console.log("Current Health Data:", healthData);
