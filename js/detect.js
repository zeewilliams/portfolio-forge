/**
 * detect.js — figures out which platform a URL belongs to,
 * and pulls hints (room name, lab slug, etc) where possible.
 *
 * No network calls — everything is pattern matching on the URL string.
 */

const PLATFORMS = {
  tryhackme: {
    name: "TryHackMe",
    template: "tryhackme",
    patterns: [/tryhackme\.com/i],
    extract: (url) => {
      const room = url.match(/\/room\/([a-zA-Z0-9_-]+)/);
      return room ? { slug: room[1], title: titleFromSlug(room[1]) } : {};
    }
  },
  hackthebox: {
    name: "Hack The Box",
    template: "hackthebox",
    patterns: [/hackthebox\.com/i, /hackthebox\.eu/i, /app\.hackthebox/i],
    extract: (url) => {
      const machine = url.match(/\/machines?\/([a-zA-Z0-9_-]+)/i);
      const academy = url.match(/\/module\/(\d+)/i);
      if (machine) return { slug: machine[1], title: titleFromSlug(machine[1]), kind: "machine" };
      if (academy) return { slug: `module-${academy[1]}`, title: `HTB Academy Module ${academy[1]}`, kind: "academy" };
      return {};
    }
  },
  pluralsight: {
    name: "Pluralsight",
    template: "pluralsight",
    patterns: [/pluralsight\.com/i],
    extract: (url) => {
      const lab = url.match(/\/labs\/([a-f0-9-]+)/i);
      const course = url.match(/\/courses\/([a-zA-Z0-9_-]+)/i);
      if (lab) return { slug: lab[1].slice(0, 8), title: "Pluralsight Hands-On Lab", kind: "lab" };
      if (course) return { slug: course[1], title: titleFromSlug(course[1]), kind: "course" };
      return { slug: "pluralsight-lab", title: "Pluralsight Lab" };
    }
  },
  letsdefend: {
    name: "LetsDefend",
    template: "letsdefend",
    patterns: [/letsdefend\.io/i],
    extract: (url) => {
      const ch = url.match(/\/challenges?\/([a-zA-Z0-9_-]+)/i);
      return ch ? { slug: ch[1], title: titleFromSlug(ch[1]) } : { slug: "letsdefend-lab", title: "LetsDefend SOC Lab" };
    }
  },
  splunk: {
    name: "Splunk",
    template: "splunk",
    patterns: [/splunk\.com/i, /boss-of-the-soc/i, /botsv\d/i],
    extract: (url) => ({ slug: "splunk-lab", title: "Splunk SIEM Lab" })
  },
  azure: {
    name: "Microsoft Azure",
    template: "azure",
    patterns: [/azure\.microsoft\.com/i, /learn\.microsoft\.com/i, /portal\.azure\.com/i, /sentinel/i],
    extract: (url) => {
      if (/sentinel/i.test(url)) return { slug: "azure-sentinel", title: "Azure Sentinel SOC Lab", kind: "sentinel" };
      if (/defender/i.test(url)) return { slug: "ms-defender", title: "Microsoft Defender Lab", kind: "defender" };
      return { slug: "azure-lab", title: "Azure Cloud Security Lab" };
    }
  },
  aws: {
    name: "AWS",
    template: "aws",
    patterns: [/aws\.amazon\.com/i, /awsworkshops/i, /skillbuilder\.aws/i, /aws\.training/i],
    extract: (url) => {
      if (/guardduty/i.test(url)) return { slug: "aws-guardduty", title: "AWS GuardDuty Lab", kind: "guardduty" };
      if (/iam/i.test(url)) return { slug: "aws-iam", title: "AWS IAM Security Lab", kind: "iam" };
      return { slug: "aws-lab", title: "AWS Cloud Security Lab" };
    }
  },
  gcp: {
    name: "Google Cloud",
    template: "gcp",
    patterns: [/cloud\.google\.com/i, /qwiklabs/i, /cloudskillsboost/i],
    extract: (url) => ({ slug: "gcp-lab", title: "Google Cloud Security Lab" })
  },
  coursera: {
    name: "Coursera",
    template: "coursera",
    patterns: [/coursera\.org/i],
    extract: (url) => {
      const course = url.match(/\/learn\/([a-zA-Z0-9_-]+)/i);
      return course ? { slug: course[1], title: titleFromSlug(course[1]) } : { slug: "coursera-course", title: "Coursera Cybersecurity Course" };
    }
  }
};

/** Convert kebab-or-snake slug into Title Case */
function titleFromSlug(slug) {
  if (!slug) return "";
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Main entry — given a URL string, return platform info + extracted hints.
 * Returns { id, name, template, hints } or null if no URL given.
 * Falls back to "generic" platform if URL doesn't match any known pattern.
 */
function detectPlatform(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  for (const [id, p] of Object.entries(PLATFORMS)) {
    if (p.patterns.some((re) => re.test(trimmed))) {
      return {
        id,
        name: p.name,
        template: p.template,
        hints: p.extract(trimmed) || {},
        url: trimmed
      };
    }
  }

  // Generic fallback
  return {
    id: "generic",
    name: "Generic Lab",
    template: "generic",
    hints: { slug: "cybersecurity-lab", title: "Cybersecurity Lab Project" },
    url: trimmed
  };
}

// Export to window for use in app.js
window.PortfolioForge = window.PortfolioForge || {};
window.PortfolioForge.detectPlatform = detectPlatform;
window.PortfolioForge.titleFromSlug = titleFromSlug;
