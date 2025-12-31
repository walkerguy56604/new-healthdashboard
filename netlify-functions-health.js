export async function handler() {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: "2025-12-30",
      walk: {
        minutes: 15,
        distance_km: 0.48
      },
      treadmill: {
        minutes: 10,
        speed: 1.4,
        distance_km: 0.24,
        avg_hr: 115,
        max_hr: 154
      },
      strength: {
        exercises: ["lateral raises", "biceps"],
        sets: 3,
        reps: 10
      },
      blood_pressure: {
        systolic: 126,
        diastolic: 69,
        pulse: 93,
        label: "M hypertension"
      }
    })
  };
}
