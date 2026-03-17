import { useState } from "react";
import { Search, Globe, Link2, Brain, CheckCircle, AlertTriangle, AlertCircle, ChevronDown, ChevronUp, MessageSquare, Send, FileText, Users, Mic, BarChart3, TrendingUp, Eye, Zap, Twitter, BookOpen, ExternalLink, Settings, Bell, Gauge } from "lucide-react";

const healthData = {
  performance: 18,
  accessibility: 89,
  bestPractices: 96,
  seo: 85,
};

const seoHealth = [
  { label: "Meta Title", value: "53 chars", pass: true },
  { label: "Meta Description", value: "122 chars", pass: true },
  { label: "Mobile Friendly", value: "Yes", pass: true },
  { label: "H1 Tag", value: "Missing!", pass: false },
  { label: "Images Missing Alt", value: "4 of 40", pass: false },
  { label: "Open Graph", value: "Complete", pass: true },
  { label: "Twitter Card", value: "Missing", pass: false },
  { label: "Structured Data", value: "AutoDealer", pass: true },
  { label: "HTTPS", value: "Yes", pass: true },
  { label: "Canonical URL", value: "Set", pass: true },
];

const backlinkStats = {
  domainAuthority: 55,
  referringDomains: 120,
  linkVelocity: "+5 Links/Month",
};

const topReferring = [
  { domain: "autotrader.com", rating: 78 },
  { domain: "caranddriver.com", rating: 72 },
  { domain: "cars.com", rating: 70 },
  { domain: "ksl.com", rating: 65 },
  { domain: "subaru.com", rating: 88 },
];

const geoData = {
  geoScore: 55,
  citationPotential: "Medium",
  visibility: 45,
  sentiment: 0.65,
};

const coreWebVitals = {
  lcp: { value: "1.6s", field: true, status: "green", label: "Largest Contentful Paint (Field)" },
  inp: { value: "138ms", field: true, status: "green", label: "Interaction to Next Paint (Field)" },
  cls: { value: "0.2", field: true, status: "orange", label: "Cumulative Layout Shift (Field)" },
  fcp: { value: "1.0s", field: true, status: "green", label: "First Contentful Paint (Field)" },
  ttfb: { value: "0.6s", field: true, status: "green", label: "Time to First Byte (Field)" },
};

const passedChecks = [
  { title: "Meta Title", desc: "'Welcome to Mark Miller Subaru | Subaru Dealer in Utah' — 53 chars (optimal)" },
  { title: "Meta Description", desc: "122 chars — within optimal 70-160 range" },
  { title: "Mobile Viewport", desc: "Viewport meta tag configured" },
  { title: "HTTPS", desc: "Site is served over HTTPS" },
  { title: "Canonical URL", desc: "Set to https://www.markmillersubaru.com/" },
  { title: "Open Graph Tags", desc: "og:title, og:description, og:image all present" },
  { title: "Structured Data", desc: "AutoDealer JSON-LD schema detected" },
  { title: "Accessibility Score", desc: "89/100 — good" },
  { title: "Best Practices", desc: "96/100 — excellent" },
  { title: "SEO Score", desc: "85/100 — good" },
  { title: "Content Depth", desc: "323 words on homepage — above 300 minimum" },
  { title: "Internal Links", desc: "56 internal links found" },
  { title: "CLS Score", desc: "Cumulative Layout Shift: 0 (green)" },
];

