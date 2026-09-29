/* =====================================================================
   JD//OPS · capture the flag
   Flags are verified by SHA-256 hash, so the answers are not stored here.
   (The two flags that this script has to *display* are XOR-sealed. That's
   obfuscation, not security, and that's part of the lesson.)
   ===================================================================== */

window.JDCTF = (() => {
  "use strict";

  const FLAGS = [
    { id: 1, name: "Source Code", diff: "easy", hint: "Recon starts with the page source. Try Ctrl+U.", hash: "4d564de9a21e416c2ac5c6e09cf677b51fe79c879c96b647b72ff1f2ffb442fd" },
    { id: 2, name: "Forbidden Path", diff: "easy", hint: "Search engines get told where not to look, and attackers read those rules too.", hash: "329950c981f23a8e2c371ca79d0c52f6b218082d9eaa219bd4f186680cca48a9" },
    { id: 3, name: "Dev Channel", diff: "easy", hint: "Developers leave messages where developers look (F12). Base64 is encoding, not encryption.", hash: "f28557d07ebed9e4250a431a1db42ab4b9aea7e341f8f3b575d5f1d0ed24a698" },
    { id: 4, name: "Broken Access", diff: "med", hint: "Your role on this site is decided by something your browser stores, and you control your browser.", hash: "a98a5633261d01a9dda5e20ff81f19e3126b35268e453e360d7d5e0d2cc41841" },
    { id: 5, name: "Shell History", diff: "med", hint: "The shell remembers what someone typed before you. Hidden files start with a dot. ROT13 isn't encryption either.", hash: "e43f7c759c9c21ba11561a4246ebb32a42354b447bc1b2f8b04742c554c81c40" },
    { id: 6, name: "Cheat Code", diff: "hard", hint: "Some old-school cheat codes still work here. 30 lives not included.", hash: "fc211b0293f4d695da2f3f7dae656f8b9cd839e048055f7ed6781379796c8a0f" }
  ];

  const KEY = "janiyax35";
  const SEALED = {
    cookie: [32, 37, 21, 7, 74, 23, 75, 65, 106, 30, 19, 27, 26, 13, 62, 12, 91, 6, 53, 2, 2, 88, 74, 15, 12, 78],
    konami: [32, 37, 21, 28, 9, 62, 13, 67, 106, 14, 81, 25, 7, 38, 5, 72, 68, 91, 53, 13, 93, 15, 13, 62, 10, 2, 82, 2, 21, 49, 11, 77, 28]
  };
  const unseal = (a) => a.map((c, i) => String.fromCharCode(c ^ KEY.charCodeAt(i % KEY.length))).join("");

  const STORE = "jd.ctf.solved";
  let solved = new Set();
  try { solved = new Set(JSON.parse(localStorage.getItem(STORE) || "[]")); } catch (e) { /* storage blocked */ }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify([...solved])); } catch (e) { /* ignore */ } };

  const subs = new Set();
  const emit = () => subs.forEach((fn) => fn(state()));
  const state = () => ({ solved: [...solved], total: FLAGS.length, flags: FLAGS });

  async function sha256(s) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    return "";
  }

  async function submit(raw) {
    const s = String(raw || "").trim();
    if (!/^JD\{[^{}]{3,70}\}$/.test(s)) return { ok: false, reason: "format" };
    const h = await sha256(s);
    const f = FLAGS.find((x) => x.hash === h);
    if (!f) return { ok: false, reason: "wrong" };
    const already = solved.has(f.id);
    solved.add(f.id);
    save();
    emit();
    return { ok: true, flag: f, already, all: solved.size === FLAGS.length };
  }

  /* ---------- flag 3: dev console ---------- */
  function consoleBanner() {
    const big = "background:#B6FF3B;color:#0A0D12;font:700 13px monospace;padding:4px 10px;border-radius:2px";
    const txt = "color:#8A97A5;font:12px monospace";
    console.log("%cJD//OPS", big);
    console.log("%cHey, you opened DevTools. Good instinct.\nThis site hides 6 flags. Here's one for looking:", txt);
    console.log("%cSkR7ZDN2dDAwbHNfNHIzX215X2Izc3RfZnIxM25kfQ==", "color:#B6FF3B;font:600 13px monospace");
    console.log("%c(submit flags in the ~/ctf section or with `submit <flag>` in the terminal)", "color:#55616E;font:11px monospace");
  }

  /* ---------- flag 4: client-side "access control" ---------- */
  function readCookie(name) {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function cookieChallenge() {
    let role = readCookie("jd_role");
    if (!role) {
      const secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = "jd_role=guest; path=/; max-age=2592000; SameSite=Lax" + secure;
      role = "guest";
    }
    return role.trim().toLowerCase() === "admin" ? unseal(SEALED.cookie) : null;
  }

  /* ---------- flag 6: konami ---------- */
  function konami(onUnlock) {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;
    addEventListener("keydown", (e) => {
      if (e.target.closest && e.target.closest("input, textarea, [contenteditable]")) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === seq[pos] ? pos + 1 : (k === seq[0] ? 1 : 0);
      if (pos === seq.length) { pos = 0; onUnlock(unseal(SEALED.konami)); }
    });
  }

  return {
    FLAGS,
    submit,
    state,
    isSolved: (id) => solved.has(id),
    onChange: (fn) => { subs.add(fn); return () => subs.delete(fn); },
    reset: () => { solved.clear(); save(); emit(); },
    consoleBanner,
    cookieChallenge,
    konami
  };
})();
