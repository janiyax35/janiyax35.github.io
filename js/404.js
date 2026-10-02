/* =====================================================================
   JD//OPS · 404 scene (three.js)
   "404" built from particles, a grid floor, and packets that fly at the
   dead host and get dropped. Without WebGL the plain heading stays.
   ===================================================================== */
(() => {
  "use strict";

  const html = document.documentElement;
  const $ = (s) => document.querySelector(s);

  /* ---------- page details that don't need WebGL ---------- */
  try {
    const m = JSON.parse(localStorage.getItem("jd.mode"));
    if (m === "red" || m === "blue") html.dataset.mode = m;
  } catch (e) { /* storage blocked */ }

  const pathEl = $("#path");
  if (pathEl) {
    let p = location.pathname || "/";
    try { p = decodeURI(p); } catch (e) { /* keep the raw path */ }
    pathEl.textContent = p.length > 48 ? p.slice(0, 47) + "…" : p;
  }

  const canvas = $("#scene");
  if (!canvas) return;
  // same URL as the modulepreload in 404.html, which pins its SRI hash
  import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js").then(run, () => { /* no CDN: the plain page stays */ });

  function run(THREE) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch (e) { return; }

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = Math.min(innerWidth, innerHeight) < 600;
    const css = getComputedStyle(html);
    const tone = (name) => new THREE.Color(css.getPropertyValue(name).trim());
    const BG = tone("--bg"), ACCENT = tone("--accent"), ALERT = tone("--alert"), LINE = tone("--line-2");

    const FOV = 50, CAM_Z = 15, TEXT_W = 11, FLOOR_Y = -4.5;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(BG, 14, 48);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120);
    camera.position.set(0, 0, CAM_Z);
    renderer.setClearColor(BG, 1);

    /* ---------- grid floor ---------- */
    const STEP = 2;
    const grid = (() => {
      const v = [], X = 44, Z0 = 12, Z1 = -64;
      for (let x = -X; x <= X; x += STEP) v.push(x, 0, Z0, x, 0, Z1);
      for (let z = Z0; z >= Z1; z -= STEP) v.push(-X, 0, z, X, 0, z);
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
      const m = new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.6 });
      const lines = new THREE.LineSegments(g, m);
      lines.position.y = FLOOR_Y;
      scene.add(lines);
      return lines;
    })();

    /* ---------- "404" as particles ---------- */
    const digits = new THREE.Group();
    scene.add(digits);
    let n = 0, home, pos, vel, pointSize = 0.1, digitsH = 4.6;
    let dotsGeo, dotsMat;

    function buildDigits() {
      const W = 720, H = 260;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.font = '700 230px "JetBrains Mono", Consolas, monospace';
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("404", W / 2, H / 2 + 8);
      const tw = g.measureText("404").width;
      const a = g.getImageData(0, 0, W, H).data;
      const on = (x, y) => a[(y * W + x) * 4 + 3] > 128;

      let rough = 0;
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (on(x, y)) rough++;
      const step = Math.max(2, Math.round(2 * Math.sqrt(rough / (small ? 1800 : 3600))));
      const k = TEXT_W / tw;
      const xy = [], col = [];
      let top = -1e9, bottom = 1e9;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (!on(x, y)) continue;
          const wx = (x - W / 2) * k, wy = (H / 2 - y) * k;
          xy.push(wx, wy);
          top = Math.max(top, wy); bottom = Math.min(bottom, wy);
          // the middle digit is the dead host
          const c3 = Math.abs(x - W / 2) < tw / 6 ? ALERT : ACCENT;
          const b = 0.55 + Math.random() * 0.45;
          col.push(c3.r * b, c3.g * b, c3.b * b);
        }
      }
      n = xy.length / 2;
      digitsH = top - bottom;
      const mid = (top + bottom) / 2;
      home = new Float32Array(n * 3); pos = new Float32Array(n * 3); vel = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        home[i * 3] = xy[i * 2]; home[i * 3 + 1] = xy[i * 2 + 1] - mid;
        if (still) {
          pos[i * 3] = home[i * 3]; pos[i * 3 + 1] = home[i * 3 + 1];
        } else { // start scattered, then assemble
          // behind the digits only: a point close to the camera is drawn huge and costs frames
          const r = 6 + Math.random() * 16, th = Math.random() * 6.283;
          pos[i * 3] = r * Math.cos(th);
          pos[i * 3 + 1] = r * Math.sin(th) * 0.7;
          pos[i * 3 + 2] = -3 - Math.random() * 24;
        }
      }
      dotsGeo = new THREE.BufferGeometry();
      dotsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      dotsGeo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      dotsMat = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false });
      pointSize = step * k * 0.62;
      const dots = new THREE.Points(dotsGeo, dotsMat);
      dots.frustumCulled = false;
      digits.add(dots);
    }

    /* ---------- packets ---------- */
    const PK = small ? 16 : 34;
    const pk = [];
    const pkPos = new Float32Array(PK * 6), pkCol = new Float32Array(PK * 6);
    const pkGeo = new THREE.BufferGeometry();
    pkGeo.setAttribute("position", new THREE.BufferAttribute(pkPos, 3).setUsage(THREE.DynamicDrawUsage));
    pkGeo.setAttribute("color", new THREE.BufferAttribute(pkCol, 3).setUsage(THREE.DynamicDrawUsage));
    const pkLines = new THREE.LineSegments(pkGeo, new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
    pkLines.frustumCulled = false;
    scene.add(pkLines);

    function launch(p, wait) {
      p.state = "fly";
      p.u = -wait;
      p.sx = (Math.random() - 0.5) * 46; p.sy = FLOOR_Y + 1 + Math.random() * 13; p.sz = -30 - Math.random() * 22;
      const i = (Math.random() * n) | 0, s = digits.scale.x;
      p.tx = home[i * 3] * s + digits.position.x; p.ty = home[i * 3 + 1] * s + digits.position.y; p.tz = 0;
      const d = Math.hypot(p.tx - p.sx, p.ty - p.sy, p.tz - p.sz);
      p.du = (15 + Math.random() * 9) / d; // progress per second
      p.dx = (p.tx - p.sx) / d; p.dy = (p.ty - p.sy) / d; p.dz = (p.tz - p.sz) / d;
    }
    function initPackets() {
      for (let i = 0; i < PK; i++) {
        const p = {};
        launch(p, still ? 0 : Math.random() * 3);
        if (still) p.u = 0.15 + Math.random() * 0.75;
        pk.push(p);
      }
    }

    const dropsEl = $("#drops");
    let drops = 0;

    // push the digits' particles away from a packet impact (digit-local coords)
    function ripple(lx, ly, force) {
      const R = 1.1;
      for (let i = 0; i < n; i++) {
        const dx = home[i * 3] - lx, dy = home[i * 3 + 1] - ly, d2 = dx * dx + dy * dy;
        if (d2 > R * R) continue;
        const f = (1 - Math.sqrt(d2) / R) * force;
        vel[i * 3 + 2] += f;
        vel[i * 3] += dx * f * 0.6; vel[i * 3 + 1] += dy * f * 0.6;
      }
    }

    function stepPackets(dt) {
      const s = digits.scale.x;
      for (let i = 0; i < PK; i++) {
        const p = pk[i], o = i * 6;
        let x = 0, y = 0, z = 0, tx = 0, ty = 0, tz = 0, c = ACCENT, b = 0;
        if (p.state === "fly") {
          p.u += (p.u < 0 ? 1 : p.du) * dt;
          if (p.u >= 1) { // hit the host: dropped
            p.state = "drop"; p.life = 1;
            p.x = p.tx; p.y = p.ty; p.z = p.tz;
            p.vx = (Math.random() - 0.5) * 4; p.vy = 1.5 + Math.random() * 3; p.vz = 1 + Math.random() * 2.5;
            ripple((p.tx - digits.position.x) / s, (p.ty - digits.position.y) / s, 5);
            drops++;
            if (dropsEl) dropsEl.textContent = String(drops);
          } else if (p.u > 0) {
            x = p.sx + (p.tx - p.sx) * p.u; y = p.sy + (p.ty - p.sy) * p.u; z = p.sz + (p.tz - p.sz) * p.u;
            const len = 1.6;
            tx = x - p.dx * len; ty = y - p.dy * len; tz = z - p.dz * len;
            b = Math.min(1, p.u * 4);
          }
        }
        if (p.state === "drop") {
          p.vy -= 16 * dt;
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          p.life -= dt * 0.9;
          if (p.life <= 0 || p.y < FLOOR_Y) launch(p, Math.random() * 1.5);
          else {
            x = p.x; y = p.y; z = p.z;
            tx = x - p.vx * 0.07; ty = y - p.vy * 0.07; tz = z - p.vz * 0.07;
            c = ALERT; b = p.life;
          }
        }
        pkPos[o] = x; pkPos[o + 1] = y; pkPos[o + 2] = z;
        pkPos[o + 3] = tx; pkPos[o + 4] = ty; pkPos[o + 5] = tz;
        pkCol[o] = c.r * b; pkCol[o + 1] = c.g * b; pkCol[o + 2] = c.b * b;
        pkCol[o + 3] = pkCol[o + 4] = pkCol[o + 5] = 0; // tail fades to nothing
      }
      pkGeo.attributes.position.needsUpdate = true;
      pkGeo.attributes.color.needsUpdate = true;
    }

    /* ---------- pointer ---------- */
    const ptr = { on: false, nx: 0, ny: 0, lx: 0, ly: 0 };
    function onMove(e) {
      ptr.on = true;
      ptr.nx = (e.clientX / innerWidth) * 2 - 1;
      ptr.ny = -((e.clientY / innerHeight) * 2 - 1);
    }
    function pointerToLocal() { // where the pointer ray meets the z = 0 plane, in digit-local coords
      const v = new THREE.Vector3(ptr.nx, ptr.ny, 0.5).unproject(camera).sub(camera.position);
      const t = -camera.position.z / v.z, s = digits.scale.x;
      ptr.lx = (camera.position.x + v.x * t - digits.position.x) / s;
      ptr.ly = (camera.position.y + v.y * t - digits.position.y) / s;
    }

    /* ---------- digits physics ---------- */
    let nextGlitch = 2.5;
    function stepDigits(dt, t) {
      const K = 42, damp = Math.exp(-6.5 * dt), R = 1.7;
      if (t > nextGlitch) { // a band of the digits tears sideways for a moment
        nextGlitch = t + 2.2 + Math.random() * 3.5;
        const y0 = (Math.random() - 0.5) * digitsH, h = 0.15 + Math.random() * 0.35, kick = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 6);
        for (let i = 0; i < n; i++) if (Math.abs(home[i * 3 + 1] - y0) < h) vel[i * 3] += kick;
      }
      for (let i = 0; i < n; i++) {
        const a = i * 3;
        const hz = Math.sin(t * 1.3 + home[a] * 0.7) * 0.14; // slow wave across the digits
        let ax = (home[a] - pos[a]) * K, ay = (home[a + 1] - pos[a + 1]) * K, az = (hz - pos[a + 2]) * K;
        if (ptr.on) {
          const dx = pos[a] - ptr.lx, dy = pos[a + 1] - ptr.ly, d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 0.001, f = (1 - d / R) * 150;
            ax += (dx / d) * f; ay += (dy / d) * f; az += f * 0.5;
          }
        }
        vel[a] = (vel[a] + ax * dt) * damp; vel[a + 1] = (vel[a + 1] + ay * dt) * damp; vel[a + 2] = (vel[a + 2] + az * dt) * damp;
        pos[a] += vel[a] * dt; pos[a + 1] += vel[a + 1] * dt; pos[a + 2] += vel[a + 2] * dt;
      }
      dotsGeo.attributes.position.needsUpdate = true;
    }

    /* ---------- layout ---------- */
    function fit() {
      const w = innerWidth, h = innerHeight;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const visH = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z, visW = visH * camera.aspect;
      // the digits sit in the free space between the top bar and the console block
      const box = $(".console"), top = 52;
      const bottom = box ? Math.max(top + 120, box.getBoundingClientRect().top) : h * 0.5;
      const freeH = ((bottom - top) / h) * visH;
      const s = Math.min(1, (visW * 0.84) / TEXT_W, (freeH * 0.72) / digitsH);
      digits.scale.setScalar(s);
      digits.position.y = (0.5 - (top + bottom) / 2 / h) * visH;
      if (dotsMat) dotsMat.size = pointSize * s;
    }

    /* ---------- loop ---------- */
    const clock = new THREE.Clock();
    let raf = 0, t = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.066);
      const sub = dt > 0.025 ? 2 : 1; // keep the springs stable on slow frames
      t += dt;
      camera.position.x += (ptr.nx * 1.3 - camera.position.x) * 0.04;
      camera.position.y += (ptr.ny * 0.7 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      if (ptr.on) pointerToLocal();
      grid.position.z = (t * 1.6) % STEP;
      for (let i = 0; i < sub; i++) stepDigits(dt / sub, t);
      stepPackets(dt);
      renderer.render(scene, camera);
    }
    function drawOnce() { stepPackets(0); renderer.render(scene, camera); }

    function start() {
      buildDigits();
      fit();
      initPackets();
      html.classList.add("has-gl");
      fit(); // the heading just left the layout, so measure again
      addEventListener("resize", () => { fit(); if (still) drawOnce(); });
      canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); cancelAnimationFrame(raf); html.classList.remove("has-gl"); });
      if (still) { // one frame, no counter: nothing is moving
        if (dropsEl) dropsEl.parentElement.hidden = true;
        drawOnce();
        return;
      }
      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("pointerdown", onMove, { passive: true });
      addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") ptr.on = false; });
      html.addEventListener("pointerleave", () => { ptr.on = false; });
      document.addEventListener("visibilitychange", () => {
        cancelAnimationFrame(raf);
        if (!document.hidden) { clock.getDelta(); frame(); }
      });
      frame();
    }

    // sample the digits in the site's own mono font when it arrives in time
    const font = document.fonts && document.fonts.load ? document.fonts.load('700 230px "JetBrains Mono"') : Promise.resolve();
    Promise.race([font, new Promise((r) => setTimeout(r, 1500))]).then(start, start);
  }
})();
