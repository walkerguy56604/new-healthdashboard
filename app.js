// Health Dashboard 3: Core App Skeleton

// In-memory store (later we can save to JSON/CSV)
const healthData = {
    daily: {
        walk: { duration: 0, distance: 0 },
        treadmill: { duration: 0, distance: 0 },
        strength: { reps: 0, exercises: 0 },
        calories: 0,
        avgHeartRate: null
    }
};

// Function to update daily summary in the page
function renderDailySummary() {
    const summary = healthData.daily;
    const div = document.getElementById('daily-summary');
    div.innerHTML = `
        <p>Walk Duration: ${summary.walk.duration} min (${summary.walk.distance} km)</p>
        <p>Treadmill Duration: ${summary.treadmill.duration} min (${summary.treadmill.distance} km)</p>
        <p>Strength Duration: ${summary.strength.reps} reps (${summary.strength.exercises} exercises)</p>
        <p>Calories Burned: ${summary.calories}</p>
        <p>Average Heart Rate: ${summary.avgHeartRate ?? 'N/A'}</p>
    `;
}

// Functions to log activities
function logWalk(duration, distance, calories=0, avgHR=null) {
    healthData.daily.walk.duration += duration;
    healthData.daily.walk.distance += distance;
    healthData.daily.calories += calories;
    healthData.daily.avgHeartRate = avgHR;
    renderDailySummary();
}

function logTreadmill(duration, distance, calories=0, avgHR=null) {
    healthData.daily.treadmill.duration += duration;
    healthData.daily.treadmill.distance += distance;
    healthData.daily.calories += calories;
    healthData.daily.avgHeartRate = avgHR;
    renderDailySummary();
}

function logStrength(reps, exercises, calories=0, avgHR=null) {
    healthData.daily.strength.reps += reps;
    healthData.daily.strength.exercises += exercises;
    healthData.daily.calories += calories;
    healthData.daily.avgHeartRate = avgHR;
    renderDailySummary();
}

// Initial render
renderDailySummary();

// Example usage (comment out if not needed)
// logWalk(5, 0.4, 12, 107);
// logTreadmill(10, 0.24, 12, 109);
// logStrength(30, 6, 120, 90);
