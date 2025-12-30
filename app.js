document.addEventListener("DOMContentLoaded", () => {
  const outputDiv = document.getElementById("dailySummaryOutput");
  outputDiv.innerHTML = "";

  const dates = lastNDates(7);

  dates.forEach(date => {
    const summary = getDailySummary(date);

    // Highlight if BP is high or avgHR missing
    const highBP = healthData.bp.some(bp => bp.date === date && bp.systolic >= 130);
    const missingHR = summary.avgHeartRate === "N/A";

    let borderColor = "#ddd"; // default
    if (highBP) borderColor = "#ff4d4d"; // red for high BP
    else if (missingHR) borderColor = "#ffa500"; // orange for missing HR

    outputDiv.innerHTML += `
      <div style="margin-bottom:15px; padding:10px; background:#fff; border-radius:6px; border:2px solid ${borderColor}; box-shadow:0 0 5px rgba(0,0,0,0.1)">
        <h3>Daily Summary for ${date}</h3>
        <p><strong>Walk Duration:</strong> ${summary.walkDuration} min (${summary.walkDistance} km)</p>
        <p><strong>Treadmill Duration:</strong> ${summary.treadmillDuration} min (${summary.treadmillDistance} km)</p>
        <p><strong>Strength Duration:</strong> ${summary.strengthDuration} reps (${summary.strengthExercises} exercises)</p>
        <p><strong>Calories Burned:</strong> ${summary.caloriesBurned}</p>
        <p><strong>Average Heart Rate:</strong> ${summary.avgHeartRate}</p>
        ${highBP ? "<p style='color:#ff4d4d; font-weight:bold'>⚠️ High BP detected</p>" : ""}
        ${missingHR ? "<p style='color:#ffa500; font-weight:bold'>⚠️ Missing HR data</p>" : ""}
      </div>
    `;
  });
});
