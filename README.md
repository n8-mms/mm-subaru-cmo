# Mark Miller Subaru — AI CMO Dashboard

Live at: **https://n8-mms.github.io/mm-subaru-cmo/**

## What This Is

A self-contained, browser-based SEO/marketing dashboard for Mark Miller Subaru, built from scratch with live-scraped data. It acts as an always-on AI Chief Marketing Officer — surfacing SEO issues, content ideas, social distribution opportunities, performance metrics, and Subaru Digital Assessment scorecard data in one view.

## Features

- **Multi-site support** — Tabs for markmillersubaru.com, Midtown, and South Towne
- **Daily automated audits** — GitHub Actions scrapes the site and calls PageSpeed Insights every morning at 7 AM MT
- **AI-powered recommendations** — Claude API generates fresh content ideas, social posts, and prioritized SEO fixes daily
- **Subaru Digital Assessment Scorecard** — Web UX, SEO, SEM scores, SERP rankings, action items, and Shift Digital recommendations
- **Interactive AI CMO chat** — Ask about SEO, performance, competitors, scorecard, content strategy
- **Core Web Vitals** — Real user field data from Chrome UX Report
- **Lighthouse scores** — Performance, Accessibility, Best Practices, SEO
- **AI CMO Feed** — SEO issues, content ideas with expandable details, social post suggestions

## File Structure

```
Daily Web Audit/
  index.html                     # The full dashboard (open in any browser)
  scripts/audit.mjs              # Daily scraper + Claude API integration
  .github/workflows/daily-audit.yml  # GitHub Actions cron job
  mm-subaru-ai-cmo.jsx           # React source component (reference)
  README.md                      # This file
  HANDOFF-PROMPT.md              # Prompt for a dev/AI to continue the project
```

## Architecture

Single HTML file with zero build dependencies:

- **React 18** + **ReactDOM** via CDN
- **Babel Standalone** for in-browser JSX compilation
- **Tailwind CSS** via CDN
- **Inter** + **JetBrains Mono** fonts via Google Fonts
- All SVG icons are inline (no icon library)

All data is hardcoded in a `DATA` section at the top of the script. The daily scraper (`scripts/audit.mjs`) updates these values automatically.

## Daily Automation

A GitHub Action runs every day at 7 AM Mountain Time:

1. Scrapes markmillersubaru.com (meta tags, headings, images, links, structured data)
2. Calls PageSpeed Insights API (Lighthouse scores + CrUX field data)
3. Calls Claude API for fresh content ideas, social posts, and SEO recommendations
4. Updates `index.html` with all new data
5. Commits and pushes — GitHub Pages auto-deploys

**Secrets required:** `ANTHROPIC_API_KEY` (set in repo Settings > Secrets > Actions)

## How to View

- **Live:** https://n8-mms.github.io/mm-subaru-cmo/
- **Local:** Just open `index.html` in any browser. No server needed.
- **Manual audit:** Trigger from GitHub Actions tab > "Daily SEO Audit" > "Run workflow"
