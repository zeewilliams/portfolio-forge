/**
 * generator.js (v2 — placeholder-driven)
 *
 * Outputs a professional README with clearly marked [REPLACE: ...] slots
 * that the user fills in. Modeled on a high-quality real example
 * (project narrative, tables, numbered ✅ steps, key takeaways with unique emoji).
 *
 * Philosophy: don't fabricate lab specifics. Hand the user a beautiful
 * pre-styled scaffold with every fill-in slot clearly marked.
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

  const userName = ctx.userName || "[REPLACE: Your Name]";
  const handle = ctx.githubHandle || "[REPLACE: your-github-handle]";
  const repoSlug = slugify(tmpl.title);
  const date = new Date().toISOString().split("T")[0];

  const files = {};

  files["README.md"] = buildReadme({ tmpl, platform, ctx, userName, handle, date });
  files["PLACEHOLDERS.md"] = buildPlaceholderChecklist({ tmpl });
  files["UPLOAD-GUIDE.md"] = buildUploadGuide({ repoSlug, handle });
  files["LINKEDIN-POST.md"] = buildLinkedInPost({ tmpl, platform });
  files["RESUME-BULLETS.md"] = buildResumeBullets({ tmpl });
  files["ARTIFACT-CHECKLIST.md"] = buildArtifactChecklist({ tmpl });
  files["CHATGPT-PROMPTS.md"] = buildPromptLibrary({ tmpl, platform });
  files["notes/raw-notes.md"] = buildNotesSeed({ ctx, platform });
  files["diagrams/architecture.md"] = buildArchitectureDoc({ platform });
  files["queries/README.md"] = buildQueriesReadme({ platform });
  files["scripts/README.md"] = "# Scripts\n\nAdd any scripts you wrote or used during this lab.\n";
  files["evidence/README.md"] = "# Evidence\n\nStore lab artifacts (logs, PCAPs, exports) here.\n\n> ⚠️ Never commit real credentials, NDA-covered data, or anything sensitive.\n";
  files["certificates/README.md"] = "# Certificates\n\nDrop your completion certificate here (PNG, JPG, or PDF).\n";
  files["screenshots/README.md"] = buildScreenshotsReadme({ tmpl });

  // .gitkeep to ensure empty folders survive upload
  ["screenshots", "diagrams", "scripts", "queries", "evidence", "notes", "certificates"]
    .forEach(d => { files[`${d}/.gitkeep`] = ""; });

  files[".gitignore"] = buildGitignore();
  files["LICENSE"] = buildLicense({ userName: ctx.userName || "Your Name", year: new Date().getFullYear() });

  return {
    repoName: repoSlug,
    files,
    previewMarkdown: files["README.md"]
  };
}

/* =========================================================================
 *  README BUILDER — modeled directly on the Merrilton example
 * ========================================================================= */
