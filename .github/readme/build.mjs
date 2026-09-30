/* Draws every README graphic into .github/readme/assets/ from content.mjs.
   Run: node .github/readme/build.mjs   (no dependencies, Node 18+)
   Adapted from the profile README generator (github.com/janiyax35/janiyax35). */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { C, Doc, svg, chrome, corners, typed, appear, textWidth, wrap, esc, mono } from "./lib.mjs";
import * as K from "./content.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "assets");
mkdirSync(OUT, { recursive: true });

const files = {};
const emit = (name, content) => { files[name] = content; };
const PROMPT = (x, y, fs) => `<text class="m" x="${x}" y="${y}" font-size="${fs}" fill="${C.lime}">jd<tspan fill="${C.dim}">:</tspan><tspan fill="${C.cyan}">~</tspan><tspan fill="${C.dim}">$</tspan></text>`;

/* deterministic PRNG so rebuilding doesn't churn the scramble frames */
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/* ------------------------------------------------------------------ hero */
function hero() {
  const d = new Doc(), W = 840, H = 300, X = 28, P = K.project;
  const out = [chrome(W, H, `jd@janith: ~/${P.repo}`, P.site)];

  // slow CRT scanline drifting down the window
  d.rule(`.scan{animation:scan 7s linear infinite}@keyframes scan{from{transform:translateY(0)}to{transform:translateY(300px)}}`);
  out.push(`<defs><clipPath id="win"><rect x="1" y="37" width="${W - 2}" height="${H - 38}" rx="5"/></clipPath>
<linearGradient id="sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.lime}" stop-opacity="0"/><stop offset=".5" stop-color="${C.lime}" stop-opacity=".05"/><stop offset="1" stop-color="${C.lime}" stop-opacity="0"/></linearGradient></defs>
<g clip-path="url(#win)"><rect class="scan" x="0" y="-24" width="${W}" height="60" fill="url(#sl)"/></g>`);

  // $ curl -I https://janith.qzz.io
  const ps = 14, cw = mono(ps), py = 78;
  out.push(PROMPT(X, py, ps));
  out.push(typed(d, { x: X + 6 * cw, y: py, text: P.cmd, size: ps, start: 0.5, dur: 1.1 }));

  // name: fit the space left of the globe, scramble → resolve, rare red/cyan glitch
  const full = P.name.join(" "), maxW = 575;
  let NS = 60;
  while (NS > 36 && textWidth(full, "sg-700", NS, -0.025 * NS) > maxW) NS -= 1;
  const LS = (-0.025 * NS).toFixed(2), NY = 150;
  const nameText = (fill, extra = "") =>
    `<text class="s" x="${X}" y="${NY}" font-size="${NS}" font-weight="700" letter-spacing="${LS}" ${extra}>${esc(P.name[0])} <tspan fill="${fill}">${esc(P.name[1])}</tspan></text>`;
  const glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&*+=?@<>/";
  const r = rng(35), F = 9, t0 = 1.75, step = 0.075;
  d.rule(`@keyframes fr{from,to{opacity:1}}@keyframes hide{from,to{opacity:0}}`);
  for (let k = 0; k < F; k++) {
    const fixed = Math.floor((full.length * k) / F);
    const s = [...full].map((ch, i) => (ch === " " || ch === "·" || i < fixed ? ch : glyphs[Math.floor(r() * glyphs.length)])).join("");
    out.push(`<text class="s" x="${X}" y="${NY}" font-size="${NS}" font-weight="700" letter-spacing="${LS}" fill="${C.lime}" fill-opacity=".85" style="opacity:0;animation:fr ${step}s linear ${(t0 + k * step).toFixed(3)}s">${esc(s)}</text>`);
  }
  const reveal = (t0 + F * step).toFixed(3);
  d.rule(`.gl-r,.gl-c{opacity:0;animation:glr 8s linear 4s infinite}.gl-c{animation-name:glc}
@keyframes glr{0%,88%,100%{opacity:0;transform:none}89%{opacity:.8;transform:translate(-4px,0)}91%{opacity:.8;transform:translate(3px,-1px)}92.5%{opacity:0}}
@keyframes glc{0%,88%,100%{opacity:0;transform:none}89%{opacity:.8;transform:translate(4px,1px)}91%{opacity:.8;transform:translate(-3px,0)}92.5%{opacity:0}}
.nm{animation:hide ${reveal}s linear}`);
  out.push(`<g class="gl-r">${nameText(C.red, `fill="${C.red}"`)}</g><g class="gl-c">${nameText(C.cyan, `fill="${C.cyan}"`)}</g>`);
  out.push(`<g class="nm">${nameText(C.lime, `fill="${C.text}"`)}</g>`);

  // tagline
  out.push(`<text class="m ${appear(d, 2.5)}" x="${X}" y="190" font-size="14" fill="${C.muted}">${esc(P.line)}</text>`);

  // > modules: <item>  — types, holds, erases, next
  const label = `> ${P.label}:`, fy = 228, fx = X + (label.length + 1) * cw, roles = P.modules, per = roles.length * 3, S = 2.8;
  out.push(`<text class="m ${appear(d, S - 0.2)}" x="${X}" y="${fy}" font-size="${ps}" fill="${C.lime}">&gt;<tspan fill="${C.dim}"> ${esc(P.label)}:</tspan></text>`);
  roles.forEach((role, i) => {
    const n = role.length, dist = (n * cw).toFixed(1), a = (100 / roles.length) * i, span = 100 / roles.length;
    const pct = (v) => `${Math.max(0, Math.min(100, v)).toFixed(2)}%`;
    const vis = d.keyframes(i === 0
      ? `0%,${pct(span - 0.5)}{opacity:1}${pct(span - 0.49)},100%{opacity:0}`
      : `0%,${pct(a - 0.01)}{opacity:0}${pct(a)},${pct(a + span - 0.5)}{opacity:1}${pct(a + span - 0.49)},100%{opacity:0}`);
    const mv = d.keyframes(`0%${a > 0 ? `,${pct(a)}` : ""}{transform:translateX(0);animation-timing-function:steps(${n},end)}${pct(a + span * 0.2)},${pct(a + span * 0.8)}{transform:translateX(${dist}px);animation-timing-function:steps(${n},end)}${pct(a + span * 0.9)},100%{transform:translateX(0)}`);
    const g = d.id("r"), c = d.id("c");
    d.rule(`.${g}{opacity:${i === 0 ? 1 : 0};animation:${vis} ${per}s linear ${S}s infinite both}.${c}{transform:translateX(${i === 0 ? dist : 0}px);animation:${mv} ${per}s linear ${S}s infinite both}`);
    out.push(`<g class="${g}"><text class="m" x="${fx}" y="${fy}" font-size="${ps}" fill="${C.text}">${esc(role)}</text><g class="${c}"><rect x="${fx}" y="${fy - 14}" width="${(n + 1) * cw + 2}" height="19" fill="${C.term}"/><rect x="${fx}" y="${fy - 13}" width="${cw}" height="17" fill="${C.lime}" style="animation:blink 1s steps(1) infinite"/></g></g>`);
  });

  // wireframe globe (The Lab's threat globe): meridians turn by scaling |sin(longitude)|
  const cx = 726, cy = 142, R = 72, T = 12; // T = seconds per full turn
  // satellite: moves round the flattened orbit (keyframed x/y), so the dot itself stays round
  const oR = R + 16, oB = oR * 0.28;
  const satKf = Array.from({ length: 25 }, (_, i) => { const a = i / 24 * 2 * Math.PI; return `${(i / 24 * 100).toFixed(2)}%{transform:translate(${(oR * Math.cos(a)).toFixed(1)}px,${(oB * Math.sin(a)).toFixed(1)}px)}`; }).join("");
  const sinKf = Array.from({ length: 25 }, (_, i) => `${(i / 24 * 100).toFixed(2)}%{transform:scaleX(${Math.abs(Math.sin(i / 24 * Math.PI)).toFixed(3)})}`).join("");
  d.rule(`.mer{transform-origin:${cx}px ${cy}px;animation:mer ${T / 2}s linear infinite}@keyframes mer{${sinKf}}
.sat{animation:sat 9s linear infinite}@keyframes sat{${satKf}}
.ping{transform-box:fill-box;transform-origin:center;animation:ping 2.4s ease-out infinite}@keyframes ping{from{opacity:.8;transform:scale(1)}to{opacity:0;transform:scale(3)}}`);
  const meridians = Array.from({ length: 6 }, (_, k) => {
    const lon = 15 + k * 30; // degrees, offset so no meridian rests edge-on
    const rest = Math.abs(Math.sin(lon * Math.PI / 180)).toFixed(3);
    return `<ellipse class="mer" cx="${cx}" cy="${cy}" rx="${R}" ry="${R}" style="transform:scaleX(${rest});animation-delay:-${(lon / 180 * T / 2).toFixed(2)}s" vector-effect="non-scaling-stroke"/>`;
  }).join("");
  const lats = [-60, -30, 0, 30, 60].map((deg) => {
    const f = deg * Math.PI / 180, y = cy - R * Math.sin(f), hw = R * Math.cos(f);
    return `<ellipse cx="${cx}" cy="${y.toFixed(2)}" rx="${hw.toFixed(2)}" ry="${(hw * 0.14).toFixed(2)}" stroke="${deg === 0 ? C.lime : C.line2}" stroke-opacity="${deg === 0 ? 0.5 : 1}"/>`;
  }).join("");
  const pings = [[-26, -30, C.lime, 0], [30, 8, C.red, 0.8], [-8, 36, C.cyan, 1.6]].map(([dx, dy, col, dl]) =>
    `<circle class="ping" cx="${cx + dx}" cy="${cy + dy}" r="3" fill="none" stroke="${col}" style="animation-delay:${dl}s"/><circle cx="${cx + dx}" cy="${cy + dy}" r="2.4" fill="${col}"/>`).join("");
  out.push(`<g class="${appear(d, 0.3, 0.6)}">
<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.panel2}" stroke="${C.line2}"/>
<g fill="none">${lats}</g>
<g fill="none" stroke="${C.lime}" stroke-opacity=".45">${meridians}</g>
${pings}
<g transform="translate(${cx} ${cy}) rotate(-10)"><ellipse rx="${oR}" ry="${oB.toFixed(2)}" fill="none" stroke="${C.line2}" stroke-dasharray="3 5"/><circle class="sat" r="3.2" fill="${C.lime}" style="transform:translate(${oR}px,0)"/></g>
<text class="m" x="${cx}" y="${cy + R + 30}" text-anchor="middle" font-size="10.5" letter-spacing="1.6" fill="${C.dim}">GITHUB PAGES · HTTPS</text>
</g>`);

  // status bar
  d.rule(`.pg{transform-box:fill-box;transform-origin:center;animation:ping 2s ease-out infinite}`);
  out.push(`<g class="${appear(d, 2.6)}"><path d="M20 252.5H${W - 20}" stroke="${C.line}"/>
<circle class="pg" cx="33" cy="274" r="4" fill="none" stroke="${C.lime}"/><circle cx="33" cy="274" r="4" fill="${C.lime}"/>
<text class="m" x="46" y="278" font-size="12" fill="${C.muted}">${esc(P.status)}</text>
<text class="m" x="${W - 22}" y="278" text-anchor="end" font-size="12" fill="${C.dim}">${esc(P.meta)}</text></g>`);

  emit("hero.svg", svg({
    w: W, h: H, doc: d, fonts: ["jbm-400", "sg-700"],
    title: `${full}`,
    desc: `Animated terminal: ${P.cmd} resolves to ${full}. ${P.line}. Modules: ${P.modules.join(", ")}. A spinning wireframe globe. Status: ${P.status}; ${P.meta}.`,
    body: out.join("\n")
  }));
}

