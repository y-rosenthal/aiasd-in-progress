document.addEventListener("DOMContentLoaded", () => {
  const hasScreenshots = document.querySelector("a.lightbox img");
  if (!hasScreenshots) return;

  const panelHTML = `
    <div id="screenshot-controls" class="sc-box">
      <div class="sc-header"><strong>Resize Screenshots</strong></div>

      <div class="sc-buttons">
        <button onclick="changeScreenshotSize(1.2)" class="yrSizerButton">
          <i class="bi bi-zoom-in"></i> +
        </button>
        <button onclick="changeScreenshotSize(0.8)" class="yrSizerButton">
          <i class="bi bi-zoom-out"></i> –
        </button>
        <button onclick="resetScreenshotSize()" class="yrSizerButton">
          <i class="bi bi-arrow-counterclockwise"></i> Reset
        </button>
        <button onclick="maximizeScreenshotSize()" class="yrSizerButton">
          <i class="bi bi-arrows-fullscreen"></i> Max
        </button>
      </div>

      <div class="sc-header"><strong>Hotkeys</strong></div>
      <div class="sc-hotkeys">
        <strong>bigger</strong> – ctrl/cmd + shift + B<br>
        <strong>smaller</strong> – ctrl/cmd + shift + S<br>
        <strong>max</strong> – ctrl/cmd + shift + M<br>
        <strong>reset</strong> – ctrl/cmd + shift + 0
      </div>

      <div class="sc-header"><strong>Alternative</strong></div>
      Click any screenshot to make it full screen.
    </div>
  `;

  const sidebar = document.getElementById("quarto-margin-sidebar");
  if (sidebar) sidebar.insertAdjacentHTML("afterbegin", panelHTML);

  setTimeout(initScreenshotWidths, 150);
});

let screenshotScale = 1;

function getImages() {
  return document.querySelectorAll("a.lightbox img");
}

function initScreenshotWidths() {
  getImages().forEach(img => {
    const w = parseFloat(window.getComputedStyle(img).width);
    img.dataset.originalWidth = w;
    img.dataset.baseWidth = w;
  });
}

function changeScreenshotSize(multiplier) {
  screenshotScale *= multiplier;
  screenshotScale = Math.max(0.3, Math.min(4, screenshotScale));
  applyScreenshotSize();
}

function resetScreenshotSize() {
  screenshotScale = 1;
  getImages().forEach(img => {
    img.style.width = img.dataset.originalWidth + "px";
    img.dataset.baseWidth = img.dataset.originalWidth;
  });
}

function maximizeScreenshotSize() {
  getImages().forEach(img => {
    const container = img.closest('.quarto-figure, p, div, section, main') || document.body;
    const maxWidth = Math.min(container.clientWidth, img.naturalWidth);
    img.style.width = maxWidth + "px";
    img.dataset.baseWidth = maxWidth;
  });
  screenshotScale = 1;
}

function applyScreenshotSize() {
  getImages().forEach(img => {
    img.style.width = (img.dataset.baseWidth * screenshotScale) + "px";
  });
}

document.addEventListener("keydown", (e) => {
  const mod = e.ctrlKey || e.metaKey;
  const shift = e.shiftKey;
  const k = e.key.toLowerCase();

  if (!mod || !shift) return;

  if (k === "b") changeScreenshotSize(1.2);
  if (k === "s") changeScreenshotSize(0.8);
  if (k === "m") maximizeScreenshotSize();
  if (k === "0" || k === ")") resetScreenshotSize();
});
