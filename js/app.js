/**
 * app.js — UI glue. Wires up the form, runs the generator,
 * zips the files with JSZip, and triggers the browser download.
 */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const labUrlInput = $("labUrl");
  const userNameInput = $("userName");
  const githubHandleInput = $("githubHandle");
  const notesInput = $("notes");
  const generateBtn = $("generateBtn");
  const previewBtn = $("previewBtn");
  const previewPane = $("preview");
  const previewContent = $("previewContent");
  const copyReadmeBtn = $("copyReadmeBtn");
  const platformName = $("platformName");
  const toast = $("toast");
  const installBtn = $("installBtn");

  let lastResult = null;

  /* ----- Live platform detection ----- */
  labUrlInput.addEventListener("input", () => {
    const p = window.PortfolioForge.detectPlatform(labUrlInput.value);
    if (p && labUrlInput.value.trim()) {
      platformName.textContent = p.name;
      platformName.classList.add("detected");
    } else {
      platformName.textContent = "—";
      platformName.classList.remove("detected");
    }
  });

  /* ----- Generate handler ----- */
  generateBtn.addEventListener("click", async () => {
    const url = labUrlInput.value.trim();

    if (!url) {
      showToast("Please paste a lab URL first.", "error");
      labUrlInput.focus();
      return;
    }

    // Loose URL validation
    if (!/^https?:\/\/.+/i.test(url)) {
      showToast("That doesn't look like a URL. Include https:// at the start.", "error");
      labUrlInput.focus();
      return;
    }

    if (typeof window.JSZip === "undefined") {
      showToast("ZIP library failed to load. Check your internet on first run.", "error");
      return;
    }

    setBusy(true);

    try {
      const ctx = {
        url,
        userName: userNameInput.value.trim(),
        githubHandle: githubHandleInput.value.trim(),
        notes: notesInput.value
      };

      const result = window.PortfolioForge.generatePortfolioFiles(ctx);
      lastResult = result;

      // Build ZIP
      const zip = new JSZip();
      const folder = zip.folder(result.repoName);

      Object.entries(result.files).forEach(([path, content]) => {
        folder.file(path, content);
      });

      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      downloadBlob(blob, `${result.repoName}.zip`);

      // Show preview
      previewContent.textContent = result.previewMarkdown;
      previewPane.hidden = false;
      previewBtn.hidden = false;

      showToast(`✓ Downloaded ${result.repoName}.zip — drop it in GitHub next.`);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setBusy(false);
    }
  });

  /* ----- Preview toggle ----- */
  previewBtn.addEventListener("click", () => {
    previewPane.hidden = !previewPane.hidden;
    if (!previewPane.hidden) {
      previewPane.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  /* ----- Copy README ----- */
  copyReadmeBtn.addEventListener("click", async () => {
    if (!lastResult) return;
    try {
      await navigator.clipboard.writeText(lastResult.previewMarkdown);
      showToast("✓ Markdown copied to clipboard.");
    } catch {
      showToast("Couldn't access clipboard. Select the text manually.", "error");
    }
  });

  /* ----- Keyboard shortcut: Ctrl/Cmd + Enter ----- */
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      generateBtn.click();
    }
  });

  /* ----- PWA install prompt ----- */
  let deferredInstall = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstall = e;
    installBtn.hidden = false;
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    const { outcome } = await deferredInstall.userChoice;
    if (outcome === "accepted") {
      installBtn.hidden = true;
      showToast("✓ Installed. You can launch Portfolio Forge from your apps.");
    }
    deferredInstall = null;
  });

  window.addEventListener("appinstalled", () => {
    installBtn.hidden = true;
  });

  /* ----- Helpers ----- */
  function setBusy(busy) {
    generateBtn.disabled = busy;
    generateBtn.querySelector(".btn-text").textContent = busy
      ? "./forging..."
      : "./generate-portfolio";
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  let toastTimer;
  function showToast(msg, kind) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.toggle("error", kind === "error");
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
  }
})();