function buildReadme({ tmpl, platform, ctx, userName, handle, date }) {
  const userNotes = ctx.notes && ctx.notes.trim()
    ? ctx.notes.trim()
    : "[REPLACE: paste a 1–2 sentence summary of your lab notes here, or delete this line]";

  const toolsTable = [
    "| Tool / Technique | Purpose |",
    "|------------------|---------|",
    ...tmpl.tools.slice(0, 6).map((t) => `| ${t} | [REPLACE: what you used it for] |`)
  ].join("\n");

  const objectives = tmpl.objectives.map((o) => `- ${o}`).join("\n");

  const attackTable = [
    "| ID | Tactic / Technique | How it appeared in this lab |",
    "|----|--------------------|------------------------------|",
    ...tmpl.attackMappings.map((m) => `| \`${m[0]}\` | ${m[1]} | [REPLACE: 1-sentence description for your lab] |`)
  ].join("\n");

  const screenshotTable = [
    "| Description | Screenshot |",
    "|-------------|------------|",
    ...tmpl.screenshots.map((s) => `| ${s[1]} | ![${s[1]}](screenshots/${s[0]}) |`)
  ].join("\n");

  const takeawayEmojis = ["📊", "📈", "🎯", "🔧", "🛡️", "🧠", "⚡", "🔍"];
  const takeaways = tmpl.learnings
    .map((l, i) => `- ${takeawayEmojis[i % takeawayEmojis.length]} ${l}`)
    .join("\n");

  const walkthroughSteps = `### ✅ Step 1: [REPLACE: Setup & Initial Observations]

> 💡 Describe how you set up the environment and the first thing you noticed or did.

- [REPLACE: First action you took — e.g., "Spun up the lab environment via the platform portal"]
- [REPLACE: Tools opened / connected]
- [REPLACE: Anything unexpected at the start]

---

### ✅ Step 2: [REPLACE: Main Investigation / Configuration]

> 💡 This is the meat of the lab. What did you actually do? What query did you write, what exploit did you try, what control did you configure?

- [REPLACE: Action 1 — be specific. Include commands or queries in backticks like \`this\`]
- [REPLACE: Action 2]
- [REPLACE: Action 3 — what evidence did you capture?]

\`\`\`
[REPLACE: paste the key command, query, or config snippet here]
\`\`\`

---

### ✅ Step 3: [REPLACE: Validation & Results]

> 💡 How did you confirm the work was correct? What proof do you have it worked?

- [REPLACE: How you tested]
- [REPLACE: What result you saw — alert fired, exploit succeeded, control blocked attack, etc.]
- [REPLACE: Reference any screenshot in \`screenshots/\` here]

---

### ✅ Step 4: [REPLACE: Cleanup & Reflection]

> 💡 How did you end the lab? What would you do differently?

- [REPLACE: Cleanup steps you took]
- [REPLACE: One thing you'd improve next time]`;

  return `# 🛡️ ${tmpl.title}

> ${tmpl.tagline}

![Cover](screenshots/cover.png)

> 💡 **Cover image tip:** Replace \`screenshots/cover.png\` with a screenshot of your lab dashboard, terminal output, or architecture diagram. This is the first thing recruiters see.

![Platform](https://img.shields.io/badge/platform-${encodeURIComponent(platform.name)}-39ff7a?style=flat-square)
![Status](https://img.shields.io/badge/status-complete-39ff7a?style=flat-square)
![Date](https://img.shields.io/badge/date-${date.replace(/-/g, "--")}-blue?style=flat-square)

---

## 📘 Introduction

> 💡 Write 2 short paragraphs that tell the story of this lab. What problem did it solve? What was the context? Why does it matter? Read it out loud — if it sounds like a human, you nailed it.

[REPLACE: Paragraph 1 — Set the scene. What is this lab about? What real-world scenario does it simulate? Who would care about this in a real job?]

[REPLACE: Paragraph 2 — What was your specific role? What were you trying to accomplish? What constraints did you work within (time, tools, scope)?]

---

## 🎯 Objectives

> 💡 These are starter objectives based on the lab type. **Replace each one with the actual objectives from your lab page** — most lab platforms list them right at the top.

${objectives}

---

## 🧰 Tools & Techniques Used

> 💡 Replace the "Purpose" column with what you actually used each tool for in *this specific* lab. Be specific — "Nmap for service version scanning" beats "Nmap."

${toolsTable}

---

## 🏗️ Architecture / Lab Environment

> 💡 See \`diagrams/architecture.md\` for help drawing one. Save your diagram as \`diagrams/architecture.png\`.

![Architecture](diagrams/architecture.png)

[REPLACE: 1–2 sentences describing what the diagram shows. e.g., "The lab simulates a small enterprise network with a Windows DC, a Linux web server, and a cloud-based SIEM ingesting logs from both."]

---

## 🪜 Project Walkthrough

${walkthroughSteps}

---

## 📊 Key Data / Results

> 💡 Did your lab produce numbers, tables, or measurable outcomes? Drop them here. Examples: detection rule counts, queries written, alerts generated, flags captured, vulnerabilities found. **Delete this entire section if your lab wasn't data-heavy.**

| Metric | Value | Notes |
|--------|-------|-------|
| [REPLACE: e.g., Detection rules written] | [REPLACE: 5] | [REPLACE: brief context] |
| [REPLACE: e.g., Alerts fired during sim] | [REPLACE: 12] | [REPLACE: brief context] |
| [REPLACE: e.g., False positive rate] | [REPLACE: 8%] | [REPLACE: brief context] |

---

## 📝 My Lab Notes

> 💡 Your raw notes — keep this section if you want to show your thought process. Recruiters love seeing how you think, not just the polished result.

\`\`\`
${userNotes}
\`\`\`

---

## 📸 Screenshots

> 💡 Drop your PNG/JPG files into the \`screenshots/\` folder using the exact filenames below.
> See \`screenshots/README.md\` for tips on capturing good screenshots.

${screenshotTable}

---

## 🎯 MITRE ATT&CK Mapping

> 💡 These techniques typically apply to this kind of lab. Edit the "How it appeared" column with what *you* saw, and delete any rows that don't fit.

${attackTable}

---

## ✅ Key Takeaways

${takeaways}

---

## 🚨 Mistakes I Made / Lessons Learned

> 💡 Recruiters love this section. Showing reflection = showing maturity.

- [REPLACE: Mistake or stumble #1 — what tripped you up?]
- [REPLACE: How you solved it]
- [REPLACE: What you'll do differently next time]

---

## 📚 Suggested Next Projects

> 💡 Already in mind? Replace these. Otherwise leave as-is.

${tmpl.nextProjects.map((p) => `- ${p}`).join("\n")}

---

## 🔗 References

- [Lab on ${platform.name}](${platform.url})
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- [REPLACE: any blog post, video, or doc that helped you complete this lab]

---

## 👤 About Me

I'm **${userName}**, a cybersecurity student building public proof-of-skill through hands-on labs.

- 🌐 GitHub: [@${handle}](https://github.com/${handle})
- 📂 More projects: see my [pinned repositories](https://github.com/${handle})
- 💼 [REPLACE: LinkedIn URL if you want to add one]

---

## 📝 License

MIT — see [LICENSE](LICENSE).

---

> 🛠️ Scaffold generated with **Portfolio Forge** — content authored by ${userName}.
> Every \`[REPLACE: ...]\` slot was filled in by hand. See \`PLACEHOLDERS.md\` for a complete checklist.
`;
}

