const operators = [
  { name: "Mateo R.", callsign: "Ghost", role: "Líder de equipo", equipment: "M4 · Asalto", team: "alfa" },
  { name: "Lucía V.", callsign: "Valkyrie", role: "Médica de campo", equipment: "SMG · Soporte", team: "alfa" },
  { name: "Franco D.", callsign: "Nomad", role: "Explorador", equipment: "M4 · Ligero", team: "alfa" },
  { name: "Tomás S.", callsign: "Reaper", role: "Tirador selecto", equipment: "DMR · Alcance", team: "alfa" },
  { name: "Juan C.", callsign: "Havoc", role: "Líder de equipo", equipment: "AK · Asalto", team: "omega" },
  { name: "Sofía M.", callsign: "Echo", role: "Comunicaciones", equipment: "SMG · Radio", team: "omega" },
  { name: "Nicolás P.", callsign: "Atlas", role: "Asalto pesado", equipment: "LMG · Contención", team: "omega" },
  { name: "Valentín A.", callsign: "Scope", role: "Reconocimiento", equipment: "DMR · Alcance", team: "omega" },
];

const intro = document.querySelector("#intro");
const app = document.querySelector("#app");
const progressBar = document.querySelector("#progress-bar");
const loadingProgress = document.querySelector("#loading-progress");
const loadingText = document.querySelector("#loading-text");
const teamList = document.querySelector("#team-list");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let introTimers = [];
let currentFilter = "todos";

function teamName(team) {
  return team === "alfa" ? "Alfa" : "Omega";
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

function renderOperators(filter = "todos") {
  currentFilter = filter;
  const visibleOperators = operators.filter((operator) => filter === "todos" || operator.team === filter);

  teamList.innerHTML = visibleOperators
    .map(
      (operator, index) => `
        <article class="operator-row" data-team="${operator.team}" style="animation-delay:${index * 35}ms">
          <span class="operator-number">${String(operators.indexOf(operator) + 1).padStart(2, "0")}</span>
          <div class="operator-main">
            <span class="operator-avatar" aria-hidden="true">${initials(operator.name)}</span>
            <div>
              <strong class="operator-name">${operator.name}</strong>
              <span class="operator-callsign">Indicativo: ${operator.callsign}</span>
            </div>
          </div>
          <span class="operator-role">${operator.role}</span>
          <span class="operator-equipment">${operator.equipment}</span>
          <span class="team-badge ${operator.team}">${teamName(operator.team)}</span>
        </article>
      `,
    )
    .join("");
}

function clearIntroTimers() {
  introTimers.forEach(window.clearTimeout);
  introTimers = [];
}

function completeIntro() {
  clearIntroTimers();
  intro.classList.add("is-complete");
  intro.setAttribute("aria-hidden", "true");
  app.classList.remove("hidden");
  document.body.style.overflow = "";
  window.setTimeout(() => intro.classList.add("hidden"), 650);
}

function schedule(callback, delay) {
  introTimers.push(window.setTimeout(callback, delay));
}

function playIntro() {
  clearIntroTimers();
  intro.classList.remove("hidden", "is-complete");
  intro.removeAttribute("aria-hidden");
  app.classList.add("hidden");
  document.body.style.overflow = "hidden";
  progressBar.style.width = "0%";
  loadingProgress.textContent = "00%";
  loadingText.textContent = "Verificando credenciales";

  if (reducedMotion) {
    completeIntro();
    return;
  }

  const duration = 3200;
  const start = performance.now();
  const messages = [
    [0, "Verificando credenciales"],
    [900, "Encriptando conexión"],
    [1750, "Descargando orden de combate"],
    [2550, "Acceso autorizado"],
  ];

  messages.forEach(([delay, message]) => schedule(() => (loadingText.textContent = message), delay));

  function updateProgress(timestamp) {
    if (intro.classList.contains("is-complete")) return;
    const elapsed = timestamp - start;
    const value = Math.min(100, Math.round((elapsed / duration) * 100));
    progressBar.style.width = `${value}%`;
    loadingProgress.textContent = `${String(value).padStart(2, "0")}%`;
    if (value < 100) {
      requestAnimationFrame(updateProgress);
    }
  }

  requestAnimationFrame(updateProgress);
  schedule(completeIntro, duration + 180);
}

function updateCountdown() {
  const targetKey = "eclipse-operation-start";
  const fallback = Date.now() + 102 * 60 * 1000;
  let target = Number(sessionStorage.getItem(targetKey));

  if (!target) {
    target = fallback;
    sessionStorage.setItem(targetKey, String(target));
  }

  const remaining = Math.max(0, target - Date.now());
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  document.querySelector("#countdown").textContent = [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

document.querySelector("#skip-intro").addEventListener("click", completeIntro);
document.querySelector("#replay-intro").addEventListener("click", () => {
  window.scrollTo({ top: 0 });
  playIntro();
});

document.querySelectorAll(".team-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".team-tab").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    renderOperators(button.dataset.filter);
  });
});

document.querySelectorAll(".section-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".section-nav a").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

renderOperators(currentFilter);
document.querySelector("#all-count").textContent = String(operators.length);
updateCountdown();
window.setInterval(updateCountdown, 1000);
playIntro();
