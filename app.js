// Health Dashboard 3 – Daily Summary JSON (2025-12-30)
const dailyData = {
  date: "2025-12-30",
  walks: [
    {
      type: "Indoor",
      duration_min: 5,
      distance_km: 0,
      calories: 0,
      avg_hr: null,
      max_hr: null,
      start_time: "03:15"
    },
    {
      type: "Outdoor/Treadmill",
      duration_min: 30,
      distance_km: 0, // if known, replace
      calories: 0, // if known, replace
      avg_hr: null,
      max_hr: null,
      start_time: "13:42"
    },
    {
      type: "Treadmill",
      duration_min: 10,
      distance_km: 0.24,
      speed_kmh: 1.4,
      calories: 11,
      avg_hr: 107,
      max_hr: 117,
      start_time: "13:42"
    },
    {
      type: "Treadmill",
      duration_min: 10,
      distance_km: 0.24,
      speed_kmh: 1.4,
      calories: 11,
      avg_hr: 115,
      max_hr: 154,
      start_time: "10:00"
    },
    {
      type: "Walk",
      duration_min: 5,
      distance_km: 0, // if known, replace
      calories: 0, // if known, replace
      avg_hr: null,
      max_hr: null,
      start_time: "10:10"
    }
  ],
  strength_training: [
    {
      start_time: "07:50",
      end_time: "08:06",
      exercises: [
        { name: "Laterals", sets: 3, reps: 10 },
        { name: "Biceps", sets: 3, reps: 10 }
      ],
      calories: 120,
      avg_hr: 90
    }
  ],
  blood_pressure: [
    { time: "07:45", systolic: 141, diastolic: 74, hr: 89, type: "H" },
    { time: "07:50", systolic: 122, diastolic: 67, hr: 92, type: "M" },
    { time: "10:15", systolic: 128, diastolic: 70, hr: 92, type: "M" }
  ]
};

// Example: Function to log the daily summary (for app.js display)
function logDailySummary(data) {
  const dash = document.getElementById('dashboard');
  if (!dash) return;

  const summary = document.createElement('div');
  summary.innerHTML = `
    <h2>Daily Summary for ${data.date}</h2>
    <p>Walk Duration: ${data.walks.reduce((a,b)=>a+b.duration_min,0)} min</p>
    <p>Treadmill Duration: ${data.walks.filter(w=>w.type==="Treadmill").reduce((a,b)=>a+b.duration_min,0)} min</p>
    <p>Strength Duration: ${data.strength_training.reduce((a,b)=>a+b.exercises.length*b.exercises[0].reps,0)} reps</p>
    <p>Calories Burned: ${data.strength_training.reduce((a,b)=>a+b.calories,0) + data.walks.reduce((a,b)=>a+b.calories,0)}</p>
    <p>Average Heart Rate: ${Math.round(
      (data.strength_training.reduce((a,b)=>a+b.avg_hr,0) + data.walks.reduce((a,b)=>a+(b.avg_hr||0),0)) /
      (data.strength_training.length + data.walks.filter(w=>w.avg_hr).length)
    ) || "N/A"}</p>
  `;
  dash.appendChild(summary);
}

// Run the summary display
logDailySummary(dailyData);
