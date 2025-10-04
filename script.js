document.addEventListener("DOMContentLoaded", () => {
  const timeDisplay = document.getElementById("time");
  const startBtn = document.getElementById("start");
  const lapBtn = document.getElementById("lap");
  const lapsTbody = document.getElementById("laps");
  const themeToggle = document.getElementById("theme-toggle");
  const lapStats = document.getElementById("lap-stats");

  let timer = null;
  let startTime = 0;
  let elapsedBefore = 0;
  let isRunning = false;
  let lastLapTime = 0;
  let lapNumber = 0;
  let laps = [];

  //Time format to HH:MM:SS:MS
  function formatTime(ms) {
    const centiseconds = Math.floor(ms / 10);
    const cs = centiseconds % 100;
    const totalSeconds = Math.floor(centiseconds / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0") +
      "." +
      String(cs).padStart(2, "0")
    );
  }

  // Time Display Update
  function updateDisplay() {
    const now = Date.now();
    const elapsed = now - startTime + elapsedBefore;
    timeDisplay.textContent = formatTime(elapsed);
  }

  // Start Function
  function startTimer() {
    startTime = Date.now();
    timer = setInterval(updateDisplay, 33);
    isRunning = true;
    startBtn.textContent = "Pause";
    lapBtn.disabled = false;
    lapBtn.textContent = "Lap";
  }

  // Pause function
  function stopTimer() {
    clearInterval(timer);
    elapsedBefore = Date.now() - startTime + elapsedBefore;
    isRunning = false;
    startBtn.textContent = "Resume";
    lapBtn.textContent = "Reset";
  }

  // Reset Function
  function resetAll() {
    clearInterval(timer);
    startTime = 0;
    elapsedBefore = 0;
    lastLapTime = 0;
    lapNumber = 0;
    laps = [];
    isRunning = false;
    timeDisplay.textContent = "00:00:00.00";
    lapsTbody.innerHTML = "";
    lapStats.textContent = "";
    startBtn.textContent = "Start";
    lapBtn.textContent = "Lap";
    lapBtn.disabled = true;
    startBtn.classList.remove("pause");
  }

  // Lap stats update
  function updateStats() {
    if (laps.length < 1) return;
    const splits = laps.map((l) => l.split);
    const avg = splits.reduce((a, b) => a + b, 0) / splits.length;
    const best = Math.min(...splits);
    lapStats.textContent = `Avg: ${formatTime(avg)} | Best: ${formatTime(
      best
    )}`;
  }

  // Lap highlight
  function highlightLaps() {
    if (laps.length < 3) return;
    laps.forEach((lap) =>
      lap.row.classList.remove("lap-fastest", "lap-slowest", "lap-normal")
    );
    const oldLaps = laps.slice(1);
    const minSplit = Math.min(...oldLaps.map((l) => l.split));
    const maxSplit = Math.max(...oldLaps.map((l) => l.split));
    oldLaps.forEach((lap) => {
      if (lap.split === minSplit) lap.row.classList.add("lap-fastest");
      else if (lap.split === maxSplit) lap.row.classList.add("lap-slowest");
      else lap.row.classList.add("lap-normal");
    });
  }

  // Add Lap
  function addLap() {
    const elapsed = Date.now() - startTime + elapsedBefore;
    const split = elapsed - lastLapTime;
    lastLapTime = elapsed;
    lapNumber++;
    const tr = document.createElement("tr");
    tr.classList.add("lap-row");
    tr.innerHTML = `<td>${lapNumber}</td><td>${formatTime(
      split
    )}</td><td>${formatTime(elapsed)}</td>`;
    lapsTbody.insertBefore(tr, lapsTbody.firstChild);
    setTimeout(() => tr.classList.add("show"), 10);
    laps.unshift({ split, row: tr });
    highlightLaps();
    updateStats();
    lapsTbody.parentElement.scrollTop = 0;
  }

  // Button control
  startBtn.addEventListener("click", () => {
    if (!isRunning && startBtn.textContent === "Start") {
      startTimer(); // Start
    } else if (isRunning) {
      stopTimer(); // Pause
    } else {
      startTimer(); // Resume
    }
  });

  lapBtn.addEventListener("click", () => {
    if (isRunning) {
      addLap();
    } else {
      resetAll();
    }
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light")
      ? "Dark"
      : "Light";
  });
});
