/**
 * generator.js — turns template data + user context into the full set of files
 * that get zipped and downloaded.
 *
 * Returns: { files: { "path/name.md": "content", ... }, repoName: "..." }
 */

function generatePortfolioFiles(ctx) {
  const { detectPlatform, TEMPLATES } = window.PortfolioForge;
  const platform = detectPlatform(ctx.url);
  if (!platform) throw new Error("Please paste a lab URL first.");

  const tmplFn = TEMPLATES[platform.template] || TEMPLATES.generic;
  const tmpl = tmplFn({
    url: ctx.url,
    userName: ctx.userName,
    githubHandle: ctx.githubHandle,
    notes: ctx.notes,
    hints: platform.hints,
    platformName: platform.name
  });

  const userName = ctx.userName || "Your Name";
  const handle = ctx.githubHandle || "your-github-handle";
  const repoSlug = slugify(tmpl.title);
  const date = new Date().toISOString().split("T")[0];

  // Build all the files
  const files = {};

  // README.md
  files["README.md"] = buildReadme({ tmpl, platform, ctx, userName, handle, date });

  // UPLOAD-GUIDE.md
  files["UPLOAD-GUIDE.md"] = buildUploadGuide({ repoSlug, handle });

  // LINKEDIN-POST.md
  files["LINKEDIN-POST.md"] = buildLinkedInPost({ tmpl, platform });

  // RESUME-BULLETS.md
  files["RESUME-BULLETS.md"] = buildResumeBullets({ tmpl });

  // ARTIFACT-CHECKLIST.md
  files["ARTIFACT-CHECKLIST.md"] = buildArtifactChecklist({ tmpl, platform });

  // CHATGPT-PROMPTS.md
  files["CHATGPT-PROMPTS.md"] = buildPromptLibrary({ tmpl, platform });

  // notes/raw-notes.md (seeded with their notes)
  files["notes/raw-notes.md"] = buildNotesSeed({ ctx, platform });

  // diagrams/architecture.md (placeholder description)
  files["diagrams/architecture.md"] = buildArchitectureDoc({ tmpl, platform });

  // queries/README.md (placeholder for KQL/SPL/etc)
  files["queries/README.md"] = buildQueriesReadme({ platform });

  // scripts/README.md
  files["scripts/README.md"] = `# Scripts\n\nAdd any scripts you wrote or used during this lab here.\n\nCommon examples:\n- Enumeration scripts\n- Exploit PoCs (only your own / sanctioned)\n- Automation helpers\n- Data parsing scripts\n`;

  // evidence/README.md
  files["evidence/README.md"] = `# Evidence\n\nStore lab artifacts here:\n- Exported logs\n- PCAP files\n- Memory dumps\n- Flag screenshots\n- Lab completion proof\n\n> ⚠️ Never commit sensitive data, real credentials, or anything covered by an NDA.\n`;

  // certificates/README.md
  files["certificates/README.md"] = `# Certificates\n\nDrop your course / lab completion certificate here.\n\nAccepted: PNG, JPG, PDF.\n`;

  // screenshots/README.md
  files["screenshots/README.md"] = buildScreenshotsReadme({ tmpl });

  // Empty .gitkeep files so empty folders show up in GitHub
  files["screenshots/.gitkeep"] = "";
  files["diagrams/.gitkeep"] = "";
  files["scripts/.gitkeep"] = "";
  files["queries/.gitkeep"] = "";
  files["evidence/.gitkeep"] = "";
  files["notes/.gitkeep"] = "";
  files["certificates/.gitkeep"] = "";

  // .gitignore (basic safe defaults)
  files[".gitignore"] = buildGitignore();

  // LICENSE (MIT)
  files["LICENSE"] = buildLicense({ userName, year: new Date().getFullYear() });

  return {
    repoName: repoSlug,
    files,
    previewMarkdown: files["README.md"]
  };
}

/* =========================================================================
 * Builders
 * ========================================================================= */

