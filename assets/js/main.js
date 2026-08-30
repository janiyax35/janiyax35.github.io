// ============================================================
// Year in footer
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// Scroll-spy for nav links
// ============================================================
const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a[data-nav]')];

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = navAnchors.find(a => a.getAttribute('href') === '#' + id);
    if (!link) return;
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(s => spy.observe(s));

// ============================================================
// Network mesh background canvas
// ============================================================
(function networkCanvas(){
  const canvas = document.getElementById('net-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [], pulses = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor((w * h) / 24000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 1
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  function maybeSpawnPulse(){
    if (Math.random() < 0.01 && nodes.length > 1) {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      const b = nodes[Math.floor(Math.random() * nodes.length)];
      if (a !== b) pulses.push({ a, b, t: 0 });
    }
  }

  function frame(){
    ctx.clearRect(0, 0, w, h);

    // move nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    // draw links
    const maxDist = 150;
    for (let i = 0; i < nodes.length; i++){
      for (let j = i + 1; j < nodes.length; j++){
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist){
          ctx.strokeStyle = `rgba(57, 255, 136, ${0.12 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // draw nodes
    nodes.forEach(n => {
      ctx.fillStyle = 'rgba(79, 216, 255, 0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // draw + advance pulses (packets travelling along an edge)
    pulses.forEach(p => {
      p.t += 0.012;
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = 'rgba(57, 255, 136, 0.9)';
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    pulses = pulses.filter(p => p.t < 1);
    maybeSpawnPulse();

    if (!reduceMotion) requestAnimationFrame(frame);
  }
  frame();
})();

// ============================================================
// Interactive terminal
// ============================================================
(function terminal(){
  const body = document.getElementById('termBody');
  const input = document.getElementById('termInput');
  if (!body || !input) return;

  const links = {
    github: 'https://github.com/janiyax35',
    linkedin: 'https://linkedin.com/in/janithdeshan',
    website: 'https://janith.qzz.io'
  };

  function print(text, cls){
    const line = document.createElement('div');
    line.className = 'term-line' + (cls ? ' ' + cls : '');
    line.textContent = text;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  const commands = {
    help(){
      print('available commands:');
      print('  whoami      basic identity');
      print('  skills      technical stack summary');
      print('  projects    featured project list');
      print('  certs       certifications & TryHackMe stats');
      print('  contact     ways to reach me');
      print('  open <site> open github / linkedin / website');
      print('  clear       clear the screen');
    },
    whoami(){
      print('Janith Deshan — Cybersecurity undergraduate, SLIIT');
      print('Network Security · Penetration Testing · Secure App Dev');
    },
    skills(){
      print('security   : pentesting, vuln assessment, digital forensics, cryptography');
      print('programming: python, java, c/c++, javascript/typescript, sql');
      print('stack      : react, next.js, spring boot, node.js, flask');
      print('cloud & ai : gcp, mcp, gemini api, tensorflow, keras');
    },
    projects(){
      print('kapruka ai shopping agent   — next.js, gemini 2.5 flash, mcp');
      print('bytex customer care system  — spring boot, mysql');
      print('enterprise network design   — cisco packet tracer, vlans');
      print('barkid dog breed identifier — flask, tensorflow, resnet50v2');
      print('scroll down for the full list ↓');
    },
    certs(){
      print('tryhackme: top 7% global, 133-day streak, 62 rooms, 12 badges');
      print('kapruka agent challenge 2026 — certificate of participation');
      print('cisco: introduction to cybersecurity — completed');
    },
    contact(){
      print('email : janithmihijaya123@gmail.com');
      print('phone : +94 70 363 8365');
      print('based in homagama, sri lanka');
    },
    clear(){
      body.innerHTML = '';
    },
    sudo(){
      print('permission denied: nice try though.', 'err');
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim();
    if (!raw) return;
    print('janith@sliit:~$ ' + raw, 'echo');
    input.value = '';

    const [cmd, arg] = raw.toLowerCase().split(/\s+/);

    if (cmd === 'open' && arg && links[arg]){
      print('opening ' + arg + '...');
      window.open(links[arg], '_blank', 'noopener');
    } else if (commands[cmd]){
      commands[cmd]();
    } else {
      print(`command not found: ${cmd} — type "help"`, 'err');
    }
  });
})();

// ============================================================
// AOS init — used sparingly, on section entrances only
// ============================================================
AOS.init({
  duration: 700,
  easing: 'ease-out',
  once: true,
  offset: 60
});
