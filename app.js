// Function to render history of previous days
function renderHistory() {
  const historyDiv = document.getElementById('historyList');
  historyDiv.innerHTML = ''; // clear previous content

  // Merge all dates from walks, treadmill, strength, bp
  const allDates = new Set([
    ...healthData.walks.map(w => w.date),
    ...healthData.treadmill.map(t => t.date),
    ...healthData.strength.map(s => s.date),
    ...healthData.bp.map(b => b.date)
  ]);

  // Sort dates descending
  const sortedDates = Array.from(allDates).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(date => {
    const summary = getDailySummary(date);
    const entryDiv = document.createElement('div');
    entryDiv.style.borderBottom = '1px solid #eee';
    entryDiv.style.marginBottom = '5px';
    entryDiv.innerHTML = `
      <strong>${date}</strong>: Walk ${summary.walkDuration} min, Treadmill ${summary.treadmillDuration} min, Strength ${summary.strengthDuration} reps, Calories ${summary.caloriesBurned}, Avg HR ${summary.avgHeartRate}
    `;
    historyDiv.appendChild(entryDiv);
  });
}

// Update history whenever you log new activity
function updateDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const summary = getDailySummary(today);

  const outputDiv = document.getElementById('dailySummaryOutput');
  outputDiv.innerHTML = `
    <h3>Daily Summary for ${today}</h3>
    <p><strong>Walk Duration:</strong> ${summary.walkDuration} min (${summary.walkDistance} km)</p>
    <p><strong>Treadmill Duration:</strong> ${summary.treadmillDuration} min (${summary.treadmillDistance} km)</p>
    <p><strong>Strength Duration:</strong> ${summary.strengthDuration} reps (${summary.strengthExercises} exercises)</p>
    <p><strong>Calories Burned:</strong> ${summary.caloriesBurned}</p>
    <p><strong>Average Heart Rate:</strong> ${summary.avgHeartRate}</p>
  `;

  renderHistory();
}

// Call this once on page load
document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
});