function buildReadme({ tmpl, platform, ctx, userName, handle, date }) {
  const objectives = tmpl.objectives.map((o) => `- ${o}`).join("\n");
  const tools = tmpl.tools.map((t) => `\`${t}\``).join(" · ");
  const concepts = tmpl.concepts.map((c) => `- ${c}`).join("\n");
  const learnings = tmpl.learnings.map((l) => `- ${l}`).join("\n");
  const resume = tmpl.resumeBullets.map((b) => `- ${b}`).join("\n");
  const nextSteps = tmpl.nextProjects.map((p) => `- ${p}`).join("\n");

  const attackTable = [
    "| ID | Tactic / Technique | How it appears in this lab |",
    "|----|--------------------|----------------------------|",
    ...tmpl.attackMappings.map((m) => `| \`${m[0]}\` | ${m[1]} | ${m[2]} |`)
  ].join("\n");

  const screenshotSections = tmpl.screenshots
    .map(
      (s) => `### ${formatScreenshotTitle(s[0])}\n\n> ${s[1]}\n\n![${formatScreenshotTitle(s[0])}](screenshots/${s[0]})`
    )
    .join("\n\n");

  const userNotesBlock = ctx.notes && ctx.notes.trim()
    ? `\n### 📝 My Lab Notes\n\n> The following are my raw notes captured during the lab.\n\n\`\`\`\n${ctx.notes.trim()}\n\`\`\`\n`
    : "";

  return `# 🛡️ ${tmpl.title}

> ${tmpl.tagline}

![Platform](https://img.shields.io/badge/platform-${encodeURIComponent(platform.name)}-39ff7a?style=flat-square)
![Status](https://img.shields.io/badge/status-complete-39ff7a?style=flat-square)
![Date](https://img.shields.io/badge/date-${date}-blue?style=flat-square)

---

## 📌 Overview

This repository documents my hands-on completion of **${tmpl.title}** on **${platform.name}**.
It includes the methodology I followed, tools I used, evidence I captured, and the skills I demonstrated.

**Lab URL:** ${platform.url}

---

## 🎯 Objectives

${objectives}

---

## 🧰 Tools & Technologies

${tools}

---

## 🧠 Security Concepts Demonstrated

${concepts}

---

## 🏗️ Architecture / Lab Environment

> See \`diagrams/architecture.md\` for a description of the lab setup.
> Add a diagram image at \`diagrams/architecture.png\` (you can draw one in [draw.io](https://app.diagrams.net/) or [Excalidraw](https://excalidraw.com/) for free).

![Architecture](diagrams/architecture.png)

---

## 🪜 Walkthrough

> Replace this section with your actual step-by-step walkthrough.
> Use the placeholders below as a starting structure.

### Step 1 — Setup & Recon
Describe how you set up the environment and what initial reconnaissance you performed.

### Step 2 — Investigation / Exploitation
Describe the main work of the lab — the queries you ran, exploits you tried, or controls you configured.

### Step 3 — Validation
Describe how you confirmed the work was correct (alerts fired, exploit succeeded, control blocked the attack, etc).

### Step 4 — Cleanup & Reflection
Describe how you ended the lab and what you'd do differently next time.
${userNotesBlock}
---

## 📸 Screenshots

> Drop matching PNG/JPG files into the \`screenshots/\` folder using the filenames below.

${screenshotSections}

---

## 🎯 MITRE ATT&CK Mapping

${attackTable}

---

## 🧠 What I Learned

${learnings}

---

## 🚨 Common Mistakes I Avoided (or Made)

- _Add 2–3 mistakes you ran into and how you solved them. Recruiters love this section — it shows reflection._

---

## 🛠️ Skills Gained

- ${tmpl.tools.slice(0, 4).join("\n- ")}
- ${tmpl.concepts.slice(0, 3).join("\n- ")}

---

## 📚 Suggested Next Projects

${nextSteps}

---

## 💼 Resume Bullets

> Copy/paste these straight into your resume:

${resume}

---

## 🔗 References

- [${platform.name}](${platform.url})
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- [GitHub Markdown Guide](https://docs.github.com/en/get-started/writing-on-github)

---

## 👤 About Me

I'm **${userName}**, a cybersecurity student building public proof-of-skill through hands-on labs and detailed writeups.

- 🌐 GitHub: [@${handle}](https://github.com/${handle})
- 📂 More projects: see my [pinned repositories](https://github.com/${handle})

---

## 📝 License

MIT — see [LICENSE](LICENSE).

---

> 🛠️ Generated with [Portfolio Forge](https://github.com/) — a free PWA that turns lab URLs into GitHub portfolio repos.
`;
}

