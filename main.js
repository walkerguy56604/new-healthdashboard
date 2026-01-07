// =======================
// Chart Setup with Interactive Arrows
// =======================
const ctx = document.getElementById("healthChart").getContext("2d");
let healthChart = new Chart(ctx, {
  type: "line",
  data: { labels: [], datasets: [] },
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
            const dates = Object.keys(dailyLogs).sort();
            let trendArrow = "→"; // default no change
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

// =======================
// Update Chart Function
// =======================
function updateChart() {
  const dates = Object.keys(dailyLogs).sort();
  const metrics = ["walk","strength","treadmill","calories","heartRate","weight","glucose","HRV","mood"];
  const colors = ["green","red","orange","lime","blue","purple","brown","pink","cyan"];
  const datasets = metrics.map((metric,i) => ({
    label: metric,
    data: dates.map(d => dailyLogs[d][metric] ?? 0),
    borderColor: colors[i],
    backgroundColor: colors[i],
    tension: 0.3,
    fill: false,
    pointRadius: 5,
    pointHoverRadius: 7
  }));
  
  healthChart.data.labels = dates;
  healthChart.data.datasets = datasets;
  healthChart.update();
}