/* --------------------------------------------------------------- buttons */
const ICONS = {
  arrow: (x, y, c) => `<path d="M${x + 2} ${y + 12}L${x + 12} ${y + 2}M${x + 4.5} ${y + 2}H${x + 12}V${y + 9.5}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="square"/>`,
  prompt: (x, y, c) => `<text class="m" x="${x}" y="${y + 11.5}" font-size="13" font-weight="700" fill="${c}">&gt;_</text>`,
  at: (x, y, c) => `<text class="m" x="${x + 1}" y="${y + 12}" font-size="14" font-weight="700" fill="${c}">@</text>`
};
const iconW = { arrow: 14, prompt: 16, at: 14 };

function button(file, label, icon, primary = false) {
  const d = new Doc(), H = 40, fs = 12, ls = 1.4, pad = 18, gap = 10;
  const tw = textWidth(label.toUpperCase(), "jbm-700", fs, ls) - ls;
  const W = Math.round(pad + iconW[icon] + gap + tw + pad);
  const fg = primary ? C.bg : C.text, ic = primary ? C.bg : C.lime;
  d.rule(`.shine{animation:shine 6s ease-in-out 1s infinite both}@keyframes shine{0%{transform:translateX(0)}25%,100%{transform:translateX(${W + 80}px)}}`);
  const body = `<defs><clipPath id="b"><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="3"/></clipPath>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${primary ? .45 : .09}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="3" fill="${primary ? C.lime : C.panel}" stroke="${primary ? C.lime : C.line2}"/>
${primary ? "" : corners(0.5, 0.5, W - 1, H - 1, C.lime, 7)}
<g clip-path="url(#b)"><rect class="shine" x="-70" y="0" width="60" height="${H}" fill="url(#g)" transform="skewX(-20)"/></g>
${ICONS[icon](pad, 13, ic)}
<text class="m up" x="${pad + iconW[icon] + gap}" y="24.5" font-size="${fs}" font-weight="700" letter-spacing="${ls}" fill="${fg}">${esc(label)}</text>`;
  emit(file, svg({ w: W, h: H, doc: d, fonts: ["jbm-700"], title: label, desc: `${label} button`, body }));
}