/* =========================================================================
 *  PLACEHOLDERS.md
 * ========================================================================= */
function buildPlaceholderChecklist({ tmpl }) {
  return `# ✅ Placeholder Checklist

Every \`[REPLACE: ...]\` slot in your README, in one place. Tick them off as you go.

---

## 🖼️ Top of README

- [ ] **Cover image** — replace \`screenshots/cover.png\` with a screenshot of your lab
- [ ] Confirm the project title at the top is accurate (the generator may have guessed)

## 📘 Introduction
- [ ] Paragraph 1: the scenario / context of the lab
- [ ] Paragraph 2: your role and what you were trying to accomplish

## 🎯 Objectives
- [ ] Replace the starter objectives with the actual ones from the lab page

## 🧰 Tools & Techniques Used
- [ ] Fill in the "Purpose" column with what *you* used each tool for
- [ ] Add or remove rows as needed

## 🏗️ Architecture
- [ ] Draw a diagram and save it as \`diagrams/architecture.png\`
- [ ] Write the 1–2 sentence description below the diagram

## 🪜 Walkthrough — for each of the 4 steps:
- [ ] Step 1: Setup & Initial Observations
- [ ] Step 2: Main Investigation / Configuration
- [ ] Step 3: Validation & Results
- [ ] Step 4: Cleanup & Reflection

> 💡 Each step has 3 placeholder bullets + a code block. Fill them in OR delete the bullets you don't need.

## 📊 Key Data / Results
- [ ] Fill in the data table — OR delete the whole section if your lab wasn't data-heavy

## 📝 My Lab Notes
- [ ] Either keep the auto-filled notes or paste in a longer version

## 📸 Screenshots — capture these
- [ ] \`screenshots/cover.png\` — the hero image at the top
${tmpl.screenshots.map((s) => `- [ ] \`screenshots/${s[0]}\` — ${s[1]}`).join("\n")}

## 🎯 MITRE ATT&CK Mapping
- [ ] Edit each row's "How it appeared" column for your specific lab
- [ ] Delete rows that don't apply

## 🚨 Mistakes I Made
- [ ] Mistake or stumble
- [ ] How you solved it
- [ ] What you'd do differently

## 🔗 References
- [ ] Add any helpful blog posts, videos, or docs