function buildUploadGuide({ repoSlug, handle }) {
  return `# 🚀 How to Upload This to GitHub (Beginner Guide)

You've got a folder full of files. Now let's get it onto GitHub so the world (and recruiters) can see it.

**No coding required.** Everything is point-and-click.

---

## ⏱️ Total time: ~5 minutes

---

## Step 1 — Make a GitHub account (skip if you have one)

1. Go to [github.com/signup](https://github.com/signup)
2. Pick a username — this becomes part of your portfolio URL.
3. Verify your email.

> 💡 Tip: Use a username close to your real name. Recruiters search for you.

---

## Step 2 — Create a new repository

1. Click the **+** icon at the top right of GitHub → **New repository**.
2. **Repository name:** \`${repoSlug}\`
3. **Description:** copy the tagline from your README.
4. Set it to **Public** (recruiters can't see private repos).
5. ✅ Check **Add a README file** — we'll overwrite it in the next step.
6. Click **Create repository**.

---

## Step 3 — Upload your files

1. On your new repo page, click **Add file** → **Upload files**.
2. Open your unzipped folder on your computer.
3. **Select all the files and folders** (Ctrl+A or Cmd+A) and **drag them into the GitHub upload area**.
4. Wait for the green checkmarks ✅ — that means they uploaded.
5. Scroll down. In the commit message box type: \`Initial portfolio commit\`.
6. Click **Commit changes**.

> ⚠️ If you see "this file is too large" — remove it. GitHub's free limit is 100MB per file. Use [Git LFS](https://git-lfs.com/) for big files later.

---

## Step 4 — Add your screenshots

1. Open the \`screenshots\` folder in your new repo.
2. Click **Add file** → **Upload files**.
3. Drag your screenshot PNG/JPG files in. **Use the exact filenames** referenced in the README (e.g. \`dashboard.png\`).
4. Commit changes.

That's it. Your screenshots will now show up in your README automatically.

---

## Step 5 — Pin the repo to your profile

1. Go to [github.com/${handle}](https://github.com/${handle}).
2. Click **Customize your pins** (top-right of the pinned section).
3. Check your new repo.
4. Save.

Now your project appears front-and-center when recruiters land on your profile.

---

## Step 6 — Share it

- 📎 Link it on your LinkedIn (see \`LINKEDIN-POST.md\` for a ready-to-post version)
- 📎 Add the GitHub URL to your resume
- 📎 Drop it in job applications under "portfolio link"

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| README shows broken images | Screenshot filenames must match exactly (case-sensitive). \`Dashboard.PNG\` ≠ \`dashboard.png\` |
| Folder is empty in GitHub | GitHub hides truly empty folders — leave the \`.gitkeep\` files alone |
| Repo is private | Settings → Danger Zone → Change visibility → Public |
| Want a custom URL | Settings → rename the repo (the slug becomes the URL) |

---

## ⭐ Optional polish

- Add **topics** to your repo (Settings → top of page): \`cybersecurity\`, \`portfolio\`, \`blue-team\`, \`siem\`, etc. Recruiters search by topic.
- Add a **profile README** at \`github.com/${handle}/${handle}\` — a special repo that becomes your GitHub homepage.
- Replace the placeholder \`diagrams/architecture.png\` with one you make in [Excalidraw](https://excalidraw.com/) (free, no signup).

---

> Made it through? You now have a public, recruiter-ready cybersecurity portfolio project. 🎉
`;
}

