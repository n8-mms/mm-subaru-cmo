# Mark Miller Subaru — AI CMO Dashboard

## What This Is

A self-contained, browser-based SEO/marketing dashboard for **markmillersubaru.com**, inspired by [Okara AI CMO](https://okara.ai) but built from scratch with live-scraped data. It acts as an always-on AI Chief Marketing Officer — surfacing SEO issues, content ideas, social distribution opportunities, and performance metrics in one view.

## Current Status

**Working prototype with real data** (scraped March 16, 2026).

What's done:
- Self-contained HTML dashboard (React 18 + Tailwind via CDN, no build step)
- Live data from markmillersubaru.com: Lighthouse scores, meta tags, heading structure, images, structured data, Core Web Vitals
- PageSpeed Insights integration (field + lab data)
- Interactive chat with keyword-aware responses
- AI CMO feed: SEO issues, content ideas, social post suggestions
- Document modals: Product Info, Competitor Analysis, Brand Voice

What's not done yet:
- GitHub Pages deployment (repo created at `n8-mms/mm-subaru-cmo` but file upload hit browser sandbox limits)
- Daily automated re-scraping
- Backlink data (currently estimated — needs Ahrefs/Moz API or scraping)
- GEO/AI visibility scores (currently estimated)

## Key Findings (Live Audit)

| Metric | Value | Status |
|---|---|---|
| Performance (Mobile) | 18/100 | Critical |
| Accessibility | 89/100 | Good |
| Best Practices | 96/100 | Excellent |
| SEO Score | 85/100 | Good |
| H1 Tag | Missing | Critical |
| Images Missing Alt | 4 of 40 | Warning |
| Twitter Card | Missing | Warning |
| LCP (Field) | 1.6s | Good |
| INP (Field) | 138ms | Good |
| CLS (Field) | 0.2 | Needs Improvement |

## File Structure

```
Daily Web Audit/
  index.html              # The full dashboard (open in any browser)
  mm-subaru-ai-cmo.jsx    # React source component (reference)
  README.md               # This file
  HANDOFF-PROMPT.md       # Prompt for a dev/AI to continue the project
```

## Architecture

The dashboard is a **single HTML file** with zero build dependencies:

- **React 18** + **ReactDOM** via CDN (production builds)
- **Babel Standalone** for in-browser JSX compilation
- **Tailwind CSS** via CDN
- **Inter** + **JetBrains Mono** fonts via Google Fonts
- All SVG icons are inline (no icon library dependency)

All data is hardcoded in a `DATA` section at the top of the script. To update, replace the values in that section with fresh scrape results.

## How to View

Just open `index.html` in any browser. No server needed.

## GitHub Repo

A repo was created at **github.com/n8-mms/mm-subaru-cmo** with a README on `main`. The `index.html` still needs to be pushed there and GitHub Pages enabled for team sharing.

## Tech Stack for Next Phase

To make this auto-updating, the next developer should:
1. Push `index.html` to the GitHub repo
2. Enable GitHub Pages (Settings > Pages > Deploy from `main`)
3. Add a GitHub Action or cron job that scrapes fresh data and updates the file daily
4. Optionally integrate real APIs (PageSpeed Insights is free, no key needed)

See `HANDOFF-PROMPT.md` for the full developer prompt.
