/* =====================================================================
   JD//OPS · jdsh, an interactive shell built on xterm.js
   ===================================================================== */

window.JDTerm = (() => {
  "use strict";

  const D = window.JD;
  const P = D.profile;
  const E = "\x1b[";
  let term = null, fit = null, host = null;
  let ready = false, booting = false, busy = false, cancelled = false;
  let buf = "", hist = [], hIdx = -1, cwd = "~", root = false;
  const queue = [];

  /* ---------- colors ---------- */
  const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const hex = (h) => { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const paint = (h, s) => { const [r, g, b] = hex(h); return `${E}38;2;${r};${g};${b}m${s}${E}39m`; };
  const c = {
    acc: (s) => paint(cssVar("--accent") || "#B6FF3B", s),
    red: (s) => paint("#FF4D5E", s),
    cyan: (s) => paint("#3BD4FF", s),
    amber: (s) => paint("#FFB020", s),
    lime: (s) => paint("#B6FF3B", s),
    mut: (s) => paint("#8A97A5", s),
    dim: (s) => paint("#55616E", s),
    b: (s) => `${E}1m${s}${E}22m`
  };
  const pad = (s, n) => (s + " ".repeat(n)).slice(0, Math.max(n, s.length));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rot13 = (s) => s.replace(/[a-z]/gi, (ch) => {
    const b = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - b + 13) % 26) + b);
  });

  function theme() {
    const a = cssVar("--accent") || "#B6FF3B";
    return {
      background: "#080B0F", foreground: "#E6EDF3",
      cursor: a, cursorAccent: "#080B0F",
      selectionBackground: "rgba(182,255,59,.25)",
      black: "#0A0D12", brightBlack: "#55616E",
      red: "#FF4D5E", green: "#B6FF3B", yellow: "#FFB020", blue: "#3BD4FF",
      magenta: "#C792EA", cyan: "#3BD4FF", white: "#E6EDF3"
    };
  }

  /* ---------- virtual filesystem ---------- */
  const projFile = (p) => [
    c.acc(c.b(`# ${p.title}`)),
    c.dim(`${p.id} · ${p.type}`),
    "",
    p.summary,
    "",
    c.cyan("## scope"), p.scope, "",
    c.cyan("## what I built"), ...p.findings.map((f) => `  • ${f}`), "",
    c.cyan("## outcome"), p.outcome, "",
    c.dim("stack: ") + p.stack.join(", "),
    c.dim("repo:  ") + p.repo
  ].join("\n");

  const FILES = {
    "~/about.txt": () => [
      c.acc(c.b(P.name)) + c.dim("  ·  ") + P.headline,
      c.dim(P.location),
      "",
      P.summary,
      "",
      c.dim("status: ") + c.acc(P.status)
    ].join("\n"),
    "~/skills.txt": () => D.skills.map((g) =>
      c.cyan(pad(g.title, 22)) + g.items.map((i) =>
        i.team === "red" ? c.red(i.n) : i.team === "blue" ? c.cyan(i.n) : i.team === "both" ? c.acc(i.n) : i.n
      ).join(c.dim(", "))
    ).join("\n") + "\n\n" + c.dim("legend: ") + c.red("offensive") + c.dim(" · ") + c.cyan("defensive") + c.dim(" · ") + c.acc("both"),
    "~/contact.txt": () => [
      c.dim(pad("email", 10)) + c.acc(P.email),
      c.dim(pad("github", 10)) + P.github,
      c.dim(pad("linkedin", 10)) + P.linkedin,
      c.dim(pad("phone", 10)) + P.phone,
      c.dim(pad("web", 10)) + P.website
    ].join("\n"),
    "~/research.md": () => [
      c.acc(c.b("# " + D.research.title)),
      c.dim(D.research.meta), "",
      ...D.research.points.map((p) => "  • " + p), "",
      c.cyan("## emerging threats"),
      ...D.research.threats.map((t, i) => `  ${c.dim("0" + (i + 1))} ${t.n}: ${c.mut(t.d)}`)
    ].join("\n"),
    "~/cv.pdf": () => c.amber("cat: cv.pdf: binary file. Use ") + c.acc("cv") + c.amber(" to download it."),
    "~/.bash_history": () => [
      "cd ~/ops",
      "nmap -sC -sV 10.10.14.7",
      "vim notes.txt",
      'echo "WQ{u1fg0el_e3c34gf_1gf3ys}"   ' + c.dim("# rot13'd, nobody will ever figure it out"),
      "history -c   " + c.dim("# TODO: this didn't actually clear anything"),
      "exit"
    ].join("\n")
  };
  D.projects.forEach((p) => { FILES[`~/projects/${p.slug}.md`] = () => projFile(p); });

  const DIRS = {
    "~": ["about.txt", "skills.txt", "contact.txt", "research.md", "cv.pdf", "projects/"],
    "~/projects": D.projects.map((p) => `${p.slug}.md`)
  };
  const HIDDEN = { "~": [".bash_history", ".ssh/"] };
  const DENIED = ["~/.ssh"];

  function resolve(p) {
    if (!p || p === "~") return p ? "~" : cwd;
    let parts;
    if (p.startsWith("~")) parts = p.split("/");
    else if (p.startsWith("/home/guest")) parts = ["~", ...p.slice(11).split("/")];
    else if (p.startsWith("/")) return "/" + p.replace(/^\/+/, "");
    else parts = [...cwd.split("/"), ...p.split("/")];
    const out = [];
    for (const s of parts) {
      if (!s || s === ".") continue;
      if (s === "..") { if (out.length > 1) out.pop(); else return "/home"; continue; }
      out.push(s);
    }
    return out.join("/") || "~";
  }

  /* ---------- output helpers ---------- */
  const w = (s = "") => term.write(s);
  const ln = (s = "") => term.write(s + "\r\n");
  const prompt = () => {
    const user = root ? c.red("root") : c.acc("guest");
    const sign = root ? c.red("# ") : c.dim("$ ");
    w(`${user}${c.dim("@")}${c.mut("jd")}${c.dim(":")}${c.cyan(cwd)}${sign}`);
    const t = document.getElementById("term-title");
    if (t) t.textContent = `${root ? "root" : "guest"}@jd: ${cwd}`;
  };
  const app = () => window.JDApp || {};

  /* ---------- commands ---------- */
  const CMDS = {
    help: {
      d: "list commands",
      run() {
        ln(c.b("Available commands"));
        const rows = Object.entries(CMDS).filter(([, v]) => v.d);
        for (const [k, v] of rows) ln("  " + c.acc(pad(k, 12)) + c.mut(v.d));
        ln("");
        ln(c.dim("Tab autocompletes · ↑/↓ history · Ctrl+C cancel · Ctrl+L clear"));
      }
    },
    about: { d: "who is Janith", run: () => ln(FILES["~/about.txt"]()) },
    whoami: {
      d: "who are you",
      run() {
        ln(root ? c.red("root") : "guest");
        if (!root) ln(c.dim("(looking for me? try ") + c.acc("about") + c.dim(")"));
      }
    },
    ls: {
      d: "list files",
      run(args) {
        const all = args.some((a) => /^-\w*a/.test(a));
        const target = resolve(args.find((a) => !a.startsWith("-")));
        if (DENIED.includes(target)) return ln(c.red(`ls: cannot open directory '${target}': Permission denied`));
        if (FILES[target]) return ln(target.split("/").pop());
        const list = DIRS[target];
        if (!list) return ln(c.red(`ls: cannot access '${target}': No such file or directory`));
        const items = [...(all ? [".", "..", ...(HIDDEN[target] || [])] : []), ...list];
        ln(items.map((f) => (f.endsWith("/") || f === "." || f === ".." ? c.cyan(c.b(f)) : f.startsWith(".") ? c.dim(f) : f)).join("   "));
      }
    },
    cd: {
      d: "change directory",
      run([p]) {
        const t = p ? resolve(p) : "~";
        if (DENIED.includes(t)) return ln(c.red(`cd: ${p}: Permission denied`));
        if (!DIRS[t]) {
          if (t === "/home" || t.startsWith("/")) return ln(c.red("cd: this is a jailed shell. Nice try, though."));
          return ln(c.red(`cd: ${p}: No such file or directory`));
        }
        cwd = t;
      }
    },
    pwd: { run: () => ln(cwd === "~" ? "/home/guest" : "/home/guest" + cwd.slice(1)) },
    cat: {
      d: "print a file",
      run(args) {
        if (!args.length) return ln(c.amber("usage: cat <file>   ") + c.dim("(try: cat about.txt)"));
        for (const a of args) {
          const t = resolve(a);
          if (t.startsWith("~/.ssh")) { ln(c.red(`cat: ${a}: Permission denied`)); continue; }
          if (FILES[t]) ln(FILES[t]());
          else if (DIRS[t]) ln(c.red(`cat: ${a}: Is a directory`));
          else ln(c.red(`cat: ${a}: No such file or directory`));
        }
      }
    },
    projects: {
      d: "list case files",
      run() {
        for (const p of D.projects) {
          ln(c.acc(p.id) + "  " + c.b(pad(p.title, 34)) + c.dim(p.type));
        }
        ln("");
        ln(c.dim("read one: ") + c.acc("cat projects/kapruka.md") + c.dim("   open the GUI: ") + c.acc("goto cases"));
      }
    },
    skills: { d: "tools & languages", run: () => ln(FILES["~/skills.txt"]()) },
    thm: {
      d: "TryHackMe stats",
      run() {
        ln(c.b("TryHackMe") + c.dim("  ·  live-ish stats"));
        for (const s of D.thm.stats) ln("  " + c.acc(pad((s.pre || "") + s.v + (s.suf || ""), 10)) + c.mut(s.l));
        ln("");
        for (const p of D.thm.paths) ln("  " + (p.s === "done" ? c.acc("[✓]") : c.amber("[~]")) + " " + pad(p.n, 26) + c.dim(p.d));
      }
    },
    research: { d: "IoT security paper", run: () => ln(FILES["~/research.md"]()) },
    contact: { d: "how to reach me", run: () => ln(FILES["~/contact.txt"]()) },
    nmap: {
      d: "scan a target",
      async run(args) {
        const target = args.filter((a) => !a.startsWith("-")).pop() || "janith";
        ln(`Starting Nmap 7.95 ( https://nmap.org ) at ${new Date().toISOString().slice(0, 16).replace("T", " ")}`);
        await sleep(350);
        if (!/janith|jd|localhost|127\.0\.0\.1/i.test(target)) {
          ln(c.amber(`Note: '${target}' is out of scope. Unauthorized scanning is how people get into trouble.`));
          ln(c.dim("Rules of engagement say: scan ") + c.acc("janith") + c.dim(" only."));
          return;
        }
        ln(`Nmap scan report for ${c.acc("janith.qzz.io")} (185.199.108.153)`);
        ln("Host is up (0.0021s latency).");
        await sleep(300);
        ln(c.dim(pad("PORT", 11) + pad("STATE", 8) + pad("SERVICE", 14) + "VERSION"));
        for (const r of D.scan) {
          if (cancelled) return;
          await sleep(180 + Math.random() * 220);
          ln(pad(r.p, 11) + c.acc(pad(r.s, 8)) + pad(r.svc, 14) + c.mut(r.v));
        }
        await sleep(200);
        ln(pad("3389/tcp", 11) + c.amber(pad("filtered", 8)) + pad("weekends", 14) + c.mut("(sometimes)"));
        ln("");
        ln(c.dim("Nmap done: 1 IP address (1 host up) scanned in 1.37 seconds"));
      }
    },
    cv: {
      d: "download my CV",
      run() {
        ln(c.acc("↓ ") + "Downloading Janith_Deshan_CV.pdf …");
        app().downloadCV && app().downloadCV();
      }
    },
    mode: {
      d: "switch: mode red|blue|ops",
      run([m]) {
        if (!["red", "blue", "ops"].includes(m)) return ln(c.amber("usage: mode <red|blue|ops>"));
        app().setMode && app().setMode(m);
        ln((m === "red" ? c.red : m === "blue" ? c.cyan : c.lime)(`[+] mode set: ${m.toUpperCase()} TEAM`));
      }
    },
    goto: {
      d: "scroll to a section",
      run([s]) {
        const ids = ["whoami", "arsenal", "cases", "research", "intel", "ctf", "contact", "top"];
        if (!ids.includes(s)) return ln(c.amber("usage: goto <" + ids.join("|") + ">"));
        app().goto && app().goto(s);
      }
    },
    quickview: { d: "recruiter summary", run: () => app().openQuickView && app().openQuickView() },
    ctf: {
      d: "capture-the-flag status",
      run() {
        const st = window.JDCTF.state();
        ln(c.b("CTF: ") + c.acc(`${st.solved.length}/${st.total}`) + " flags captured");
        for (const f of st.flags) {
          const ok = st.solved.includes(f.id);
          ln("  " + (ok ? c.acc("[✓]") : c.dim("[ ]")) + " " + pad(f.name, 18) + c.dim(f.diff));
        }
        ln(c.dim("submit with: ") + c.acc("submit JD{...}"));
      }
    },
    submit: {
      d: "submit a flag",
      async run(args) {
        const r = await window.JDCTF.submit(args.join(" "));
        if (r.ok) {
          ln(r.already ? c.amber(`[=] already captured: ${r.flag.name}`) : c.lime(`[+] FLAG CAPTURED: ${r.flag.name}`));
          if (r.all) ln(c.red(c.b("[!] 6/6. You own this box. Email me, seriously.")));
        } else ln(r.reason === "format" ? c.amber("format: JD{...}") : c.red("[-] incorrect flag"));
      }
    },
    history: { run: () => hist.forEach((h, i) => ln(c.dim(pad(String(i + 1), 5)) + h)) },
    clear: { d: "clear screen", run: () => term.clear() },
    echo: { run: (args) => ln(args.join(" ")) },
    date: { run: () => ln(new Date().toString()) },
    uname: { run: (a) => ln(a.includes("-a") ? "JDOS 2.6.0-sliit #1 SMP x86_64 GNU/Linux (Year 3, Sem 1)" : "JDOS") },
    rot13: { run: (a) => ln(rot13(a.join(" "))) },
    sudo: {
      run(args) {
        const cmd = args.join(" ");
        if (/^hire[- ]?me/.test(cmd)) {
          ln(c.lime("[sudo] access granted. Good call."));
          ln("");
          ln("  " + c.b("Janith Deshan") + c.dim(": cybersecurity undergrad @ SLIIT"));
          ln("  " + c.mut("pentesting · network security · secure dev · AI systems"));
          ln("");
          ln("  " + c.dim("→ ") + c.acc(P.email));
          ln("  " + c.dim("→ ") + P.linkedin);
          ln("  " + c.dim("→ type ") + c.acc("cv") + c.dim(" to download my CV"));
          return;
        }
        if (root) return CMDS[args[0]] ? CMDS[args[0]].run(args.slice(1)) : ln(c.red(`sudo: ${args[0] || ""}: command not found`));
        ln(c.red("guest is not in the sudoers file. This incident will be reported."));
        ln(c.dim("(hint: ") + c.acc("sudo hire-me") + c.dim(" works though)"));
      }
    },
    ssh: { run: () => ln(c.red("ssh: connect to host port 22: Connection refused") + c.dim("  (key-based auth only, obviously)")) },
    rm: { run: (a) => ln(a.join(" ").includes("-rf") ? c.red("rm: nice try. This filesystem is read-only.") : c.red("rm: permission denied")) },
    vim: { run: () => ln(c.amber("You'd never get out. Protecting you from yourself.")) },
    exit: { run: () => ln(c.dim("There is no exit. Only ") + c.acc("goto contact") + c.dim(".")) },
    ping: {
      async run([h = "janith"]) {
        for (let i = 0; i < 4 && !cancelled; i++) {
          ln(`64 bytes from ${h}: icmp_seq=${i + 1} ttl=64 time=${(Math.random() * 3 + 1).toFixed(2)} ms`);
          await sleep(300);
        }
      }
    }
  };
  const ALIASES = { ll: "ls -la", dir: "ls", cls: "clear", "?": "help", man: "help", hire: "sudo hire-me", "hire-me": "sudo hire-me" };

  /* ---------- line editor ---------- */
  async function execLine(line) {
    let raw = line.trim();
    if (!raw) return;
    hist.push(raw); hIdx = -1;
    const first = raw.split(/\s+/)[0];
    if (ALIASES[first]) raw = raw.replace(first, ALIASES[first]);
    const [name, ...args] = raw.split(/\s+/);
    const cmd = CMDS[name.toLowerCase()];
    if (!cmd) {
      ln(c.red(`jdsh: command not found: ${name}`) + c.dim("   (type ") + c.acc("help") + c.dim(")"));
      return;
    }
    busy = true; cancelled = false;
    try { await cmd.run(args); } catch (e) { ln(c.red("error: " + e.message)); }
    busy = false;
  }

  function complete() {
    const parts = buf.split(/\s+/);
    if (parts.length === 1) {
      const opts = Object.keys(CMDS).filter((k) => k.startsWith(parts[0]));
      return finish(parts[0], opts, "");
    }
    const partial = parts[parts.length - 1];
    const slash = partial.lastIndexOf("/");
    const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : "";
    const base = partial.slice(slash + 1);
    const dir = resolve(dirPart || ".");
    const pool = [...(DIRS[dir] || []), ...(base.startsWith(".") ? HIDDEN[dir] || [] : [])];
    const opts = pool.filter((f) => f.startsWith(base)).map((f) => dirPart + f);
    return finish(partial, opts, "");

    function finish(cur, list) {
      if (!list.length) return;
      if (list.length === 1) {
        const add = list[0].slice(cur.length) + (list[0].endsWith("/") ? "" : " ");
        buf += add; w(add);
        return;
      }
      // common prefix
      let pre = list[0];
      for (const o of list) while (!o.startsWith(pre)) pre = pre.slice(0, -1);
      if (pre.length > cur.length) { const add = pre.slice(cur.length); buf += add; w(add); return; }
      ln(""); ln(list.map((o) => o.split("/").pop() || o).join("   ")); prompt(); w(buf);
    }
  }

  function replaceBuf(s) {
    w("\b \b".repeat(buf.length));
    buf = s; w(buf);
  }

  async function onData(data) {
    if (busy) {
      if (data === "\x03") { cancelled = true; ln("^C"); }
      return;
    }
    if (data === "\x1b[A") { if (hist.length) { hIdx = hIdx < 0 ? hist.length - 1 : Math.max(0, hIdx - 1); replaceBuf(hist[hIdx]); } return; }
    if (data === "\x1b[B") { if (hIdx >= 0) { hIdx++; if (hIdx >= hist.length) { hIdx = -1; replaceBuf(""); } else replaceBuf(hist[hIdx]); } return; }
    if (data.startsWith("\x1b")) return;

    for (const ch of data) {
      if (ch === "\r" || ch === "\n") {
        ln("");
        const line = buf; buf = "";
        await execLine(line);
        prompt();
      } else if (ch === "\x7f" || ch === "\b") {
        if (buf.length) { buf = buf.slice(0, -1); w("\b \b"); }
      } else if (ch === "\t") {
        complete();
      } else if (ch === "\x03") {
        ln("^C"); buf = ""; prompt();
      } else if (ch === "\x0c") {
        term.clear();
      } else if (ch >= " ") {
        buf += ch; w(ch);
      }
    }
  }

  /* ---------- lifecycle ---------- */
  async function init(el) {
    if (ready || booting) return;
    host = el;
    if (!window.Terminal) {
      el.innerHTML = '<p class="term__fallback mono">The terminal library failed to load (offline or blocked CDN). Everything else on the page still works.</p>';
      return;
    }
    booting = true;
    try { await document.fonts.load('14px "JetBrains Mono"'); } catch (e) { /* ignore */ }
    el.innerHTML = "";
    term = new window.Terminal({
      fontFamily: '"JetBrains Mono", Consolas, monospace',
      fontSize: window.innerWidth < 600 ? 12 : 14,
      lineHeight: 1.35,
      cursorBlink: true,
      cursorStyle: "block",
      convertEol: true,
      scrollback: 1000,
      theme: theme(),
      allowTransparency: true
    });
    if (window.FitAddon) { fit = new window.FitAddon.FitAddon(); term.loadAddon(fit); }
    term.open(el);
    fit && fit.fit();
    term.attachCustomKeyEventHandler((e) => !((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"));
    term.onData(onData);
    new ResizeObserver(() => { try { fit && fit.fit(); } catch (e) { /* ignore */ } }).observe(el);

    ln(c.acc(c.b("jdsh")) + c.dim(" v2.6 · JD//OPS operator shell"));
    ln(c.dim("Authorized guests only (that includes you)."));
    ln("Type " + c.acc("help") + " for commands. Try " + c.acc("about") + ", " + c.acc("projects") + ", or " + c.acc("nmap janith") + ".");
    prompt();
    ready = true; booting = false;
    while (queue.length) await type(queue.shift());
  }

  async function type(cmd) {
    if (!ready) { queue.push(cmd); return; }
    if (busy) return;
    replaceBuf("");
    for (const ch of cmd) { buf += ch; w(ch); await sleep(22); }
    await onData("\r");
  }

  function focus() { term && term.focus(); }

  function setRoot(on = true) {
    root = on;
    document.documentElement.classList.toggle("is-root", on);
    if (ready && !busy) {
      replaceBuf("");
      ln("");
      ln(c.red(c.b("# privilege escalated. Welcome, root.")));
      prompt();
    }
  }

  function refreshTheme() { if (term) term.options.theme = theme(); }

  return { init, type, focus, setRoot, refreshTheme, isReady: () => ready };
})();