function buildLinkedInPost({ tmpl, platform }) {
  return `# 🔗 LinkedIn Post (Ready to Copy)

Below are three variants — pick whichever fits your voice. Edit the bracketed parts before posting.

---

## Variant 1 — Direct & Professional

🛡️ Just wrapped up a hands-on lab on **${platform.name}**: *${tmpl.title}*.

What I worked on:
${tmpl.objectives.slice(0, 3).map((o) => `• ${o}`).join("\n")}

Tools used: ${tmpl.tools.slice(0, 5).join(" · ")}

Biggest takeaway: ${tmpl.learnings[0].toLowerCase()}.

Full writeup with screenshots, queries, and MITRE ATT&CK mappings is in my GitHub portfolio 👉 [link]

#Cybersecurity #BlueTeam #${platform.name.replace(/\s+/g, "")} #PortfolioProject #LearningInPublic

---

## Variant 2 — Story-Driven (more engagement)

A few weeks ago I couldn't have told you what *${tmpl.concepts[0]}* really meant.

Today I just finished a hands-on lab on **${platform.name}** where I had to actually do it — not just read about it.

Here's what I built / broke / learned:
${tmpl.objectives.slice(0, 2).map((o) => `→ ${o}`).join("\n")}
→ Mapped everything to MITRE ATT&CK so I understand the *why*

The lesson I'll carry forward: ${tmpl.learnings[0].toLowerCase()}.

Sharing the full writeup so other beginners can see what this looks like in practice 👇
[link to your GitHub]

#Cybersecurity #LearningInPublic #BlueTeam #InfoSec

---

## Variant 3 — Short & Punchy

New project up. 🛡️

✅ ${platform.name} lab complete
✅ ${tmpl.tools.slice(0, 3).join(", ")}
✅ MITRE ATT&CK mapped
✅ Documented end-to-end in GitHub

Recruiter-ready writeup → [link]

#Cybersecurity #${platform.name.replace(/\s+/g, "")} #Portfolio

---

## 📌 Posting tips

1. Post during weekday business hours (10am–2pm in your timezone gets best reach).
2. Include the GitHub link, but don't lead with it — LinkedIn deprioritizes link-heavy posts.
3. Add one screenshot from your lab as the post image — visuals 5x engagement.
4. Reply to every comment in the first hour — it boosts the algorithm.
5. Tag people who taught you (the course instructor, the platform's official page) — they often reshare.
`;
}

function buildResumeBullets({ tmpl }) {
  return `# 💼 Resume Bullets

These are pre-written, action-verb-first, results-focused bullets. Drop them straight into your resume.

---

## Standard Version (use these as-is)

${tmpl.resumeBullets.map((b) => `- ${b}`).join("\n")}

---

## Punchy Version (shorter, for tight resume real estate)

${tmpl.resumeBullets.map((b) => `- ${shortenBullet(b)}`).join("\n")}

---

## ✏️ Customization tips

1. **Add a number wherever possible.** "Wrote 12 KQL detection rules" beats "Wrote KQL detection rules."
2. **Lead with the action verb.** Built, deployed, investigated, detected, automated, hardened.
3. **End with the outcome.** "...resulting in X" or "...demonstrating Y skill" makes recruiters slow down.
4. **Match the job description's keywords.** If a job says "SIEM," use "SIEM" — not just "Splunk."

---

## 📋 Where to put these

- **Projects** section of your resume (preferred for students/career-changers)
- **Skills** section (as supporting evidence)
- **LinkedIn → Featured** (link to the GitHub repo)
- **Cover letter** (paraphrased, not copy-pasted)
`;
}

function buildArtifactChecklist({ tmpl, platform }) {
  const screenshots = tmpl.screenshots.map((s) => `- [ ] \`screenshots/${s[0]}\` — ${s[1]}`).join("\n");

  return `# ✅ Artifact Checklist

Use this checklist to make sure your repo is complete before publishing.

---

## 📸 Screenshots

${screenshots}

---

## 📂 Other artifacts (as applicable to your lab)

- [ ] \`diagrams/architecture.png\` — visual of the lab setup (draw in Excalidraw or draw.io)
- [ ] \`queries/\` — any KQL / SPL / SQL / search queries you wrote
- [ ] \`scripts/\` — any scripts you ran or modified
- [ ] \`evidence/\` — exported logs, PCAPs, or other proof of work
- [ ] \`certificates/\` — course or lab completion certificate
- [ ] \`notes/raw-notes.md\` — your unpolished notes (great for showing process)

---

## 📄 Polish items

- [ ] README.md filled in (no placeholder text left)
- [ ] All screenshots show up (no broken image links)
- [ ] Architecture diagram added
- [ ] Resume bullets reviewed and personalized
- [ ] LinkedIn post variant chosen and posted
- [ ] Repo topics added on GitHub (cybersecurity, ${platform.template}, etc.)
- [ ] Repo pinned to your profile

---

## ⚠️ Safety checklist (BEFORE pushing to public GitHub)

- [ ] No real credentials, API keys, or tokens in any file
- [ ] No personal data (your home IP, real names of others, etc.)
- [ ] No screenshots showing sensitive customer / employer data
- [ ] No content that violates the lab platform's terms of service (some platforms forbid public writeups — check first)
- [ ] If the lab is part of an exam (e.g. OSCP), don't post the writeup until you're allowed to

---

> 💡 Pro tip: once everything is checked, this checklist is your **interview talking points**. Walk a recruiter through the bullets above and you've already aced "tell me about a project."
`;
}

