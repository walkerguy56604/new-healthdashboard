// -----------------------
// Daily logs data
// -----------------------
const dailyLogs = {
  "2025-12-30": {
    walk: 5,       // minutes
    treadmill: 10, // minutes
    strength: 6,   // reps
    calories: 131, // total calories
    heartRate: 115 // average
  },
  "2025-10-29": { // reference day
    walk: 0,
    treadmill: 0,
    strength: 0,
    calories: 0,
    heartRate: 'N/A'
  }
};

// -----------------------
// Function to render daily summary
// -----------------------
function renderDailySummary(date) {
  const dailySummaryOutput = document.getElementById('dailySummaryOutput');
  const summary = dailyLogs[date] || {
    walk: 0, treadmill: 0, strength: 0, calories: 0, heartRate: 'N/A'
  };

  dailySummaryOutput.innerHTML = `
    <h3>Daily Summary for ${date}</h3>
    <div>Walk Duration: ${summary.walk} min</div>
    <div>Treadmill Duration: ${summary.treadmill} min</div>
    <div>Strength Duration: ${summary.strength} reps</div>
    <div>Calories Burned: ${summary.calories}</div>
    <div>Average Heart Rate: ${summary.heartRate}</div>
  `;
}

// -----------------------
// History list & date picker logic
// -----------------------
const historyList = document.getElementById('historyList');
const datePicker = document.getElementById('datePicker');

datePicker.addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  renderDailySummary(selectedDate);

  // Add to history buttons if not already there
  if (![...historyList.children].some(btn => btn.dataset.date === selectedDate)) {
    const btn = document.createElement('button');
    btn.textContent = selectedDate;
    btn.dataset.date = selectedDate;
    btn.addEventListener('click', () => renderDailySummary(selectedDate));
    historyList.prepend(btn); // newest on top
  }
});

// Optional: auto-render today's summary if present
const today = new Date().toISOString().split('T')[0];
if (dailyLogs[today]) {
  datePicker.value = today;
  renderDailySummary(today);
}
