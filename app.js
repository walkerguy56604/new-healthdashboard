// =======================
// Update 2025-12-31 (all activities & readings)
// =======================
dailyLogs["2025-12-31"] = dailyLogs["2025-12-31"] || {
  bloodPressure: [],
  glucose: [],
  walk: 0,
  treadmill: 0,
  strength: 0,
  calories: 0,
  heartRate: 0
};

// Morning readings
dailyLogs["2025-12-31"].bloodPressure.push(
  { systolic: 130, diastolic: 69, heartRate: 80 }, // first morning
  { systolic: 121, diastolic: 67, heartRate: 80 }  // second morning
);
dailyLogs["2025-12-31"].glucose.push({ value: 5.4 }); // morning glucose

// Post-strength training
dailyLogs["2025-12-31"].bloodPressure.push({ systolic: 144, diastolic: 75, heartRate: 87 });

// After treadmill
dailyLogs["2025-12-31"].treadmill += 10;
dailyLogs["2025-12-31"].calories += 12;
dailyLogs["2025-12-31"].heartRate = 141; // average HR during treadmill
dailyLogs["2025-12-31"].bloodPressure.push({ systolic: 132, diastolic: 73, heartRate: 86 });

// After-dinner walk & treadmill
dailyLogs["2025-12-31"].walk += 45;
dailyLogs["2025-12-31"].treadmill += 10;
dailyLogs["2025-12-31"].calories += 11;
dailyLogs["2025-12-31"].heartRate = 88; // post-activity HR
dailyLogs["2025-12-31"].bloodPressure.push({ systolic: 125, diastolic: 59, heartRate: 88 });
