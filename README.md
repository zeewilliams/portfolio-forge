# 🛠️ Portfolio Forge

> **Turn any cybersecurity lab URL into a recruiter-ready GitHub portfolio repo — in under a minute.**

A free, installable Progressive Web App (PWA) that runs entirely in your browser.
**No AI. No backend. No signup. No data leaves your device.**

![Status](https://img.shields.io/badge/status-live-39ff7a?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-installable-39ff7a?style=flat-square)

---

## 🌐 Live demo

Hosted free on GitHub Pages: **`https://<your-username>.github.io/portfolio-forge/`**

*(Replace `<your-username>` after you fork — see setup below.)*

---

## ✨ What it does

Paste a lab URL from any of these platforms:

- TryHackMe
- Hack The Box
- Pluralsight
- LetsDefend
- Splunk
- Microsoft Azure (incl. Sentinel)
- AWS
- Google Cloud
- Coursera
- ...or any other lab (falls back to a generic template)

Hit generate → download a ZIP containing a **complete portfolio repo**:

```
your-lab-name/
├── README.md              ← polished, recruiter-ready writeup
├── UPLOAD-GUIDE.md        ← step-by-step GitHub upload guide
├── LINKEDIN-POST.md       ← 3 ready-to-post variants
├── RESUME-BULLETS.md      ← copy-paste resume bullets
├── ARTIFACT-CHECKLIST.md  ← so you don't miss anything
├── CHATGPT-PROMPTS.md     ← reusable prompts to extend the project
├── LICENSE                ← MIT
├── .gitignore             ← safe defaults
├── screenshots/           ← drop your PNGs here
├── diagrams/              ← architecture diagram instructions
├── queries/               ← KQL/SPL/etc.
├── scripts/
├── evidence/
├── notes/                 ← seeded with your raw notes
└── certificates/
```

The generated README includes:

- Objectives, tools, and concepts (tailored to the platform)
- Step-by-step walkthrough structure
- MITRE ATT&CK mappings
- Screenshot placeholders with suggested filenames
- "What I learned" + "Common mistakes" sections
- Resume bullets and a LinkedIn post
- An About Me section

---

## 🚀 Setup (for hosting your own copy on GitHub Pages)

### Option A — One-click deploy (recommended)

1. Click **Use this template** at the top of this repo (or **Fork**).
2. Name your new repo `portfolio-forge` (or anything you want).
3. In your new repo, go to **Settings → Pages**.
4. Under **Source**, select **Deploy from a branch** → **main** → **/ (root)**.
5. Click **Save**.
6. Wait ~1 minute, then visit `https://<your-username>.github.io/portfolio-forge/`.

Done. The PWA is live and free forever.

### Option B — Local development

```bash
# Clone the repo
git clone https://github.com/<your-username>/portfolio-forge.git
cd portfolio-forge

# Serve locally (any static server works)
python3 -m http.server 8000
# or:  npx serve
# or:  npx http-server

# Open http://localhost:8000
```

That's it. No build step, no dependencies, no `npm install`. Just static HTML/CSS/JS.

---

## 🧩 How it works (under the hood)

```
┌──────────────────┐    ┌────────────────┐    ┌──────────────────┐    ┌──────────────┐
│  User pastes URL │ →  │ detect.js      │ →  │ templates.js     │ →  │ generator.js │
│  + notes         │    │ identifies     │    │ provides         │    │ assembles    │
│                  │    │ platform       │    │ tailored content │    │ files        │
└──────────────────┘    └────────────────┘    └──────────────────┘    └──────────────┘
                                                                              │
                                                                              ▼
                                                                      ┌──────────────┐
                                                                      │  JSZip       │
                                                                      │  → blob      │
                                                                      │  → download  │
                                                                      └──────────────┘
```

- **No backend.** Everything runs in `js/`.
- **No AI.** Content is template-driven so it's deterministic, fast, and free.
- **Offline-capable.** A service worker caches the app shell after first load.
- **Installable.** Add to home screen / install as desktop app via the browser.

---

## 📂 Project structure

```
portfolio-forge/
├── index.html              ← entry point
├── manifest.webmanifest    ← PWA install metadata
├── sw.js                   ← service worker (offline cache)
├── css/
│   └── style.css           ← terminal/CRT aesthetic
├── js/
│   ├── app.js              ← UI glue, download handler
│   ├── detect.js           ← platform detection
│   ├── templates.js        ← per-platform content
│   └── generator.js        ← file builders
├── assets/
│   ├── icon.svg
│   ├── icon-192.png
│   └── icon-512.png
└── README.md               ← you are here
```

---

## 🛠️ Customizing the templates

Want to add a new platform, or tweak the wording for an existing one?

1. Open `js/detect.js` — add a new entry to the `PLATFORMS` object with the URL patterns.
2. Open `js/templates.js` — add a matching entry to the `TEMPLATES` object with objectives, tools, MITRE mappings, etc.
3. Reload. That's it.

No build step. No deploy step. Just commit and push — GitHub Pages picks it up automatically.

---

## 🔒 Privacy

- **Zero telemetry.** No analytics, no tracking, no cookies.
- **Zero network calls** after the first page load (everything is in your browser).
- **Zero data storage.** What you type vanishes when you close the tab.

The only external dependency is **JSZip** loaded from a CDN (and cached for offline use).
If you want to host JSZip locally too, grab it from [stuk.github.io/jszip](https://stuk.github.io/jszip/) and drop it next to `index.html`, then update the script tag.

---

## 🤝 Contributing

Issues and pull requests welcome. Especially:

- New platform templates
- Improvements to existing template content
- Translations
- Accessibility fixes

---

## 📝 License

MIT — see [LICENSE](LICENSE).

Use it, fork it, sell it, learn from it.

---

## 💚 Built for

Cybersecurity students who are tired of:

- Finishing labs and having nothing to show for them
- Staring at empty GitHub profiles wondering what recruiters want
- Spending hours writing READMEs instead of doing more labs

Forge the repo. Get back to learning.
