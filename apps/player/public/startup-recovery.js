/* Deliberately runs before the static module graph. It owns no saved data. */
(function () {
  var root = document.getElementById("root"), observer;
  if (!root) return;
  function stop() {
    window.removeEventListener("error", failed, true);
    window.removeEventListener("unhandledrejection", failed);
    if (observer) observer.disconnect();
  }
  function painted() {
    if (root.childNodes.length || document.querySelector("[data-loading-state]")) { stop(); return true; }
    return false;
  }
  function failed(event) {
    if (painted()) return;
    // Optional image/font/style failures must not replace the opening screen.
    if (event.type === "error" && event.target && event.target.tagName && event.target.tagName !== "SCRIPT") return;
    if (event.preventDefault) event.preventDefault();
    stop();
    root.textContent = "Game data could not load. Reload to try again. Your saves have not changed.";
    var retry = document.createElement("button"); retry.textContent = "Reload";
    retry.addEventListener("click", function () { window.location.reload(); });
    root.appendChild(retry);
  }
  window.addEventListener("error", failed, true);
  window.addEventListener("unhandledrejection", failed);
  if (typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(painted);
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
