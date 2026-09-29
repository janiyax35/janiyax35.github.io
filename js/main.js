/* =====================================================================
   JD//OPS · main controller
   ===================================================================== */

(() => {
  "use strict";

  const D = window.JD;
  const P = D.profile;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const ext = 'target="_blank" rel="noopener noreferrer"';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  const hasGSAP = !!window.gsap;
  const hasST = hasGSAP && !!window.ScrollTrigger;
  const hasScramble = hasGSAP && !!window.ScrambleTextPlugin;
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (hasScramble) gsap.registerPlugin(ScrambleTextPlugin);
  const animate = hasST && !reduced;
  if (animate) html.classList.add("anim");

  /* ================================================================
     RENDER
     ================================================================ */
  function render() {
    // hero scan
    $("#scan-table").insertAdjacentHTML("beforeend", D.scan.map((r) =>
      `<div class="scan__row is-hidden" role="row"><span role="cell">${esc(r.p)}</span><span role="cell" class="s">${esc(r.s)}</span><span role="cell">${esc(r.svc)}</span><span role="cell" class="v">${esc(r.v)}</span></div>`
    ).join(""));
    $("#scan-status").textContent = P.status.toLowerCase().startsWith("open") ? "open to opportunities" : "online";
    $("#id-status").textContent = P.status;

    // ticker (duplicated for seamless loop)
    const t = D.ticker.map(([lv, m]) => `<span class="ticker__item"><b class="lv-${lv}">[${lv.toUpperCase()}]</b>${esc(m)}</span>`).join("");
    $("#ticker").innerHTML = t + t;

    // principles
    $("#principles").innerHTML = D.principles.map((p) =>
      `<div class="principle"><span class="principle__k">${esc(p.k)}</span><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div>`).join("");

    // arsenal
    $("#arsenal-grid").innerHTML = D.skills.map((g, i) => `
      <div class="panel skill-group${g.wide ? " skill-group--wide" : ""}" data-reveal>
        <div class="panel__head"><span>[${String(i + 1).padStart(2, "0")}] ${esc(g.title)}</span><span>${g.items.length} mod</span></div>
        <div class="panel__body">${g.items.map((s) => `<span class="chip"${s.team ? ` data-team="${s.team}"` : ""}>${esc(s.n)}</span>`).join("")}</div>
        ${g.wide ? `<div class="skill-legend"><span><i style="background:var(--red)"></i>offensive</span><span><i style="background:var(--cyan)"></i>defensive</span><span><i style="background:linear-gradient(90deg,var(--red) 50%,var(--cyan) 50%)"></i>both</span></div>` : ""}
      </div>`).join("");

    // kill chain
    const K = D.killchain, p2 = (i) => String(i).padStart(2, "0");
    const tools = (arr) => arr.map((t) => `<span class="chip">${esc(t)}</span>`).join("");
    $("#kc-rail").insertAdjacentHTML("beforeend", K.map((s, i) =>
      `<li class="kc__node" data-i="${i}"><button type="button" aria-label="Stage ${i + 1}: ${esc(s.n)}"><span class="kc__dot">${p2(i + 1)}</span><span class="kc__name">${esc(s.n)}<small>${esc(s.short)}</small></span></button></li>`).join(""));
    $("#kc-stages").innerHTML = K.map((s, i) => `
      <article class="panel kc-stage" data-i="${i}">
        <div class="panel__head"><span>stage <b class="accent">${p2(i + 1)}</b> / ${p2(K.length)}</span><span>ATT&amp;CK · ${esc(s.attack)}</span></div>
        <div class="panel__body">
          <span class="kc-stage__num" aria-hidden="true">${p2(i + 1)}</span>
          <h3 class="kc-stage__title">${esc(s.n)}</h3>
          <p class="kc-stage__sum">${esc(s.sum)}</p>
          <div class="kc-duel">
            <div class="kc-side kc-side--atk" data-team="red"><span class="kc-side__label">▲ attack</span><p>${esc(s.atk)}</p><div class="kc-side__tools">${tools(s.atkTools)}</div></div>
            <div class="kc-side kc-side--def" data-team="blue"><span class="kc-side__label">■ defend</span><p>${esc(s.def)}</p><div class="kc-side__tools">${tools(s.defTools)}</div></div>
          </div>
        </div>
      </article>`).join("");

    // case files
    $("#cases-grid").innerHTML = D.projects.map((p) => `
      <article class="panel case${p.featured ? " case--featured" : ""}" data-slug="${p.slug}"${p.team ? ` data-team="${p.team}"` : ""} data-reveal>
        <div class="case__top"><span class="case__id">${esc(p.id)}</span><span>${esc(p.type)}</span></div>
        <div class="case__body">
          <h3 class="case__title">${esc(p.title)}</h3>
          <p class="case__sum">${esc(p.summary)}</p>
          <div class="case__stack">${p.stack.slice(0, p.featured ? 6 : 4).map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
          <div class="case__metric"><b>${esc(p.metric.v)}</b><span>${esc(p.metric.l)}</span></div>
        </div>
        <div class="case__actions">
          <button type="button" class="btn btn--primary" data-case="${p.slug}">Open file</button>
          <a class="btn" href="${esc(p.repo)}" ${ext}>Repo ↗</a>
        </div>
      </article>`).join("");
    $("#extras").innerHTML = D.extraProjects.map((x) =>
      `<div class="extra"><b>${esc(x.t)}</b><span>${esc(x.s)}</span><p style="margin:0">${esc(x.d)}</p></div>`).join("");

    // research
    const R = D.research;
    $("#paper-title").textContent = R.title;
    $("#paper-meta").textContent = R.meta;
    $("#paper-points").innerHTML = R.points.map((p) => `<li>${esc(p)}</li>`).join("");
    $("#paper-era").innerHTML = R.era.map((e) => `<li><div class="era__y">${esc(e.y)}</div><p class="era__t">${esc(e.t)}</p><p class="era__d">${esc(e.d)}</p></li>`).join("");
    $("#threats").innerHTML = R.threats.map((t, i) =>
      `<div class="threat" data-reveal><span class="threat__n">T-0${i + 1}</span><h4>${esc(t.n)}</h4><p>${esc(t.d)}</p></div>`).join("");

    // intel
    $("#thm-stats").innerHTML = D.thm.stats.map((s) =>
      `<div class="stat" data-reveal><span class="stat__src">THM</span><div class="stat__v">${s.pre ? `<small>${esc(s.pre)}</small>` : ""}<span data-count="${s.v}">${s.v}</span>${s.suf ? `<small>${esc(s.suf)}</small>` : ""}</div><div class="stat__l">${esc(s.l)}</div></div>`).join("");
    $("#thm-paths").innerHTML = D.thm.paths.map((p) =>
      `<li><span class="st st--${p.s}">${p.s === "done" ? "✓" : "◌"}</span><span class="grow">${esc(p.n)}</span><span class="meta">${esc(p.d)}</span></li>`).join("");
    if (P.tryhackme) { const a = $("#thm-link"); a.href = P.tryhackme; a.hidden = false; }
    $("#certs").innerHTML = D.certs.map((c) =>
      `<li><span class="st st--${c.s} mono">${c.s === "done" ? "✓" : "◌"}</span><span class="grow">${esc(c.t)}<span class="sub">${esc(c.o)}</span></span></li>`).join("");
    $("#cert-count").textContent = `${D.certs.filter((c) => c.s === "done").length} done · ${D.certs.filter((c) => c.s !== "done").length} in progress`;
    $("#gitlog").innerHTML = D.log.map((l) => `
      <div class="commit">
        <div class="commit__graph"></div>
        <div class="commit__body">
          <div class="commit__line"><span class="commit__hash">${esc(l.h)}</span>${l.ref ? `<span class="commit__ref">${esc(l.ref)}</span>` : ""}<span class="commit__date">${esc(l.d)}</span></div>
          <p class="commit__msg"><span class="commit__type">${esc(l.type)}:</span> ${esc(l.m)}</p>
        </div>
      </div>`).join("");
  }

  /* ================================================================
     TOASTS
     ================================================================ */
  function toast(title, body = "", ms = 2800) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<b>${esc(title)}</b>${body ? `<span>${esc(body)}</span>` : ""}`;
    $("#toasts").appendChild(el);
    setTimeout(() => { el.classList.add("is-out"); setTimeout(() => el.remove(), 320); }, ms);
  }

  /* ================================================================
     BOOT
     ================================================================ */
  function boot() {
    const el = $("#boot");
    let seen = false;
    try { seen = sessionStorage.getItem("jd.booted"); } catch (e) { /* ignore */ }
    if (seen || reduced) { el.remove(); return Promise.resolve(); }
    html.classList.add("is-booting");
    return new Promise((resolve) => {
      const out = $("#boot-log"), bar = $("#boot-progress");
      let i = 0, done = false;
      const finish = () => {
        if (done) return;
        done = true;
        try { sessionStorage.setItem("jd.booted", "1"); } catch (e) { /* ignore */ }
        removeEventListener("keydown", finish, true);
        el.classList.add("is-done");
        html.classList.remove("is-booting");
        setTimeout(() => { el.remove(); }, 460);
        resolve();
      };
      addEventListener("keydown", finish, true);
      el.addEventListener("click", finish);
      const tick = () => {
        if (done) return;
        if (i >= D.boot.length) { setTimeout(finish, 350); return; }
        const [lv, msg] = D.boot[i++];
        const tag = lv === "ok" ? '<span class="ok">[  OK  ]</span> ' : lv === "warn" ? '<span class="warn">[ WARN ]</span> ' : "";
        out.insertAdjacentHTML("beforeend", tag + esc(msg) + "\n");
        bar.style.width = (i / D.boot.length) * 100 + "%";
        setTimeout(tick, i < 2 ? 160 : 70 + Math.random() * 70);
      };
      tick();
    });
  }

  /* ================================================================
     HERO
     ================================================================ */
  function heroIntro() {
    const rows = $$("#scan-table .scan__row.is-hidden");
    const state = $("#scan-state");
    const revealRows = () => {
      rows.forEach((r, i) => setTimeout(() => r.classList.remove("is-hidden"), reduced ? 0 : 500 + i * 220));
      setTimeout(() => { state.textContent = "scan complete"; state.classList.add("is-done"); }, reduced ? 0 : 600 + rows.length * 220);
    };
    if (animate) {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__line > span", { yPercent: 110, duration: 1.1, stagger: 0.12 })
        .from(".hero__tag, .hero__role, .hero__lede, .hero__cta", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=.7")
        .from(".scan", { x: 30, opacity: 0, duration: 0.9 }, "-=.8")
        .from(".ticker", { opacity: 0, duration: 0.8 }, "-=.5");
      if (hasScramble) tl.to("#hero-tag", { duration: 1.2, scrambleText: { text: "SECURE SESSION ESTABLISHED · TLS 1.3", chars: "01<>/#%&", speed: 0.5 } }, 0.2);
    }
    revealRows();

    // rotating role
    const role = $("#role");
    let ri = 0;
    setInterval(() => {
      if (document.hidden) return;
      ri = (ri + 1) % D.roles.length;
      if (hasScramble && !reduced) gsap.to(role, { duration: 0.9, scrambleText: { text: D.roles[ri], chars: "upperAndLowerCase", speed: 0.6 } });
      else role.textContent = D.roles[ri];
    }, 3200);
  }

  /* ================================================================
     MODE (OPS / RED / BLUE)
     ================================================================ */
  function setMode(m, silent = false) {
    if (!D.modes[m]) return;
    html.dataset.mode = m;
    store.set("jd.mode", m);
    $$(".mode-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    const tag = $("#tagline");
    if (hasScramble && !reduced && !silent) gsap.to(tag, { duration: 1, scrambleText: { text: D.modes[m].tagline, chars: "lowerCase", speed: 0.8 } });
    else tag.textContent = D.modes[m].tagline;
    sortCases(m);
    window.JDFX && window.JDFX.refreshColors();
    window.JDTerm && window.JDTerm.refreshTheme();
    if (!silent) toast(`MODE → ${D.modes[m].label}${m === "ops" ? "" : " TEAM"}`, D.modes[m].desc);
  }
  function sortCases(m) {
    $$("#cases-grid .case").forEach((el) => {
      const t = el.dataset.team;
      let rank = 1;
      if (m !== "ops" && (t === m || t === "both")) rank = 0;
      else if (m !== "ops" && t && t !== m) rank = 2;
      el.style.order = String(rank);
    });
  }

  /* ================================================================
     SCROLL, NAV & ANIMATION
     ================================================================ */
  let lenis = null;
  function smoothScroll() {
    if (!window.Lenis || reduced) return;
    lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
    if (hasST) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function goto(id) {
    const t = id === "top" ? $("#top") : document.getElementById(id);
    if (!t) return;
    const off = id === "top" ? 0 : -($("#bar").offsetHeight + 8);
    // absolute target from the real scroll position (stays correct with pinned sections)
    const y = Math.max(0, t.getBoundingClientRect().top + window.scrollY + off);
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", id === "top" ? location.pathname : "#" + id);
  }

  function reveals() {
    if (!animate || !hasST) return;
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%",
      once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.07, overwrite: true })
    });
    if (hasScramble) {
      $$("[data-scramble]").forEach((h) => {
        const text = h.textContent;
        ScrollTrigger.create({
          trigger: h, start: "top 88%", once: true,
          onEnter: () => {
            const dim = h.querySelector(".dim");
            const target = dim ? text.replace(dim.textContent, "") : text;
            const node = document.createElement("span");
            node.textContent = target;
            h.lastChild.remove();
            h.appendChild(node);
            gsap.fromTo(node, { opacity: 1 }, { duration: 0.9, scrambleText: { text: target, chars: "01/\\<>_#", speed: 0.7 } });
          }
        });
      });
    }
    $$("[data-count]").forEach((el) => {
      const to = +el.dataset.count;
      const o = { v: 0 };
      el.textContent = "0";
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = Math.round(o.v); } })
      });
    });
    // refresh once fonts settle so trigger positions are right
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- scan dial: scroll progress + current section ---------- */
  function scanDial() {
    const dial = $("#dial");
    if (!dial) return;
    const arc = $("#dial-arc"), needle = $("#dial-needle"), pctEl = $("#dial-pct");
    const secEl = $("#dial-sec"), sectorEl = $("#dial-sector"), label = $("#dial-label"), btn = $("#dial-btn");
    const blipsEl = $("#dial-blips");
    const C = 2 * Math.PI * 33;
    const p2 = (n) => String(n).padStart(2, "0");
    const AT = 0.35; // a section is "current" once its top passes 35% of the viewport
    arc.style.strokeDasharray = C;
    arc.style.strokeDashoffset = C;

    // 60 ticks, every 5th one longer
    let t = "";
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2, s = Math.sin(a), c = Math.cos(a);
      const major = i % 5 === 0, r1 = major ? 37 : 39.5, r2 = 42.5;
      t += `<line${major ? ' class="major"' : ""} x1="${(50 + r1 * s).toFixed(2)}" y1="${(50 - r1 * c).toFixed(2)}" x2="${(50 + r2 * s).toFixed(2)}" y2="${(50 - r2 * c).toFixed(2)}"/>`;
    }
    $("#dial-ticks").innerHTML = t;

    const sections = $$("main > section[id]").map((el) => ({
      el,
      name: el.id === "top" ? "~/home" : (el.querySelector("h2") ? el.querySelector("h2").textContent.trim() : "~/" + el.id)
    }));
    let blips = [], cur = -1, last = -1, raf = 0;
    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    // one blip per section, placed where the needle will be when that section becomes current
    function layout() {
      const max = maxScroll();
      blipsEl.innerHTML = sections.map((s) => {
        const y = s.el.getBoundingClientRect().top + window.scrollY - window.innerHeight * AT;
        const a = Math.min(1, Math.max(0, y / max)) * Math.PI * 2;
        return `<circle r="2" cx="${(50 + 47.5 * Math.sin(a)).toFixed(2)}" cy="${(50 - 47.5 * Math.cos(a)).toFixed(2)}"/>`;
      }).join("");
      blips = $$("circle", blipsEl);
      cur = -1; last = -1;
      update();
    }

    function update() {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll()));
      const pct = Math.round(p * 100);
      dial.classList.toggle("is-on", window.scrollY > window.innerHeight * 0.35);
      if (pct !== last) {
        last = pct;
        arc.style.strokeDashoffset = C * (1 - p);
        needle.style.transform = `rotate(${p * 360}deg)`;
        pctEl.textContent = String(pct).padStart(3, "0");
        const done = pct >= 100;
        dial.classList.toggle("is-complete", done);
        label.textContent = done ? "scan complete" : "scanning";
      }
      let i = 0;
      sections.forEach((s, j) => { if (s.el.getBoundingClientRect().top <= window.innerHeight * AT) i = j; });
      if (i !== cur) {
        cur = i;
        secEl.textContent = sections[i].name;
        sectorEl.textContent = `sector ${p2(i)}/${p2(sections.length - 1)}`;
        blips.forEach((b, j) => { b.classList.toggle("is-past", j < i); b.classList.toggle("is-cur", j === i); });
      }
      btn.setAttribute("aria-label", `Scroll progress ${pct}%, reading ${sections[i].name}. Back to top`);
    }

    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    let rt;
    const relayout = () => { clearTimeout(rt); rt = setTimeout(layout, 150); };
    addEventListener("resize", relayout);
    new ResizeObserver(relayout).observe($("#main")); // late content (GitHub feed, fonts, pins) changes page height
    if (hasST) ScrollTrigger.addEventListener("refresh", relayout);
    btn.addEventListener("click", () => goto("top"));
    layout();
  }

  /* ---------- kill chain: pinned, one stage per scroll step ---------- */
  function killChain() {
    const sec = $("#killchain");
    if (!sec || !animate) return; // static stacked layout
    const nodes = $$(".kc__node", sec), stages = $$(".kc-stage", sec), n = stages.length;
    const fill = $("#kc-fill"), packet = $("#kc-packet"), hint = $("#kc-hint");
    let cur = -1;

    function setStage(i) {
      if (i === cur) return;
      cur = i;
      nodes.forEach((nd, j) => {
        nd.classList.toggle("is-active", j === i);
        nd.classList.toggle("is-past", j < i);
        nd.firstElementChild.setAttribute("aria-current", j === i ? "step" : "false");
      });
      stages.forEach((st, j) => {
        st.classList.toggle("is-active", j === i);
        st.setAttribute("aria-hidden", String(j !== i));
      });
      if (hasScramble) {
        gsap.to(stages[i].querySelector(".kc-stage__title"), { duration: 0.6, scrambleText: { text: D.killchain[i].n, chars: "01<>/#_", speed: 0.9 } });
      }
    }
    function setProgress(p) {
      // packet sits exactly on node i at the middle of stage i's scroll range
      const pos = Math.min(1, Math.max(0, (p * n - 0.5) / (n - 1))) * 100;
      fill.style.height = pos + "%";
      packet.style.top = pos + "%";
      hint.classList.toggle("is-done", p > 0.97);
    }

    gsap.matchMedia().add("(min-width: 900px) and (min-height: 700px)", () => {
      sec.classList.add("is-pinned");
      setStage(0);
      setProgress(0);
      const st = ScrollTrigger.create({
        trigger: "#kc-pin",
        start: "top top",
        end: () => "+=" + window.innerHeight * (n - 1) * 0.55,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          setProgress(self.progress);
          setStage(Math.min(n - 1, Math.floor(self.progress * n)));
        }
      });
      const handlers = nodes.map((nd, i) => {
        const fn = () => {
          const y = st.start + (st.end - st.start) * ((i + 0.5) / n);
          if (lenis) lenis.scrollTo(y, { duration: 1 });
          else window.scrollTo({ top: y, behavior: "smooth" });
        };
        nd.firstElementChild.addEventListener("click", fn);
        return [nd.firstElementChild, fn];
      });
      return () => {
        sec.classList.remove("is-pinned");
        handlers.forEach(([b, fn]) => b.removeEventListener("click", fn));
        stages.forEach((s) => { s.classList.remove("is-active"); s.removeAttribute("aria-hidden"); });
        cur = -1;
      };
    });
  }

  function navSpy() {
    const links = $$(".bar__nav a");
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.remove("is-active"));
        map.get(en.target.id)?.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); s && io.observe(s); });
  }

  /* ================================================================
     DIALOGS
     ================================================================ */
  function openDialog(d) {
    if (d.open) return;
    d.showModal();
    lenis && lenis.stop();
  }
  $$("dialog").forEach((d) => {
    d.addEventListener("close", () => { if (!$("dialog[open]")) lenis && lenis.start(); });
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); }); // backdrop click
  });

  /* ---------- case file ---------- */
  function openCase(slug) {
    const p = D.projects.find((x) => x.slug === slug);
    if (!p) return;
    const topo = p.topology && window.JDFX ? window.JDFX.topology() : null;
    $("#case-body").innerHTML = `
      <div class="modal__head"><span class="accent">${esc(p.id)}</span><span>· case file · classification: public</span>
        <button type="button" class="modal__close" data-close aria-label="Close">×</button></div>
      <div class="modal__content">
        <h2 class="modal__title" id="case-title">${esc(p.title)}</h2>
        <p class="modal__sum">${esc(p.summary)}</p>
        <div class="modal__meta">
          <div><span>Type</span><b>${esc(p.type)}</b></div>
          <div><span>Key metric</span><b class="accent">${esc(p.metric.v)}</b> <b style="font-weight:400;color:var(--muted)">${esc(p.metric.l)}</b></div>
          <div><span>Source</span><a href="${esc(p.repo)}" ${ext}>${esc(p.repo.replace("https://", ""))} ↗</a></div>
        </div>
        ${topo ? `<div class="topo">${topo.svg}<div class="topo__cap">Hover a VLAN to trace its path to the internet. Department names are placeholders.</div></div>` : ""}
        <section class="rep"><h4><span>01</span>Scope</h4><p>${esc(p.scope)}</p></section>
        <section class="rep"><h4><span>02</span>What I built</h4><ul class="ticks">${p.findings.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></section>
        <section class="rep"><h4><span>03</span>Outcome</h4><p>${esc(p.outcome)}</p></section>
        <section class="rep"><h4><span>04</span>Stack</h4><div class="case__stack">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></section>
      </div>`;
    const dlg = $("#case-modal");
    openDialog(dlg);
    dlg.scrollTop = 0;
    if (topo) topo.bind($("#case-body .topo"));
  }

  /* ---------- quick view ---------- */
  function openQuickView() {
    const top = D.projects.slice(0, 5);
    const skills = D.skills.slice(0, 5).map((g) => `<li><b>${esc(g.title)}:</b> ${esc(g.items.map((i) => i.n).join(", "))}</li>`).join("");
    $("#qv-body").innerHTML = `
      <div class="modal__head"><span class="accent">quick view</span><span>· the 60-second version</span>
        <button type="button" class="modal__close" data-close aria-label="Close">×</button></div>
      <div class="modal__content">
        <h2 class="qv__name">${esc(P.name)}</h2>
        <p class="qv__role">${esc(P.headline)} · Network Security · Penetration Testing · Secure App Development</p>
        <div class="qv__contacts">
          <a class="chip chip--btn" href="mailto:${esc(P.email)}">${esc(P.email)}</a>
          <a class="chip chip--btn" href="${esc(P.linkedin)}" ${ext}>LinkedIn ↗</a>
          <a class="chip chip--btn" href="${esc(P.github)}" ${ext}>GitHub ↗</a>
          <span class="chip">${esc(P.location)}</span>
        </div>
        <div class="qv__grid">
          <div>
            <div class="qv__sec"><h3>Summary</h3><p>${esc(P.summary)}</p></div>
            <div class="qv__sec"><h3>Projects</h3><ul>${top.map((p) => `<li><b>${esc(p.title)}</b>: ${esc(p.summary)}</li>`).join("")}</ul></div>
            <div class="qv__sec"><h3>Skills</h3><ul>${skills}</ul></div>
          </div>
          <div>
            <div class="qv__sec"><h3>Education</h3>${D.education.map((e) => `<div class="qv__kv"><b>${esc(e.t)}</b><span>${esc(e.o)}</span><span class="mono dim" style="font-size:12px">${esc(e.d)}</span></div>`).join("")}</div>
            <div class="qv__sec"><h3>Highlights</h3><ul>
              <li><b>TryHackMe top 7%</b> globally · 133-day streak · 62 rooms · 12 badges</li>
              <li><b>Kapruka Agent Challenge 2026</b>: Builder certificate (700+ entrants)</li>
              <li><b>Research:</b> IoT security, Mirai botnets and future risks</li>
            </ul></div>
            <div class="qv__sec"><h3>Certifications</h3><ul>${D.certs.map((c) => `<li>${esc(c.t)}${c.s !== "done" ? " <span class='dim'>(in progress)</span>" : ""}</li>`).join("")}</ul></div>
            <div class="qv__actions">
              <a class="btn btn--primary" href="${esc(P.cv)}" download>Download CV ↓</a>
              <a class="btn" href="mailto:${esc(P.email)}">Email</a>
            </div>
          </div>
        </div>
      </div>`;
    const dlg = $("#quickview");
    openDialog(dlg);
    dlg.scrollTop = 0;
  }

  /* ---------- command palette ---------- */
  const ACTIONS = [
    ...[["top", "Home"], ["whoami", "~/whoami"], ["arsenal", "~/arsenal · skills"], ["killchain", "~/kill-chain · attack vs. defense"],["cases", "~/case-files · projects"], ["research", "~/research · IoT & Mirai"], ["intel", "~/intel · THM, certs, timeline"], ["terminal", "~/shell · terminal"], ["ctf", "~/ctf · capture the flag"], ["contact", "~/contact"]]
      .map(([id, l]) => ({ ico: "#", label: `Go to ${l}`, grp: "navigate", run: () => goto(id) })),
    ...D.projects.map((p) => ({ ico: "▣", label: `Open case: ${p.title}`, grp: "case file", run: () => openCase(p.slug) })),
    { ico: "●", label: "Switch to RED TEAM mode", grp: "mode", kw: "offensive attack", run: () => setMode("red") },
    { ico: "●", label: "Switch to BLUE TEAM mode", grp: "mode", kw: "defensive defense", run: () => setMode("blue") },
    { ico: "●", label: "Switch to OPS mode", grp: "mode", kw: "default lime", run: () => setMode("ops") },
    { ico: ">", label: "Open terminal", grp: "action", kw: "shell console", run: openTerminal },
    { ico: "◎", label: "Quick view (recruiter summary)", grp: "action", kw: "resume cv summary", run: openQuickView },
    { ico: "↓", label: "Download CV (PDF)", grp: "action", kw: "resume", run: downloadCV },
    { ico: "@", label: "Copy email address", grp: "action", kw: "contact mail", run: copyEmail },
    { ico: "↗", label: "Open GitHub", grp: "link", run: () => window.open(P.github, "_blank", "noopener") },
    { ico: "↗", label: "Open LinkedIn", grp: "link", run: () => window.open(P.linkedin, "_blank", "noopener") },
    { ico: "↻", label: "Replay boot sequence", grp: "system", run: () => { try { sessionStorage.removeItem("jd.booted"); } catch (e) { /* ignore */ } location.reload(); } }
  ];
  let palSel = 0, palItems = [];
  function renderPalette(q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    palItems = ACTIONS.filter((a) => {
      const hay = (a.label + " " + a.grp + " " + (a.kw || "")).toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    palSel = 0;
    const list = $("#palette-list");
    list.innerHTML = palItems.length
      ? palItems.map((a, i) => `<li class="palette__item" role="option" id="pi-${i}" data-i="${i}" aria-selected="${i === 0}"><span class="ico">${esc(a.ico)}</span><span>${esc(a.label)}</span><span class="grp">${esc(a.grp)}</span></li>`).join("")
      : `<li class="palette__empty">No matches. Try "red", "cv", or "terminal".</li>`;
    $("#palette-input").setAttribute("aria-activedescendant", palItems.length ? "pi-0" : "");
  }
  function movePalette(d) {
    if (!palItems.length) return;
    palSel = (palSel + d + palItems.length) % palItems.length;
    $$(".palette__item").forEach((el, i) => el.setAttribute("aria-selected", String(i === palSel)));
    const cur = $(`#pi-${palSel}`);
    cur && cur.scrollIntoView({ block: "nearest" });
    $("#palette-input").setAttribute("aria-activedescendant", `pi-${palSel}`);
  }
  function runPalette(i) {
    const a = palItems[i];
    if (!a) return;
    $("#palette").close();
    setTimeout(a.run, 60);
  }
  function openPalette() {
    const d = $("#palette");
    const input = $("#palette-input");
    input.value = "";
    renderPalette("");
    openDialog(d);
    input.focus();
  }

  /* ---------- misc actions ---------- */
  function openTerminal() {
    goto("terminal");
    const T = window.JDTerm;
    T.init($("#xterm")).then(() => setTimeout(() => T.focus(), 700));
  }
  function downloadCV() {
    const a = document.createElement("a");
    a.href = P.cv; a.download = "Janith_Deshan_CV.pdf";
    document.body.appendChild(a); a.click(); a.remove();
    toast("[OK] DOWNLOAD", "Janith_Deshan_CV.pdf");
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(P.email); toast("[OK] COPIED", P.email); }
    catch (e) { toast("[!] COPY FAILED", P.email); }
  }

  /* ================================================================
     CTF UI
     ================================================================ */
  function ctfUI() {
    const C = window.JDCTF;
    if (!C) return;
    const list = $("#flags");
    const diffLabel = { easy: "easy", med: "medium", hard: "hard" };
    list.innerHTML = C.FLAGS.map((f) => `
      <li class="flag" id="flag-${f.id}">
        <div class="flag__row">
          <span class="flag__icon">${String(f.id).padStart(2, "0")}</span>
          <span class="flag__name">${esc(f.name)}<small class="d-${f.diff}">${diffLabel[f.diff]}</small></span>
          <button type="button" class="flag__hint-btn" aria-expanded="false" aria-controls="hint-${f.id}">hint</button>
        </div>
        <p class="flag__hint" id="hint-${f.id}" hidden>${esc(f.hint)}</p>
      </li>`).join("");
    list.addEventListener("click", (e) => {
      const b = e.target.closest(".flag__hint-btn");
      if (!b) return;
      const h = document.getElementById(b.getAttribute("aria-controls"));
      h.hidden = !h.hidden;
      b.setAttribute("aria-expanded", String(!h.hidden));
    });

    const update = (st) => {
      st.flags.forEach((f) => {
        const el = document.getElementById("flag-" + f.id);
        const ok = st.solved.includes(f.id);
        el.classList.toggle("is-solved", ok);
        el.querySelector(".flag__icon").textContent = ok ? "✓" : String(f.id).padStart(2, "0");
      });
      $("#ctf-bar").style.width = (st.solved.length / st.total) * 100 + "%";
      $("#ctf-count").textContent = `${st.solved.length} / ${st.total} captured`;
      $("#foot-flags").textContent = `flags ${st.solved.length}/${st.total}`;
    };
    update(C.state());
    C.onChange((st) => {
      update(st);
    });

    const form = $("#ctf-form"), input = $("#ctf-input"), msg = $("#ctf-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const r = await C.submit(input.value);
      form.classList.remove("is-wrong");
      if (r.ok) {
        msg.className = "ctf__msg mono ok";
        msg.textContent = r.already ? `[=] Already captured: ${r.flag.name}` : `[+] Flag captured: ${r.flag.name}`;
        input.value = "";
        if (!r.already) toast("[+] FLAG CAPTURED", r.flag.name);
        if (r.all && !r.already) setTimeout(allDone, 700);
      } else {
        void form.offsetWidth;
        form.classList.add("is-wrong");
        msg.className = "ctf__msg mono bad";
        msg.textContent = r.reason === "format" ? "[-] Format is JD{...}" : "[-] Incorrect flag. Keep digging.";
      }
    });

    // flag 4
    const adminFlag = C.cookieChallenge();
    if (adminFlag) {
      $("#ctf-admin").hidden = false;
      $("#ctf-admin-flag").textContent = "flag 4/6 : " + adminFlag;
    }

    // flag 6
    C.konami((flag) => {
      window.JDTerm.setRoot(true);
      $("#root-body").innerHTML = `
        <h3>ROOT SHELL UNLOCKED</h3>
        <p>↑ ↑ ↓ ↓ ← → ← → B A. A person of culture.</p>
        <p>Privilege escalated. The terminal now runs as <span class="red">root</span>.</p>
        <div class="flagbox"><span>flag 6/6 : ${esc(flag)}</span><button type="button" class="chip chip--btn" id="copy-root">copy</button></div>
        <button type="button" class="btn btn--primary" data-close>Continue as root</button>`;
      openDialog($("#root-dlg"));
      $("#copy-root").addEventListener("click", () => navigator.clipboard && navigator.clipboard.writeText(flag).then(() => toast("[OK] COPIED", "flag 6")));
    });

    C.consoleBanner();
  }

  function allDone() {
    $("#root-body").innerHTML = `
      <h3>6/6 · BOX OWNED</h3>
      <p>You found every flag, which puts you ahead of most people who visit.</p>
      <p>Email me with the subject <span class="accent">"I got root"</span> and I'll add you to the hall of fame.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">
        <a class="btn btn--primary" href="mailto:${esc(P.email)}?subject=${encodeURIComponent("I got root")}">Claim it →</a>
        <button type="button" class="btn" data-close>Close</button>
      </div>`;
    openDialog($("#root-dlg"));
  }

  /* ================================================================
     GITHUB LIVE FEED
     ================================================================ */
  async function ghFeed() {
    const box = $("#gh-feed");
    let data = null;
    try { data = JSON.parse(sessionStorage.getItem("jd.gh") || "null"); } catch (e) { /* ignore */ }
    if (!data) {
      try {
        const r = await fetch(`https://api.github.com/users/${encodeURIComponent(P.githubUser)}/repos?sort=pushed&per_page=6`, { headers: { Accept: "application/vnd.github+json" } });
        if (!r.ok) throw new Error(r.status);
        data = (await r.json()).filter((x) => !x.fork).slice(0, 5).map((x) => ({ n: x.name, u: x.html_url, p: x.pushed_at, l: x.language }));
        try { sessionStorage.setItem("jd.gh", JSON.stringify(data)); } catch (e) { /* ignore */ }
      } catch (e) {
        box.innerHTML = `<li class="dim">Feed unavailable (offline or rate-limited). <a class="accent" href="${esc(P.github)}" ${ext}>View on GitHub ↗</a></li>`;
        return;
      }
    }
    box.innerHTML = data.map((x) => {
      const d = new Date(x.p);
      const ts = isNaN(d) ? "" : d.toISOString().slice(0, 10);
      return `<li><span class="ev">PUSH</span><a class="grow" href="${esc(x.u)}" ${ext}>${esc(x.n)}</a><span class="meta">${esc(x.l || "")} ${esc(ts)}</span></li>`;
    }).join("");
  }

  /* ================================================================
     CLOCK
     ================================================================ */
  function clock() {
    const el = $("#clock");
    let fmt;
    try { fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }); }
    catch (e) { fmt = { format: (d) => d.toTimeString().slice(0, 8) }; }
    const tick = () => { el.textContent = "COL " + fmt.format(new Date()); };
    tick(); setInterval(tick, 1000);
  }

  /* ================================================================
     EVENTS
     ================================================================ */
  function bind() {
    // anchors
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (a && a.getAttribute("href").length > 1) {
        e.preventDefault();
        const id = a.getAttribute("href").slice(1);
        if (a.hasAttribute("data-open-terminal")) return openTerminal();
        goto(id);
        return;
      }
      if (a && a.getAttribute("href") === "#") { e.preventDefault(); goto("top"); }

      const t = e.target;
      const caseBtn = t.closest("[data-case]");
      if (caseBtn) return openCase(caseBtn.dataset.case);
      if (t.closest("[data-close]")) return t.closest("dialog")?.close();
      if (t.closest("[data-quickview]")) return openQuickView();
      if (t.closest("[data-palette]")) return openPalette();
      const sm = t.closest("[data-set-mode]");
      if (sm) return setMode(sm.dataset.setMode);
      const cmd = t.closest("[data-cmd]");
      if (cmd) {
        const T = window.JDTerm;
        T.init($("#xterm")).then(() => { T.type(cmd.dataset.cmd); T.focus(); });
      }
    });

    if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $(".bar__k-label").textContent = "Ctrl K";
    $$(".mode-switch button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    $("#qv-open").addEventListener("click", openQuickView);
    $("#palette-open").addEventListener("click", openPalette);
    $("#copy-email").addEventListener("click", copyEmail);

    // palette input
    const pin = $("#palette-input");
    pin.addEventListener("input", () => renderPalette(pin.value));
    pin.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); movePalette(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); movePalette(-1); }
      else if (e.key === "Enter") { e.preventDefault(); runPalette(palSel); }
    });
    $("#palette-list").addEventListener("click", (e) => {
      const li = e.target.closest(".palette__item");
      if (li) runPalette(+li.dataset.i);
    });
    $("#palette-list").addEventListener("mousemove", (e) => {
      const li = e.target.closest(".palette__item");
      if (li && +li.dataset.i !== palSel) movePalette(+li.dataset.i - palSel);
    });

    // contact → mailto
    $("#contact-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target.elements;
      const name = f.name.value.trim(), subject = f.subject.value.trim(), message = f.message.value.trim();
      if (!name || !message) return;
      const label = $("#tx-label");
      const go = () => {
        location.href = `mailto:${P.email}?subject=${encodeURIComponent("[Portfolio] " + (subject || "Hello from " + name))}&body=${encodeURIComponent(message + "\n\n- " + name)}`;
        label.textContent = "Transmit";
      };
      if (hasScramble && !reduced) gsap.to(label, { duration: 0.7, scrambleText: { text: "Composing packet…", chars: "01" }, onComplete: () => setTimeout(go, 250) });
      else go();
    });

    // keyboard shortcuts
    addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "k") { e.preventDefault(); openPalette(); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest && e.target.closest("input, textarea, [contenteditable], .xterm")) return;
      if ($("dialog[open]") || html.classList.contains("is-booting")) return;
      if (k === "/") { e.preventDefault(); openPalette(); }
      else if (k === "q") openQuickView();
      else if (k === "`") { e.preventDefault(); openTerminal(); }
    });
  }

  /* ================================================================
     INIT
     ================================================================ */
  render();
  setMode(store.get("jd.mode", "ops"), true);
  bind();
  clock();
  ctfUI();
  smoothScroll();
  navSpy();
  scanDial();

  window.JDApp = { setMode, goto, openQuickView, openPalette, downloadCV, toast };

  window.JDFX && window.JDFX.initHero($("#net"));
  window.JDFX && window.JDFX.initMirai({
    canvas: $("#mirai"), btn: $("#sim-run"), count: $("#sim-count"),
    bw: $("#sim-bw"), phase: $("#sim-phase"), offline: $("#sim-offline")
  });

  // lazy-start the terminal when it's near the viewport
  new IntersectionObserver(([en], io) => {
    if (en.isIntersecting) { io.disconnect(); window.JDTerm.init($("#xterm")); }
  }, { rootMargin: "300px" }).observe($("#xterm"));

  ghFeed();

  boot().then(() => {
    heroIntro();
    killChain(); // create the pin before other triggers so their positions include its spacing
    reveals();
    if (location.hash && location.hash.length > 1) setTimeout(() => goto(location.hash.slice(1)), 100);
  });
})();
