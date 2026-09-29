# JD//OPS: Janith Deshan's portfolio

A cybersecurity portfolio styled as an operator console. It's plain HTML, CSS and JS with pinned CDN libraries and no build step, and it's hosted on GitHub Pages.

## Run locally

Use a local server rather than opening `index.html` directly. The cookie challenge and some browser APIs don't work on `file://`.

```bash
python -m http.server 5500
```

Then open http://localhost:5500

## Where to edit

| What | File |
|---|---|
| All content (profile, skills, projects, research, THM stats, timeline, boot lines) | `js/data.js` |
| Colours, fonts, layout | `css/style.css` (tokens at the top) |
| Home page structure (only content about me) | `index.html` |
| The Lab: CTF, full shell, site security | `lab.html` |
| Terminal commands | `js/terminal.js` (`CMDS` object) |
| Hero network, Mirai simulation, topology diagram | `js/fx.js` |
| CTF flags, hints | `js/ctf.js` + `CTF_SOLUTIONS.md` (local only) |

## Features

- **Boot sequence**: shown once per session. Press any key to skip.
- **OPS / RED / BLUE modes**: switch the accent colour and highlight offensive or defensive skills and projects.
- **Case files**: projects written up as engagement reports. The network project has an interactive topology diagram.
- **Mirai simulation**: an animated model of botnet propagation and DDoS for the research section.
- **Hero terminal** (xterm.js): auto-runs `whoami`; `help`, `about`, `projects`, `nmap janith`, `lab`, `sudo hire-me`, and more.
- **The Lab** (`lab.html`): CTF scoreboard (6 flags hidden across the whole site), a full-size shell, and the site-security self-audit.
- **Command palette**: `Ctrl+K` or `/`. **Quick view**: `Q`. **Terminal**: `` ` ``.
- **Live GitHub feed**: recently pushed repos from the public GitHub API.

## Security notes

- All third-party scripts are version-pinned with SHA-384 SRI hashes. If you bump a library version, recompute its hash:
  ```bash
  curl -s URL | openssl dgst -sha384 -binary | openssl base64 -A
  ```
- CSP is set with a `<meta>` tag, because GitHub Pages can't set headers. If you add a new CDN or API, add it to the CSP in `index.html`.
- `.nojekyll` is required. Without it, GitHub Pages hides `/.well-known/`.

## Deploy (GitHub Pages)

Push to your Pages repo and enable Pages on the `main` branch at `/ (root)`. For the custom domain, keep your existing `CNAME` file (`janith.qzz.io`).
