// Load dailyLogs
async function loadDailyLogs() {
  try {
    const res = await fetch('dailyLogs.json');
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Failed to load daily logs", e);
    return {};
  }
}

// Populate date selector
function populateDates(logs) {
  const select = document.getElementById('dateSelect');
  select.innerHTML = '';
  Object.keys(logs).forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    select.appendChild(option);
  });
  if (select.options.length > 0) updateDashboard(logs, select.value);
  select.addEventListener('change', () => updateDashboard(logs, select.value));
}

// Update dashboard stats
function updateDashboard(logs, date) {
  const day = logs[date];
  if (!day) return;

  document.getElementById('walk').textContent = `Walk: ${day.walk}`;
  document.getElementById('strength').textContent = `Strength: ${day.strength}`;
  document.getElementById('treadmill').textContent = `Treadmill: ${day.treadmill}`;
  document.getElementById('calories').textContent = `Calories: ${day.calories}`;
  document.getElementById('heartRate').textContent = `Heart Rate: ${day.heartRate || 'N/A'}`;
  
  const bpText = day.bloodPressure.map(bp => `${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate}) • ${bp.note}`).join(' • ');
  document.getElementById('bloodPressure').textContent = `Blood Pressure: ${bpText || 'N/A'}`;

  document.getElementById('weight').textContent = `Weight: ${day.weight || 'N/A'}`;
  document.getElementById('glucose').textContent = `Glucose: ${day.glucose || 'N/A'}`;
  document.getElementById('sleep').textContent = `Sleep: ${day.sleep || 'N/A'}`;
  document.getElementById('HRV').textContent = `HRV: ${day.HRV || 'N/A'}`;
  document.getElementById('mood').textContent = `Mood: ${day.mood || 'N/A'}`;

  updateChart(day);
}

// Basic bar chart
let chartInstance = null;
function updateChart(day) {
  const ctx = document.getElementById('healthChart').getContext('2d');
  const labels = ['Walk', 'Strength', 'Treadmill', 'Calories'];
  const values = [day.walk, day.strength, day.treadmill, day.calories];

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Activity Metrics',
        data: values,
        backgroundColor: ['#4caf50','#f44336','#2196f3','#ff9800']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Initialize
(async () => {
  const logs = await loadDailyLogs();
  populateDates(logs);
})();
