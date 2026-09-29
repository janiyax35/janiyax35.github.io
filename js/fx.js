/* =====================================================================
   JD//OPS · visual effects
   - hero network: nodes, links, packets, firewalls blocking bad traffic
   - mirai: botnet propagation + DDoS simulation (research section)
   - topology: interactive enterprise network diagram (case file modal)
   ===================================================================== */

window.JDFX = (() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const rgb = (hex) => {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  let colors = {};
  function readColors() {
    colors = {
      accent: rgb(css("--accent") || "#B6FF3B"),
      alert: rgb(css("--alert") || "#FF4D5E"),
      red: rgb(css("--red") || "#FF4D5E"),
      node: rgb("#5B6875"),
      line: rgb("#2A3542")
    };
  }

  /* ---------------------------------------------------------------
     HERO NETWORK
     --------------------------------------------------------------- */
  function initHero(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, nodes = [], packets = [], flashes = [];
    let running = false, visible = true, raf = 0, lastSpawn = 0;
    const mouse = { x: -9999, y: -9999, on: false };
    const LINK = 150;

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(95, Math.round((w * h) / 15000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.4,
        fw: Math.random() < 0.09
      }));
      packets = [];
      if (!running) draw(0);
    }

    function spawn() {
      const a = nodes[(Math.random() * nodes.length) | 0];
      let best = null, bd = Infinity;
      for (const b of nodes) {
        if (b === a) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK && d < bd && Math.random() < 0.6) { best = b; bd = d; }
      }
      if (!best) return;
      packets.push({ a, b: best, t: 0, sp: 0.008 + Math.random() * 0.012, bad: best.fw && Math.random() < 0.7 });
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      const ac = colors.accent;

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const k = 1 - Math.sqrt(d2) / LINK;
            ctx.strokeStyle = rgba(colors.line, k * 0.9);
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (mouse.on) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < 190) {
            ctx.strokeStyle = rgba(ac, (1 - d / 190) * 0.55);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }

      // packets
      for (const p of packets) {
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        const tx = p.a.x + (p.b.x - p.a.x) * Math.max(0, p.t - 0.18);
        const ty = p.a.y + (p.b.y - p.a.y) * Math.max(0, p.t - 0.18);
        const c = p.bad ? colors.alert : ac;
        const g = ctx.createLinearGradient(tx, ty, x, y);
        g.addColorStop(0, rgba(c, 0));
        g.addColorStop(1, rgba(c, 0.9));
        ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = rgba(c, 1);
        ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
      }

      // flashes (blocked at firewall)
      for (const f of flashes) {
        const k = f.life / 40;
        ctx.strokeStyle = rgba(colors.alert, k);
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(f.x, f.y, 6 + (1 - k) * 18, 0, Math.PI * 2); ctx.stroke();
        if (f.life > 20) {
          ctx.fillStyle = rgba(colors.alert, k);
          ctx.font = "600 9px 'JetBrains Mono', monospace";
          ctx.fillText("DROP", f.x + 10, f.y - 8);
        }
      }

      // nodes
      for (const n of nodes) {
        if (n.fw) {
          ctx.strokeStyle = rgba(ac, 0.85);
          ctx.lineWidth = 1.2;
          ctx.strokeRect(n.x - 4, n.y - 4, 8, 8);
          ctx.fillStyle = rgba(ac, 0.18);
          ctx.fillRect(n.x - 4, n.y - 4, 8, 8);
        } else {
          ctx.fillStyle = rgba(colors.node, 0.9);
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    function step(time) {
      raf = requestAnimationFrame(step);
      if (!visible || document.hidden) return;

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
        if (mouse.on) {
          const dx = n.x - mouse.x, dy = n.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 90 && d > 0.1) { n.x += (dx / d) * 0.6; n.y += (dy / d) * 0.6; }
        }
      }
      if (time - lastSpawn > 140 && packets.length < 40) { spawn(); lastSpawn = time; }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.sp;
        if (p.bad && p.t >= 0.92) {
          flashes.push({ x: p.b.x, y: p.b.y, life: 40 });
          packets.splice(i, 1);
        } else if (p.t >= 1) packets.splice(i, 1);
      }
      for (let i = flashes.length - 1; i >= 0; i--) if (--flashes[i].life <= 0) flashes.splice(i, 1);
      draw(time);
    }

    readColors();
    resize();
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });

    const hero = canvas.parentElement;
    hero.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    });
    hero.addEventListener("pointerleave", () => { mouse.on = false; });

    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);

    if (reduced) { draw(0); return; }
    running = true;
    raf = requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------
     MIRAI SIMULATION
     --------------------------------------------------------------- */
  function initMirai(opts) {
    const { canvas, btn, count, bw, phase, offline } = opts;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const PHASES = [
      "Scanning random IPs for exposed Telnet (23/2323)",
      "Brute-forcing factory-default credentials",
      "Bots report to C2 and the botnet grows",
      "Volumetric DDoS against the DNS provider",
      "Target offline: major sites unreachable"
    ];
    let w, h, dpr, cells = [], cols, rows, size, target, state, raf = 0, played = false, t0 = 0;

    function layout() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size = w < 500 ? 11 : 13;
      const gridW = w - 110;
      cols = Math.max(8, Math.floor((gridW - 16) / size));
      rows = Math.max(6, Math.floor((h - 24) / size));
      target = { x: w - 52, y: h / 2 };
      const prev = cells;
      cells = [];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        cells.push({
          x: 16 + x * size, y: 12 + y * size,
          hard: prev[i] ? prev[i].hard : Math.random() < 0.08,
          inf: prev[i] ? prev[i].inf : 0
        });
      }
    }

    function reset() {
      for (const c of cells) { c.inf = 0; c.hard = Math.random() < 0.08; }
      state = { ph: -1, infected: 0, bw: 0, attack: 0, done: false };
      offline.classList.remove("is-on");
      count.textContent = "0"; bw.textContent = "0.00 Tbps"; phase.textContent = "Idle";
    }

    function vulnerable() { return cells.filter((c) => !c.hard); }

    function draw(now) {
      ctx.clearRect(0, 0, w, h);
      const red = colors.red, ac = colors.accent;
      const pulse = 0.6 + 0.4 * Math.sin(now / 160);

      // attack streams
      if (state.attack > 0) {
        const inf = cells.filter((c) => c.inf);
        const n = Math.min(60, Math.round(inf.length * 0.12 * state.attack));
        ctx.lineWidth = 1;
        for (let i = 0; i < n; i++) {
          const c = inf[(Math.random() * inf.length) | 0];
          ctx.strokeStyle = rgba(red, 0.08 + Math.random() * 0.22);
          ctx.beginPath(); ctx.moveTo(c.x + 2, c.y + 2); ctx.lineTo(target.x, target.y); ctx.stroke();
        }
      }

      // devices
      const s = size - 5;
      for (const c of cells) {
        if (c.hard) {
          ctx.strokeStyle = rgba(ac, 0.75);
          ctx.lineWidth = 1;
          ctx.strokeRect(c.x + 0.5, c.y + 0.5, s - 1, s - 1);
        } else if (c.inf) {
          const age = Math.min(1, (now - c.inf) / 400);
          ctx.fillStyle = rgba(red, 0.35 + 0.65 * age);
          ctx.fillRect(c.x, c.y, s, s);
        } else {
          ctx.fillStyle = "rgba(91,104,117,.35)";
          ctx.fillRect(c.x + 1, c.y + 1, s - 2, s - 2);
        }
      }

      // target
      const down = state.done;
      ctx.beginPath(); ctx.arc(target.x, target.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = down ? rgba(red, 0.18 * pulse + 0.1) : "rgba(16,21,28,1)";
      ctx.fill();
      ctx.strokeStyle = down ? rgba(red, pulse) : state.attack ? rgba(red, 0.8) : "rgba(138,151,165,.6)";
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = down ? rgba(red, 1) : "rgba(230,237,243,.9)";
      ctx.font = "600 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("DNS", target.x, target.y + 3.5);
      ctx.fillStyle = "rgba(85,97,110,1)";
      ctx.font = "500 9px 'JetBrains Mono', monospace";
      ctx.fillText(down ? "OFFLINE" : "TARGET", target.x, target.y + 38);
      ctx.textAlign = "start";
    }

    function setPhase(i) {
      if (state.ph === i) return;
      state.ph = i;
      phase.textContent = PHASES[i];
    }

    function tick(now) {
      const t = now - t0;
      const vuln = vulnerable();
      const total = vuln.length;

      if (t < 900) setPhase(0);
      else if (t < 1900) setPhase(1);
      else if (state.infected < total) setPhase(2);

      // infection: random scanning → logistic growth
      if (t > 700 && state.infected < total) {
        const clean = vuln.filter((c) => !c.inf);
        const k = Math.max(1, Math.ceil(state.infected * 0.055));
        for (let i = 0; i < k && clean.length; i++) {
          const j = (Math.random() * clean.length) | 0;
          clean[j].inf = now;
          clean.splice(j, 1);
          state.infected++;
        }
      }

      const frac = total ? state.infected / total : 0;
      count.textContent = Math.round(frac * 600000).toLocaleString("en-US");

      if (frac >= 1 && !state.attackStart) state.attackStart = now;
      if (state.attackStart && !state.done) {
        setPhase(3);
        state.attack = Math.min(1, (now - state.attackStart) / 1800);
        bw.textContent = (1.2 * state.attack).toFixed(2) + " Tbps";
        if (state.attack >= 1 && !state.done) {
          state.done = true;
          setPhase(4);
          offline.classList.add("is-on");
          btn.textContent = "↻ Replay";
        }
      }

      draw(now);
      if (state.done) {
        // keep pulsing the target briefly, then stop
        if (now - state.attackStart > 6000) { cancelAnimationFrame(raf); raf = 0; return; }
      }
      raf = requestAnimationFrame(tick);
    }

    function run() {
      cancelAnimationFrame(raf);
      reset();
      btn.textContent = "■ Running";
      played = true;
      if (reduced) {
        // jump to final state
        const now = performance.now();
        for (const c of cells) if (!c.hard) c.inf = now - 1000;
        state.infected = vulnerable().length;
        state.attack = 1; state.done = true; state.attackStart = now;
        count.textContent = "600,000"; bw.textContent = "1.20 Tbps"; setPhase(4);
        offline.classList.add("is-on"); btn.textContent = "↻ Replay";
        draw(now);
        return;
      }
      t0 = performance.now();
      // patient zero
      const v = vulnerable();
      v[(Math.random() * v.length) | 0].inf = t0;
      state.infected = 1;
      raf = requestAnimationFrame(tick);
    }

    readColors();
    layout();
    reset();
    draw(performance.now());

    let rt;
    addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { layout(); if (!raf) draw(performance.now()); }, 150);
    });
    btn.addEventListener("click", run);
    new IntersectionObserver(([en], io) => {
      if (en.isIntersecting && !played) { io.disconnect(); setTimeout(run, 400); }
    }, { threshold: 0.45 }).observe(canvas);
  }

  /* ---------------------------------------------------------------
     TOPOLOGY (enterprise network case file)
     --------------------------------------------------------------- */
  function topology() {
    // Department names are placeholders. Rename them to match the real design.
    const floors = [
      { f: "FLOOR 1", v: [["VLAN 10", "Dept A"], ["VLAN 20", "Dept B"]] },
      { f: "FLOOR 2", v: [["VLAN 30", "Dept C"], ["VLAN 40", "Dept D"]] },
      { f: "FLOOR 3", v: [["VLAN 50", "Dept E"], ["VLAN 60", "Dept F"]] }
    ];
    const W = 760, node = (id, x, y, w, t1, t2, cls = "") =>
      `<g class="n ${cls}" id="tp-${id}" transform="translate(${x - w / 2},${y - 17})"><rect width="${w}" height="34" rx="3"/>` +
      `<text x="${w / 2}" y="${t2 ? 15 : 21}" text-anchor="middle">${t1}</text>` +
      (t2 ? `<text class="t2" x="${w / 2}" y="27" text-anchor="middle">${t2}</text>` : "") + `</g>`;
    const edge = (id, x1, y1, x2, y2) => `<path class="e" id="te-${id}" d="M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}"/>`;

    let edges = "", nodes = "";
    nodes += node("net", W / 2, 30, 120, "INTERNET");
    nodes += node("fw", W / 2, 100, 150, "EDGE FIREWALL", "stateful · default deny", "fw");
    nodes += node("rt", W / 2, 170, 150, "CORE ROUTER", "OSPF area 0");
    nodes += node("sw", W / 2, 240, 150, "CORE SWITCH", "L3 · inter-VLAN ACLs");
    nodes += node("vpn", 110, 170, 130, "VPN GATEWAY", "remote access");
    nodes += node("ap", W - 110, 170, 130, "WIRELESS", "WPA2 / WPA3");
    edges += edge("net-fw", W / 2, 47, W / 2, 83);
    edges += edge("fw-rt", W / 2, 117, W / 2, 153);
    edges += edge("rt-sw", W / 2, 187, W / 2, 223);
    edges += edge("fw-vpn", W / 2 - 75, 100, 110, 153);
    edges += edge("sw-ap", W / 2 + 75, 240, W - 110, 187);

    const colW = W / 3;
    floors.forEach((fl, fi) => {
      const cx = colW * fi + colW / 2;
      nodes += `<text x="${cx}" y="392" text-anchor="middle" class="floor" fill="#55616E" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.5">${fl.f}</text>`;
      fl.v.forEach((v, vi) => {
        const x = cx + (vi ? 58 : -58);
        const id = `v${fi}${vi}`;
        nodes += node(id, x, 350, 104, v[0], v[1] + " · /27", "vlan");
        edges += edge(`sw-${id}`, W / 2, 257, x, 333);
      });
    });

    const svg = `<svg viewBox="0 0 ${W} 402" role="img" aria-label="Network topology: internet, edge firewall, core router, core switch, and six department VLANs across three floors">${edges}${nodes}</svg>`;
    return { svg, bind: bindTopology };
  }

  function bindTopology(root) {
    const hot = (id) => {
      root.querySelectorAll(".is-hot").forEach((el) => el.classList.remove("is-hot"));
      if (!id) return;
      const path = [`tp-net`, `tp-fw`, `tp-rt`, `tp-sw`, `tp-${id}`, `te-net-fw`, `te-fw-rt`, `te-rt-sw`, `te-sw-${id}`];
      path.forEach((p) => root.querySelector("#" + p)?.classList.add("is-hot"));
    };
    root.querySelectorAll(".n.vlan").forEach((g) => {
      const id = g.id.replace("tp-", "");
      g.addEventListener("pointerenter", () => hot(id));
      g.addEventListener("pointerleave", () => hot(null));
    });
    // default: show one path so the idea is obvious
    hot("v10");
  }

  return {
    initHero,
    initMirai,
    topology,
    refreshColors: readColors
  };
})();
