# Developer Handoff Prompt

Copy everything below the line into Claude, Cursor, Copilot, or any AI coding assistant to pick up where we left off.

---

## Prompt

You are continuing a project to build an auto-updating AI CMO (Chief Marketing Officer) dashboard for Mark Miller Subaru. Here is the full context:

### Project Overview

We built a self-contained HTML dashboard (`index.html`) that displays live SEO audit data for markmillersubaru.com. It's a single-file React app (React 18 + Tailwind + Babel via CDN) with no build step — just open in a browser. All data is hardcoded in a DATA section near the top of the file.

### What Exists

- `index.html` — Full working dashboard with real scraped data from March 16, 2026
- `mm-subaru-ai-cmo.jsx` — The React source component for reference
- GitHub repo: `n8-mms/mm-subaru-cmo` (has only a README on `main` branch right now)

### What Needs to Happen Next

Complete these tasks in order:

#### 1. Push `index.html` to GitHub

```bash
cd /path/to/Daily\ Web\ Audit
git init
git remote add origin https://github.com/n8-mms/mm-subaru-cmo.git
git fetch origin
git checkout main
cp index.html .
git add index.html
git commit -m "Add AI CMO dashboard"
git push origin main
```

#### 2. Enable GitHub Pages

Go to github.com/n8-mms/mm-subaru-cmo > Settings > Pages > Source: "Deploy from a branch" > Branch: `main` / `/ (root)` > Save.

The site will be live at: `https://n8-mms.github.io/mm-subaru-cmo/`

#### 3. Build a Daily Scraper (GitHub Actions)

Create `.github/workflows/daily-audit.yml` that:

- Runs on `schedule: cron '0 14 * * *'` (7 AM MT)
- Also supports `workflow_dispatch` for manual runs
- Uses Node.js or Python to scrape markmillersubaru.com for:
  - Meta title, meta description, canonical URL
  - H1/H2/H3 heading structure
  - Image count and alt text coverage
  - Open Graph and Twitter Card tags
  - Structured data (JSON-LD)
  - Internal link count
  - Word count
- Calls the PageSpeed Insights API (free, no key):
  ```
  https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.markmillersubaru.com/&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO
  ```
- Extracts: Performance, Accessibility, Best Practices, SEO scores + Core Web Vitals (LCP, INP, CLS, FCP, TTFB) from both field and lab data
- Updates the DATA section in `index.html` with fresh values
- Updates the terminal log lines with the new scan date and findings
- Commits and pushes the updated `index.html`

#### 4. Data Schema

The DATA section in `index.html` contains these JavaScript objects that need updating:

```javascript
// Lighthouse scores
const healthData = { performance: 18, accessibility: 89, bestPractices: 96, seo: 85 };

// SEO checklist items
const seoHealth = [
  { label: "Meta Title", value: "53 chars", pass: true },
  { label: "H1 Tag", value: "Missing!", pass: false },
  // ... 10 items total
];

// Core Web Vitals from PageSpeed field data
const coreWebVitals = [
  { label: "LCP (Field)", value: "1.6s", status: "green" },  // green/orange/red
  // ... 5 items
];

// Issues found (update based on what the scraper finds)
const seoIssues = [
  { title: "...", severity: "Critical", category: "On-Page", details: "..." },
  // severity: "Critical" | "Medium" | "Low"
];

// Passed checks (items that passed the audit)
const passedChecks = [
  { title: "...", desc: "..." },
];

// Terminal output lines (the scan log at the top)
const terminalLines = [
  "$ MM Subaru Growth Agent v1.0 — Live Audit",
  "> Last scan: March 16, 2026 5:28 PM",
  // update with real scan time and findings
];
```

#### 5. Future Enhancements (Optional)

- **Backlink data**: Integrate Ahrefs, Moz, or SEMrush API for real domain authority and referring domains (currently using estimates: DA 55, 120 referring domains)
- **GEO/AI Visibility**: Track how the site appears in AI search results (ChatGPT, Perplexity, Google AI Overviews). Currently estimated at 55/100.
- **Content ideas**: Use an LLM to generate fresh blog post ideas based on current inventory, seasonal trends, and competitor content
- **Social monitoring**: Track Reddit (r/SaltLakeCity, r/Subaru), X/Twitter mentions, and Google Business reviews
- **Multi-page audit**: Extend scraping beyond the homepage to inventory pages, service pages, etc.
- **Historical tracking**: Store daily scores in a JSON file and add trend charts to the dashboard

### Key Technical Notes

- The HTML file uses `<script type="text/babel">` for JSX — Babel compiles it in the browser
- All SVG icons are defined as inline React components (IconSearch, IconGlobe, IconCheck, etc.) — no icon library
- The dashboard has 5 analytics tabs: Health, Links, AI/GEO, CWV, Passed
- Chat responses are keyword-matched (not AI-powered) — search for `chatResponses` in the code
- The `ScoreCircle` component renders animated SVG gauge circles
- Tailwind is loaded via CDN (v2.2.19) — only pre-built utility classes work

### Target URL

`https://www.markmillersubaru.com/`

### GitHub Repo

`https://github.com/n8-mms/mm-subaru-cmo`

### Team Access

Once on GitHub Pages, share this link with the team:
`https://n8-mms.github.io/mm-subaru-cmo/`