/* --------------------------------------------------------- section heads */
/* heads sit on GitHub's own page colour, so they come in two themes */
const HEAD_THEME = {
  dark: { ink: C.text, accent: C.lime, meta: C.dim, rule: C.line2 },
  light: { ink: "#1F2328", accent: "#4F7A00", meta: "#59636E", rule: "#D0D7DE" }
};

function sectionHead(key, theme = "dark") {
  const [idx, title, meta] = K.sections[key];
  const T = HEAD_THEME[theme];
  const d = new Doc(), W = 840, H = 60, ty = 40;
  const tw = textWidth(title, "sg-700", 30, -1);
  const mw = mono(12) * (meta.length + 2);
  const x1 = 50 + tw + 18, x2 = W - 2 - mw - 18, len = x2 - x1;
  d.rule(`.ln{transform-origin:${x1}px 0;animation:draw 1.1s cubic-bezier(.2,.8,.2,1) .2s both}@keyframes draw{from{transform:scaleX(0)}}
.pk{animation:pk 5s cubic-bezier(.5,0,.5,1) 1.3s infinite both}@keyframes pk{0%{transform:translateX(0);opacity:0}6%{opacity:1}54%{opacity:1}60%,100%{transform:translateX(${(len - 8).toFixed(1)}px);opacity:0}}`);
  const body = `<defs><linearGradient id="lg" gradientUnits="userSpaceOnUse" x1="${x1}" y1="0" x2="${x2}" y2="0"><stop offset="0" stop-color="${T.rule}"/><stop offset="1" stop-color="${T.rule}" stop-opacity="0"/></linearGradient></defs>
<rect x=".5" y="19.5" width="34" height="22" rx="2" fill="none" stroke="${T.accent}" stroke-opacity=".45"/>
<text class="m" x="17.5" y="34.5" text-anchor="middle" font-size="12" fill="${T.accent}">${idx}</text>
<text class="s" x="50" y="${ty}" font-size="30" font-weight="700" letter-spacing="-1" fill="${T.ink}">${esc(title)}</text>
<rect class="ln" x="${x1}" y="30" width="${len}" height="1" fill="url(#lg)"/>
<rect class="pk" x="${x1}" y="29.5" width="8" height="2" fill="${T.accent}"/>
<text class="m" x="${W - 2}" y="35" text-anchor="end" font-size="12" fill="${T.meta}"><tspan fill="${T.accent}">$</tspan> ${esc(meta)}</text>`;
  emit(`head-${key}${theme === "light" ? "-light" : ""}.svg`, svg({ w: W, h: H, doc: d, fonts: ["jbm-400", "sg-700"], title: `${idx} ${title}`, desc: `Section ${idx}: ${title}`, body }));
}