const seoIssues = [
  {
    title: "Missing H1 Tag & 4 Images Without Alt Text",
    severity: "Critical",
    category: "On-Page",
    details: "LIVE DATA: Homepage has zero H1 tags — only an H2 ('One Store, Two Great Locations') and H3s. 4 of 40 images are missing alt text. Heading hierarchy jumps from H2 → H3 with no H1, which hurts SEO crawlability.",
  },
  {
    title: "Performance Score: 18 — Critical Page Speed Issues",
    severity: "Critical",
    category: "Performance",
    details: "LIVE DATA: Mobile Lighthouse performance is 18/100. First Contentful Paint: 4.6s (red). Largest Contentful Paint: 15.3s (red). Total Blocking Time: 1,550ms (red). Core Web Vitals assessment: FAILED. CLS of 0.2 (needs improvement).",
  },
  {
    title: "Missing Twitter Card Meta Tags",
    severity: "Medium",
    category: "Social",
    details: "LIVE DATA: No twitter:card meta tag found. Open Graph tags (og:title, og:description, og:image) are present and correct. Adding Twitter Card tags would improve social sharing appearance on X/Twitter.",
  },
];

const contentIdeas = [
  {
    type: "article",
    title: "New Subaru Outback vs. Forester 2026: Which SUV Is Right for Utah Families?",
    status: "Draft Ready",
  },
  {
    type: "article",
    title: "5 Reasons Mark Miller Subaru Is SLC's Top-Rated Dealer for Service",
    status: "Idea",
  },
  {
    type: "article",
    title: "Winter Driving in Utah: How Subaru's Symmetrical AWD Keeps You Safe",
    status: "Idea",
  },
];

const socialPosts = [
  {
    platform: "X",
    content: "Just helped a family find their perfect 2026 Crosstrek at our Midtown location 🚗 Whether you're in South Salt Lake or Sandy, we've got you covered at both Mark Miller Subaru locations. Search inventory → markmillersubaru.com",
    type: "Suggested Tweet",
  },
  {
    platform: "Reddit",
    content: "r/SaltLakeCity — Thread: Best Subaru dealers in the valley? (Opportunity to engage authentically about service experience)",
    type: "Reddit Opportunity",
  },
  {
    platform: "HackerNews",
    content: "Show HN: Mark Miller Subaru — How a local dealership is using tech to improve the car-buying experience",
    type: "HN Submission",
  },
];

const ScoreCircle = ({ score, label, size = "lg" }) => {
  const color = score >= 90 ? "#22c55e" : score >= 50 ? "#f97316" : "#ef4444";
  const radius = size === "lg" ? 32 : 24;
  const stroke = size === "lg" ? 4 : 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dim = (radius + stroke) * 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={dim} height={dim} className="transform -rotate-90">
        <circle cx={radius + stroke} cy={radius + stroke} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={radius + stroke} cy={radius + stroke} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        <text x={radius + stroke} y={radius + stroke} textAnchor="middle" dominantBaseline="central" className="transform rotate-90" style={{ transformOrigin: "center", fontSize: size === "lg" ? "16px" : "13px", fontWeight: 700, fill: color }}>{score}</text>
      </svg>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
};

