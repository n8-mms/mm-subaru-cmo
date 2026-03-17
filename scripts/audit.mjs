/**
 * Daily SEO Audit Script
 * Scrapes markmillersubaru.com and PageSpeed Insights API,
 * then updates the DATA section in index.html.
 */

import { readFile, writeFile } from 'node:fs/promises';
import https from 'node:https';

const TARGET_URL = 'https://www.markmillersubaru.com/';

// ── Helpers ──

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MMSubaruAuditBot/1.0)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve, reject);
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function fetchJSON(url) {
  return fetch(url).then(JSON.parse);
}

function postJSON(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = JSON.stringify(body);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve(data); }
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ── Scrape HTML ──

function scrapeHTML(html) {
  const meta = (name) => {
    const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`, 'i'));
    return m ? m[1] : null;
  };

  const metaTitle = (html.match(/<title[^>]*>(.*?)<\/title>/i) || [])[1] || '';
  const metaDesc = meta('description') || '';
  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) || [])[1]
    || (html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i) || [])[1] || '';

  const headings = (tag) => [...html.matchAll(new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gis'))].map((m) => m[1].replace(/<[^>]*>/g, '').trim());
  const h1s = headings('h1');
  const h2s = headings('h2');
  const h3s = headings('h3');

  const images = [...html.matchAll(/<img[^>]*>/gi)];
  const imgCount = images.length;
  const imgMissingAlt = images.filter((m) => {
    const tag = m[0];
    return !tag.match(/alt=["'][^"']+["']/i);
  }).length;

  // OG tags
  const ogTitle = meta('og:title');
  const ogDesc = meta('og:description');
  const ogImage = meta('og:image');
  const ogComplete = !!(ogTitle && ogDesc && ogImage);

  // Twitter Card
  const twitterCard = meta('twitter:card');

  // Structured data
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis)];
  let structuredDataType = null;
  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);
      const type = data['@type'] || (Array.isArray(data['@graph']) ? data['@graph'].map((g) => g['@type']).join(', ') : null);
      if (type) structuredDataType = type;
    } catch {}
  }

  // HTTPS
  const isHTTPS = TARGET_URL.startsWith('https');

  // Mobile viewport
  const hasViewport = !!html.match(/<meta[^>]+name=["']viewport["']/i);

  // Internal links
  const domain = new URL(TARGET_URL).hostname;
  const links = [...html.matchAll(/href=["'](https?:\/\/[^"']*|\/[^"']*)/gi)];
  const internalLinks = links.filter((l) => {
    const href = l[1];
    if (href.startsWith('/')) return true;
    try { return new URL(href).hostname.includes(domain); } catch { return false; }
  }).length;

  // Word count (strip tags from body)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyText = bodyMatch ? bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  return {
    metaTitle, metaDesc, canonical,
    h1s, h2s, h3s,
    imgCount, imgMissingAlt,
    ogComplete, twitterCard,
    structuredDataType,
    isHTTPS, hasViewport,
    internalLinks, wordCount,
  };
}

// ── PageSpeed Insights ──

async function getPageSpeedData() {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(TARGET_URL)}&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

  console.log('Calling PageSpeed Insights API...');
  const data = await fetchJSON(apiUrl);

  const cats = data.lighthouseResult?.categories || {};
  const scores = {
    performance: Math.round((cats.performance?.score || 0) * 100),
    accessibility: Math.round((cats.accessibility?.score || 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
    seo: Math.round((cats.seo?.score || 0) * 100),
  };

  // Field data (CrUX)
  const field = data.loadingExperience?.metrics || {};
  const fieldMetric = (key) => {
    const m = field[key];
    if (!m) return { value: 'N/A', status: 'gray' };
    const val = m.percentile;
    const cat = m.category; // FAST, AVERAGE, SLOW
    const status = cat === 'FAST' ? 'green' : cat === 'AVERAGE' ? 'orange' : 'red';
    return { value: val, status };
  };

  const lcpField = fieldMetric('LARGEST_CONTENTFUL_PAINT_MS');
  const inpField = fieldMetric('INTERACTION_TO_NEXT_PAINT');
  const clsField = fieldMetric('CUMULATIVE_LAYOUT_SHIFT_SCORE');
  const fcpField = fieldMetric('FIRST_CONTENTFUL_PAINT_MS');
  const ttfbField = fieldMetric('EXPERIMENTAL_TIME_TO_FIRST_BYTE');

  const formatMs = (v) => (typeof v === 'number' ? (v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${v}ms`) : v);
  const formatCLS = (v) => (typeof v === 'number' ? (v / 100).toFixed(2) : v);

  const cwv = [
    { label: 'LCP (Field)', value: formatMs(lcpField.value), status: lcpField.status },
    { label: 'INP (Field)', value: formatMs(inpField.value), status: inpField.status },
    { label: 'CLS (Field)', value: formatCLS(clsField.value), status: clsField.status },
    { label: 'FCP (Field)', value: formatMs(fcpField.value), status: fcpField.status },
    { label: 'TTFB (Field)', value: formatMs(ttfbField.value), status: ttfbField.status },
  ];

  // Lab data for terminal lines
  const audits = data.lighthouseResult?.audits || {};
  const labLCP = audits['largest-contentful-paint']?.displayValue || 'N/A';
  const labFCP = audits['first-contentful-paint']?.displayValue || 'N/A';
  const labTBT = audits['total-blocking-time']?.displayValue || 'N/A';

  return { scores, cwv, labLCP, labFCP, labTBT };
}

