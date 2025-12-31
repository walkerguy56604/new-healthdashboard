/*********************************
 * Reference Day (Baseline)
 *********************************/
const referenceDay = {
  date: '2025-10-29',
  walk: 0,
  treadmill: 0,
  strength: 30,
  calories: 0,
  heartRate: 'N/A',
  bloodPressure: {
    systolic: 102,
    diastolic: 62,
    iHB: 75
  }
};

/*********************************
 * Daily Logs (data store)
 *********************************/
const dailyLogs = {
  '2025-12-30': {
    walk: 40,
    treadmill: 10,
    strength: 30,
    calories: 22,
    heartRate: 103,
    bloodPressure: {
      systolic: 131,
      diastolic: 74,
      iHB: 95
    }
  }
};

/*********************************
 * Ensure a day exists (AUTO-CREATE)
 *********************************/
function ensureDailyLog(date) {
  if (!dailyLogs[date]) {
    dailyLogs[date] = {
      walk: 0,
      treadmill: 0,
      strength: 0,
      calories: 0,
      heartRate: 0,
      bloodPressure: {
        systolic: 0,
        diastolic: 0,
        iHB: 0
      }
    };
  }
}

/*********************************
 * Color Helpers
 *********************************/
function getColor(value, reference, lowerBetter = false) {
  if (typeof value !== 'number' || typeof reference !== 'number') return 'black';

  if (lowerBetter) {
    if (value <= reference) return 'green';
    if (value <= reference * 1.2) return 'yellow';
    return 'red';
  } else {
    if (value >= reference) return 'green';
    if (value >= reference * 0.8) return 'yellow';
    return 'red';
  }
}

function getBPColor(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80) return 'green';
  if (systolic <= 139 || diastolic <= 89) return 'yellow';
  return 'red';
}

/*********************************
 * Render DAILY Summary
 *********************************/
function renderDailySummary(date) {
  ensureDailyLog(date);
  const summary = dailyLogs[date];
  const output = document.getElementById('dailySummaryOutput');

  const bpColor = getBPColor(
    summary.bloodPressure.systolic,
    summary.bloodPressure.diastolic
  );

  output.innerHTML = `
    <h3>Daily Summary — ${date}</h3>

    <div>Walk: <span style="color:${getColor(summary.walk, referenceDay.walk)}">
      ${summary.walk} min</span></div>

    <div>Treadmill: <span style="color:${getColor(summary.treadmill, referenceDay.treadmill)}">
      ${summary.treadmill} min</span></div>

    <div>Strength: <span style="color:${getColor(summary.strength, referenceDay.strength)}">
      ${summary.strength}</span></div>

    <div>Calories: <span style="color:${getColor(summary.calories, referenceDay.calories)}">
      ${summary.calories}</span></div>

    <div>Avg HR: <span style="color:${getColor(summary.heartRate, referenceDay.heartRate, true)}">
      ${summary.heartRate}</span></div>

    <div><strong>Blood Pressure:</strong>
      <span style="color:${bpColor}">
        ${summary.bloodPressure.systolic}/
        ${summary.bloodPressure.diastolic}/
        ${summary.bloodPressure.iHB}
        ${bpColor === 'green' ? 'N' : bpColor === 'yellow' ? 'M' : 'H'}
      </span>
    </div>
  `;
}

/*********************************
 * 7-Day Rolling Summary
 *********************************/
function getLast7Days(endDate) {
  const days = [];
  const base = new Date(endDate);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function render7DaySummary(endDate) {
  const output = document.getElementById('dailySummaryOutput');
  const days = getLast7Days(endDate);

  let html = `
    <h3>7-Day Rolling Summary (ending ${endDate})</h3>
    <table border="1" style="width:100%;text-align:center;border-collapse:collapse">
      <tr>
        <th>Date</th>
        <th>Walk</th>
        <th>Treadmill</th>
        <th>Strength</th>
        <th>Calories</th>
        <th>HR</th>
        <th>BP</th>
      </tr>
  `;

  days.forEach(date => {
    ensureDailyLog(date);
    const d = dailyLogs[date];
    const bpColor = getBPColor(d.bloodPressure.systolic, d.bloodPressure.diastolic);

    html += `
      <tr>
        <td>${date}</td>
        <td>${d.walk}</td>
        <td>${d.treadmill}</td>
        <td>${d.strength}</td>
        <td>${d.calories}</td>
        <td>${d.heartRate}</td>
        <td style="color:${bpColor}">
          ${d.bloodPressure.systolic}/${d.bloodPressure.diastolic}/${d.bloodPressure.iHB}
        </td>
      </tr>
    `;
  });

  html += `</table>`;
  output.innerHTML = html;
}

/*********************************
 * Date Picker + History
 *********************************/
const datePicker = document.getElementById('datePicker');
const historyList = document.getElementById('historyList');

datePicker.addEventListener('change', e => {
  const date = e.target.value;

  renderDailySummary(date);
  render7DaySummary(date);

  if (![...historyList.children].some(b => b.dataset.date === date)) {
    const btn = document.createElement('button');
    btn.textContent = date;
    btn.dataset.date = date;
    btn.onclick = () => {
      renderDailySummary(date);
      render7DaySummary(date);
    };
    historyList.prepend(btn);
  }
});

/*********************************
 * Auto-load TODAY
 *********************************/
const today = new Date().toISOString().split('T')[0];
datePicker.value = today;
renderDailySummary(today);
render7DaySummary(today);
