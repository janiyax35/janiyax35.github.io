<!-- jd://signal  cmVhZGluZyB0aGUgc291cmNlPyBnb29kIGluc3RpbmN0LiB0aGlzIHJlcG8gaXMgdGhlIHNpdGUsIGFuZCBzaXggZmxhZ3MgYXJlIGhpZGRlbiBhY3Jvc3MgaXQuIHRoZSBodW50IHN0YXJ0cyBpbiB0aGUgbGFiOiBodHRwczovL2phbml0aC5xenouaW8vbGFiLmh0bWw= -->

<div align="center">

<a href="https://janith.qzz.io"><img src=".github/readme/assets/hero.svg" width="100%" alt="Janith Deshan · Portfolio. Animated terminal: curl -I https://janith.qzz.io resolves to Janith Deshan · Portfolio, a cybersecurity portfolio styled as an operator console. Modules: operator console, jdsh terminal, case files, the lab ctf. A spinning wireframe globe. Status: live at janith.qzz.io; static site on GitHub Pages; MIT."></a>

<a href="https://janith.qzz.io"><img src=".github/readme/assets/btn-site.svg" height="40" alt="Visit site"></a>&nbsp;
<a href="https://janith.qzz.io/lab.html"><img src=".github/readme/assets/btn-lab.svg" height="40" alt="The Lab"></a>&nbsp;
<a href="mailto:janithmihijaya123@gmail.com"><img src=".github/readme/assets/btn-email.svg" height="40" alt="Email"></a>

<a href="https://github.com/janiyax35/janiyax35.github.io/actions/workflows/static.yml"><img src="https://img.shields.io/github/actions/workflow/status/janiyax35/janiyax35.github.io/static.yml?branch=main&style=flat-square&labelColor=10151C&label=deploy" alt="Deploy status"></a>
<img src="https://img.shields.io/github/license/janiyax35/janiyax35.github.io?style=flat-square&labelColor=10151C&color=B6FF3B" alt="License: MIT">
<img src="https://img.shields.io/github/last-commit/janiyax35/janiyax35.github.io?style=flat-square&labelColor=10151C&color=B6FF3B" alt="Last commit">
<img src="https://img.shields.io/badge/build_step-none-B6FF3B?style=flat-square&labelColor=10151C" alt="No build step">

</div>

<details>
<summary><b>tl;dr</b>: the 20-second plain-text version</summary>
<br>