## 👤 About Me
- [ ] Your name (if you didn't enter it during generation)
- [ ] GitHub handle
- [ ] LinkedIn URL (optional)

---

## 🔎 Final search: find any remaining placeholders

Before publishing, open your README in any text editor and **Ctrl+F (Cmd+F) for**:

\`\`\`
[REPLACE:
\`\`\`

If anything matches, you missed a spot. There should be **zero** results when you're done.

---

> 💡 Pro tip: after filling everything in, also check for \`💡\` tip blockquotes. They're helpful while writing but **delete them before publishing** so the README reads cleanly. Search for \`> 💡\` and delete those lines.
`;
}

/* =========================================================================
 *  Supporting files
 * ========================================================================= */

function buildUploadGuide({ repoSlug, handle }) {
  return `# 🚀 How to Upload This to GitHub (Beginner Guide)

You've got a folder full of files. Let's get it onto GitHub — no coding required.

**Total time: ~5 minutes** (after you fill in the placeholders).

---

## Step 1 — Make a GitHub account (skip if you have one)

1. Go to [github.com/signup](https://github.com/signup)
2. Pick a username close to your real name — recruiters search for you
3. Verify your email

---

## Step 2 — Fill in your README **first**, before uploading

Open \`README.md\` in any text editor (Notepad, TextEdit, or [VS Code](https://code.visualstudio.com/) for syntax highlighting).

Search for \`[REPLACE:\` and fill in each slot. Use \`PLACEHOLDERS.md\` as your checklist.

> ⚠️ **Don't upload until every placeholder is replaced.** A README with visible \`[REPLACE: ...]\` text is worse than no README at all.

---

## Step 3 — Create a new repository

1. Click the **+** at the top right of GitHub → **New repository**
2. **Repository name:** \`${repoSlug}\`
3. **Public** ✅
4. ❌ Don't check "Add a README file" (we have our own)
5. Click **Create repository**

---

## Step 4 — Upload your files

1. On the empty repo page, click **uploading an existing file** (or **Add file** → **Upload files**)
2. From your unzipped folder, **select everything inside it** (Ctrl+A / Cmd+A) and drag it into the GitHub upload area
3. Wait for green checkmarks ✅
4. Commit message: \`Initial portfolio commit\`
5. Click **Commit changes**

---

## Step 5 — Add screenshots

1. Click the \`screenshots\` folder → **Add file** → **Upload files**
2. Drag your PNG/JPG files in
3. **Use the exact filenames** referenced in the README (case-sensitive!)
4. Commit

---

## Step 6 — Pin to your profile

1. Go to \`github.com/${handle}\`
2. Click **Customize your pins**
3. Check this new repo → Save

---

## 🆘 Folder fix (if folders flatten on upload)

If files like \`style.css\` end up at the top level instead of inside \`css/\`:

1. Click the misplaced file
2. Click the pencil ✏️ to edit
3. Change the filename from \`style.css\` to \`css/style.css\`
4. Commit. GitHub auto-creates the folder.

---

> Made it through? You now have a public, recruiter-ready portfolio project. 🎉
`;
}

function buildLinkedInPost({ tmpl, platform }) {
  return `# 🔗 LinkedIn Post (Ready to Customize)

Below are three variants. Pick whichever fits your voice. **Replace the [REPLACE: ...] slots** before posting.

---

## Variant 1 — Direct & Professional

🛡️ Just wrapped up a hands-on lab on **${platform.name}**: *${tmpl.title}*.

What I worked on:
• [REPLACE: thing 1 you did]
• [REPLACE: thing 2 you did]
• [REPLACE: thing 3 you did]

Tools used: [REPLACE: 4–5 of the most important tools from your lab]

Biggest takeaway: [REPLACE: one sentence on what surprised or challenged you most].

Full writeup with screenshots and MITRE mappings → [REPLACE: your GitHub repo URL]

#Cybersecurity #BlueTeam #${platform.name.replace(/\s+/g, "")} #PortfolioProject #LearningInPublic

---

## Variant 2 — Story-Driven (more engagement)

A few weeks ago I couldn't have told you what *[REPLACE: a specific concept from your lab]* really meant.

Today I finished a hands-on lab on **${platform.name}** where I had to actually do it — not just read about it.

What I built / broke / learned:
→ [REPLACE: outcome 1]
→ [REPLACE: outcome 2]
→ Mapped everything to MITRE ATT&CK so I understand the *why*, not just the *how*

The lesson I'll carry forward: [REPLACE: one human, honest insight].

Sharing the full writeup so other beginners can see what this looks like in practice 👇
[REPLACE: your GitHub repo URL]

#Cybersecurity #LearningInPublic #BlueTeam

---

## Variant 3 — Short & Punchy

New project up. 🛡️

✅ ${platform.name} lab complete
✅ [REPLACE: skill 1]
✅ [REPLACE: skill 2]
✅ MITRE ATT&CK mapped
✅ Documented end-to-end

Recruiter-ready writeup → [REPLACE: GitHub URL]

#Cybersecurity #${platform.name.replace(/\s+/g, "")} #Portfolio

---

## 📌 Posting tips

1. Weekday business hours (10am–2pm in your timezone) gets best reach
2. **Don't lead with the link** — LinkedIn deprioritizes link posts. Put the URL near the bottom on its own line.
3. Add one screenshot from your lab as the post image — visuals 5x engagement
4. Reply to every comment in the first hour (algorithm boost)
5. Tag the platform's official LinkedIn page — they often reshare student work
`;
}