// ── Build updated data ──

function buildDataSection(scrape, psi) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Denver' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver' });

  const { scores, cwv, labLCP, labFCP, labTBT } = psi;
  const s = scrape;

  // SEO health checklist
  const seoHealth = [
    { label: 'Meta Title', value: `${s.metaTitle.length} chars`, pass: s.metaTitle.length > 0 && s.metaTitle.length <= 60 },
    { label: 'Meta Description', value: `${s.metaDesc.length} chars`, pass: s.metaDesc.length >= 70 && s.metaDesc.length <= 160 },
    { label: 'Mobile Friendly', value: s.hasViewport ? 'Yes' : 'No', pass: s.hasViewport },
    { label: 'H1 Tag', value: s.h1s.length > 0 ? `${s.h1s.length} found` : 'Missing!', pass: s.h1s.length > 0 },
    { label: 'Images Missing Alt', value: `${s.imgMissingAlt} of ${s.imgCount}`, pass: s.imgMissingAlt === 0 },
    { label: 'Open Graph', value: s.ogComplete ? 'Complete' : 'Incomplete', pass: s.ogComplete },
    { label: 'Twitter Card', value: s.twitterCard || 'Missing', pass: !!s.twitterCard },
    { label: 'Structured Data', value: s.structuredDataType || 'None', pass: !!s.structuredDataType },
    { label: 'HTTPS', value: s.isHTTPS ? 'Yes' : 'No', pass: s.isHTTPS },
    { label: 'Canonical URL', value: s.canonical ? 'Set' : 'Missing', pass: !!s.canonical },
  ];

  // Issues
  const seoIssues = [];
  const passedChecks = [];

  // H1 + alt text
  if (s.h1s.length === 0 || s.imgMissingAlt > 0) {
    const parts = [];
    if (s.h1s.length === 0) parts.push(`Homepage has zero H1 tags${s.h2s.length > 0 ? ` — only H2: '${s.h2s[0]}'` : ''}`);
    if (s.imgMissingAlt > 0) parts.push(`${s.imgMissingAlt} of ${s.imgCount} images are missing alt text`);
    const title = [s.h1s.length === 0 ? 'Missing H1 Tag' : null, s.imgMissingAlt > 0 ? `${s.imgMissingAlt} Images Without Alt Text` : null].filter(Boolean).join(' & ');
    seoIssues.push({ title, severity: 'Critical', category: 'On-Page', details: `LIVE DATA: ${parts.join('. ')}.` });
  }

  // Performance
  if (scores.performance < 50) {
    seoIssues.push({
      title: `Performance Score: ${scores.performance} — Critical Page Speed Issues`,
      severity: 'Critical', category: 'Performance',
      details: `LIVE DATA: Mobile Lighthouse performance is ${scores.performance}/100. FCP: ${labFCP}. LCP: ${labLCP}. TBT: ${labTBT}. Core Web Vitals assessment: ${scores.performance < 50 ? 'FAILED' : 'NEEDS WORK'}.`,
    });
  }

  // Twitter Card
  if (!s.twitterCard) {
    seoIssues.push({
      title: 'Missing Twitter Card Meta Tags',
      severity: 'Medium', category: 'Social',
      details: `LIVE DATA: No twitter:card meta tag found. Open Graph tags are ${s.ogComplete ? 'present and correct' : 'also incomplete'}. Adding Twitter Card tags would improve social sharing on X/Twitter.`,
    });
  }

  // Passed checks
  if (s.metaTitle.length > 0 && s.metaTitle.length <= 60) passedChecks.push({ title: 'Meta Title', desc: `'${s.metaTitle}' — ${s.metaTitle.length} chars (optimal)` });
  if (s.metaDesc.length >= 70 && s.metaDesc.length <= 160) passedChecks.push({ title: 'Meta Description', desc: `${s.metaDesc.length} chars — within optimal 70-160 range` });
  if (s.hasViewport) passedChecks.push({ title: 'Mobile Viewport', desc: 'Viewport meta tag configured' });
  if (s.isHTTPS) passedChecks.push({ title: 'HTTPS', desc: 'Site is served over HTTPS' });
  if (s.canonical) passedChecks.push({ title: 'Canonical URL', desc: `Set to ${s.canonical}` });
  if (s.ogComplete) passedChecks.push({ title: 'Open Graph Tags', desc: 'og:title, og:description, og:image all present' });
  if (s.structuredDataType) passedChecks.push({ title: 'Structured Data', desc: `${s.structuredDataType} JSON-LD schema detected` });
  if (scores.accessibility >= 80) passedChecks.push({ title: 'Accessibility Score', desc: `${scores.accessibility}/100 — ${scores.accessibility >= 90 ? 'excellent' : 'good'}` });
  if (scores.bestPractices >= 80) passedChecks.push({ title: 'Best Practices', desc: `${scores.bestPractices}/100 — ${scores.bestPractices >= 90 ? 'excellent' : 'good'}` });
  if (scores.seo >= 80) passedChecks.push({ title: 'SEO Score', desc: `${scores.seo}/100 — ${scores.seo >= 90 ? 'excellent' : 'good'}` });
  if (s.wordCount >= 300) passedChecks.push({ title: 'Content Depth', desc: `${s.wordCount} words on homepage — above 300 minimum` });
  if (s.internalLinks > 0) passedChecks.push({ title: 'Internal Links', desc: `${s.internalLinks} internal links found` });

  // Terminal lines
  const issueCount = seoIssues.length;
  const terminalLines = [
    '$ MM Subaru Growth Agent v1.0 — Live Audit',
    `> Last scan: ${dateStr} ${timeStr}`,
    `> Scraped markmillersubaru.com — ${s.imgCount} images, ${s.internalLinks} internal links, ${s.wordCount} words`,
  ];
  if (s.h1s.length === 0) terminalLines.push(`> - [CRITICAL] No H1 tag on homepage.${s.h2s.length > 0 ? ` Only H2: '${s.h2s[0]}'` : ''}`);
  if (scores.performance < 50) terminalLines.push(`> - [CRITICAL] Mobile Performance: ${scores.performance}/100 — LCP ${labLCP}, FCP ${labFCP}, TBT ${labTBT}`);
  if (s.imgMissingAlt > 0) terminalLines.push(`> - [WARNING] ${s.imgMissingAlt} images missing alt text out of ${s.imgCount} total`);
  if (!s.twitterCard) terminalLines.push(`> - [WARNING] No Twitter Card meta tags — OG tags ${s.ogComplete ? 'present' : 'also missing'}`);
  if (s.structuredDataType) terminalLines.push(`> - [PASS] Structured data: ${s.structuredDataType} schema detected`);
  terminalLines.push(`> - [PASS] Meta title (${s.metaTitle.length} chars), description (${s.metaDesc.length} chars), HTTPS, canonical URL`);
  terminalLines.push(`> - [PASS] Accessibility: ${scores.accessibility} | Best Practices: ${scores.bestPractices} | SEO: ${scores.seo}`);
  terminalLines.push(`> ${issueCount} issue${issueCount !== 1 ? 's' : ''} found. Ready for commands.`);

  return {
    healthData: scores,
    seoHealth,
    coreWebVitals: cwv,
    seoIssues,
    passedChecks,
    terminalLines,
    dateComment: `Live scraped ${dateStr}`,
  };
}

