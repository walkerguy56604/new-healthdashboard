// load dailyLogs.json and display
fetch('dailyLogs.json')
  .then(res => res.json())
  .then(data => {
    const dashboard = document.getElementById('dashboard');
    for (let date in data) {
      const day = data[date];
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${date}</h3>
        Walk: ${day.walk ?? '—'}<br>
        Strength: ${day.strength ?? '—'}<br>
        Treadmill: ${day.treadmill ?? '—'}<br>
        Calories: ${day.calories ?? '—'}<br>
        Heart Rate: ${day.heartRate ?? '—'}<br>
        Blood Pressure: ${
          day.bloodPressure?.map(bp => `${bp.systolic}/${bp.diastolic} (HR ${bp.heartRate})`).join(' • ') ?? '—'
        }
      `;
      dashboard.appendChild(div);
    }
  })
  .catch(err => console.error(err));