/* --------------------------------------------------------- feature cards */
function cardLayout(p) {
  const title = wrap(p.title, "sg-700", 20, 370, 2);
  const sum = wrap(p.summary, "sg-500", 13.5, 370, 4);
  return { title, sum, h: 38 + 34 + (title.length - 1) * 24 + 16 + sum.length * 19.5 + 12 + 22 + 60 };
}

function card(p, i, H) {
  const d = new Doc(), W = 410, X = 20, L = cardLayout(p);
  const out = [];
  out.push(`<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.panel}"/><stop offset="1" stop-color="${C.panel2}"/></linearGradient>
<linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.lime}" stop-opacity="0"/><stop offset=".5" stop-color="${C.lime}" stop-opacity=".09"/><stop offset="1" stop-color="${C.lime}" stop-opacity="0"/></linearGradient>
<clipPath id="cc"><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="4"/></clipPath></defs>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="4" fill="url(#bg)" stroke="${C.line}"/>`);
  // scan sweep, staggered per card
  d.rule(`.sw{animation:sw 8s cubic-bezier(.4,0,.2,1) ${(1 + i * 1.6).toFixed(1)}s infinite both}@keyframes sw{0%{transform:translateX(0)}18%,100%{transform:translateX(${W + 260}px)}}`);
  out.push(`<g clip-path="url(#cc)"><rect class="sw" x="-240" y="0" width="200" height="${H}" fill="url(#sw)" transform="skewX(-12)"/></g>`);
  out.push(corners(0.5, 0.5, W - 1, H - 1));
  out.push(`<text class="m" x="${X}" y="24" font-size="11" letter-spacing=".9" fill="${C.lime}">${esc(p.id)}</text>
<text class="m up" x="${W - X}" y="24" text-anchor="end" font-size="10.5" letter-spacing=".8" fill="${C.muted}">${esc(p.type)}</text>
<path d="M1 38.5H${W - 1}" stroke="${C.line}"/>`);
  let y = 38 + 34;
  L.title.forEach((ln, k) => out.push(`<text class="s" x="${X}" y="${y + k * 24}" font-size="20" font-weight="700" letter-spacing="-.4" fill="${C.text}">${esc(ln)}</text>`));
  y += (L.title.length - 1) * 24 + 16;
  L.sum.forEach((ln, k) => out.push(`<text class="s" x="${X}" y="${y + 13 + k * 19.5}" font-size="13.5" font-weight="500" fill="${C.muted}">${esc(ln)}</text>`));
  // metric pinned to the bottom, stack chips to its right
  const my = H - 22, [mv, ml] = p.metric;
  const vw = textWidth(mv, "sg-700", 28, -0.8);
  out.push(`<path d="M${X} ${my - 40.5}H${W - X}" stroke="${C.line}" stroke-dasharray="3 4"/>
<text class="s" x="${X}" y="${my}" font-size="28" font-weight="700" letter-spacing="-.8" fill="${C.lime}">${esc(mv)}</text>
<text class="m up" x="${X + vw + 10}" y="${my}" font-size="10" letter-spacing="1" fill="${C.dim}">${esc(ml)}</text>`);
  const chipW = (s) => textWidth(s, "jbm-400", 10.5) + 16;
  const left = X + vw + 10 + textWidth(ml.toUpperCase(), "jbm-400", 10, 1) + 14;
  let cx = W - X;
  for (const s of [...p.stack].reverse()) {
    const w = chipW(s);
    if (cx - w < left) break;
    cx -= w;
    out.push(`<rect x="${cx + .5}" y="${my - 16.5}" width="${w}" height="21" rx="2" fill="${C.term}" stroke="${C.line2}"/><text class="m" x="${cx + 8.5}" y="${my - 2}" font-size="10.5" fill="${C.muted}">${esc(s)}</text>`);
    cx -= 6;
  }
  emit(`${p.file}.svg`, svg({
    w: W, h: H, doc: d, fonts: ["jbm-400", "sg-500", "sg-700"],
    title: `${p.id}: ${p.title}`,
    desc: `${p.summary} Built with ${p.stack.join(", ")}. ${p.metric.join(" ")}.`,
    body: out.join("\n")
  }));
}

