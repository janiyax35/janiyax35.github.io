/* =====================================================================
   JD//OPS · custom right-click menu
   - Shift + right-click opens the browser's normal menu (escape hatch)
   - The normal menu is kept in text fields, the terminal, and dialogs
   - Mouse only: touch devices keep their long-press behaviour
   ===================================================================== */

(() => {
  "use strict";

  if (!matchMedia("(pointer: fine)").matches) return;

  const D = window.JD;
  const P = D.profile;
  const app = () => window.JDApp || {};
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const KEEP_NATIVE = "input, textarea, select, [contenteditable], .xterm";

  const menu = document.createElement("div");
  menu.className = "ctx";
  menu.id = "ctx";
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", "Site menu");
  menu.tabIndex = -1;
  menu.hidden = true;
  document.body.appendChild(menu);

  let actions = [], lastFocus = null, isOpen = false;

  /* ---------- helpers ---------- */
  function currentSection() {
    let name = document.body.dataset.page === "lab" ? "~/lab" : "~/home";
    document.querySelectorAll("main > section[id]").forEach((s) => {
      if (s.getBoundingClientRect().top <= innerHeight * 0.35) {
        name = s.dataset.label || (s.querySelector("h2") ? s.querySelector("h2").textContent.trim() : "~/" + s.id);
      }
    });
    return name;
  }
  async function copy(text, what) {
    try { await navigator.clipboard.writeText(text); app().toast && app().toast("[OK] COPIED", what); }
    catch (e) { app().toast && app().toast("[!] COPY FAILED", what); }
  }
  const openTab = (url) => window.open(url, "_blank", "noopener");

  /* ---------- build the menu for what was right-clicked ---------- */
  function build(target) {
    actions = [];
    const act = (fn) => { actions.push(fn); return actions.length - 1; };
    const item = (ico, label, fn, key = "") =>
      `<button type="button" class="ctx__item" role="menuitem" data-a="${act(fn)}"><span class="ico">${ico}</span><span class="lbl">${esc(label)}</span>${key ? `<kbd>${key}</kbd>` : ""}</button>`;
    const sep = '<div class="ctx__sep" role="separator"></div>';
    const isLab = app().page === "lab";

    // context-specific items
    const ctx = [];
    const selection = String(window.getSelection() || "").trim();
    if (selection) ctx.push(item("⧉", "Copy selection", () => copy(selection, "selection")));
    const link = target.closest("a[href]");
    if (link) {
      const raw = link.getAttribute("href");
      if (raw.startsWith("mailto:")) {
        ctx.push(item("@", "Copy email address", () => copy(raw.slice(7).split("?")[0], "email")));
      } else if (raw.startsWith("tel:")) {
        ctx.push(item("☏", "Copy phone number", () => copy(raw.slice(4), "phone")));
      } else {
        if (!raw.startsWith("#")) ctx.push(item("↗", "Open link in new tab", () => openTab(link.href)));
        ctx.push(item("⎘", "Copy link address", () => copy(link.href, "link")));
      }
    }
    const card = target.closest(".case[data-slug]");
    if (card) {
      const p = D.projects.find((x) => x.slug === card.dataset.slug);
      if (p) {
        ctx.push(item("▣", "Open case file", () => app().openCase && app().openCase(p.slug)));
        if (p.live) ctx.push(item("●", "Open live platform", () => openTab(p.live)));
        ctx.push(p.private
          ? item("✉", "Request repo access", () => { location.href = app().repoRequest(p); })
          : item("↗", "Open repo", () => openTab(p.repo)));
      }
    }

    const mode = document.documentElement.dataset.mode || "ops";
    const modeBtn = (m) => `<button type="button" role="menuitemradio" aria-checked="${m === mode}" data-a="${act(() => app().setMode && app().setMode(m))}">${m.toUpperCase()}</button>`;

    const flags = window.JDCTF ? window.JDCTF.state() : { solved: [], total: 6 };

    return `
      <div class="ctx__head mono"><span class="accent">jd@ops</span><span>${esc(currentSection())}</span></div>
      <div class="ctx__row" role="group" aria-label="Navigation">
        <button type="button" class="ctx__icon" role="menuitem" title="Back" aria-label="Back" data-a="${act(() => history.back())}">←</button>
        <button type="button" class="ctx__icon" role="menuitem" title="Reload" aria-label="Reload" data-a="${act(() => location.reload())}">↻</button>
        <button type="button" class="ctx__icon" role="menuitem" title="Back to top" aria-label="Back to top" data-a="${act(() => app().goto && app().goto("top"))}">↑</button>
      </div>
      ${ctx.length ? sep + ctx.join("") : ""}
      ${sep}
      ${item("◎", "Quick view", () => app().openQuickView && app().openQuickView(), "Q")}
      ${item("›", "Command palette", () => app().openPalette && app().openPalette(), "Ctrl K")}
      ${item(">", "Open terminal", () => app().openTerminal && app().openTerminal())}
      ${item("↓", "Download CV", () => app().downloadCV && app().downloadCV())}
      ${item("@", "Copy email", () => app().copyEmail && app().copyEmail())}
      ${sep}
      <div class="ctx__modes" role="group" aria-label="Team mode"><span>mode</span>${["ops", "red", "blue"].map(modeBtn).join("")}</div>
      ${sep}
      ${isLab ? item("←", "Back to portfolio", () => { location.href = "index.html"; })
              : item("⚑", "Enter The Lab ↗", () => app().goto && app().goto("lab"))}
      <div class="ctx__foot mono">flags <b>${flags.solved.length}/${flags.total}</b> · page source holds secrets (Ctrl+U)<br>Shift + right-click: browser menu</div>`;
  }

  /* ---------- open / close ---------- */
  function focusables() { return [...menu.querySelectorAll("button")]; }

  function open(x, y, target) {
    lastFocus = document.activeElement;
    menu.innerHTML = build(target);
    menu.hidden = false;
    menu.classList.remove("is-open");
    // keep it on screen: flip left/up near the edges
    const w = menu.offsetWidth, h = menu.offsetHeight, pad = 8;
    const left = x + w + pad > innerWidth ? Math.max(pad, x - w) : x;
    const top = y + h + pad > innerHeight ? Math.max(pad, y - h) : y;
    menu.style.left = left + "px";
    menu.style.top = top + "px";
    menu.style.transformOrigin = `${left < x ? "right" : "left"} ${top < y ? "bottom" : "top"}`;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    menu.focus({ preventScroll: true });
    isOpen = true;
  }

  function close(restoreFocus = false) {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove("is-open");
    menu.hidden = true;
    if (restoreFocus && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- events ---------- */
  document.addEventListener("contextmenu", (e) => {
    if (menu.contains(e.target)) { e.preventDefault(); return; }
    if (e.shiftKey) { close(); return; }                                   // escape hatch
    if (e.target.closest && e.target.closest(KEEP_NATIVE)) { close(); return; }
    if (document.querySelector("dialog[open]")) { close(); return; }       // dialogs sit above the menu
    if (document.documentElement.classList.contains("is-booting")) return;
    e.preventDefault();
    let x = e.clientX, y = e.clientY;
    if (!x && !y && document.activeElement) {                              // keyboard: Menu key / Shift+F10
      const r = document.activeElement.getBoundingClientRect();
      x = r.left + 12; y = r.bottom;
    }
    open(x, y, e.target);
  });

  menu.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]");
    if (!b) return;
    const fn = actions[+b.dataset.a];
    close();
    if (fn) setTimeout(fn, 0);
  });

  menu.addEventListener("keydown", (e) => {
    const list = focusables();
    const i = list.indexOf(document.activeElement);
    const move = (d) => { e.preventDefault(); list[(i + d + list.length) % list.length].focus(); };
    if (e.key === "ArrowDown" || e.key === "ArrowRight") move(1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") move(i < 0 ? 0 : -1);
    else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
    else if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "Tab") { close(); return; }
    else return;
    e.stopPropagation(); // keep site shortcuts (and the Konami listener) quiet while the menu is open
  });

  document.addEventListener("pointerdown", (e) => { if (isOpen && !menu.contains(e.target)) close(); }, true);
  addEventListener("wheel", () => close(), { passive: true });
  addEventListener("scroll", () => close(), { passive: true });
  addEventListener("resize", () => close());
  addEventListener("blur", () => close());
})();
