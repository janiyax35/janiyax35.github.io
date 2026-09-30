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
| All content (profile, skills, projects, research, THM stats, education, certifications, boot lines) | `js/data.js` |
| Contact form (EmailJS service, template and public key) | `js/data.js` (`profile.emailjs`) |
| Colours, fonts, layout | `css/style.css` (tokens at the top) |
| Home page structure (only content about me) | `index.html` |
| The Lab: CTF, full shell, threat globe, site security | `lab.html` |
| Terminal commands | `js/terminal.js` (`CMDS` object) |
| Hero network, Lab globe, Mirai simulation, topology diagram | `js/fx.js` |
| Right-click menu | `js/contextmenu.js` |
| README graphics | `.github/readme/` (see its `BUILD.md`) |
| CTF flags, hints | `js/ctf.js` + `CTF_SOLUTIONS.md` (local only) |

## Features

- **Boot sequence**: shown once per session. Press any key to skip.
- **OPS / RED / BLUE modes**: switch the accent colour and highlight offensive or defensive skills and projects.
- **Case files**: projects written up as engagement reports. The network project has an interactive topology diagram.
- **Mirai simulation**: an animated model of botnet propagation and DDoS for the research section.
- **Hero terminal** (xterm.js): auto-runs `whoami`; `help`, `about`, `projects`, `nmap janith`, `lab`, `sudo hire-me`, and more.
- **The Lab** (`lab.html`): CTF scoreboard (6 flags hidden across the whole site), a full-size shell, a drag-to-spin threat globe, and the site-security self-audit.
- **Command palette**: `Ctrl+K` or `/`. **Quick view**: `Q`. **Terminal**: `` ` ``.
- **Contact form**: sends through EmailJS, with a honeypot, a 3-second time trap, a 30-second cooldown and a mail-app backup.
- **Custom right-click menu and cursors**: mouse only. Shift + right-click opens the browser's own menu.

## Security notes

- All third-party scripts are version-pinned with SHA-384 SRI hashes. If you bump a library version, recompute its hash:
  ```bash
  curl -s URL | openssl dgst -sha384 -binary | openssl base64 -A
  ```
- CSP is set with a `<meta>` tag, because GitHub Pages can't set headers. If you add a new CDN or API, add it to the CSP in both `index.html` and `lab.html`.
- Keep `.nojekyll`, so `/.well-known/` is served even if the site is ever built with Jekyll again.

## Deploy (GitHub Pages)

Pushing to `main` deploys the site through GitHub Actions (`.github/workflows/static.yml`). In the repo settings, Pages must use **GitHub Actions** as its source. Keep the `CNAME` file (`janith.qzz.io`) for the custom domain.

The upload step (`actions/upload-pages-artifact@v3`) skips the `.github` folder, so the README kit isn't published. Newer versions (v4 and later) also skip hidden folders by default. If you upgrade it, set `include-hidden-files: true`, or `/.well-known/security.txt` will stop being served.
