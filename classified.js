const intro = document.querySelector("#intro");
const app = document.querySelector("#app");
const progressBar = document.querySelector("#progress-bar");
const loadingProgress = document.querySelector("#loading-progress");
const loadingText = document.querySelector("#loading-text");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const team = document.body.dataset.team;
const copyButton = document.querySelector("#copy-code");
let introTimers = [];

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

  if (reducedMotion) {
    completeIntro();
    return;
  }

  const duration = 2800;
  const start = performance.now();
  const messages = [
    [0, "Analizando huella del enlace"],
    [750, `Autenticando equipo ${team.toUpperCase()}`],
    [1550, "Desencriptando ventaja táctica"],
    [2250, "Acceso exclusivo concedido"],
  ];

  messages.forEach(([delay, message]) =>
    schedule(() => {
      loadingText.textContent = message;
    }, delay),
  );

  function updateProgress(timestamp) {
    if (intro.classList.contains("is-complete")) return;
    const value = Math.min(100, Math.round(((timestamp - start) / duration) * 100));
    progressBar.style.width = `${value}%`;
    loadingProgress.textContent = `${String(value).padStart(2, "0")}%`;
    if (value < 100) requestAnimationFrame(updateProgress);
  }

  requestAnimationFrame(updateProgress);
  schedule(completeIntro, duration + 180);
}

document.querySelector("#skip-intro").addEventListener("click", completeIntro);
document.querySelector("#replay-intro").addEventListener("click", () => {
  window.scrollTo({ top: 0 });
  playIntro();
});

copyButton.addEventListener("click", async () => {
  const code = document.querySelector("#mission-code").textContent.trim();
  try {
    await navigator.clipboard.writeText(code);
    copyButton.textContent = "Código copiado ✓";
  } catch {
    copyButton.textContent = "Copiá el código manualmente";
  }
  window.setTimeout(() => {
    copyButton.textContent = "Copiar código";
  }, 2600);
});

playIntro();
