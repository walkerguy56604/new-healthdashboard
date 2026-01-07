document.addEventListener("DOMContentLoaded", () => {
  // Ensure dailyLogs exists
  if (!window.dailyLogs) {
    alert("dailyLogs not found! Make sure dailyLogs.js is loaded first.");
    return;
  }

  const dates = Object.keys(dailyLogs).sort();
  const metrics = [
    "walk", "strength", "treadmill", "calories",
    "heartRate", "weight", "glucose", "HRV", "sleep", "mood"
  ];
  const colors = ["green","red","orange","lime","blue","purple","brown","pink","cyan","magenta"];

  const datasets = metrics.map((metric,i) => ({
    label: metric,
    data: dates.map(d => dailyLogs[d][metric] ?? 0),
    borderColor: colors[i],
    backgroundColor: colors[i],
    fill: false,
    tension: 0.3,
    pointRadius: 5,
    pointHoverRadius: 7
  }));

  const ctx = document.getElementById("healthChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: { labels: dates, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: function(context) {
              const metric = context.dataset.label;
              const value = context.parsed.y;
              const index = context.dataIndex;
              let trendArrow = "→";
              if (index > 0) {
                const prevValue = dailyLogs[dates[index-1]][metric] ?? 0;
                if (value > prevValue) trendArrow = "↑";
                else if (value < prevValue) trendArrow = "↓";
              }
              return `${metric}: ${value} ${trendArrow}`;
            }
          }
        }
      },
      scales: { y: { beginAtZero: true } }
    }
  });

  // Metrics summary below chart
  const metricsSummary = document.getElementById("metricsSummary");
  dates.forEach(date => {
    const container = document.createElement("div");
    container.classList.add("metric");
    container.innerHTML = `<strong>${date}</strong><br>` +
      metrics.map(m => `${m}: ${dailyLogs[date][m] ?? 0}`).join("<br>");
    metricsSummary.appendChild(container);
  });
});