function buildResumeBullets({ tmpl }) {
  return `# 💼 Resume Bullets — Starting Points

These are **structural starting points**. The [REPLACE: ...] slots are where you make them specific — that's what turns a generic bullet into a job-winning one.

---

## Standard

${tmpl.resumeBullets.map((b) => `- ${b} — **[REPLACE: add a specific outcome, number, or skill]**`).join("\n")}

---

## Punchy (shorter, for tight resume space)

${tmpl.resumeBullets.map((b) => `- ${shortenBullet(b)} **[REPLACE: + 1 specific result]**`).join("\n")}

---

## ✏️ How to make these recruiter-magnetic

1. **Add a number wherever possible.** "Wrote 12 KQL detection rules" beats "Wrote KQL detection rules."
2. **Lead with the action verb.** Built, deployed, investigated, detected, automated, hardened.
3. **End with the outcome.** "...resulting in X" or "...demonstrating Y skill"
4. **Match the job description's keywords.** If a job says "SIEM," use "SIEM" — not just "Splunk."

---

## 📋 Where to put these

- **Projects** section of your resume (preferred for students)
- **Skills** section (as supporting evidence)
- **LinkedIn → Featured** (link to the GitHub repo)
- **Cover letter** (paraphrased, not copy-pasted)
`;
}

function buildArtifactChecklist({ tmpl }) {
  const screenshots = tmpl.screenshots.map((s) => `- [ ] \`screenshots/${s[0]}\` — ${s[1]}`).join("\n");

  return `# 📦 Artifact Checklist

Use this before publishing to make sure nothing's missing.

---

## 📸 Screenshots to capture

- [ ] \`screenshots/cover.png\` — the **main hero image** for the top of your README
${screenshots}

---

## 📂 Other artifacts (as applicable)

- [ ] \`diagrams/architecture.png\` — visual of the lab setup (use Excalidraw or draw.io)
- [ ] \`queries/\` — KQL / SPL / SQL queries you wrote
- [ ] \`scripts/\` — scripts you ran or modified
- [ ] \`evidence/\` — exported logs, PCAPs, proof of work
- [ ] \`certificates/\` — completion certificate (PNG, JPG, or PDF)
- [ ] \`notes/raw-notes.md\` — your unpolished notes (great for showing process)

---

## 📄 Polish items

- [ ] README.md fully filled in (zero \`[REPLACE: ...]\` left — search to confirm)
- [ ] All \`> 💡\` tip blocks deleted from README before publishing
- [ ] All screenshots show up (no broken image links)
- [ ] Architecture diagram added
- [ ] Resume bullets reviewed and personalized
- [ ] LinkedIn post variant chosen and posted
- [ ] Repo topics added on GitHub (cybersecurity, etc.)
- [ ] Repo pinned to your profile

---

## ⚠️ Safety checklist (BEFORE pushing public)

- [ ] No real credentials, API keys, or tokens anywhere
- [ ] No personal data (your home IP, real names of bystanders, etc.)
- [ ] No screenshots showing sensitive customer / employer data
- [ ] No content violating the lab platform's terms of service
- [ ] If the lab is part of an exam (OSCP, etc.), confirm you're allowed to publish
`;
}