/* ---------------------------------------------------------- results strip */
function results() {
  const d = new Doc(), W = 840, H = 104, gap = 12, n = K.results.length;
  const tw = (W - gap * (n - 1)) / n, out = [];
  out.push(`<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.panel}"/><stop offset="1" stop-color="${C.panel2}"/></linearGradient></defs>`);
  K.results.forEach(([v, l], i) => {
    const x = i * (tw + gap);
    out.push(`<g class="${appear(d, 0.2 + i * 0.12, 0.4)}"><rect x="${x + .5}" y=".5" width="${tw - 1}" height="${H - 1}" rx="4" fill="url(#bg)" stroke="${C.line}"/>
<rect x="${x + 1}" y="1" width="2" height="${H - 2}" fill="${C.lime}"/>
<text class="s" x="${x + 22}" y="56" font-size="42" font-weight="700" letter-spacing="-1.6" fill="${i === n - 1 ? C.text : C.lime}">${esc(v)}</text>
<text class="m up" x="${x + 22}" y="82" font-size="10.5" letter-spacing="1.3" fill="${C.dim}">${esc(l)}</text></g>`);
  });
  emit("results.svg", svg({
    w: W, h: H, doc: d, fonts: ["jbm-400", "sg-700"],
    title: "By the numbers",
    desc: K.results.map(([v, l]) => `${v} ${l}`).join(", "),
    body: out.join("\n")
  }));
}