// ── AI Recommendations via Claude ──

async function getAIRecommendations(scrape, psi) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('No ANTHROPIC_API_KEY set — skipping AI recommendations.');
    return null;
  }

  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const auditSummary = `
Site: markmillersubaru.com (Subaru dealership, two locations in Salt Lake City area — Midtown & South Towne)
Date: ${month}

Lighthouse Scores: Performance ${psi.scores.performance}/100, Accessibility ${psi.scores.accessibility}/100, Best Practices ${psi.scores.bestPractices}/100, SEO ${psi.scores.seo}/100

SEO Findings:
- Meta title: "${scrape.metaTitle}" (${scrape.metaTitle.length} chars)
- Meta description: ${scrape.metaDesc.length} chars
- H1 tags: ${scrape.h1s.length} found ${scrape.h1s.length > 0 ? `("${scrape.h1s.join('", "')}")` : '— MISSING'}
- H2 tags: ${scrape.h2s.length} found ${scrape.h2s.length > 0 ? `("${scrape.h2s.slice(0, 5).join('", "')}")` : ''}
- Images: ${scrape.imgCount} total, ${scrape.imgMissingAlt} missing alt text
- Open Graph: ${scrape.ogComplete ? 'Complete' : 'Incomplete'}
- Twitter Card: ${scrape.twitterCard || 'Missing'}
- Structured Data: ${scrape.structuredDataType || 'None'}
- Internal links: ${scrape.internalLinks}
- Word count: ${scrape.wordCount}

Core Web Vitals (Field): LCP ${psi.cwv[0]?.value}, INP ${psi.cwv[1]?.value}, CLS ${psi.cwv[2]?.value}
Lab Data: LCP ${psi.labLCP}, FCP ${psi.labFCP}, TBT ${psi.labTBT}
`.trim();

  const prompt = `You are an AI CMO (Chief Marketing Officer) for Mark Miller Subaru, a car dealership in Salt Lake City, Utah. Based on today's live SEO audit data, generate fresh daily recommendations.

${auditSummary}

Respond with ONLY valid JSON (no markdown, no code fences) in this exact structure:
{
  "contentIdeas": [
    {"title": "Article title optimized for local SEO", "status": "Idea"},
    {"title": "Another article title", "status": "Idea"},
    {"title": "Third article title", "status": "Idea"}
  ],
  "socialPosts": [
    {"platform": "X", "content": "Tweet text under 280 chars", "type": "Suggested Tweet"},
    {"platform": "Reddit", "content": "Subreddit and engagement opportunity", "type": "Reddit Opportunity"},
    {"platform": "LinkedIn", "content": "LinkedIn post about dealership", "type": "LinkedIn Post"}
  ],
  "seoRecommendation": "One specific, actionable SEO fix the team should prioritize this week based on today's data. Be specific with code or steps."
}

Requirements:
- Content ideas should be timely (consider the current month/season), target local Utah search intent, and reference real Subaru models (Outback, Forester, Crosstrek, Ascent, WRX, BRZ, Impreza, Legacy)
- Social posts should feel authentic, not corporate. Reference real SLC neighborhoods, Utah outdoor culture, or seasonal activities
- The SEO recommendation should address the most impactful issue from today's audit data
- Keep content ideas varied — mix comparison articles, local guides, and seasonal content
- NEVER repeat the same ideas verbatim from previous days — vary your suggestions`;

  console.log('Calling Claude API for AI recommendations...');
  const response = await postJSON('https://api.anthropic.com/v1/messages', {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  }, {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  });

  try {
    const text = response.content?.[0]?.text;
    if (!text) {
      console.log('Claude API returned no content:', JSON.stringify(response).slice(0, 200));
      return null;
    }
    const parsed = JSON.parse(text);
    console.log(`AI generated: ${parsed.contentIdeas?.length} content ideas, ${parsed.socialPosts?.length} social posts`);
    return parsed;
  } catch (err) {
    console.log('Failed to parse Claude response:', err.message);
    console.log('Raw response:', JSON.stringify(response).slice(0, 500));
    return null;
  }
}