- **What:** the source of my portfolio, [janith.qzz.io](https://janith.qzz.io): a cybersecurity portfolio styled as an operator console, plus The Lab, a small cyber range with a six-flag CTF.
- **Built by:** me, Janith Deshan, a Cybersecurity undergraduate at SLIIT. Design, code and content.
- **Stack:** plain HTML, CSS and JavaScript; GSAP, Lenis, xterm.js, EmailJS and three.js (404 page only) from pinned CDNs with SRI. No framework, no build step.
- **Hosting:** GitHub Pages, deployed by GitHub Actions, on a custom domain.
- **Run it:** `python -m http.server 5500`, then open http://localhost:5500

</details>

<br>

<picture><source media="(prefers-color-scheme: light)" srcset=".github/readme/assets/head-overview-light.svg"><img src=".github/readme/assets/head-overview.svg" width="100%" alt="01 overview"></picture>

This is my portfolio, built to feel like the tools I work with: a dark operator console with one lime accent, a real terminal, and projects written up as case files.

It has two pages:

- **Home** (`index.html`) is only about me and my work: who I am, my skills, nine case files, my research, education and certifications, and a contact form.
- **The Lab** (`lab.html`) holds the extras: a six-flag CTF, a full-size shell, a threat globe, and a self-audit of how the site is secured.

Everything is hand-written HTML, CSS and JavaScript. All content lives in one file (`js/data.js`) and is rendered in the browser.

<table>
<tr>
<td width="50%"><a href="https://janith.qzz.io"><img src=".github/readme/assets/screen-home.png" alt="Home page: the name JANITH DESHAN in large solid and outlined letters, a rotating focus line, buttons to open the case files, enter The Lab or open the quick view, and a terminal on the right that has run whoami."></a></td>
<td width="50%"><a href="https://janith.qzz.io/lab.html"><img src=".github/readme/assets/screen-lab.png" alt="The Lab: the title The Lab, a short intro, Start hunting and Open shell buttons, a flag counter at 0 of 6, and a dotted world globe marking Homagama, Sri Lanka."></a></td>
</tr>
<tr>
<td align="center"><sub>home · <code>index.html</code></sub></td>
<td align="center"><sub>the lab · <code>lab.html</code></sub></td>
</tr>
</table>

<picture><source media="(prefers-color-scheme: light)" srcset=".github/readme/assets/head-features-light.svg"><img src=".github/readme/assets/head-features.svg" width="100%" alt="02 features"></picture>

<p align="center">
<img src=".github/readme/assets/card-console.svg" width="49%" alt="F-01 Operator console: a boot sequence once per session, OPS / RED / BLUE modes that re-colour the site and highlight offensive or defensive work, and a Ctrl+K command palette. Built with GSAP 3.13, Lenis and CSS tokens. 3 colour modes.">
<img src=".github/readme/assets/card-terminal.svg" width="49%" alt="F-02 jdsh terminal: a real xterm.js shell in the hero that types whoami on load. Try help, projects, nmap janith, cat, lab or sudo hire-me. Built with xterm.js 5.5 and addon-fit. 30+ commands.">
<img src=".github/readme/assets/card-cases.svg" width="49%" alt="F-03 Case files: projects written up as engagement reports with scope, findings and outcome. Private repos show a request-access button instead of a link. Built with data.js, dialog and mailto. 9 case files.">
<img src=".github/readme/assets/card-lab.svg" width="49%" alt="F-04 The Lab: a separate page for the extras: a six-flag CTF scoreboard, a full-size shell, a drag-to-spin threat globe and a site-security self-audit. Built with canvas, topojson and Web Crypto. 6 hidden flags.">
<img src=".github/readme/assets/card-contact.svg" width="49%" alt="F-05 Contact channel: the form sends through EmailJS with a honeypot, a 3-second time trap, a 30-second cooldown and headless-browser blocking. A mail-app backup is always there. Built with EmailJS 4.4, a honeypot and a rate limit. 48h reply time.">
<img src=".github/readme/assets/card-ux.svg" width="49%" alt="F-06 Custom UX: a context-aware right-click menu, native SVG cursors, a radar-style scroll dial and a giant footer name lit by a cursor spotlight. Built with SVG cursors, only on precise pointers. 0 frameworks.">
</p>

<img src=".github/readme/assets/results.svg" width="100%" alt="By the numbers: 9 case files, 6 hidden flags, 3 colour modes, 0 build steps.">

Keyboard: <kbd>Ctrl</kbd> + <kbd>K</kbd> or <kbd>/</kbd> opens the command palette, <kbd>Q</kbd> the quick view, <kbd>`</kbd> the terminal. <kbd>Shift</kbd> + right-click brings back the browser's own menu.

<picture><source media="(prefers-color-scheme: light)" srcset=".github/readme/assets/head-architecture-light.svg"><img src=".github/readme/assets/head-architecture.svg" width="100%" alt="03 architecture"></picture>

<img src=".github/readme/assets/architecture.svg" width="100%" alt="Architecture: the janiyax35.github.io repo (git, main branch) is pushed to GitHub Actions, which deploys static.yml to GitHub Pages at janith.qzz.io over HTTPS. The browser loads index.html (home) and lab.html (the lab), renders content from data.js, and keeps mode and flags in localStorage. It only loads from the CSP allow-list: Google Fonts (stylesheet and woff2), cdnjs, jsDelivr and unpkg (pinned versions with SRI sha384), world-atlas 2.0.2 (globe data, hash-checked), and the EmailJS API (contact form, rate-limited). Static site: no server code and no build step.">

<picture><source media="(prefers-color-scheme: light)" srcset=".github/readme/assets/head-stack-light.svg"><img src=".github/readme/assets/head-stack.svg" width="100%" alt="04 stack"></picture>

<img src=".github/readme/assets/stack.svg" width="100%" alt="The stack as an nmap scan of janith.qzz.io: 443/tcp https, GitHub Pages with a custom domain and Actions deploy; 80/tcp web, HTML, CSS and vanilla JS with no framework and no build; 8080/tcp motion, GSAP 3.13 with ScrollTrigger and ScrambleText, and Lenis 1.3.4; 2222/tcp shell, xterm.js 5.5.0 with addon-fit 0.10.0, running jdsh; 9000/tcp globe, canvas 2D with topojson-client 3.1.0 and world-atlas 2.0.2; 587/tcp mail, EmailJS 4.4.1 with a honeypot, time trap and rate limit; 8443/tcp integrity, CSP, SRI sha384 and Web Crypto SHA-256; 31337/tcp ctf, 6 flags hidden, start at /lab.html.">

<picture><source media="(prefers-color-scheme: light)" srcset=".github/readme/assets/head-security-light.svg"><img src=".github/readme/assets/head-security.svg" width="100%" alt="05 security"></picture>

A security portfolio should be secure itself. GitHub Pages can't set response headers, so everything that can be done in the page is done in the page. The live self-audit is at [lab.html#security](https://janith.qzz.io/lab.html#security).

| Control | Where | What it stops |
|---|---|---|
| Content-Security-Policy (`<meta>`) | `index.html`, `lab.html`, `404.html` | Scripts from anywhere except the site and three pinned CDNs, plus plugins, embedded frames and `<base>` hijacking. Each page allows only the network hosts it needs. |
| Subresource Integrity (SHA-384) | every CDN `<script>` and stylesheet | A compromised or tampered CDN file: the browser refuses to run it |
| Hash-checked data fetch | globe data in `js/fx.js` | Tampered map data from the CDN |
| CTF flags stored as SHA-256 hashes | `js/ctf.js` | Reading the answers straight out of the source |
| Contact-form spam controls | `js/main.js` | Bots: honeypot field, 3-second time trap, 30-second cooldown, EmailJS rate limit and headless-browser blocking |
| No analytics or trackers | whole site | Tracking visitors; there are no third-party cookies |
| `security.txt` (RFC 9116) | `/.well-known/security.txt` | Gives researchers a clear way to report a real issue |

Found a real vulnerability (not a CTF flag)? Please email me privately first: [janithmihijaya123@gmail.com](mailto:janithmihijaya123@gmail.com).

<picture><source media="(prefers-color-scheme: light)" srcset=".github/readme/assets/head-lab-light.svg"><img src=".github/readme/assets/head-lab.svg" width="100%" alt="06 the lab"></picture>

Six flags are hidden across the site, from easy to hard. Start at **[The Lab](https://janith.qzz.io/lab.html)**: it has the scoreboard, the hints, and a shell you can submit flags from. Your progress stays in your own browser.

Yes, this repo is the site's source, so reading it is fair game. Please don't post the answers publicly; let others enjoy the hunt.

<picture><source media="(prefers-color-scheme: light)" srcset=".github/readme/assets/head-run-light.svg"><img src=".github/readme/assets/head-run.svg" width="100%" alt="07 run locally"></picture>

Use a local server rather than opening `index.html` directly. The cookie challenge and some browser APIs don't work on `file://`.

```bash
git clone https://github.com/janiyax35/janiyax35.github.io.git
cd janiyax35.github.io
python -m http.server 5500
```

Then open http://localhost:5500.

| To change | Edit |
|---|---|
| All content: profile, skills, case files, education, certifications | `js/data.js` |
| Colours, fonts, layout | `css/style.css` (design tokens at the top) |
| Page structure | `index.html` (home), `lab.html` (The Lab) |
| Terminal commands | `js/terminal.js` |
| Hero network, globe, Mirai simulation, topology | `js/fx.js` |

More detail, including how to update SRI hashes and the CSP, is in [DEVELOPMENT.md](DEVELOPMENT.md). Pushing to `main` deploys the site automatically.

<picture><source media="(prefers-color-scheme: light)" srcset=".github/readme/assets/head-contact-light.svg"><img src=".github/readme/assets/head-contact.svg" width="100%" alt="08 contact"></picture>

Open to **internships and collaborations** in security. Email is the fastest way to reach me, and I reply within 48 hours.

[janithmihijaya123@gmail.com](mailto:janithmihijaya123@gmail.com) · [LinkedIn](https://linkedin.com/in/janithdeshan) · [janith.qzz.io](https://janith.qzz.io) · [GitHub profile](https://github.com/janiyax35)

**License:** the code is [MIT](LICENSE), so you're welcome to learn from it and reuse the techniques. My personal content (the text, CV, photos and case-file write-ups) isn't covered by that licence. Please don't publish it as your own.

<a href="https://janith.qzz.io"><img src=".github/readme/assets/footer.svg" width="100%" alt="JANITH.QZZ.IO"></a>

<p align="center"><sub>Graphics are generated by <code>.github/readme/build.mjs</code> (see <a href=".github/readme/BUILD.md">BUILD.md</a>). Part of the case files at <a href="https://janith.qzz.io/#cases">janith.qzz.io</a>. Stay curious, stay secure.</sub></p>
