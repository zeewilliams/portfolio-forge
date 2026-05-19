# 🐣 Beginner's Guide: Get Portfolio Forge Live on the Internet

> No coding. No terminal. Just click and drag.
> By the end of this, you'll have a live, installable web app at your own URL.

**Total time: ~10 minutes.**

---

## 🧰 What you need

- A free [GitHub account](https://github.com/signup) — sign up first if you don't have one.
- A web browser. That's it.

You don't need:
- ❌ Git installed
- ❌ A terminal
- ❌ A code editor
- ❌ A credit card
- ❌ Programming knowledge

---

## Step 1 — Get the files onto your computer

If you already have the ZIP I generated for you:
1. Unzip it. You'll see a folder called `portfolio-forge`.
2. Open it. You should see files like `index.html`, `manifest.webmanifest`, folders called `css`, `js`, `assets`, etc.

Keep this folder open in a Finder/Explorer window — you'll drag from it in a minute.

---

## Step 2 — Create a new GitHub repository

1. Sign in to [github.com](https://github.com).
2. Click the **+** icon in the top-right corner → **New repository**.
3. Fill in:
   - **Repository name:** `portfolio-forge`
   - **Description:** `Turn cybersecurity lab URLs into portfolio repos. PWA.`
   - **Public** ✅ (must be public for free GitHub Pages hosting)
   - **Add a README file:** ❌ leave UNCHECKED (we already have one)
4. Click **Create repository**.

You'll land on an empty repo page that says "Quick setup."

---

## Step 3 — Upload the files

1. On that empty repo page, look for the line:
   > **uploading an existing file**
   
   Click it. (If you can't find it, the URL is `https://github.com/YOUR-USERNAME/portfolio-forge/upload/main`.)

2. You'll see a big drag-and-drop area that says **"Drag files here to add them to your repository."**

3. **From your unzipped folder**, select all the files and folders (Ctrl+A on Windows, Cmd+A on Mac) and **drag them into the GitHub upload area**.

   > ⚠️ Important: drag the **contents** of the `portfolio-forge` folder, not the folder itself. You want `index.html` to end up at the top level of your repo.

4. Wait for green checkmarks ✅ next to each file. This can take 30–60 seconds.

5. Scroll down. You'll see a "Commit changes" box.
   - Commit message: `Initial commit`
   - Click **Commit changes**.

You should now see all your files in the repo: `index.html`, `README.md`, `css/`, `js/`, etc.

---

## Step 4 — Turn on GitHub Pages (this is the magic part)

1. In your repo, click **Settings** (top-right of the repo nav bar).
2. In the left sidebar, scroll down and click **Pages**.
3. Under **Build and deployment**:
   - **Source:** select **Deploy from a branch**.
   - **Branch:** select **main** and folder **/ (root)**.
   - Click **Save**.

4. GitHub will say something like *"Your site is live at https://yourusername.github.io/portfolio-forge/"*.

5. ⏳ **Wait 1–2 minutes** for the first deployment. Refresh the Pages settings page until you see the green "Your site is live at..." message.

---

## Step 5 — Visit your site

Click the link GitHub shows you. Or type it into your browser:

```
https://YOUR-USERNAME.github.io/portfolio-forge/
```

🎉 You should see the dark terminal-style Portfolio Forge interface.

---

## Step 6 — Test it works

1. Paste any lab URL into the input. Try:
   ```
   https://tryhackme.com/room/picklerick
   ```
2. Add your name.
3. Click **./generate-portfolio**.
4. A ZIP should download. Unzip it and check the `README.md` inside — it should be a polished writeup.

---

## Step 7 — Install it as an app on your phone (optional)

This is what makes it a **PWA** — a Progressive Web App.

### On Android (Chrome)
1. Visit your site.
2. Tap the **⋮** menu → **Install app** or **Add to Home screen**.

### On iPhone (Safari)
1. Visit your site.
2. Tap the **Share** button → **Add to Home Screen**.

### On desktop (Chrome, Edge, Brave)
1. Visit your site.
2. Look for the **install icon** in the address bar (looks like a monitor with a down-arrow).
3. Click **Install**.

Now Portfolio Forge runs like a real app, even offline.

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| Site shows 404 | Wait another 2 minutes. First deploy takes time. Then hard-refresh (Ctrl+Shift+R). |
| Site looks unstyled (no green text, plain white) | The `css/` folder didn't upload. Re-upload it. |
| Generate button does nothing | Open browser console (F12). Most likely the JSZip CDN is blocked — check your network. |
| Install button never appears | Some browsers only show "Install" after you've visited the site twice in different sessions. |
| Page works but no ZIP downloads | Your browser might be blocking auto-downloads. Check the download bar / settings. |

---

## 🚀 Make it yours

After everything works, you can personalize:

1. **Change the title and branding**
   - Edit `index.html` → search for "Portfolio Forge" → replace with your name/brand.
   - Edit the `<title>` tag too.

2. **Pick a different color**
   - Edit `css/style.css` → find `--phosphor: #39ff7a;` → change to any hex color. The whole app re-themes.

3. **Add your own templates**
   - Edit `js/templates.js` → copy an existing platform block → modify objectives/tools/mappings for a new platform.

4. **Share it!**
   - Put the URL on your LinkedIn, your resume, in Discord communities for cyber students.

---

## 💡 Pro tip — custom domain

If you own a domain (like `yourname.com`):
1. In your repo: **Settings → Pages → Custom domain** → type your domain.
2. At your domain registrar, point a CNAME record at `yourusername.github.io`.

Now Portfolio Forge lives at `forge.yourname.com`. Free SSL included.

---

> Stuck on a step? Open an issue at the repo or ask in any cybersecurity Discord — beginners help beginners.
