// Load daily logs
let dailyLogs = {};

async function loadDailyLogs() {
  try {
    const response = await fetch('dailyLogs.json');
    dailyLogs = await response.json();
    populateDateSelector();
  } catch (err) {
    console.error('Failed to load dailyLogs.json:', err);
  }
}

function populateDateSelector() {
  const select = document.getElementById('selectDate');
  select.innerHTML = '';
  Object.keys(dailyLogs).forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    select.appendChild(option);
  });
  if (select.options.length > 0) {
    select.value = select.options[0].value;
    updateDashboard(select.value);
  }
  select.addEventListener('change', () => updateDashboard(select.value));
}

function updateDashboard(date) {
  const data = dailyLogs[date];
  if (!data) return;

  // Map elements
  const metrics = {
    walk: 'green',
    strength: 'red',
    treadmill: 'green',
    calories: 'green',
    heartRate: 'blue',
    weight: 'purple',
    glucose: 'orange',
    sleep: 'teal',
    HRV: 'pink',
    mood: 'brown',
    bloodPressure: 'blue',
    notes: 'black'
  };

  for (const key in metrics) {
    const el = document.getElementById(key);
    const span = el.querySelector('span');
    if (data[key] !== undefined) {
      span.textContent = Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key];
    } else {
      span.textContent = '0';
    }
    el.style.color = metrics[key];
  }

  updateChart(date, data);
}

// Placeholder chart data
let healthChart;
function updateChart(date, data) {
  const ctx = document.getElementById('healthChart').getContext('2d');
  const labels = ['Walk','Strength','Treadmill','Calories','Heart Rate','Weight','Glucose','Sleep','HRV','Mood'];
  const values = labels.map(l => data[l.toLowerCase()] || 0);
  
  if (healthChart) healthChart.destroy();
  healthChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: `Metrics for ${date}`,
        data: values,
        backgroundColor: values.map((v, i) => ['green','red','green','green','blue','purple','orange','teal','pink','brown'][i])
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Initialize
loadDailyLogs();