const Badge = ({ text, color }) => {
  const colors = {
    red: "bg-red-100 text-red-700 border-red-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    green: "bg-green-100 text-green-700 border-green-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[color]}`}>{text}</span>;
};

export default function AICMODashboard() {
  const [activeTab, setActiveTab] = useState("health");
  const [expandedSeo, setExpandedSeo] = useState(true);
  const [expandedContent, setExpandedContent] = useState(false);
  const [expandedSocial, setExpandedSocial] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hi, I'm your AI CMO for Mark Miller Subaru. I can help with SEO audits, content strategy, social media distribution, and competitive analysis. What would you like to work on?" },
  ]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [terminalLines] = useState([
    "$ MM Subaru Growth Agent v1.0 — Live Audit",
    "> Last scan: March 16, 2026 5:28 PM",
    "> Scraped markmillersubaru.com — 40 images, 56 internal links, 323 words",
    "> - [CRITICAL] No H1 tag on homepage. Only H2: 'One Store, Two Great Locations'",
    "> - [CRITICAL] Mobile Performance: 18/100 — LCP 15.3s, FCP 4.6s, TBT 1,550ms",
    "> - [WARNING] 4 images missing alt text out of 40 total",
    "> - [WARNING] No Twitter Card meta tags — OG tags present",
    "> - [PASS] Structured data: AutoDealer schema detected",
    "> - [PASS] Meta title (53 chars), description (122 chars), HTTPS, canonical URL",
    "> - [PASS] Accessibility: 89 | Best Practices: 96 | SEO: 85",
    "> 3 issues found. Ready for commands.",
  ]);

  const tabs = [
    { id: "health", label: "Health", icon: Gauge },
    { id: "links", label: "Links", icon: Link2 },
    { id: "aigeo", label: "AI/GEO", icon: Brain },
    { id: "passed", label: "Passed", icon: CheckCircle },
  ];

  const documents = [
    { id: "product", title: "Product Information", icon: FileText },
    { id: "competitor", title: "Competitor Analysis", icon: Users },
    { id: "brand", title: "Brand Voice", icon: Mic },
  ];

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    const input = chatInput.toLowerCase();
    setChatInput("");
    setTimeout(() => {
      let response = "I'll look into that for you. Give me a moment to analyze the data...";
      if (input.includes("seo")) response = "Based on my audit, your top priorities are: 1) Add a proper H1 tag to the homepage, 2) Add alt text to all vehicle images, 3) Implement LocalBusiness structured data. Want me to generate the code fixes?";
      else if (input.includes("content") || input.includes("article")) response = "I've drafted an article comparing the 2026 Outback vs. Forester for Utah families. It targets local search intent and highlights your two dealership locations. Want me to expand it or generate more topics?";
      else if (input.includes("social") || input.includes("twitter") || input.includes("reddit")) response = "I found a Reddit thread in r/SaltLakeCity asking about Subaru dealers. This is a great organic engagement opportunity. I also have a tweet draft ready highlighting your dual-location advantage. Want to review?";
      else if (input.includes("competitor")) response = "Your main local competitors are Nate Wade Subaru and Tim Dahle Subaru. Mark Miller has a stronger domain authority (55 vs ~40) but they're outpacing you on content volume. I recommend publishing 2-3 articles per month to maintain your lead.";
      setChatMessages((prev) => [...prev, { role: "assistant", text: response }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Terminal Header */}
      <div className="bg-gray-900 text-green-400 p-4 font-mono text-sm border-b-2 border-green-500">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-white font-semibold text-base">MM Subaru AI CMO</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
            <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
            <div className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300">
              Mark Miller Subaru
            </div>
          </div>
        </div>
        <div className="bg-gray-950 rounded-lg p-3 max-h-36 overflow-y-auto">
          {terminalLines.map((line, i) => (
            <div key={i} className={`${line.startsWith("$") ? "text-cyan-400" : line.startsWith(">") ? "text-green-400" : "text-gray-500"}`}>
              {line}
              {i === terminalLines.length - 1 && <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Mark Miller Subaru</h2>
                <a href="https://markmillersubaru.com" className="text-sm text-blue-600 hover:underline flex items-center gap-1">markmillersubaru.com <ExternalLink className="w-3 h-3" /></a>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Two physical dealerships in the Salt Lake City, Utah area — one in South Salt Lake (Midtown) and one in Sandy (South Towne). Visitors can search new and pre-owned Subaru inventory online and schedule service appointments at either location.
            </p>

            {/* Documents */}
            <div className="mt-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">Documents</h3>
              {documents.map((doc) => (
                <button key={doc.id} onClick={() => setActiveDoc(activeDoc === doc.id ? null : doc.id)} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group text-left">
                  <div className="flex items-center gap-2">
                    <doc.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    <span className="text-sm text-gray-700">{doc.title}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* AI CMO Feed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">AI CMO Feed</h3>
            </div>

            {/* SEO Issues */}
            <div className="border-b border-gray-100">
              <button onClick={() => setExpandedSeo(!expandedSeo)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">SEO + GEO Recommendations</span>
                    <p className="text-xs text-gray-500">Found {seoIssues.length} issues</p>
                  </div>
                </div>
                {expandedSeo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSeo && (
                <div className="px-4 pb-4 space-y-3">
                  {seoIssues.map((issue, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-gray-800 pr-3">{issue.title}</p>
                        <button className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium">Fix</button>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <Badge text={issue.severity} color={issue.severity === "Critical" ? "red" : "orange"} />
                        <Badge text={issue.category} color="gray" />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{issue.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Ideas */}
            <div className="border-b border-gray-100">
              <button onClick={() => setExpandedContent(!expandedContent)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">Content Ideas</span>
                    <p className="text-xs text-gray-500">{contentIdeas.length} articles queued</p>
                  </div>
                </div>
                {expandedContent ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedContent && (
                <div className="px-4 pb-4 space-y-3">
                  {contentIdeas.map((idea, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{idea.title}</p>
                        <Badge text={idea.status} color={idea.status === "Draft Ready" ? "green" : "blue"} />
                      </div>
                      <button className="text-blue-600 text-xs hover:underline whitespace-nowrap ml-2">View →</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Distribution */}
            <div>
              <button onClick={() => setExpandedSocial(!expandedSocial)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Twitter className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">Social Distribution</span>
                    <p className="text-xs text-gray-500">{socialPosts.length} opportunities</p>
                  </div>
                </div>
                {expandedSocial ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSocial && (
                <div className="px-4 pb-4 space-y-3">
                  {socialPosts.map((post, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge text={post.platform} color="blue" />
                        <Badge text={post.type} color="gray" />
                      </div>
                      <p className="text-sm text-gray-700">{post.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Analytics Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Analytics Overview</h3>
            </div>
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-5">
              {activeTab === "health" && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Page Speed</h4>
                  <div className="flex justify-around mb-6">
                    <ScoreCircle score={healthData.performance} label="Performance" />
                    <ScoreCircle score={healthData.accessibility} label="Accessibility" />
                    <ScoreCircle score={healthData.bestPractices} label="Best Practices" />
                    <ScoreCircle score={healthData.seo} label="SEO" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-3">SEO Health</h4>
                  <div className="space-y-2">
                    {seoHealth.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          {item.pass ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                          <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <span className={`text-sm font-medium ${item.pass ? "text-green-600" : "text-red-600"}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "links" && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Backlink Stats</h4>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{backlinkStats.domainAuthority}</div>
                      <div className="text-xs text-gray-500 mt-1">Domain Authority</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{backlinkStats.referringDomains}</div>
                      <div className="text-xs text-gray-500 mt-1">Referring Domains</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-lg font-bold text-green-600">{backlinkStats.linkVelocity}</div>
                      <div className="text-xs text-gray-500 mt-1">Link Velocity</div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-3">Top Referring Domains</h4>
                  <div className="space-y-2">
                    {topReferring.map((ref, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-700">{ref.domain}</span>
                        <span className="text-sm font-semibold text-gray-800">{ref.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "aigeo" && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">GEO Optimization</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-500">{geoData.geoScore}</div>
                      <div className="text-xs text-gray-500 mt-1">GEO Score</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-lg font-bold text-gray-800">{geoData.citationPotential}</div>
                      <div className="text-xs text-gray-500 mt-1">Citation Potential</div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-3">Overall Visibility</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-500">{geoData.visibility}</div>
                      <div className="text-xs text-gray-500 mt-1">Visibility</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-800">{geoData.sentiment}</div>
                      <div className="text-xs text-gray-500 mt-1">Sentiment</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "passed" && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Passed Checks ({passedChecks.length})</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {passedChecks.map((check, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">{check.title}</div>
                          <div className="text-xs text-gray-500">{check.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Chat with AI CMO</h3>
              </div>
              <button onClick={() => setChatOpen(!chatOpen)} className="text-gray-400 hover:text-gray-600">
                {chatOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {chatOpen && (
              <div>
                <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`text-sm p-3 rounded-lg ${msg.role === "assistant" ? "bg-gray-50 text-gray-700" : "bg-blue-600 text-white ml-8"}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    placeholder="Ask about SEO, content, competitors..."
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button onClick={handleSendChat} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Agents Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Active Agents</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "SEO Agent", icon: Search, color: "bg-red-100 text-red-600", status: "3 issues found" },
                { name: "PageSpeed", icon: Gauge, color: "bg-red-100 text-red-600", status: "Perf: 18/100" },
                { name: "Content Writer", icon: BookOpen, color: "bg-purple-100 text-purple-600", status: "1 draft" },
                { name: "X / Twitter", icon: Twitter, color: "bg-sky-100 text-sky-600", status: "1 post ready" },
                { name: "Reddit Agent", icon: MessageSquare, color: "bg-orange-100 text-orange-600", status: "1 opportunity" },
                { name: "Site Scraper", icon: Globe, color: "bg-green-100 text-green-600", status: "Live: 40 imgs, 56 links" },
              ].map((agent, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${agent.color}`}>
                    <agent.icon className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-medium text-gray-800">{agent.name}</div>
                  <div className="text-xs text-gray-500">{agent.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      {activeDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setActiveDoc(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {activeDoc === "product" && "Product Information"}
                {activeDoc === "competitor" && "Competitor Analysis"}
                {activeDoc === "brand" && "Brand Voice"}
              </h2>
              <button onClick={() => setActiveDoc(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            {activeDoc === "product" && (
              <div className="space-y-4 text-sm text-gray-700">
                <div><strong>Product Name:</strong> Mark Miller Subaru</div>
                <div><strong>Website:</strong> markmillersubaru.com</div>
                <div><strong>One-liner:</strong> A Salt Lake City area Subaru dealership with two locations where customers can browse, buy, and service Subaru vehicles.</div>
                <div><strong>Product Category:</strong> Car dealership, Auto dealer, Subaru dealership</div>
                <div><strong>Product Type:</strong> E-commerce</div>
                <div><strong>Target Customers:</strong> Car buyers and Subaru owners in the Salt Lake City, Utah area looking to purchase a new or used vehicle or schedule vehicle service.</div>
                <div><strong>Business Model:</strong> Vehicle sales (new and pre-owned), Automotive service and maintenance</div>
                <div><strong>Key Features:</strong> New Subaru inventory search (Ascent, BRZ, Crosstrek, Forester, Outback, Legacy, WRX, Impreza), Pre-owned vehicle search, Online service scheduling for both Midtown and South Towne locations, Inventory filtering by payment type and price</div>
                <div><strong>Primary CTA:</strong> Search New Vehicles</div>
              </div>
            )}
            {activeDoc === "competitor" && (
              <div className="space-y-4 text-sm text-gray-700">
                <p>Key competitors in the Salt Lake City Subaru market:</p>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <strong>Nate Wade Subaru</strong> — Downtown SLC location, strong local reputation, DA ~42
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <strong>Tim Dahle Subaru</strong> — South Jordan location, aggressive digital marketing, DA ~38
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <strong>Larry H. Miller Dealerships</strong> — Multi-brand competitor, high brand awareness in Utah market, DA ~55
                  </div>
                </div>
                <p><strong>Mark Miller Subaru's Advantage:</strong> Two strategic locations, strong domain authority (55), established service reputation, and growing online presence.</p>
              </div>
            )}
            {activeDoc === "brand" && (
              <div className="space-y-4 text-sm text-gray-700">
                <div><strong>Tone:</strong> Friendly, trustworthy, community-oriented</div>
                <div><strong>Voice:</strong> Knowledgeable but approachable — like a helpful neighbor who happens to know everything about Subarus</div>
                <div><strong>Values:</strong> Customer-first service, Utah outdoor lifestyle, environmental responsibility, family safety</div>
                <div><strong>Key Messages:</strong> "Two locations to serve you better," "Your Salt Lake City Subaru experts," "Adventure starts here"</div>
                <div><strong>Audience Persona:</strong> Active Utah families and outdoor enthusiasts aged 28-55 who value safety, reliability, and all-weather capability</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