/* ----------------------------------------------------------- architecture */
function architecture() {
  const d = new Doc(), W = 840, A = K.arch, out = [];
  const node = (x, y, w, h, t, lines, hi = false) => {
    const rows = lines.map((s, k) => `<text class="m" x="${x + 12}" y="${y + 38 + k * 18}" font-size="10.5" fill="${C.dim}" xml:space="preserve">${esc(s)}</text>`).join("");
    return `<rect x="${x + .5}" y="${y + .5}" width="${w}" height="${h}" rx="3" fill="${C.panel}" stroke="${hi ? C.lime : C.line2}" stroke-opacity="${hi ? .6 : 1}"/>${hi ? corners(x + .5, y + .5, w, h) : ""}
<text class="m" x="${x + 12}" y="${y + 20}" font-size="12" font-weight="700" fill="${C.text}">${esc(t)}</text>${rows}`;
  };
  d.rule(`.hot{stroke-dasharray:4 4;animation:dash 1s linear infinite}@keyframes dash{to{stroke-dashoffset:-8}}`);
  let t = 0.25;

  // deploy chain: repo -> actions -> pages (vertical), then pages -> browser
  const NH = 52, dep = A.deploy, b = A.browser;
  dep.forEach((n) => { out.push(`<g class="${appear(d, t)}">${node(n.x, n.y, n.w, NH, n.t, [n.s])}</g>`); t += 0.12; });
  const hot = [];
  for (let i = 0; i < 2; i++) {
    const x = dep[i].x + dep[i].w / 2, y1 = dep[i].y + NH + 1, y2 = dep[i + 1].y;
    hot.push({ d: `M${x} ${y1}V${y2}`, x, y: y1, dx: 0, dy: y2 - y1, label: A.edges[i], lx: x + 10, ly: (y1 + y2) / 2 + 4 });
  }
  const py = dep[2].y + NH / 2, px1 = dep[2].x + dep[2].w + 1, px2 = b.x;
  hot.push({ d: `M${px1} ${py}H${px2}`, x: px1, y: py, dx: px2 - px1, dy: 0, label: A.edges[2], lx: (px1 + px2) / 2, ly: py - 8, mid: true });
  hot.forEach((e, i) => {
    const k = d.keyframes(`from{transform:translate(0,0);opacity:0}15%,85%{opacity:1}to{transform:translate(${e.dx}px,${e.dy}px);opacity:0}`);
    const cls = d.id("pk");
    d.rule(`.${cls}{opacity:0;animation:${k} 2.4s linear ${(0.8 + i * 0.8).toFixed(1)}s infinite}`);
    out.push(`<path class="hot" d="${e.d}" stroke="${C.lime}" stroke-opacity=".7" fill="none"/><circle class="${cls}" cx="${e.x}" cy="${e.y}" r="3" fill="${C.lime}"/>
<text class="m" x="${e.lx}" y="${e.ly}" ${e.mid ? `text-anchor="middle"` : ""} font-size="10" fill="${C.muted}">${esc(e.label)}</text>`);
  });

  // browser
  out.push(`<g class="${appear(d, t)}">${node(b.x, b.y, b.w, b.h, b.t, b.lines, true)}</g>`);
  t += 0.15;

  // CSP allow-list boundary with the external hosts
  const ex = 588, ew = 224, eh = 48, eg = 12, ey0 = 72;
  const bx = 572, by = 56, bw = W - 18 - bx, bh = ey0 + A.external.length * (eh + eg) - eg + 30 - by;
  out.push(`<g class="${appear(d, t)}"><rect x="${bx + .5}" y="${by + .5}" width="${bw}" height="${bh}" rx="4" fill="none" stroke="${C.amber}" stroke-opacity=".6" stroke-dasharray="5 4"/>
<text class="m up" x="${bx + bw - 12}" y="${by + bh - 10}" text-anchor="end" font-size="9.5" letter-spacing="1.2" fill="${C.amber}">${esc(A.boundary)}</text></g>`);
  const busX = 548, bMid = b.y + b.h / 2, mids = [];
  A.external.forEach((n, i) => {
    const y = ey0 + i * (eh + eg);
    mids.push(y + eh / 2);
    out.push(`<g class="${appear(d, t + 0.1 + i * 0.1)}">${node(ex, y, ew, eh - 4, n.t, [n.s])}</g>`);
  });
  const branches = mids.map((m) => `M${busX} ${m}H${ex}`).join("");
  out.push(`<g class="${appear(d, t + 0.1)}"><path d="M${b.x + b.w + 1} ${bMid}H${busX}M${busX} ${mids[0]}V${mids[mids.length - 1]}${branches}" fill="none" stroke="${C.line2}"/>
${mids.map((m) => `<circle cx="${ex}" cy="${m}" r="2.5" fill="${C.line2}"/>`).join("")}<circle cx="${busX}" cy="${bMid}" r="2.5" fill="${C.lime}"/></g>`);

  // caption
  const cy = by + bh + 34;
  out.push(`<path d="M20 ${cy - 20}.5H${W - 20}" stroke="${C.line}"/><text class="m ${appear(d, t + 0.6)}" x="28" y="${cy}" font-size="11.5" fill="${C.dim}">${esc(A.caption)}</text>`);
  const H = cy + 18;
  emit("architecture.svg", svg({
    w: W, h: H, doc: d, fonts: ["jbm-400", "jbm-700"],
    title: "Architecture of janith.qzz.io",
    desc: `${dep.map((n) => `${n.t} (${n.s})`).join(" -> ")} -> ${b.t} (${b.lines.join("; ")}). The browser loads only from the CSP allow-list: ${A.external.map((n) => `${n.t} (${n.s})`).join("; ")}. ${A.caption}`,
    body: chrome(W, H, A.title, "static") + "\n" + out.join("\n")
  }));
}

