// main.js
document.addEventListener("DOMContentLoaded", async () => {
  const dateSelect = document.getElementById("dateSelect");
  const metricsContainer = document.getElementById("metricsContainer");

  let dailyLogs = {};
  try {
    const response = await fetch("dailyLogs.json");
    dailyLogs = await response.json();
  } catch (err) {
    console.error("Failed to load dailyLogs.json", err);
    return;
  }

  const dates = Object.keys(dailyLogs).sort();
  dates.forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    dateSelect.appendChild(option);
  });

  function renderMetrics(selectedDate) {
    metricsContainer.innerHTML = "";
    const today = dailyLogs[selectedDate];
    const prevDateIndex = dates.indexOf(selectedDate) - 1;
    const yesterday = prevDateIndex >= 0 ? dailyLogs[dates[prevDateIndex]] : null;

    const metrics = [
      "walk", "strength", "treadmill", "calories",
      "heartRate", "weight", "glucose", "sleep", "HRV", "mood"
    ];

    metrics.forEach(metric => {
      const todayVal = today[metric] ?? 0;
      const yesterdayVal = yesterday ? yesterday[metric] ?? 0 : 0;
      const diff = todayVal - yesterdayVal;

      const arrow = diff > 0 ? "⬆️" : diff < 0 ? "⬇️" : "➡️";
      const color = diff > 0 ? "green" : diff < 0 ? "red" : "gray";

      const metricDiv = document.createElement("div");
      metricDiv.style.margin = "4px 0";
      metricDiv.innerHTML = `<strong>${metric}:</strong> <span style="color:${color}">${todayVal} ${arrow}</span>`;
      metricDiv.title = `Yesterday: ${yesterdayVal} | Change: ${diff}`;
      metricsContainer.appendChild(metricDiv);
    });
  }

  dateSelect.addEventListener("change", () => {
    renderMetrics(dateSelect.value);
    renderCharts(dateSelect.value);
  });

  function renderCharts(selectedDate) {
    const ctxBar = document.getElementById("barChart").getContext("2d");
    const ctxLine = document.getElementById("lineChart").getContext("2d");

    const metricLabels = ["walk","strength","treadmill","calories","heartRate","weight","glucose","sleep","HRV","mood"];
    const barData = metricLabels.map(m => dailyLogs[selectedDate][m] ?? 0);

    // Destroy old charts if exist
    if(window.barChartInstance) window.barChartInstance.destroy();
    if(window.lineChartInstance) window.lineChartInstance.destroy();

    // Bar Chart
    window.barChartInstance = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: metricLabels,
        datasets: [{
          label: selectedDate,
          data: barData,
          backgroundColor: metricLabels.map((_,i) => i < 4 ? "green" : "blue"),
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });

    // Line Chart - trends for past days
    const pastDays = dates.slice(-7); // last 7 days
    const datasets = metricLabels.map(metric => ({
      label: metric,
      data: pastDays.map(d => dailyLogs[d][metric] ?? 0),
      borderColor: `hsl(${Math.random()*360},70%,50%)`,
      fill: false,
      tension: 0.2
    }));

    window.lineChartInstance = new Chart(ctxLine, {
      type: "line",
      data: {
        labels: pastDays,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: { tooltip: { enabled: true } }
      }
    });
  }

  // Initial render
  if(dates.length) {
    dateSelect.value = dates[dates.length - 1];
    renderMetrics(dateSelect.value);
    renderCharts(dateSelect.value);
  }
});
