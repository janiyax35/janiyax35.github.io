/* =====================================================================
   JD//OPS — CONTENT
   ---------------------------------------------------------------------
   Almost everything you'll want to change lives in this file:
   profile, skills, projects ("case files"), research, TryHackMe stats,
   timeline, boot lines. The rest of the site renders from it.

   team: "red"  → offensive (highlighted in RED TEAM mode)
         "blue" → defensive (highlighted in BLUE TEAM mode)
         "both" → highlighted in both
         omit   → neutral (never dimmed)
   ===================================================================== */

window.JD = {
  profile: {
    name: "Janith Deshan",
    first: "Janith",
    last: "Deshan",
    headline: "Cybersecurity Undergraduate",
    location: "Homagama, Sri Lanka",
    email: "janithmihijaya123@gmail.com",
    phone: "+94 70 363 8365",
    githubUser: "janiyax35",
    github: "https://github.com/janiyax35",
    linkedin: "https://linkedin.com/in/janithdeshan",
    website: "https://janith.qzz.io",
    tryhackme: "", // ← paste your public TryHackMe profile URL here to show the link
    cv: "assets/Janith_Deshan_CV.pdf",
    // Contact form delivery (EmailJS). These IDs are public by design; abuse limits live in main.js.
    emailjs: { serviceId: "service_vt4z0ad", templateId: "template_1z6zc59", publicKey: "fPKkVwF73NhpvP2VE" },
    status: "Open to internships & collaborations", // ← edit if needed
    summary:
      "Cybersecurity undergraduate at SLIIT specializing in network security, penetration testing, and secure application development. Ranked top 7% globally on TryHackMe. I build full-stack and AI-integrated systems, most recently an AI shopping assistant recognized in a national developer competition."
  },

  roles: [
    "Penetration Testing",
    "Network Security",
    "Secure App Development",
    "AI-Integrated Systems"
  ],

  modes: {
    ops: {
      label: "OPS",
      desc: "Balanced view",
      tagline:
        "I break systems to understand them, and build systems that are harder to break."
    },
    red: {
      label: "RED",
      desc: "Offensive focus: recon, exploitation, attack analysis",
      tagline:
        "Offensive mindset: recon, exploit, report. Top 7% on TryHackMe and still climbing."
    },
    blue: {
      label: "BLUE",
      desc: "Defensive focus: segmentation, hardening, forensics",
      tagline:
        "Defensive mindset: segment, harden, monitor. Networks designed so attackers can't move sideways."
    }
  },

  /* whoami → operating principles (edit freely) */
  principles: [
    { k: "01", t: "Think like an attacker", d: "Recon first. Every system is a set of assumptions waiting to be tested." },
    { k: "02", t: "Build like a defender", d: "Least privilege, segmentation, and secure defaults from the first commit." },
    { k: "03", t: "Learn in public", d: "A 133-day TryHackMe streak and counting. Consistency beats intensity." }
  ],

  skills: [
    {
      id: "sec", title: "Security & Networking", wide: true,
      items: [
        { n: "Penetration Testing", team: "red" },
        { n: "Vulnerability Assessment", team: "red" },
        { n: "Network Security", team: "blue" },
        { n: "Digital Forensics", team: "blue" },
        { n: "Cryptography", team: "both" },
        { n: "OWASP Top 10", team: "both" },
        { n: "Nmap", team: "red" },
        { n: "Burp Suite", team: "red" },
        { n: "Metasploit", team: "red" },
        { n: "Wireshark", team: "blue" }
      ]
    },
    {
      id: "sys", title: "Systems",
      items: [
        { n: "Linux", team: "both" },
        { n: "Kali Linux", team: "red" },
        { n: "System Administration", team: "blue" },
        { n: "Bash Scripting", team: "both" }
      ]
    },
    {
      id: "lang", title: "Programming",
      items: [{ n: "Python" }, { n: "Java" }, { n: "C / C++" }, { n: "JavaScript / TypeScript" }, { n: "SQL" }]
    },
    {
      id: "cloud", title: "Cloud & AI",
      items: [{ n: "GCP" }, { n: "Git" }, { n: "Model Context Protocol" }, { n: "Google Gemini API" }, { n: "TensorFlow" }, { n: "Keras" }]
    },
    {
      id: "web", title: "Frontend & Backend",
      items: [{ n: "HTML5 / CSS3" }, { n: "React.js" }, { n: "Next.js" }, { n: "Spring Boot" }, { n: "Node.js" }, { n: "Flask" }, { n: "Vercel AI SDK" }]
    },
    {
      id: "db", title: "Databases",
      items: [{ n: "MySQL" }, { n: "MongoDB" }, { n: "SQLite" }, { n: "Supabase" }, { n: "Firebase" }]
    },
    {
      id: "hw", title: "Hardware & IoT",
      items: [{ n: "Arduino" }, { n: "IoT Sensors" }, { n: "Cisco Packet Tracer", team: "blue" }]
    }
  ],

  projects: [
    {
      id: "CASE-001", slug: "sentinel-ctf", featured: true, team: "both",
      title: "Operation Silent Dawn: Sentinel CTF",
      type: "CTF Platform · Offensive Security",
      metric: { v: "6", l: "stages · 6 domains" },
      summary: "A custom CTF platform and six-stage incident-response challenge: players trace a breach at a fictional aerospace observatory through forensics, OSINT, web, network, crypto, and reverse engineering.",
      stack: ["Node.js (Vercel serverless)", "Supabase / PostgreSQL", "Row-Level Security", "HMAC-SHA256", "JavaScript", "Python"],
      scope: "Design and build a complete CTF Play Box for a Year 3 penetration testing cohort: one connected story, six progressive stages, and the platform to run it.",
      findings: [
        "Built a custom CTF platform instead of using CTFd: a Vercel serverless API and Supabase PostgreSQL with row-level security on every table, plus accounts, a live scoreboard, hint unlocks, announcements, and an admin console with leaderboard moderation.",
        "Six stages across six domains: audio steganography with a decoy flag, OSINT, SQL-injection web exploitation, packet-capture analysis, weak-RNG cryptanalysis, and a reverse-engineering capstone.",
        "Flags are never stored in plaintext: submissions are checked against peppered HMAC-SHA256 hashes with a timing-safe comparison, rate-limited to 5 attempts per minute, and written to an audit log.",
        "Hardened delivery: a strict Content-Security-Policy, frame-ancestors 'none', and deny-by-default security headers."
      ],
      outcome: "Deployed at ctf.janith.qzz.io as an invite-only platform. Contact me to be added to the access list.",
      repo: "https://github.com/janiyax35/sentinel-ctf", private: true,
      live: "https://ctf.janith.qzz.io", liveNote: "Invite-only: contact me to be added to the access list."
    },
    {
      id: "CASE-002", slug: "nodegoat-devsecops", team: "both",
      title: "NodeGoat DevSecOps Pipeline",
      type: "DevSecOps · AppSec",
      metric: { v: "4", l: "vulns fixed · 4 CI gates" },
      summary: "Secured OWASP NodeGoat end to end: a STRIDE threat model, four OWASP Top 10 vulnerabilities exploited and then fixed, and a GitHub Actions pipeline with four security gates.",
      stack: ["Node.js", "Express", "MongoDB", "Docker Compose", "GitHub Actions", "Semgrep", "Gitleaks", "Trivy"],
      scope: "Apply DevSecOps to an intentionally vulnerable Node.js / Express / MongoDB app (presented as \"RetireEasy\", a retirement-savings portal), containerised as a two-tier stack.",
      findings: [
        "STRIDE threat model: five application-specific threats rated on a likelihood × impact matrix and mapped to controls.",
        "Exploited, then fixed: NoSQL injection ($where replaced by a typed $gt query), stored XSS (sanitised input plus context-aware output encoding), IDOR (session ownership check returning 403), and weak session management (httpOnly, sameSite, expiry, secret from env).",
        "Verified every fix by re-running the original exploit and with a before/after Semgrep SAST comparison.",
        "GitHub Actions pipeline with four gates: Gitleaks secrets scanning (blocks the build), Semgrep SAST, npm audit dependency scanning, and Trivy container scanning."
      ],
      outcome: "Four critical/high findings closed, secrets moved to environment variables and GitHub encrypted secrets, and a pipeline that stops leaked credentials before they merge.",
      repo: "https://github.com/janiyax35/NodeGoat-DevSecOps-Project", private: true
    },
    {
      id: "CASE-003", slug: "kapruka",
      title: "Kapruka AI Shopping Agent",
      type: "AI · Agents · MCP",
      metric: { v: "700+", l: "national entrants" },
      summary: "Multi-modal shopping assistant that uses Gemini 2.5 Flash over the Model Context Protocol for conversational product search and comparison.",
      stack: ["Next.js 15", "TypeScript", "Vercel AI SDK", "Gemini 2.5 Flash", "MCP"],
      scope: "Build a working agent on the Kapruka MCP server for the Kapruka Agent Challenge 2026, a national competition for developers.",
      findings: [
        "Engineered a multi-modal shopping assistant integrating Gemini 2.5 Flash via the Model Context Protocol (MCP).",
        "Conversational product search and side-by-side comparison, driven by live tool calls instead of static data."
      ],
      outcome: "Recognized among 700+ national entrants with a Certificate of Participation (Builder track) from Kapruka Holdings PLC, July 2026.",
      repo: "https://github.com/janiyax35/kapruka-shopping-agent"
    },
    {
      id: "CASE-004", slug: "enterprise-network", team: "blue", topology: true,
      title: "Enterprise Network Architecture",
      type: "Network Security",
      metric: { v: "75+", l: "hosts segmented" },
      summary: "Secure 3-floor enterprise network with VLAN segmentation across 6 departments, OSPF routing, VPN, and centralized firewalls.",
      stack: ["Cisco Packet Tracer", "OSPF", "VLANs", "/27 Subnetting", "WPA2/WPA3", "VPN"],
      scope: "Design a secure network for 75+ workstations, servers, and IoT devices across 3 floors and 6 departments.",
      findings: [
        "VLAN segmentation with /27 subnetting for every department, which limits lateral movement and broadcast domains.",
        "Hardened wireless and remote access with WPA2/WPA3 encryption and VPN configuration.",
        "Centralized firewalls controlling traffic between segments and to the internet."
      ],
      outcome: "A segmented, defensible topology in which compromising one department doesn't give access to the rest.",
      repo: "https://github.com/janiyax35/Enterprise-Network-Architecture-Design"
    },
    {
      id: "CASE-005", slug: "cryptoguard", team: "both",
      title: "CryptoGuard & CyberGuard Tools",
      type: "Security Tooling",
      metric: { v: "LIVE", l: "web interface" },
      summary: "A deployed cryptography and security-tooling suite with a live web interface.",
      stack: ["Cryptography", "Web", "Security Tooling"],
      scope: "Practical cryptography and security utilities, packaged as tools people can use in the browser.",
      findings: [
        "Cryptography utilities exposed through a live web interface.",
        "Security tooling suite, deployed and publicly usable."
      ],
      outcome: "Deployed and live.",
      repo: "https://github.com/janiyax35" // ← replace with the repo / live URL
    },
    {
      id: "CASE-006", slug: "bytex",
      title: "ByteX Customer Care System",
      type: "Full-Stack · Secure Dev",
      metric: { v: "6", l: "user roles" },
      summary: "Full-stack support platform on a layered Spring MVC → Service → JPA architecture covering ticketing, repairs, and inventory.",
      stack: ["Java 17", "Spring Boot", "MySQL", "Thymeleaf", "Maven"],
      scope: "Customer-care platform with role-separated workflows for 6 user roles.",
      findings: [
        "Layered Spring MVC → Service → JPA architecture with role-based access across 6 user roles.",
        "Ticketing, repair tracking, and inventory in one system.",
        "Automated stock monitoring and reorder thresholds, which cut manual purchase-order tracking."
      ],
      outcome: "End-to-end support operations with less manual tracking.",
      repo: "https://github.com/janiyax35/ByteX-Customer-Care-System"
    },
    {
      id: "CASE-007", slug: "barkid",
      title: "BarkID: Dog Breed Identifier",
      type: "Machine Learning",
      metric: { v: "120+", l: "breeds classified" },
      summary: "AI web app that classifies 120+ dog breeds using a gatekeeper filter followed by a ResNet50V2 classifier.",
      stack: ["Python", "Flask", "TensorFlow", "Keras", "ResNet50V2"],
      scope: "Image classification web app trained on the Stanford Dogs dataset.",
      findings: [
        "A gatekeeper filter rejects non-dog images before classification.",
        "Accuracy improved with transfer learning, data augmentation, and Test-Time Augmentation."
      ],
      outcome: "A two-stage pipeline that is more reliable than a single classifier.",
      repo: "https://github.com/janiyax35/Dog-Breed-Identifier"
    },
    {
      id: "CASE-008", slug: "intelli-home",
      title: "Intelli-Home",
      type: "IoT · Embedded",
      metric: { v: "RT", l: "sensor-driven control" },
      summary: "Arduino-based smart home system with remote and voice control and automated environmental monitoring.",
      stack: ["Arduino", "C++", "IoT Sensors"],
      scope: "Home automation driven by live sensor data.",
      findings: [
        "Remote and voice control of home devices.",
        "Real-time control logic that triggers device responses from live sensor data."
      ],
      outcome: "A working IoT system, which later informed my IoT security research.",
      repo: "https://github.com/janiyax35/Intelli-Home"
    },
    {
      id: "CASE-009", slug: "ghostpdf", small: true,
      title: "GhostPDF",
      type: "Security Tooling · TUI",
      metric: { v: "3", l: "obfuscation modes" },
      summary: "A terminal app that hides PDFs in plain sight: header swap, XOR scramble, or AES encryption.",
      stack: ["Python", "Textual", "cryptography"],
      scope: "Side project: a fast, keyboard-driven terminal tool for obfuscating and encrypting PDF files.",
      findings: [
        "Header swap changes the PDF magic bytes so document viewers treat the file as corrupted.",
        "XOR scramble with a custom key for quick byte-level obfuscation.",
        "AES encryption via Fernet (AES-128-CBC + HMAC-SHA256) with PBKDF2 password-derived keys.",
        "Built-in file browser, keyboard shortcuts, and light/dark themes."
      ],
      outcome: "A small, polished tool built in my free time.",
      repo: "https://github.com/janiyax35/tools-GhostPDF", private: true
    }
  ],

  extraProjects: [
    { t: "Marry-Mate", s: "Java, OOP", d: "Wedding and vendor management platform built on custom OOP data structures." },
    { t: "AquaTest-ML-App", s: "Python, ML", d: "Pipeline predicting water-quality metrics from environmental datasets." }
  ],

  research: {
    title: "IoT Security: Smart Device Vulnerabilities, Botnets, and Future Risks",
    meta: "Individual Research Paper · IE2092 Introduction to Cybersecurity · SLIIT · 2026",
    points: [
      "Traced IoT security from pre-2016 negligence, through the Mirai botnet watershed (600,000+ devices, 1.2 Tbps DDoS), to today's expanded attack surface.",
      "Analyzed five emerging threats using peer-reviewed and government sources (NIST, Veracode)."
    ],
    era: [
      { y: "< 2016", t: "Negligence", d: "Default credentials, open Telnet, no update path." },
      { y: "2016", t: "Mirai", d: "600k+ devices conscripted; 1.2 Tbps DDoS." },
      { y: "Today", t: "Expanded surface", d: "Billions of devices, edge compute, AI-driven attacks." }
    ],
    threats: [
      { n: "AI-driven botnets", d: "Adaptive malware that learns which devices to target." },
      { n: "Zero Trust architecture", d: "Never trust the device, always verify." },
      { n: "5G / edge risks", d: "More compute at the edge means more attack surface." },
      { n: "New regulation", d: "Security-by-default is becoming law." },
      { n: "Quantum threats", d: "Today's device crypto has to outlive quantum." }
    ]
  },

  thm: {
    stats: [
      { v: 7, pre: "TOP ", suf: "%", l: "Global rank" },
      { v: 133, suf: "", l: "Day streak" },
      { v: 62, suf: "", l: "Rooms completed" },
      { v: 12, suf: "", l: "Badges earned" }
    ],
    paths: [
      { n: "Pre Security (Legacy)", s: "done", d: "Feb 2026" },
      { n: "AI Security", s: "wip", d: "In progress" },
      { n: "Cyber Security 101", s: "wip", d: "In progress" }
    ]
  },

  /* certifications, newest first. tag = short issuer label shown on the right */
  certs: [
    { t: "Hacker Holidays Completion Certificate", o: "TryHackMe", tag: "THM", d: "Aug 2026", s: "done" },
    { t: "Introduction to Cybersecurity", o: "Cisco Networking Academy", tag: "CISCO", d: "Aug 2026", s: "done" },
    { t: "Kapruka Agent Challenge 2026: Certificate of Participation (Builder)", o: "Kapruka Holdings PLC", tag: "KAPRUKA", d: "Jul 2026", s: "done" },
    { t: "loveatfirstbreach", o: "TryHackMe", tag: "THM", d: "Feb 2026", s: "done" },
    { t: "Google Cloud Arcade Badges: Level 1–3", o: "Google Cloud Skills Boost · 2025-CH2", tag: "GCP", d: "2025", s: "done" },
    { t: "Networking Basics", o: "Cisco Networking Academy", tag: "CISCO", d: "In progress", s: "wip" }
  ],

  /* education (newest first). start/end on the degree drive its progress bar */
  education: [
    { t: "BSc (Hons) Information Technology – Cyber Security", o: "Sri Lanka Institute of Information Technology (SLIIT), Malabe", when: "2024 – 2028", d: "Year 3, Semester 1", status: "In progress", start: "2024-06", end: "2028-07" },
    { t: "G.C.E. Advanced Level", o: "Mahanama College, Colombo 03", when: "2023", d: "Technology stream", status: "Passed" },
    { t: "G.C.E. Ordinary Level", o: "Mahanama College, Colombo 03", when: "2020", d: "", status: "Passed" }
  ],

  /* hero "nmap" panel */
  scan: [
    { p: "22/tcp", s: "open", svc: "pentest", v: "Kali · Metasploit · Burp" },
    { p: "53/tcp", s: "open", svc: "network-sec", v: "VLAN · OSPF · VPN" },
    { p: "443/tcp", s: "open", svc: "secure-dev", v: "Spring Boot · Next.js" },
    { p: "8080/tcp", s: "open", svc: "ai-systems", v: "Gemini · MCP · TF" },
    { p: "31337/tcp", s: "open", svc: "elite", v: "TryHackMe top 7%" }
  ],

  boot: [
    ["", "JD-OPS BIOS v2.6.0  (c) 2026 Janith Deshan"],
    ["", "CPU0: SLIIT CyberSec x86_64 @ Year 3 / Sem 1"],
    ["ok", "Memory check: 133-day streak intact"],
    ["ok", "Mounted /dev/sliit on /education"],
    ["ok", "Loaded module: penetration_testing"],
    ["ok", "Loaded module: network_security"],
    ["ok", "Loaded module: secure_app_dev"],
    ["ok", "Verified: TryHackMe rank = top 7% global"],
    ["warn", "Recruiter detected. Quick View available [press Q]"],
    ["ok", "6 flags hidden. Good luck."],
    ["ok", "Starting operator console..."]
  ],

  ticker: [
    ["ok", "THM streak: 133 days"],
    ["info", "9 case files indexed"],
    ["alert", "Mirai-class botnet simulation armed in ~/research"],
    ["ok", "Kapruka Agent Challenge: Builder"],
    ["info", "Firewall policy: default deny"],
    ["warn", "6 flags hidden on this site"],
    ["ok", "SRI verified on all 3rd-party scripts"],
    ["info", "Location: Homagama, LK"]
  ]
};
