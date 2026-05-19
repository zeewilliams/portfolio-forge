/**
 * templates.js — content templates for each platform.
 *
 * Each template returns the data that fills the README + other files.
 * Templates are pure functions — no DOM, no network.
 *
 * Context shape passed in:
 *   { url, userName, githubHandle, notes, hints, platformName }
 */

const TEMPLATES = {
  // ============================================================
  // TryHackMe
  // ============================================================
  tryhackme: (ctx) => ({
    title: `${ctx.hints.title || "TryHackMe Room"} — Walkthrough & Notes`,
    tagline: "TryHackMe room writeup with methodology, tools, and lessons learned.",
    objectives: [
      "Enumerate the target system using common reconnaissance tools",
      "Identify and exploit vulnerabilities in the target environment",
      "Capture user and root flags to complete the room",
      "Document findings in a clear, reproducible writeup"
    ],
    tools: ["Nmap", "Gobuster / Dirb", "Burp Suite", "Metasploit", "Linux command line", "TryHackMe AttackBox"],
    concepts: ["Network reconnaissance", "Service enumeration", "Vulnerability exploitation", "Privilege escalation", "Post-exploitation"],
    attackMappings: [
      ["TA0043", "Reconnaissance", "Active scanning of target services"],
      ["TA0001", "Initial Access", "Exploitation of public-facing application"],
      ["TA0004", "Privilege Escalation", "Abuse of misconfigured permissions"],
      ["T1059", "Command and Scripting Interpreter", "Use of shell access for execution"]
    ],
    screenshots: [
      ["nmap-scan.png", "Initial Nmap scan revealing open ports"],
      ["enumeration.png", "Service / directory enumeration results"],
      ["exploit.png", "Successful exploitation step"],
      ["user-flag.png", "User flag captured"],
      ["root-flag.png", "Root / system flag captured"]
    ],
    resumeBullets: [
      `Completed ${ctx.hints.title || "TryHackMe room"} demonstrating offensive security methodology end-to-end`,
      "Performed network and service enumeration using Nmap and directory brute-forcing tools",
      "Documented exploitation chain and remediation recommendations in GitHub portfolio",
      "Mapped attack chain to MITRE ATT&CK tactics and techniques"
    ],
    learnings: [
      "How to approach an unknown target system methodically",
      "The importance of thorough enumeration before exploitation",
      "How small misconfigurations chain into full system compromise",
      "Why clear documentation is as valuable as the technical work itself"
    ],
    nextProjects: [
      "Attempt a harder room in the same skill path",
      "Try the same techniques on a Hack The Box machine",
      "Build a detection rule for the exploited vulnerability",
      "Write a blog post explaining the room in your own words"
    ]
  }),

  // ============================================================
  // Hack The Box
  // ============================================================
  hackthebox: (ctx) => ({
    title: `${ctx.hints.title || "HTB Machine"} — Penetration Test Writeup`,
    tagline: "Hack The Box machine writeup covering enumeration, exploitation, and privilege escalation.",
    objectives: [
      "Conduct full reconnaissance of the target machine",
      "Identify exploitable services and misconfigurations",
      "Gain initial foothold via identified vulnerability",
      "Escalate privileges from user to root/system",
      "Capture both flags and document the attack path"
    ],
    tools: ["Nmap", "Gobuster", "Burp Suite", "LinPEAS / WinPEAS", "Metasploit", "Python exploit scripts", "Kali Linux"],
    concepts: ["Active reconnaissance", "Exploit development", "Lateral movement", "Privilege escalation", "Pivoting"],
    attackMappings: [
      ["TA0043", "Reconnaissance", "Port and service scanning"],
      ["TA0001", "Initial Access", "Exploitation of vulnerable service"],
      ["TA0002", "Execution", "Command execution via exploit"],
      ["TA0004", "Privilege Escalation", "Kernel exploit or misconfig abuse"],
      ["TA0007", "Discovery", "Host and account enumeration"]
    ],
    screenshots: [
      ["recon-nmap.png", "Nmap service version scan"],
      ["web-enum.png", "Web application enumeration"],
      ["foothold.png", "Initial foothold / reverse shell"],
      ["priv-esc.png", "Privilege escalation moment"],
      ["root-proof.png", "Root flag and proof of compromise"]
    ],
    resumeBullets: [
      `Pwned ${ctx.hints.title || "HTB machine"} demonstrating full kill-chain penetration testing skills`,
      "Chained service misconfiguration with privilege escalation to achieve root access",
      "Documented full attack path with screenshots and command output for portfolio",
      "Mapped each step to MITRE ATT&CK framework tactics"
    ],
    learnings: [
      "Real attackers spend most of their time on enumeration, not exploitation",
      "Privilege escalation often comes down to one small misconfig",
      "Note-taking discipline matters more than tool knowledge",
      "Why blue teams need to understand the offensive perspective"
    ],
    nextProjects: [
      "Try a harder HTB box in the same category",
      "Write detection rules for the techniques you used",
      "Build a SIEM lab to detect the same attack chain",
      "Attempt the OSCP exam-style writeup format"
    ]
  }),

  // ============================================================
  // Pluralsight
  // ============================================================
  pluralsight: (ctx) => ({
    title: `${ctx.hints.title || "Pluralsight Cybersecurity Lab"} — Hands-On Project`,
    tagline: "Hands-on cybersecurity lab from Pluralsight with implementation notes and outcomes.",
    objectives: [
      "Complete the guided hands-on lab from start to finish",
      "Demonstrate practical application of the security concepts taught",
      "Configure and validate the security control or detection",
      "Document the process for future reference and portfolio"
    ],
    tools: ["Pluralsight Hands-On Sandbox", "Cloud console (Azure / AWS / GCP)", "PowerShell / Bash", "Browser developer tools"],
    concepts: ["Cloud security configuration", "Identity & access management", "Logging and monitoring", "Detection engineering"],
    attackMappings: [
      ["TA0006", "Credential Access", "Common credential attack patterns covered in lab"],
      ["TA0007", "Discovery", "Resource enumeration techniques"],
      ["TA0005", "Defense Evasion", "Concepts around detecting evasion attempts"]
    ],
    screenshots: [
      ["lab-environment.png", "Lab environment overview"],
      ["configuration.png", "Key configuration step"],
      ["validation.png", "Validating the control works"],
      ["completion.png", "Lab completion screen"]
    ],
    resumeBullets: [
      `Completed Pluralsight hands-on cybersecurity lab: ${ctx.hints.title || "lab"}`,
      "Applied lab concepts in a real cloud environment with documented outcomes",
      "Built portfolio writeup with screenshots, configuration notes, and lessons learned"
    ],
    learnings: [
      "Bridging theory to practice in a sandboxed environment",
      "How production-style configurations differ from documentation examples",
      "Why structured note-taking accelerates the learning curve"
    ],
    nextProjects: [
      "Replicate the lab in your own free-tier cloud account",
      "Add monitoring/alerting on top of the lab outcome",
      "Take a related Pluralsight skill assessment",
      "Build a more complex lab combining these skills"
    ]
  }),

  // ============================================================
  // LetsDefend
  // ============================================================
  letsdefend: (ctx) => ({
    title: `${ctx.hints.title || "LetsDefend SOC Challenge"} — Incident Response Walkthrough`,
    tagline: "Blue team SOC challenge from LetsDefend covering alert triage, investigation, and response.",
    objectives: [
      "Triage incoming SIEM alert and determine validity",
      "Investigate logs, endpoints, and network traffic for IOCs",
      "Build an incident timeline and identify the attack chain",
      "Document findings and recommend containment / remediation"
    ],
    tools: ["LetsDefend SOC platform", "SIEM (simulated)", "EDR console", "Email analysis tools", "VirusTotal", "Hybrid Analysis"],
    concepts: ["Alert triage", "Log analysis", "Endpoint forensics", "Network forensics", "Incident documentation"],
    attackMappings: [
      ["TA0001", "Initial Access", "Common vectors investigated (phishing, exploit)"],
      ["TA0002", "Execution", "Process and command-line execution analysis"],
      ["TA0011", "Command and Control", "C2 traffic detection and analysis"],
      ["TA0010", "Exfiltration", "Data exfiltration indicators"]
    ],
    screenshots: [
      ["alert-detail.png", "Initial SIEM alert details"],
      ["timeline.png", "Attack timeline reconstruction"],
      ["ioc-analysis.png", "IOC analysis and pivoting"],
      ["closing-report.png", "Incident closing report"]
    ],
    resumeBullets: [
      `Resolved LetsDefend SOC challenge: ${ctx.hints.title || "incident"} from alert to closure`,
      "Performed end-to-end alert triage including log review, IOC pivoting, and endpoint investigation",
      "Built incident timeline and produced analyst-grade closing report",
      "Mapped attacker actions to MITRE ATT&CK techniques"
    ],
    learnings: [
      "Alert fatigue is real — prioritization is a skill, not a tool",
      "Timelines are the analyst's most valuable artifact",
      "Pivoting on IOCs reveals scope faster than tunnel-vision investigation",
      "Clear written reports matter more than fancy dashboards"
    ],
    nextProjects: [
      "Build the same detection rule in your own Splunk / Sentinel lab",
      "Practice writing detection logic for the technique you investigated",
      "Take on a harder LetsDefend incident",
      "Set up a home honeypot to generate your own alerts"
    ]
  }),

  // ============================================================
  // Splunk
  // ============================================================
  splunk: (ctx) => ({
    title: `Splunk SIEM Lab — ${ctx.hints.title || "Detection Engineering Project"}`,
    tagline: "Hands-on Splunk lab covering SPL queries, dashboards, and detection rule development.",
    objectives: [
      "Ingest sample security data into Splunk",
      "Write SPL queries to identify suspicious activity",
      "Build dashboards visualizing security posture",
      "Create alerts and saved searches for detection"
    ],
    tools: ["Splunk Enterprise / Free", "SPL (Search Processing Language)", "Sample datasets (BOTS, sysmon logs)", "Splunk dashboards"],
    concepts: ["SIEM fundamentals", "SPL query writing", "Detection engineering", "Dashboard design", "Log source onboarding"],
    attackMappings: [
      ["T1110", "Brute Force", "Detect repeated failed login attempts"],
      ["T1078", "Valid Accounts", "Anomalous account usage detection"],
      ["T1059", "Command and Scripting Interpreter", "Suspicious command-line execution"],
      ["T1071", "Application Layer Protocol", "C2 traffic over HTTP/HTTPS"]
    ],
    screenshots: [
      ["splunk-home.png", "Splunk home / app navigation"],
      ["spl-query.png", "Key SPL query with results"],
      ["dashboard.png", "Custom security dashboard"],
      ["alert-config.png", "Alert / saved search configuration"]
    ],
    resumeBullets: [
      "Built Splunk SIEM lab with custom SPL detections and analyst dashboards",
      "Wrote detection logic for brute-force, lateral movement, and C2 indicators",
      "Demonstrated end-to-end SIEM workflow: ingest → search → alert → dashboard",
      "Documented detection rules with MITRE ATT&CK mappings"
    ],
    learnings: [
      "SPL syntax becomes muscle memory faster than expected",
      "Good detections start from the attacker behavior, not from the data",
      "Dashboards should answer questions, not display everything you have",
      "Tuning is 80% of the job — false positives kill SOC morale"
    ],
    nextProjects: [
      "Add a new log source and write detections against it",
      "Convert your SPL rules to Sigma format for portability",
      "Build a SOAR-style playbook around one detection",
      "Try the Splunk BOTS (Boss of the SOC) dataset"
    ]
  }),

  // ============================================================
  // Azure
  // ============================================================
  azure: (ctx) => ({
    title: `Azure ${ctx.hints.kind === "sentinel" ? "Sentinel SOC" : "Cloud Security"} Lab — Hands-On Project`,
    tagline: "Azure cloud security lab covering Sentinel, Defender, and detection engineering.",
    objectives: [
      "Deploy and configure a Microsoft Sentinel workspace",
      "Onboard data sources (Windows Event Logs, sign-in logs, etc)",
      "Write KQL analytics rules for common attack patterns",
      "Visualize detections in Sentinel workbooks",
      "Simulate attacks and validate detection coverage"
    ],
    tools: ["Microsoft Azure portal", "Microsoft Sentinel", "Log Analytics Workspace", "KQL (Kusto Query Language)", "Microsoft Defender", "Azure AD / Entra ID"],
    concepts: ["Cloud SIEM architecture", "Data ingestion and connectors", "KQL query writing", "Analytics rules", "Incident management", "Workbook visualization"],
    attackMappings: [
      ["T1110", "Brute Force", "KQL rule detecting repeated failed sign-ins"],
      ["T1078", "Valid Accounts", "Detect impossible-travel sign-ins"],
      ["T1486", "Data Encrypted for Impact", "Ransomware indicator detection"],
      ["T1098", "Account Manipulation", "Privileged role assignment alerts"]
    ],
    screenshots: [
      ["sentinel-overview.png", "Sentinel workspace overview"],
      ["data-connectors.png", "Connected data sources"],
      ["kql-query.png", "KQL analytics rule with results"],
      ["incident.png", "Generated incident from analytics rule"],
      ["workbook.png", "Custom Sentinel workbook"]
    ],
    resumeBullets: [
      "Built end-to-end Azure Sentinel SOC lab with custom KQL detections",
      "Onboarded Windows, Azure AD, and Office 365 log sources via Sentinel connectors",
      "Authored analytics rules mapped to MITRE ATT&CK for brute-force, anomalous sign-in, and privilege escalation",
      "Designed Sentinel workbook visualizing detection coverage and incident trends"
    ],
    learnings: [
      "Cloud SIEMs eliminate infrastructure pain but introduce cost-tuning challenges",
      "KQL is more powerful than it looks — joins and let-statements unlock advanced detections",
      "Data connectors are 80% of the work; queries are the easy part",
      "Workbooks are where your work becomes visible to non-analyst stakeholders"
    ],
    nextProjects: [
      "Add MITRE ATT&CK Sentinel solution and tune rule coverage",
      "Integrate Defender for Endpoint and write cross-product detections",
      "Build a Logic App / Playbook to auto-respond to one alert type",
      "Onboard a new data source and write 3 detections against it"
    ]
  }),

  // ============================================================
  // AWS
  // ============================================================
  aws: (ctx) => ({
    title: `AWS Cloud Security Lab — ${ctx.hints.title || "Hands-On Project"}`,
    tagline: "AWS cloud security lab covering IAM, GuardDuty, CloudTrail, and detection engineering.",
    objectives: [
      "Configure AWS account security baselines (IAM, MFA, CloudTrail)",
      "Enable threat detection services (GuardDuty, Security Hub)",
      "Investigate simulated security findings",
      "Build automated response with EventBridge + Lambda",
      "Document the secure architecture and detection coverage"
    ],
    tools: ["AWS Console", "AWS CLI", "IAM", "GuardDuty", "CloudTrail", "Security Hub", "EventBridge", "Lambda", "S3"],
    concepts: ["Cloud IAM least privilege", "Threat detection in cloud", "Log aggregation", "Automated response", "Shared responsibility model"],
    attackMappings: [
      ["T1078.004", "Valid Accounts: Cloud Accounts", "Compromised IAM credential detection"],
      ["T1526", "Cloud Service Discovery", "API call enumeration in CloudTrail"],
      ["T1098.001", "Additional Cloud Credentials", "Suspicious access key creation"],
      ["T1530", "Data from Cloud Storage", "Unusual S3 access patterns"]
    ],
    screenshots: [
      ["iam-baseline.png", "IAM users, MFA, and password policy"],
      ["guardduty-findings.png", "GuardDuty findings dashboard"],
      ["cloudtrail-event.png", "Suspicious CloudTrail event"],
      ["automated-response.png", "Lambda response function triggered"]
    ],
    resumeBullets: [
      "Built AWS cloud security lab with IAM hardening, GuardDuty detection, and automated response",
      "Configured CloudTrail + EventBridge + Lambda pipeline for real-time threat response",
      "Investigated simulated cloud attack scenarios with full IR documentation",
      "Mapped detections to MITRE ATT&CK Cloud matrix"
    ],
    learnings: [
      "IAM is the single biggest risk surface in AWS — least privilege is non-negotiable",
      "GuardDuty's value scales with the breadth of your AWS footprint",
      "Detection without automated response leaves you with a 3am pager problem",
      "CloudTrail is the foundation of any AWS investigation"
    ],
    nextProjects: [
      "Extend with AWS Config rules for compliance drift detection",
      "Add a CloudWatch Logs + Athena pipeline for ad-hoc threat hunting",
      "Build a multi-account organizational baseline with Control Tower",
      "Replicate the same controls in Azure for multi-cloud comparison"
    ]
  }),

  // ============================================================
  // GCP
  // ============================================================
  gcp: (ctx) => ({
    title: `Google Cloud Security Lab — ${ctx.hints.title || "Hands-On Project"}`,
    tagline: "GCP cloud security lab covering IAM, Cloud Logging, and Security Command Center.",
    objectives: [
      "Configure GCP project IAM with least-privilege roles",
      "Enable Cloud Audit Logs and Security Command Center",
      "Build detection queries in Cloud Logging",
      "Respond to simulated SCC findings",
      "Document the security baseline"
    ],
    tools: ["Google Cloud Console", "gcloud CLI", "Cloud IAM", "Security Command Center", "Cloud Logging", "Cloud Functions"],
    concepts: ["GCP IAM model", "Resource hierarchy security", "Audit logging", "Findings management", "Automated response"],
    attackMappings: [
      ["T1078.004", "Valid Accounts: Cloud Accounts", "Service account abuse detection"],
      ["T1098", "Account Manipulation", "Suspicious IAM role binding"],
      ["T1526", "Cloud Service Discovery", "Audit log anomaly detection"]
    ],
    screenshots: [
      ["scc-findings.png", "Security Command Center findings"],
      ["iam-policy.png", "IAM policy configuration"],
      ["log-query.png", "Cloud Logging detection query"],
      ["response.png", "Automated response execution"]
    ],
    resumeBullets: [
      "Built GCP security lab with IAM hardening and Security Command Center detection coverage",
      "Wrote Cloud Logging queries for anomalous service account activity",
      "Configured automated response with Cloud Functions for high-severity findings",
      "Documented full GCP security baseline aligned with CIS benchmarks"
    ],
    learnings: [
      "GCP's resource hierarchy makes org-wide policy enforcement easier than AWS",
      "Service account keys are the most common GCP compromise vector",
      "Cloud Logging's query language is approachable for analysts new to GCP",
      "SCC findings need tuning just like any other detection product"
    ],
    nextProjects: [
      "Add Chronicle (Google SecOps) for advanced threat hunting",
      "Build org-policy constraints for preventive controls",
      "Extend to multi-cloud with corresponding AWS/Azure detections",
      "Implement BeyondCorp-style access for a sample workload"
    ]
  }),

  // ============================================================
  // Coursera
  // ============================================================
  coursera: (ctx) => ({
    title: `${ctx.hints.title || "Coursera Cybersecurity Course"} — Capstone Notes`,
    tagline: "Course notes and capstone deliverable from Coursera cybersecurity coursework.",
    objectives: [
      "Complete all course modules with hands-on activities",
      "Apply key concepts to a capstone scenario",
      "Build artifacts demonstrating mastery of the material",
      "Document learning for portfolio reference"
    ],
    tools: ["Course-provided lab environment", "Various per-module tools"],
    concepts: ["Foundational cybersecurity concepts", "Risk and compliance", "Security operations", "Incident response", "Course-specific topics"],
    attackMappings: [
      ["TA0001", "Initial Access", "General concept coverage"],
      ["TA0006", "Credential Access", "Credential security covered in modules"],
      ["TA0007", "Discovery", "Enumeration concept coverage"]
    ],
    screenshots: [
      ["completion-cert.png", "Course completion certificate"],
      ["module-activity.png", "Key module activity / quiz"],
      ["capstone.png", "Capstone project deliverable"]
    ],
    resumeBullets: [
      `Completed ${ctx.hints.title || "Coursera cybersecurity course"} including hands-on capstone`,
      "Built portfolio artifacts demonstrating applied understanding of course material",
      "Documented learning outcomes and next-step plan for continued growth"
    ],
    learnings: [
      "Structured curriculum closes blind spots that ad-hoc learning leaves",
      "The capstone matters more than the certificate — it's what proves you can do the work",
      "Connecting concepts across modules is where real understanding clicks"
    ],
    nextProjects: [
      "Apply course concepts to a real CTF or lab platform",
      "Build a project specifically demonstrating the capstone topic",
      "Take the next course in the specialization",
      "Write a public blog post summarizing the key takeaways"
    ]
  }),

  // ============================================================
  // Generic fallback
  // ============================================================
  generic: (ctx) => ({
    title: `${ctx.hints.title || "Cybersecurity Lab"} — Portfolio Project`,
    tagline: "Hands-on cybersecurity lab with documented methodology, tools, and findings.",
    objectives: [
      "Complete the lab objectives end-to-end",
      "Document the methodology and tools used",
      "Capture evidence and key artifacts",
      "Reflect on lessons learned and next steps"
    ],
    tools: ["Lab-specific tools (see notes)", "Standard cybersecurity toolchain"],
    concepts: ["Hands-on application of cybersecurity concepts", "Methodology and documentation", "Evidence-based analysis"],
    attackMappings: [
      ["TA0043", "Reconnaissance", "Information gathering phase"],
      ["TA0001", "Initial Access", "Common entry techniques"],
      ["TA0004", "Privilege Escalation", "Elevation of privilege concepts"]
    ],
    screenshots: [
      ["overview.png", "Lab environment / objective overview"],
      ["work-in-progress.png", "Mid-lab progress capture"],
      ["completion.png", "Lab completion / final state"]
    ],
    resumeBullets: [
      "Completed hands-on cybersecurity lab with documented methodology and outcomes",
      "Produced portfolio writeup including screenshots, tooling, and lessons learned",
      "Mapped lab activities to relevant MITRE ATT&CK tactics"
    ],
    learnings: [
      "Hands-on practice cements concepts faster than passive learning",
      "Documentation discipline pays off when revisiting concepts later",
      "Every lab teaches something the syllabus didn't promise"
    ],
    nextProjects: [
      "Tackle a slightly harder lab in the same category",
      "Apply the techniques to a CTF or capture-the-flag scenario",
      "Write a public writeup or blog post",
      "Build a detection rule for techniques used in the lab"
    ]
  })
};

window.PortfolioForge = window.PortfolioForge || {};
window.PortfolioForge.TEMPLATES = TEMPLATES;