function buildPromptLibrary({ tmpl, platform }) {
  return `# 🤖 Reusable Prompts (ChatGPT, Claude, etc.)

When you want to extend or improve this portfolio, paste these prompts into your favorite AI assistant.

---

## 1. Improve the README

> Read my README.md (paste the contents below). Suggest 5 specific improvements that would make it stronger for a recruiter scanning it in 30 seconds. Be specific about which sentences to change.
>
> [paste README]

---

## 2. Generate more resume bullets

> Based on this lab I completed (paste your README), write 6 additional resume bullet points. Use strong action verbs, include outcomes, and tailor them for a SOC Analyst role.

---

## 3. Explain my architecture diagram

> I built a lab using ${platform.name}. Help me write a 3-paragraph architecture explanation suitable for a portfolio README. Cover: components used, how data flows, and which security controls are demonstrated.
>
> Lab notes: [paste your notes]

---

## 4. Write detection logic

> Based on this attack technique: ${tmpl.attackMappings[0][1]} (${tmpl.attackMappings[0][0]}), write me a detection rule in ${platform.name === "Splunk" ? "SPL" : "KQL"}. Include comments explaining what each line does.

---

## 5. Interview prep — STAR stories

> Turn this project into 3 STAR-format interview stories (Situation, Task, Action, Result). Each should be 60–90 seconds spoken. Project: [paste your README].

---

## 6. Generate a project blog post

> I want to turn this GitHub project into a Medium / Dev.to blog post for beginners. Write a draft (~800 words) with: hook intro, what I learned, the actual walkthrough, and a "what's next" closer.
>
> Source: [paste your README]

---

## 7. LinkedIn engagement post

> Write me a short LinkedIn post (under 150 words) about completing this project. Tone: confident but humble. Audience: cybersecurity recruiters and other learners. End with a question that drives comments.

---

## 8. Find related certifications

> Based on the skills demonstrated in this lab (paste README), which entry-level cybersecurity certifications would best validate this skill set? Give me 3 options with rationale.

---

## 9. Identify portfolio gaps

> Here are my current portfolio projects: [list them]. What kinds of projects am I missing if I want to apply for SOC Analyst / Security Engineer roles? Suggest 4 specific next projects with platforms to use.
`;
}

function buildNotesSeed({ ctx, platform }) {
  const userNotes = ctx.notes && ctx.notes.trim() ? ctx.notes.trim() : "_Add your raw notes here as you go. Don't worry about polish — this is your scratch pad._";

  return `# 📝 Raw Notes

> Unpolished notes from working through this lab. The README is the polished story; this file is the messy reality.

**Lab:** ${platform.url}
**Date started:** ${new Date().toISOString().split("T")[0]}
**Platform:** ${platform.name}

---

## Initial impressions

${userNotes}

---

## Commands & queries I ran

\`\`\`
# paste anything useful here as you go
\`\`\`

---

## Things that confused me

- _Add anything you got stuck on. Future-you will be grateful._

---

## Aha moments

- _The little realizations that clicked while doing the lab. These are gold for blog posts later._

---

## Questions for follow-up

- _Stuff you want to research more deeply after the lab._
`;
}

