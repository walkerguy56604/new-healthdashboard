import { dailyLogs } from './dailylogs.js'; // Make sure path is correct
import { renderDailySummary } from './main.js'; // Use the new main.js function

// ====== Elements ======
const datePicker = document.getElementById("datePicker");
const bpFilter = document.getElementById("bpFilter"); // optional filter dropdown

// ====== Populate Date Picker ======
Object.keys(dailyLogs).sort().forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.text = date;
    datePicker.appendChild(option);
});

// ====== Refresh Summary ======
function refreshSummary() {
    renderDailySummary(datePicker.value, bpFilter ? bpFilter.value : "all");
}

// ====== Event Listeners ======
datePicker.addEventListener("change", refreshSummary);
if (bpFilter) bpFilter.addEventListener("change", refreshSummary);

// ====== Initial Render ======
if (datePicker.options.length) {
    datePicker.value = datePicker.options[0].value;
    refreshSummary();
}