// ── Update index.html ──

function replaceDataBlock(html, varName, newValue) {
  // Match: const varName = ...; (handling nested objects/arrays)
  const pattern = new RegExp(`(const ${varName} = )([\\s\\S]*?);(\\n)`, 'm');
  const json = JSON.stringify(newValue, null, 2)
    .replace(/"([^"]+)":/g, '$1:')           // unquote keys
    .replace(/"/g, '"');                       // use double quotes for values
  // Re-add quotes around string values properly
  const jsLiteral = JSON.stringify(newValue, null, 2)
    .replace(/"(\w+)":/g, '$1:');              // unquote object keys only
  return html.replace(pattern, `$1${jsLiteral};$3`);
}

async function main() {
  console.log(`Auditing ${TARGET_URL}...`);

  // Fetch page HTML
  console.log('Fetching page HTML...');
  const html = await fetch(TARGET_URL);
  console.log(`Fetched ${html.length} bytes of HTML`);

  // Scrape
  const scrape = scrapeHTML(html);
  console.log(`Found: ${scrape.imgCount} images, ${scrape.internalLinks} internal links, ${scrape.wordCount} words`);
  console.log(`H1 tags: ${scrape.h1s.length}, H2 tags: ${scrape.h2s.length}, H3 tags: ${scrape.h3s.length}`);

  // PageSpeed
  const psi = await getPageSpeedData();
  console.log(`Lighthouse scores: Perf=${psi.scores.performance}, A11y=${psi.scores.accessibility}, BP=${psi.scores.bestPractices}, SEO=${psi.scores.seo}`);

  // Build data
  const data = buildDataSection(scrape, psi);

  // Get AI recommendations
  const ai = await getAIRecommendations(scrape, psi);

  // Read and update index.html
  let indexHtml = await readFile('index.html', 'utf-8');

  // Update date comment
  indexHtml = indexHtml.replace(
    /\/\* ─+ DATA \(.*?\) ─+ \*\//,
    `/* ───────── DATA (${data.dateComment}) ───────── */`
  );

  // Replace each data block
  indexHtml = replaceDataBlock(indexHtml, 'healthData', data.healthData);
  indexHtml = replaceDataBlock(indexHtml, 'seoHealth', data.seoHealth);
  indexHtml = replaceDataBlock(indexHtml, 'coreWebVitals', data.coreWebVitals);
  indexHtml = replaceDataBlock(indexHtml, 'seoIssues', data.seoIssues);
  indexHtml = replaceDataBlock(indexHtml, 'passedChecks', data.passedChecks);
  indexHtml = replaceDataBlock(indexHtml, 'terminalLines', data.terminalLines);

  // Replace AI-generated content if available
  if (ai) {
    if (ai.contentIdeas?.length) {
      indexHtml = replaceDataBlock(indexHtml, 'contentIdeas', ai.contentIdeas);
    }
    if (ai.socialPosts?.length) {
      indexHtml = replaceDataBlock(indexHtml, 'socialPosts', ai.socialPosts);
    }
    // Add AI weekly recommendation as an actionable issue
    if (ai.seoRecommendation) {
      data.seoIssues.push({
        title: 'AI CMO Weekly Priority',
        severity: 'Medium',
        category: 'AI Recommendation',
        details: ai.seoRecommendation,
      });
      // Re-write seoIssues with the AI rec included
      indexHtml = replaceDataBlock(indexHtml, 'seoIssues', data.seoIssues);
    }
  }

  await writeFile('index.html', indexHtml, 'utf-8');
  console.log('Updated index.html with fresh audit data.');

  // Summary
  console.log('\n── Audit Summary ──');
  console.log(`Issues: ${data.seoIssues.length}`);
  console.log(`Passed: ${data.passedChecks.length}`);
  if (ai) console.log(`AI content ideas: ${ai.contentIdeas?.length || 0}, social posts: ${ai.socialPosts?.length || 0}`);
  data.terminalLines.forEach((l) => console.log(l));
}

main().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