function buildArchitectureDoc({ tmpl, platform }) {
  return `# 🏗️ Architecture

> Describe the components and data flow of your lab environment here.
> Then create a diagram (see "How to draw the diagram" below) and save it as \`architecture.png\` in this folder.

---

## Components

- _List each major component (VMs, services, log sources, etc.)_

## Data flow

1. _Step 1 of how data moves through the lab_
2. _Step 2_
3. _Step 3_

## Security controls demonstrated

- _Control 1: what it does, why it matters_
- _Control 2: ..._

---

## 🎨 How to draw the diagram (free, no signup)

**Option 1 — [Excalidraw](https://excalidraw.com/)** (hand-drawn feel, great for portfolios)
1. Open excalidraw.com
2. Drag rectangles, arrows, labels for each component
3. Click **Export image** → save as \`architecture.png\` in this folder

**Option 2 — [draw.io](https://app.diagrams.net/)** (more polished, professional look)
1. Open app.diagrams.net
2. Use the AWS / Azure / GCP shape library for cloud icons
3. **File → Export as → PNG** into this folder

**Option 3 — Mermaid (text-based, lives right in markdown)**
\`\`\`mermaid
graph LR
  A[Attacker] -->|exploit| B[Vulnerable Service]
  B --> C[Logs]
  C --> D[${platform.name === "Microsoft Azure" ? "Sentinel" : "SIEM"}]
  D --> E[Alert / Incident]
\`\`\`
`;
}

function buildQueriesReadme({ platform }) {
  const queryLang = platform.template === "azure" ? "KQL"
    : platform.template === "splunk" ? "SPL"
    : platform.template === "aws" ? "Athena SQL"
    : platform.template === "gcp" ? "Cloud Logging query"
    : "Detection queries";

  return `# 🔍 Queries

Detection logic, search queries, and analytics rules from this lab.

**Primary language:** ${queryLang}

---

## How to organize this folder

\`\`\`
queries/
├── 01-brute-force.${queryLang === "KQL" ? "kql" : "txt"}
├── 02-anomalous-signin.${queryLang === "KQL" ? "kql" : "txt"}
└── 03-data-exfiltration.${queryLang === "KQL" ? "kql" : "txt"}
\`\`\`

For each query file, include a header comment with:
- What the query detects
- Which MITRE ATT&CK technique it maps to
- The data source it depends on
- Known false positives

Example header:

\`\`\`
// Detection: Brute-force login attempts
// MITRE: T1110 — Brute Force
// Source: SecurityEvent (Windows logon events)
// FP: scheduled tasks running with wrong cached creds; service account testing
\`\`\`
`;
}

function buildScreenshotsReadme({ tmpl }) {
  return `# 📸 Screenshots

Drop your PNG / JPG screenshots in this folder.

**Important:** the filenames in the parent README are case-sensitive. Use exactly these names:

${tmpl.screenshots.map((s) => `- \`${s[0]}\` — ${s[1]}`).join("\n")}

---

## 📐 Screenshot tips

- Use **PNG** for UI screenshots, **JPG** for photos.
- Keep file size under 1 MB each. Use [TinyPNG](https://tinypng.com/) to compress.
- Crop to remove personal info (your real name in title bars, etc).
- Use a clean dark theme if possible — looks more professional.
- For terminal screenshots, [Carbon](https://carbon.now.sh/) makes them gorgeous.
`;
}

function buildGitignore() {
  return `# OS noise
.DS_Store
Thumbs.db
desktop.ini

# Editor noise
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log

# Environment / secrets — NEVER commit these
.env
.env.*
*.pem
*.key
*-credentials.json
secrets/
`;
}

function buildLicense({ userName, year }) {
  return `MIT License

Copyright (c) ${year} ${userName}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

/* =========================================================================
 * Small helpers
 * ========================================================================= */

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function formatScreenshotTitle(filename) {
  return filename
    .replace(/\.(png|jpg|jpeg|gif|webp)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function shortenBullet(b) {
  // Trim filler phrases for "punchy" version
  return b
    .replace(/demonstrating .*$/, "")
    .replace(/ in GitHub portfolio$/, "")
    .replace(/ with documented .*$/, "")
    .trim()
    .replace(/[.,]$/, "");
}

window.PortfolioForge = window.PortfolioForge || {};
window.PortfolioForge.generatePortfolioFiles = generatePortfolioFiles;
