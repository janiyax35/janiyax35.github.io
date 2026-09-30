/* Everything the README graphics say. Edit here, then run
   `node .github/readme/build.mjs` to redraw .github/readme/assets/.
   Only ASCII plus · – — ’ … (the embedded fonts contain nothing else). */

export const project = {
  repo: "janiyax35.github.io",
  site: "janith.qzz.io",
  name: ["Janith Deshan", "· Portfolio"],
  cmd: "curl -I https://janith.qzz.io",
  line: "A cybersecurity portfolio styled as an operator console",
  label: "modules",
  modules: ["operator console", "jdsh terminal", "case files", "the lab ctf"],
  status: "live · janith.qzz.io",
  meta: "static · github pages · mit"
};

export const links = {
  site: "https://janith.qzz.io",
  lab: "https://janith.qzz.io/lab.html",
  email: "mailto:janithmihijaya123@gmail.com"
};

/* section heads: key -> [index, title, meta command] */
export const sections = {
  overview: ["01", "overview", "cat overview.md"],
  features: ["02", "features", "ls ./features"],
  architecture: ["03", "architecture", "tree -L 2"],
  stack: ["04", "stack", "nmap -sV janith.qzz.io"],
  security: ["05", "security", "cat security.txt"],
  lab: ["06", "the lab", "cd ~/lab"],
  run: ["07", "run locally", "python -m http.server"],
  contact: ["08", "contact", "ssh janith@janith.qzz.io"]
};

/* feature cards (2-up) */
export const features = [
  {
    file: "card-console", id: "F-01", type: "interface",
    title: "Operator console",
    summary: "A boot sequence once per session, OPS / RED / BLUE modes that re-colour the site and highlight offensive or defensive work, and a Ctrl+K command palette.",
    stack: ["GSAP 3.13", "Lenis", "CSS tokens"],
    metric: ["3", "colour modes"]
  },
  {
    file: "card-terminal", id: "F-02", type: "interactive",
    title: "jdsh terminal",
    summary: "A real xterm.js shell in the hero that types whoami on load. Try help, projects, nmap janith, cat, lab or sudo hire-me.",
    stack: ["xterm.js 5.5", "addon-fit"],
    metric: ["30+", "commands"]
  },
  {
    file: "card-cases", id: "F-03", type: "projects",
    title: "Case files",
    summary: "Projects written up as engagement reports: scope, findings, outcome. Private repos show a request-access button instead of a link.",
    stack: ["data.js", "<dialog>", "mailto"],
    metric: ["9", "case files"]
  },
  {
    file: "card-lab", id: "F-04", type: "the lab",
    title: "The Lab",
    summary: "A separate page for the extras: a six-flag CTF scoreboard, a full-size shell, a drag-to-spin threat globe and a site-security self-audit.",
    stack: ["canvas", "topojson", "Web Crypto"],
    metric: ["6", "hidden flags"]
  },
  {
    file: "card-contact", id: "F-05", type: "contact",
    title: "Contact channel",
    summary: "The form sends through EmailJS with a honeypot, a 3-second time trap, a 30-second cooldown and headless-browser blocking. A mail-app backup is always there.",
    stack: ["EmailJS 4.4", "honeypot", "rate limit"],
    metric: ["48h", "reply time"]
  },
  {
    file: "card-ux", id: "F-06", type: "details",
    title: "Custom UX",
    summary: "A context-aware right-click menu, native SVG cursors, a radar-style scroll dial and a giant footer name lit by a cursor spotlight.",
    stack: ["SVG cursors", "pointer: fine"],
    metric: ["0", "frameworks"]
  }
];

/* results strip */
export const results = [
  ["9", "case files"],
  ["6", "hidden flags"],
  ["3", "colour modes"],
  ["0", "build steps"]
];

/* architecture diagram: hand-placed boxes on an 840-wide canvas */
export const arch = {
  title: "architecture — janith.qzz.io",
  caption: "Static site: no server code and no build step. The browser only talks to hosts on the CSP allow-list.",
  deploy: [
    { x: 28, y: 64, w: 200, t: "janiyax35.github.io", s: "git · main branch" },
    { x: 28, y: 160, w: 200, t: "GitHub Actions", s: "static.yml · deploy" },
    { x: 28, y: 256, w: 200, t: "GitHub Pages", s: "janith.qzz.io · HTTPS" }
  ],
  edges: ["push", "deploy", "HTTPS"],
  browser: { x: 300, y: 150, w: 212, h: 158, t: "browser", lines: ["index.html   home", "lab.html     the lab", "data.js  ->  render", "localStorage: mode, flags"] },
  boundary: "CSP ALLOW-LIST",
  external: [
    { t: "Google Fonts", s: "stylesheet + woff2" },
    { t: "cdnjs · jsDelivr · unpkg", s: "pinned versions · SRI sha384" },
    { t: "world-atlas 2.0.2", s: "globe data · hash-checked" },
    { t: "EmailJS API", s: "contact form · rate-limited" }
  ]
};

/* stack as an nmap scan: [port, service, version] */
export const scan = [
  ["443/tcp", "https", "GitHub Pages · custom domain · Actions deploy"],
  ["80/tcp", "web", "HTML · CSS · vanilla JS · no framework, no build"],
  ["8080/tcp", "motion", "GSAP 3.13 · ScrollTrigger · ScrambleText · Lenis 1.3.4"],
  ["2222/tcp", "shell", "xterm.js 5.5.0 · addon-fit 0.10.0 · jdsh"],
  ["9000/tcp", "globe", "canvas 2D · topojson-client 3.1.0 · world-atlas 2.0.2"],
  ["587/tcp", "mail", "EmailJS 4.4.1 · honeypot · time trap · rate limit"],
  ["8443/tcp", "integrity", "CSP · SRI sha384 · Web Crypto SHA-256"],
  ["31337/tcp", "ctf", "6 flags hidden · start at /lab.html"]
];

export const footer = "JANITH.QZZ.IO";
