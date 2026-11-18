/* Deliberately runs before the static module graph. It owns no saved data. */
(function () {
  var root = document.getElementById("root"), observer, deadline;
  if (!root) return;
  var surface = document.getElementById("clinic-loading-screen");
  if (!surface || surface.id !== "clinic-loading-screen") surface = null;
  if (surface) {
    try {
      var lines = JSON.parse(document.getElementById("clinic-loading-taglines").textContent), previous = null;
      try { previous = window.sessionStorage.getItem("stitchin-time.intro-tagline.last.v1"); } catch (_) {}
      var special = "Saves nine, pending prior authorization.", eligible = previous !== special;
      var ordinary = lines.filter(function (line) { return line !== previous && line !== special; });
      var roll = Math.random(), adjusted = eligible ? Math.max(0, (roll - 0.1) / 0.9) : roll;
      var tagline = eligible && roll < 0.1 ? special : ordinary[Math.min(ordinary.length - 1, Math.floor(adjusted * ordinary.length))];
      surface.querySelector("[data-loading-tagline-slot]").textContent = tagline;
      surface.setAttribute("data-loading-tagline", tagline);
    } catch (_) { /* A subtitle preference cannot hold the opening hostage. */ }
    if (typeof window.setTimeout === "function") deadline = window.setTimeout(function () { failed({ type: "deadline" }); }, 30000);
  }
  function stop() {
    window.removeEventListener("error", failed, true);
    window.removeEventListener("unhandledrejection", failed);
    if (observer) observer.disconnect();
    if (deadline) window.clearTimeout(deadline);
  }
  function painted() {
    if (surface ? surface.getAttribute("data-loading-managed") === "true" : root.childNodes.length || document.querySelector("[data-loading-state]")) { stop(); return true; }
    return false;
  }
  function failed(event) {
    if (painted()) return;
    // Optional image/font/style failures must not replace the opening screen.
    if (event.type === "error" && event.target && event.target.tagName && event.target.tagName !== "SCRIPT") return;
    if (event.preventDefault) event.preventDefault();
    stop();
    var message = "Game data could not load. Reload to try again. Your saves have not changed.";
    if (surface) {
      surface.setAttribute("data-loading-state", "failed");
      var status = surface.querySelector("#clinic-loading-status"); status.textContent = message; status.setAttribute("role", "alert");
    } else root.textContent = message;
    var retry = document.createElement("button"); retry.textContent = "Reload";
    retry.addEventListener("click", function () { window.location.reload(); });
    (surface ? surface.querySelector("[data-loading-boot-actions]") : root).appendChild(retry);
  }
  window.addEventListener("error", failed, true);
  window.addEventListener("unhandledrejection", failed);
  if (typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(painted);
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
