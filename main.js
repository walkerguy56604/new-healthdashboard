async function loadDailyLogs() {
  try {
    const res = await fetch("dailyLogs.json");
    const data = await res.json();

    const dateSelect = document.getElementById("dateSelect");
    dateSelect.innerHTML = "";

    Object.keys(data).sort().reverse().forEach(date => {
      const option = document.createElement("option");
      option.value = date;
      option.textContent = date;
      dateSelect.appendChild(option);
    });

    dateSelect.addEventListener("change", () => {
      renderDay(data[dateSelect.value]);
    });

    renderDay(data[dateSelect.value]);
  } catch (err) {
    console.error("Failed to load daily logs", err);
  }
}

function renderDay(log) {
  setText("walk", log.walk);
  setText("strength", log.strength);
  setText("treadmill", log.treadmill);
  setText("calories", log.calories);
  setText("weight", log.weight);
  setText("glucose", log.glucose);
  setText("sleep", log.sleep);
  setText("hrv", log.hrv);
  setText("mood", log.mood);

  renderBloodPressure(log.bloodPressure);
}

function setText(id, value) {
  document.getElementById(id).textContent =
    value !== undefined && value !== null ? value : "—";
}

function renderBloodPressure(bpArray) {
  const el = document.getElementById("bp");

  if (!Array.isArray(bpArray) || bpArray.length === 0) {
    el.textContent = "—";
    return;
  }

  el.textContent = bpArray.map(bp => {
    const sys = bp.systolic ?? bp.sys ?? "—";
    const dia = bp.diastolic ?? bp.dia ?? "—";
    const hr  = bp.pulse ?? bp.hr ?? bp.heartRate ?? "";

    return hr
      ? `${sys}/${dia} (HR ${hr})`
      : `${sys}/${dia}`;
  }).join(" • ");
}

loadDailyLogs();
