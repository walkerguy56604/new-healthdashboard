async function loadHealthData(date) {
  try {
    const res = await fetch('https://candid-douhua-07a524.netlify.app/.netlify/functions/netlify-functions-health');
    const dailyLogs = await res.json();

    // If you want to pick a specific date
    const summary = dailyLogs[date] || {
      walk: { minutes: 0, distance_km: 0 },
      treadmill: { minutes: 0, speed: 0 },
      strength: { exercises: [] },
      blood_pressure: { systolic: 0, diastolic: 0, label: 'N/A' },
    };

    const dailySummaryOutput = document.getElementById('dailySummaryOutput');
    dailySummaryOutput.innerHTML = `
      <h3>Daily Summary for ${date}</h3>
      <div>Walk Duration: ${summary.walk.minutes} min (${summary.walk.distance_km} km)</div>
      <div>Treadmill Duration: ${summary.treadmill.minutes} min @ ${summary.treadmill.speed}</div>
      <div>Strength: ${summary.strength.exercises.join(', ')}</div>
      <div>BP: ${summary.blood_pressure.systolic}/${summary.blood_pressure.diastolic} (${summary.blood_pressure.label})</div>
    `;
  } catch (err) {
    console.error('Failed to load health data:', err);
  }
}

// Initialize dashboard with today's date
const datePicker = document.getElementById('datePicker');
const today = new Date().toISOString().split('T')[0];
datePicker.value = today;
loadHealthData(today);

// History list logic
const historyList = document.getElementById('historyList');
datePicker.addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  loadHealthData(selectedDate);

  // Check if button already exists
  if (![...historyList.children].some(btn => btn.dataset.date === selectedDate)) {
    const btn = document.createElement('button');
    btn.textContent = selectedDate;
    btn.dataset.date = selectedDate;
    btn.addEventListener('click', () => loadHealthData(selectedDate));
    historyList.prepend(btn); // newest on top
  }
});
