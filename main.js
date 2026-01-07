let dailyLogs = {};
let chart;

async function loadLogs() {
    try {
        const response = await fetch('dailyLogs.json');
        dailyLogs = await response.json();
        populateDates();
    } catch (err) {
        console.error('Error loading dailyLogs.json:', err);
    }
}

function populateDates() {
    const select = document.getElementById('dateSelect');
    select.innerHTML = '';
    Object.keys(dailyLogs).sort().forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = date;
        select.appendChild(option);
    });
    select.addEventListener('change', () => updateDashboard(select.value));
    if (select.options.length > 0) updateDashboard(select.value);
}

function updateDashboard(date) {
    const metricsDiv = document.getElementById('metricsContainer');
    metricsDiv.innerHTML = '';
    const current = dailyLogs[date];
    const prevDate = Object.keys(dailyLogs).sort().reverse().find(d => d < date);
    const previous = prevDate ? dailyLogs[prevDate] : null;

    const metrics = ['walk', 'strength', 'treadmill', 'calories', 'heartRate', 'weight', 'glucose', 'sleep', 'HRV', 'mood'];
    metrics.forEach(metric => {
        const value = current[metric] ?? 0;
        let arrow = '';
        if (previous && previous[metric] !== undefined) {
            if (value > previous[metric]) arrow = '<span class="arrow-up">↑</span>';
            else if (value < previous[metric]) arrow = '<span class="arrow-down">↓</span>';
        }
        const div = document.createElement('div');
        div.className = 'metric';
        div.innerHTML = `${metric}<span class="value">${value} ${arrow}</span>`;
        metricsDiv.appendChild(div);
    });

    updateChart(date, current);
}

function updateChart(date, data) {
    const ctx = document.getElementById('healthChart').getContext('2d');
    const labels = ['Walk', 'Strength', 'Treadmill', 'Calories', 'Heart Rate', 'Weight', 'Glucose', 'Sleep', 'HRV', 'Mood'];
    const colors = ['green','red','orange','green','blue','purple','pink','brown','gray','teal'];
    const values = labels.map(label => data[label.toLowerCase()] ?? 0);

    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: `Metrics for ${date}`,
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

loadLogs();
