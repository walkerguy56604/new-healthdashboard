function updateDashboard(date) {
  const data = dailyLogs[date];
  if (!data) return;

  const logsDiv = document.getElementById('logs');

  // ----- Blood Pressure Rendering -----
  let bpHtml = '<div><strong>Blood Pressure:</strong></div>';

  if (data.bloodPressure && data.bloodPressure.length > 0) {
    bpHtml += '<ul>';
    data.bloodPressure.forEach(bp => {
      bpHtml += `
        <li>
          ${bp.systolic}/${bp.diastolic}
          ${bp.heartRate ? `(HR ${bp.heartRate})` : ''}
          ${bp.note ? `– <em>${bp.note}</em>` : ''}
        </li>
      `;
    });
    bpHtml += '</ul>';
  } else {
    bpHtml += '<div>No BP readings recorded</div>';
  }

  // ----- Main Log Output -----
  logsDiv.innerHTML = `
    <div>Walk: <span class="green">${data.walk}</span> mins</div>
    <div>Strength: <span class="red">${data.strength}</span> mins</div>
    <div>Treadmill: <span class="green">${data.treadmill}</span> mins</div>
    <div>Calories: <span class="green">${data.calories}</span> kcal</div>
    <div>Heart Rate: <span class="blue">${data.heartRate ?? '-'}</span></div>
    <div>Weight: ${data.weight ?? '-'}</div>
    <div>Glucose: ${data.glucose ?? '-'}</div>
    <div>Sleep: ${data.sleep ?? '-'}</div>
    <div>HRV: ${data.hrv ?? '-'}</div>
    <div>Mood: ${data.mood ?? '-'}</div>

    <hr>
    ${bpHtml}

    <hr>
    <div><strong>Notes:</strong></div>
    <div>${data.notes.length ? data.notes.join(', ') : 'None'}</div>
  `;

  // charts remain unchanged below 👇
}