/* ------------------------------------------------------------ stack scan */
function stack() {
  const d = new Doc(), W = 840, X = 28, fs = 13, cw = mono(fs), lh = 21;
  const out = [];
  let y = 72;
  out.push(PROMPT(X, y, fs));
  out.push(typed(d, { x: X + 6 * cw, y, text: `nmap -sV ${K.project.site}`, size: fs, start: 0.4, dur: 0.9 }));
  let t = 1.6;
  const line = (txt, color = C.dim, dt = 0.12) => {
    y += lh;
    out.push(`<text class="m ${appear(d, t)}" x="${X}" y="${y}" font-size="${fs}" fill="${color}" xml:space="preserve">${txt}</text>`);
    t += dt;
  };
  y += 6;
  line(`Starting Nmap 7.95 ( https://nmap.org )`);
  line(`Nmap scan report for ${K.project.site} (185.199.108.153)`, C.muted);
  line(`Host is up (0.0042s latency).`, C.dim, 0.3);
  y += lh * 0.5;
  const col = (c) => X + c * cw;
  y += lh;
  out.push(`<g class="${appear(d, t)}" font-size="${fs}" font-weight="700"><text class="m" x="${col(0)}" y="${y}" fill="${C.text}">PORT</text><text class="m" x="${col(11)}" y="${y}" fill="${C.text}">STATE</text><text class="m" x="${col(18)}" y="${y}" fill="${C.text}">SERVICE</text><text class="m" x="${col(30)}" y="${y}" fill="${C.text}">VERSION</text></g>`);
  t += 0.2;
  for (const [port, svc, ver] of K.scan) {
    y += lh;
    const ctf = svc === "ctf";
    out.push(`<g class="${appear(d, t, 0.25)}" font-size="${fs}"><text class="m" x="${col(0)}" y="${y}" fill="${ctf ? C.red : C.text}">${port}</text><text class="m" x="${col(11)}" y="${y}" fill="${C.lime}">open</text><text class="m" x="${col(18)}" y="${y}" fill="${ctf ? C.red : C.cyan}">${esc(svc)}</text><text class="m" x="${col(30)}" y="${y}" fill="${C.muted}">${esc(ver)}</text></g>`);
    t += 0.14;
  }
  y += lh * 0.5;
  t += 0.2;
  line(`Service detection performed. <tspan fill="${C.lime}">${K.scan.length} services open</tspan> on 1 host.`, C.dim);
  line(`Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds`, C.dim, 0.3);
  y += lh + 6;
  out.push(`<g class="${appear(d, t, 0.1)}">${PROMPT(X, y, fs)}<rect x="${X + 6 * cw}" y="${y - 12}" width="${cw}" height="16" fill="${C.lime}" style="animation:blink 1s steps(1) infinite"/></g>`);
  d.once("blink", "@keyframes blink{50%{opacity:0}}@keyframes cur{from,to{opacity:1}}");
  const H = y + 24;
  emit("stack.svg", svg({
    w: W, h: H, doc: d, fonts: ["jbm-400", "jbm-700"],
    title: "The stack as an nmap scan",
    desc: K.scan.map(([p, s, v]) => `${p} ${s}: ${v}`).join("; "),
    body: chrome(W, H, "nmap — zsh", "stack") + "\n" + out.join("\n")
  }));
}