function buildPromptLibrary({ tmpl, platform }) {
  return `# 🤖 Reusable AI Prompts

When you want to extend or polish this portfolio, paste these into ChatGPT, Claude, or any AI assistant.

---

## 1. Polish my README

> I just wrote this README for a cybersecurity portfolio project. Suggest 5 specific improvements that would make it stronger for a recruiter scanning it in 30 seconds. Be specific about which sentences to change.
>
> [paste your README]

---

## 2. Generate more resume bullets

> Based on this lab I completed (paste your README), write 6 additional resume bullets. Use strong action verbs, include outcomes, and tailor them for a SOC Analyst role.

---

## 3. Explain my architecture diagram

> I built a lab using ${platform.name}. Help me write a 3-paragraph architecture explanation suitable for a portfolio README. Cover: components used, how data flows, and which security controls are demonstrated.
>
> Lab notes: [paste your notes]

---

## 4. Write detection logic

> Based on this attack technique: ${tmpl.attackMappings[0][1]} (${tmpl.attackMappings[0][0]}), write a detection rule in ${platform.name === "Splunk" ? "SPL" : "KQL"}. Include comments explaining each line.

---

## 5. Interview prep — STAR stories

> Turn this project into 3 STAR-format interview stories (Situation, Task, Action, Result). Each should be 60–90 seconds spoken. Project: [paste README].

---

## 6. Turn the project into a blog post

> I want to turn this GitHub project into a Medium / Dev.to blog post for beginners. Write a draft (~800 words) with: hook intro, what I learned, the walkthrough, and a "what's next" closer.

---

## 7. LinkedIn engagement post

> Write me a short LinkedIn post (under 150 words) about completing this project. Tone: confident but humble. Audience: cybersecurity recruiters and other learners. End with a question that drives comments.
`;
}

function buildNotesSeed({ ctx, platform }) {
  const userNotes = ctx.notes && ctx.notes.trim()
    ? ctx.notes.trim()
    : "_Add your raw notes here as you go. Don't worry about polish — this is your scratch pad._";

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
[paste anything useful here as you go]
\`\`\`

---

## Things that confused me

- _Add anything you got stuck on. Future-you will be grateful._

---

## Aha moments

- _Little realizations that clicked while doing the lab. Gold for blog posts later._
`;
}

function buildArchitectureDoc({ platform }) {
  return `# 🏗️ Architecture

Describe the components and data flow of your lab. Then create a diagram and save it as \`architecture.png\` in this folder.

---

## Components

- [REPLACE: each major component — VMs, services, log sources]

## Data flow

1. [REPLACE: step 1 of how data moves]
2. [REPLACE: step 2]
3. [REPLACE: step 3]

## Security controls demonstrated

- [REPLACE: control 1: what it does, why it matters]
- [REPLACE: control 2]

---

## 🎨 How to draw the diagram (free, no signup)

**Option 1 — [Excalidraw](https://excalidraw.com/)** (hand-drawn feel)
**Option 2 — [draw.io](https://app.diagrams.net/)** (more polished)
**Option 3 — Mermaid (lives right in markdown)**:

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

## Header template for each query file

\`\`\`
// Detection: [REPLACE: what this detects]
// MITRE: [REPLACE: T-number — name]
// Source: [REPLACE: data table / log type it needs]
// FP: [REPLACE: known false-positive scenarios]
\`\`\`
`;
}

function buildScreenshotsReadme({ tmpl }) {
  return `# 📸 Screenshots

Drop your PNG / JPG screenshots here. Filenames must match the README **exactly** (case-sensitive).

## Suggested captures

- \`cover.png\` — main hero image for top of README
${tmpl.screenshots.map((s) => `- \`${s[0]}\` — ${s[1]}`).join("\n")}

## 📐 Tips

- Use **PNG** for UI screenshots, **JPG** for photos
- Keep each file under 1 MB ([TinyPNG](https://tinypng.com/) compresses for free)
- Crop to remove personal info
- For terminal output, [Carbon](https://carbon.now.sh/) makes it look gorgeous
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

# Logs
*.log

# Secrets — NEVER commit
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

/* ---------- helpers ---------- */
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function shortenBullet(b) {
  return b.replace(/demonstrating .*$/, "").replace(/ in GitHub portfolio$/, "").replace(/ with documented .*$/, "").trim().replace(/[.,]$/, "");
}

window.PortfolioForge = window.PortfolioForge || {};
window.PortfolioForge.generatePortfolioFiles = generatePortfolioFiles;
