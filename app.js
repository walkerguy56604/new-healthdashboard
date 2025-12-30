const dailyData = {
  date: "2025-12-30",
  walks: [
    { type: "Indoor", duration_min: 5, distance_km: 0, calories: 0, avg_hr: null, max_hr: null, start_time: "03:15" },
    { type: "Treadmill", duration_min: 10, distance_km: 0.24, speed_kmh: 1.4, calories: 11, avg_hr: 107, max_hr: 117, start_time: "13:42" },
    { type: "Treadmill", duration_min: 10, distance_km: 0.24, speed_kmh: 1.4, calories: 11, avg_hr: 115, max_hr: 154, start_time: "10:00" },
    { type: "Walk", duration_min: 5, distance_km: 0, calories: 0, avg_hr: null, max_hr: null, start_time: "10:10" },
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

// Display function
function displayDashboard(data) {
  const dash = document.getElementById('dashboard');
  if (!dash) return;

  // Clear old content
  dash.innerHTML = "";

  // Daily summary
  const summary = document.createElement('div');
  summary.innerHTML = `
    <h2>Daily Summary for ${data.date}</h2>
    <p>Total Walk Duration: ${data.walks.reduce((a,b)=>a+b.duration_min,0)} min</p>
    <p>Total Treadmill Duration: ${data.walks.filter(w=>w.type==="Treadmill").reduce((a,b)=>a+b.duration_min,0)} min</p>
    <p>Total Strength Reps: ${data.strength_training.reduce((a,b)=>a+b.exercises.reduce((exSum, ex) => exSum + ex.sets*ex.reps, 0),0)}</p>
    <p>Total Calories Burned: ${data.strength_training.reduce((a,b)=>a+b.calories,0) + data.walks.reduce((a,b)=>a+b.calories,0)}</p>
    <p>Average Heart Rate: ${Math.round(
      (data.strength_training.reduce((a,b)=>a+b.avg_hr,0) + data.walks.reduce((a,b)=>a+(b.avg_hr||0),0)) /
      (data.strength_training.length + data.walks.filter(w=>w.avg_hr).length)
    ) || "N/A"}</p>
  `;
  dash.appendChild(summary);

  // Blood pressure table
  const bpDiv = document.createElement('div');
  bpDiv.innerHTML = "<h3>Blood Pressure Readings</h3>";
  const bpTable = document.createElement('table');
  bpTable.style.borderCollapse = "collapse";
  bpTable.style.width = "100%";
  bpTable.innerHTML = `
    <tr>
      <th style="border:1px solid black;padding:4px">Time</th>
      <th style="border:1px solid black;padding:4px">Systolic</th>
      <th style="border:1px solid black;padding:4px">Diastolic</th>
      <th style="border:1px solid black;padding:4px">Heart Rate</th>
      <th style="border:1px solid black;padding:4px">Type</th>
    </tr>
    ${data.blood_pressure.map(bp => `
      <tr>
        <td style="border:1px solid black;padding:4px">${bp.time}</td>
        <td style="border:1px solid black;padding:4px">${bp.systolic}</td>
        <td style="border:1px solid black;padding:4px">${bp.diastolic}</td>
        <td style="border:1px solid black;padding:4px">${bp.hr}</td>
        <td style="border:1px solid black;padding:4px">${bp.type}</td>
      </tr>
    `).join("")}
  `;
  bpDiv.appendChild(bpTable);
  dash.appendChild(bpDiv);

  // Walks / Treadmill
  const walksDiv = document.createElement('div');
  walksDiv.innerHTML = "<h3>Walks & Treadmill Sessions</h3>";
  walksDiv.innerHTML += "<ul>" + data.walks.map(w => `
    <li>${w.start_time} - ${w.type}: ${w.duration_min} min, ${w.distance_km} km, ${w.calories} cal, HR: ${w.avg_hr||"N/A"}/${w.max_hr||"N/A"}</li>
  `).join("") + "</ul>";
  dash.appendChild(walksDiv);

  // Strength training details
  const strDiv = document.createElement('div');
  strDiv.innerHTML = "<h3>Strength Training</h3>";
  data.strength_training.forEach(st => {
    strDiv.innerHTML += `<p>${st.start_time} - ${st.end_time}: ${st.exercises.map(ex => `${ex.name} ${ex.sets}x${ex.reps}`).join(", ")}, Calories: ${st.calories}, Avg HR: ${st.avg_hr}</p>`;
  });
  dash.appendChild(strDiv);

  console.log("Dashboard fully loaded");
}

// Run display
displayDashboard(dailyData);