/* ---------------------------------------------------------------- footer */
function footer() {
  const d = new Doc(), W = 840, name = K.footer;
  const unit = textWidth(name, "sg-700", 1, -0.05);
  const fs = Math.floor((W - 40) / unit), ls = (-0.05 * fs).toFixed(2);
  const base = Math.round(fs * 0.78) + 22, H = Math.round(fs * 0.8) + 36;
  d.rule(`.spot{animation:spot 11s ease-in-out infinite alternate both}@keyframes spot{from{transform:translateX(-360px)}to{transform:translateX(360px)}}`);
  const txt = (attrs) => `<text class="s" x="${W / 2}" y="${base}" text-anchor="middle" font-size="${fs}" font-weight="700" letter-spacing="${ls}" ${attrs}>${esc(name)}</text>`;
  const body = `<defs>
<linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151C25"/><stop offset=".75" stop-color="#0B0E13"/></linearGradient>
<linearGradient id="fadeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".45" stop-color="#fff" stop-opacity=".5"/><stop offset=".92" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="fade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#fadeG)"/></mask>
<radialGradient id="sp"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<mask id="spot" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><circle class="spot" cx="${W / 2}" cy="${H / 2}" r="170" fill="url(#sp)"/></mask>
</defs>
<rect width="${W}" height="${H}" rx="6" fill="${C.bg}"/>
<g mask="url(#fade)">
${txt(`fill="url(#fill)" stroke="#1E2630" stroke-width="1"`)}
<g mask="url(#spot)">${txt(`fill="${C.lime}" fill-opacity=".16" stroke="${C.lime}" stroke-width="1.5"`)}</g>
</g>`;
  emit("footer.svg", svg({ w: W, h: H, doc: d, fonts: ["sg-700"], title: name, desc: `${name} in giant outlined letters with a slowly moving lime spotlight.`, body }));
}

/* ------------------------------------------------------------------ run */
hero();
button("btn-site.svg", "visit site", "arrow", true);
button("btn-lab.svg", "the lab", "prompt");
button("btn-email.svg", "email", "at");
for (const key of Object.keys(K.sections)) { sectionHead(key); sectionHead(key, "light"); }
const cardH = Math.ceil(Math.max(...K.features.map((p) => cardLayout(p).h)));
K.features.forEach((p, i) => card(p, i, cardH));
results();
architecture();
stack();
footer();

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(`${name.padEnd(26)} ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB`);
}
