// Main JS for Health Dashboard
(async function() {
  const dailyLogsUrl = `dailyLogs.json?v=${Date.now()}`; // Cache-busting

  let dailyLogs = {};
  try {
    const res = await fetch(dailyLogsUrl);
    dailyLogs = await res.json();
  } catch (err) {
    console.error("Failed to load dailyLogs.json:", err);
    return;
  }

  const dateSelect = document.getElementById("dateSelect");
  const metricsCard = document.getElementById("metricsCard");
  const ctx = document.getElementById("healthChart").getContext("2d");

  // Populate dates in dropdown
  const dates = Object.keys(dailyLogs).sort((a,b)=> new Date(b) - new Date(a));
  dates.forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    dateSelect.appendChild(option);
  });

  function renderMetrics(date) {
    const day = dailyLogs[date];
    metricsCard.innerHTML = ""; // Clear previous

    const metrics = [
      { key: "walk", label: "Walk", color: "green" },
      { key: "strength", label: "Strength", color: "red" },
      { key: "treadmill", label: "Treadmill", color: "green" },
      { key: "calories", label: "Calories", color: "green" },
      { key: "heartRate", label: "Heart Rate", color: "blue" },
      { key: "weight", label: "Weight", color: "blue" },
      { key: "glucose", label: "Glucose", color: "blue" },
      { key: "sleep", label: "Sleep", color: "blue" },
      { key: "HRV", label: "HRV", color: "blue" },
      { key: "mood", label: "Mood", color: "blue" }
    ];

    metrics.forEach(m => {
      if(day[m.key] !== undefined && day[m.key] !== null) {
        const div = document.createElement("div");
        div.classList.add("metric", m.color);
        div.innerHTML = `<span>${m.label}:</span> ${day[m.key]}`;
        metricsCard.appendChild(div);
      }
    });

    // Blood pressure
    if(day.bloodPressure && day.bloodPressure.length) {
      day.bloodPressure.forEach(bp => {
        const div = document.createElement("div");
        div.classList.add("metric", "blue");
        div.textContent = `BP: ${bp.systolic}/${bp.diastolic} HR:${bp.heartRate} (${bp.note || ""})`;
        metricsCard.appendChild(div);
      });
    }

    // Notes
    if(day.notes && day.notes.length) {
      day.notes.forEach(note => {
        const div = document.createElement("div");
        div.classList.add("metric");
        div.textContent = `Note: ${note}`;
        metricsCard.appendChild(div);
      });
    }
  }

  function renderChart(date) {
    const day = dailyLogs[date];

    const labels = ["Walk", "Strength", "Treadmill", "Calories", "Heart Rate", "Weight", "Glucose", "Sleep", "HRV"];
    const data = [
      day.walk || 0,
      day.strength || 0,
      day.treadmill || 0,
      day.calories || 0,
      day.heartRate || 0,
      day.weight || 0,
      day.glucose || 0,
      day.sleep || 0,
      day.HRV || 0
    ];

    if(window.healthChartInstance) window.healthChartInstance.destroy();

    window.healthChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Metrics for ${date}`,
          data,
          backgroundColor: labels.map(l => {
            if(l === "Walk" || l === "Treadmill" || l === "Calories") return "green";
            if(l === "Strength") return "red";
            return "blue";
          })
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
  const defaultDate = dates[0];
  renderMetrics(defaultDate);
  renderChart(defaultDate);

  dateSelect.value = defaultDate;
  dateSelect.addEventListener("change", e => {
    renderMetrics(e.target.value);
    renderChart(e.target.value);
  });
})();
