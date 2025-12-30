console.log("Health Dashboard 3 is alive 👊");

// =======================
// In-memory store
// =======================
const healthData = {
  walks: [],
  treadmill: [],
  strength: [],
  bp: [],
  calories: [],
  heartRates: []
};

// =======================
// Timestamp helper
// =======================
function now() {
  return new Date().toISOString();
}

// =======================
// Logging functions
// =======================
function logWalk(date, durationMinutes, distanceKm = 0, avgHR = null, maxHR = null, calories = 0, speed = 0) {
  const entry = { date, durationMinutes, distanceKm, avgHR, maxHR, calories, speed };
  healthData.walks.push(entry);
  if (avgHR) healthData.heartRates.push(avgHR);
  if (calories) healthData.calories.push(calories);
  console.log("Walk logged:", entry);
}

function logTreadmill(date, durationMinutes, distanceKm = 0, avgHR = null, maxHR = null, calories = 0, speed = 0) {
  const entry = { date, durationMinutes, distanceKm, avgHR, maxHR, calories, speed };
  healthData.treadmill.push(entry);
  if (avgHR) healthData.heartRates.push(avgHR);
  if (calories) healthData.calories.push(calories);
  console.log("Treadmill logged:", entry);
}

function logStrength(date, exercises = []) {
  const entry = { date, exercises };
  healthData.strength.push(entry);
  console.log("Strength session logged:", entry);
}

function logBP(date, systolic, diastolic, pulse, category = "") {
  const entry = { date, systolic, diastolic, pulse, category };
  healthData.bp.push(entry);
  if (pulse) healthData.heartRates.push(pulse);
  console.log("BP logged:", entry);
}

// =======================
// Render dashboard
// =======================
function renderDashboard(date) {
  const dashboard = document.getElementById('dashboard');
  if (!dashboard) return console.warn("No dashboard element found");
  dashboard.innerHTML = ''; // Clear previous content

  const summaryTitle = document.createElement('h2');
  summaryTitle.textContent = `Daily Summary for ${date}`;
  dashboard.appendChild(summaryTitle);

  // Walks
  const totalWalkMinutes = healthData.walks
    .filter(w => w.date === date)
    .reduce((sum, w) => sum + w.durationMinutes, 0);
  const totalWalkDistance = healthData.walks
    .filter(w => w.date === date)
    .reduce((sum, w) => sum + w.distanceKm, 0);
  const walkDiv = document.createElement('div');
  walkDiv.textContent = `Walk Duration: ${totalWalkMinutes} min (${totalWalkDistance.toFixed(2)} km)`;
  dashboard.appendChild(walkDiv);

  // Treadmill
  const totalTreadmillMinutes = healthData.treadmill
    .filter(t => t.date === date)
    .reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalTreadmillDistance = healthData.treadmill
    .filter(t => t.date === date)
    .reduce((sum, t) => sum + t.distanceKm, 0);
  const treadmillDiv = document.createElement('div');
  treadmillDiv.textContent = `Treadmill Duration: ${totalTreadmillMinutes} min (${totalTreadmillDistance.toFixed(2)} km)`;
  dashboard.appendChild(treadmillDiv);

  // Strength
  const totalReps = healthData.strength
    .filter(s => s.date === date)
    .reduce((sum, s) => sum + s.exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps), 0), 0);
  const totalExercises = healthData.strength
    .filter(s => s.date === date)
    .reduce((sum, s) => sum + s.exercises.length, 0);
  const strengthDiv = document.createElement('div');
  strengthDiv.textContent = `Strength Duration: ${totalReps} reps (${totalExercises} exercises)`;
  dashboard.appendChild(strengthDiv);

  // Calories
  const totalCalories = healthData.calories.reduce((sum, c) => sum + c, 0);
  const caloriesDiv = document.createElement('div');
  caloriesDiv.textContent = `Calories Burned: ${totalCalories}`;
  dashboard.appendChild(caloriesDiv);

  // Average Heart Rate
  const avgHeartRate = healthData.heartRates.length
    ? Math.round(healthData.heartRates.reduce((sum, h) => sum + h, 0) / healthData.heartRates.length)
    : 'N/A';
  const hrDiv = document.createElement('div');
  hrDiv.textContent = `Average Heart Rate: ${avgHeartRate}`;
  dashboard.appendChild(hrDiv);

  // Blood pressure readings
  healthData.bp
    .filter(bp => bp.date === date)
    .forEach((bpEntry, i) => {
      const bpDiv = document.createElement('div');
      bpDiv.textContent = `BP ${i + 1}: ${bpEntry.systolic}/${bpEntry.diastolic}/${bpEntry.pulse} ${bpEntry.category}`;
      dashboard.appendChild(bpDiv);
    });
}

// =======================
// Example usage
// =======================
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
logWalk(today, 5, 0.2, 107, 117, 12, 1.4);
logTreadmill(today, 10, 0.24, 115, 154, 11, 1.4);
logStrength(today, [
  { name: "biceps", sets: 3, reps: 10 },
  { name: "laterals", sets: 3, reps: 10 }
]);
logBP(today, 128, 65, 92, "M Hypertension");

// Render when page loads
document.addEventListener("DOMContentLoaded", () => {
  renderDashboard(today);
});
