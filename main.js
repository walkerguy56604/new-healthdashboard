document.addEventListener("DOMContentLoaded", () => {
  const dateSelect = document.getElementById("dateSelect");
  const metricsContainer = document.getElementById("metricsContainer");
  const barCanvas = document.getElementById("barChart");
  const lineCanvas = document.getElementById("lineChart");

  fetch("dailyLogs.json")
    .then(res => res.json())
    .then(dailyLogs => {
      const dates = Object.keys(dailyLogs).sort();
      if (!dates.length) return;

      // Populate dropdown
      dates.forEach(date => {
        const opt = document.createElement("option");
        opt.value = date;
        opt.textContent = date;
        dateSelect.appendChild(opt);
      });

      function renderMetrics(date) {
        metricsContainer.innerHTML = "";
        const today = dailyLogs[date];
        const prevIdx = dates.indexOf(date) - 1;
        const yesterday = prevIdx >= 0 ? dailyLogs[dates[prevIdx]] : null;

        const metrics = ["walk","strength","treadmill","calories","heartRate","weight","glucose","sleep","HRV","mood"];
        metrics.forEach(metric => {
          const todayVal = today[metric] ?? 0;
          const prevVal = yesterday ? yesterday[metric] ?? 0 : 0;
          const diff = todayVal - prevVal;

          const arrow = diff > 0 ? "⬆️" : diff < 0 ? "⬇️" : "➡️";
          const color = diff > 0 ? "green" : diff < 0 ? "red" : "gray";

          const div = document.createElement("div");
          div.style.margin = "4px 0";
          div.innerHTML = `<strong>${metric}:</strong> <span style="color:${color}">${todayVal} ${arrow}</span>`;
          div.title = `Yesterday: ${prevVal} | Change: ${diff}`;
          metricsContainer.appendChild(div);
        });
      }

      function renderCharts(date) {
        const metricLabels = ["walk","strength","treadmill","calories","heartRate","weight","glucose","sleep","HRV","mood"];
        const barData = metricLabels.map(m => dailyLogs[date][m] ?? 0);

        // Destroy old charts if exist
        if(window.barChartInstance) window.barChartInstance.destroy();
        if(window.lineChartInstance) window.lineChartInstance.destroy();

        // Bar Chart
        window.barChartInstance = new Chart(barCanvas.getContext("2d"), {
          type: "bar",
          data: { labels: metricLabels, datasets:[{ label: date, data: barData, backgroundColor: metricLabels.map((_,i)=> i<4?"green":"blue") }]},
          options: { responsive:true, plugins:{ legend:{ display:false }, tooltip:{ enabled:true } } }
        });

        // Line chart (last 7 days)
        const last7 = dates.slice(-7);
        const datasets = metricLabels.map(metric => ({
          label: metric,
          data: last7.map(d => dailyLogs[d][metric] ?? 0),
          borderColor: `hsl(${Math.random()*360},70%,50%)`,
          fill:false,
          tension:0.2
        }));

        window.lineChartInstance = new Chart(lineCanvas.getContext("2d"), {
          type:"line",
          data:{ labels:last7, datasets },
          options:{ responsive:true, plugins:{ tooltip:{ enabled:true } } }
        });
      }

      dateSelect.addEventListener("change", () => {
        const selected = dateSelect.value;
        renderMetrics(selected);
        renderCharts(selected);
      });

      // initial render
      const lastDate = dates[dates.length-1];
      dateSelect.value = lastDate;
      renderMetrics(lastDate);
      renderCharts(lastDate);

    })
    .catch(err => console.error("Failed to load dailyLogs.json", err));
});
