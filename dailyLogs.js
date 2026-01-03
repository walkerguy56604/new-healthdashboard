export const dailyLogs = {
  "2026-01-02": {
    bloodPressure: [
      // Morning post-strength (5 min after)
      { systolic: 127, diastolic: 57, heartRate: 91, note: "Post AM strength – low hypertension" },

      // Post treadmill (midday)
      { systolic: 128, diastolic: 72, heartRate: 97, note: "Post treadmill" },

      // Post evening strength (5 min after)
      { systolic: 136, diastolic: 67, heartRate: 93, note: "Post PM strength – high hypertension (expected)" },

      // Post evening treadmill (5 min after)
      { systolic: 116, diastolic: 64, heartRate: 92, note: "Post PM treadmill – low hypertension" }
    ],

    strength: 29,
    strengthDetails: [
      {
        time: "07:48–08:03",
        duration: 15,
        exercises: "3x10 lateral raises, 3x10 biceps",
        restAfter: 5
      },
      {
        time: "16:06–16:20",
        duration: 14,
        exercises: "3x10 lateral raises, 3x10 biceps",
        restAfter: 5
      }
    ],

    treadmill: [
      {
        time: "12:25–12:35",
        speed: 1.4,
        distance: 0.24,
        calories: 11,
        avgHR: 108,
        maxHR: 151
      },
      {
        time: "Evening",
        speed: 1.4,
        distance: 0.24,
        calories: 11,
        avgHR: 118,
        maxHR: 123
      }
    ],

    walk: 0,
    glucose: [],
    calories: 22, // treadmill calories only (can refine later)

    heartRate: 92 // last recorded HR of the day (6:00 PM)
  }
};
