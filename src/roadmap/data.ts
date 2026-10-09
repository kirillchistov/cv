// Content for the "Solo MarTech Founder" roadmap page.
// Evidence strings reference the CV (index.html / i18n.ts) so the roadmap
// stays grounded in real background rather than generic advice.

export type SkillId =
  | 'discovery'
  | 'gtm'
  | 'growth'
  | 'analytics'
  | 'sales'
  | 'product'
  | 'engineering'
  | 'dataai'
  | 'audience'
  | 'ops';

export interface Skill {
  id: SkillId;
  label: string;
  short: string; // radar axis label
  current: number; // 0–10, my read of the CV
  target: number; // 0–10, what a solo martech founder needs
  evidence: string[];
  close: string[];
}

export interface Task {
  id: string;
  text: string;
}

export interface Stage {
  id: string;
  title: string;
  tagline: string;
  startWeek: number;
  endWeek: number;
  window: string;
  goal: string;
  advantage: string[];
  skills: SkillId[];
  tasks: Task[];
  exit: string[];
  tools: string[];
  cvHook: string;
}

export interface Criterion {
  id: 'pain' | 'reach' | 'fit' | 'ease';
  label: string;
  hint: string;
}

export type Scores = Record<Criterion['id'], number>;

export interface Bet {
  id: string;
  title: string;
  projectUrls: string[]; // links to entries in projects.ts
  thesis: string;
  firstOffer: string;
  scores: Scores;
}

export interface Integration {
  id: string;
  title: string;
  why: string;
  files: string[];
  effort: 'S' | 'M' | 'L';
  stageId: string;
  done?: boolean;
}

export const TOTAL_WEEKS = 78; // ~18 months

export const skills: Skill[] = [
  {
    id: 'discovery',
    label: 'Customer & problem discovery',
    short: 'Discovery',
    current: 9,
    target: 8,
    evidence: [
      'Took 20+ B2B martech startups from customer discovery to revenue in 6–12 months (ADV Tech, 2019–2026)',
      'Demand validation and GTM hypotheses listed as core skills',
    ],
    close: [
      'Switch from advisor to owner: hear “no” personally and decide faster than feels comfortable',
      'Keep a public interview log so the evidence, not enthusiasm, picks the niche',
    ],
  },
  {
    id: 'gtm',
    label: 'Positioning & GTM',
    short: 'GTM',
    current: 9,
    target: 8,
    evidence: [
      'GTM strategy for new markets and verticals, positioning, scalable launch processes',
      'Cross-industry view: AdTech, MarTech, FinTech, FMCG, B2B IT',
    ],
    close: [
      'Narrow to a single ICP and a single promise. Trying to cover too much at once kills solo founders',
    ],
  },
  {
    id: 'growth',
    label: 'Performance & lifecycle marketing',
    short: 'Growth',
    current: 9,
    target: 7,
    evidence: [
      'Managing Director of performance & programmatic agencies (2010–2018), team of up to 15',
      'Email channel ROI 300–400%; RFM and email+SMS+push journeys at a FinTech startup',
    ],
    close: [
      'Re-learn the zero-budget version: organic, lifecycle and partnerships before paid',
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & unit economics',
    short: 'Analytics',
    current: 9,
    target: 8,
    evidence: [
      'End-to-end ROI analytics across performance, programmatic, search, email and SMS',
      'Unit economics, marketing P&L, +15% LTV/ARPU, −10 p.p. churn of profitable customers',
    ],
    close: [
      'Add SaaS-specific metrics: net revenue retention, CAC payback, cohort retention by plan',
    ],
  },
  {
    id: 'sales',
    label: 'Founder-led sales',
    short: 'Sales',
    current: 7,
    target: 8,
    evidence: [
      'B2B sales programs in the Microsoft / Lanit / Kyocera ecosystem (1997–2002)',
      'Built an office, sales team and key products from scratch (2002–2010)',
    ],
    close: [
      'Get back to selling yourself: demos, follow-ups and closing small deals with no team behind you',
      'Write a simple sales script and objection log and update it after every call',
    ],
  },
  {
    id: 'product',
    label: 'Product & UX',
    short: 'Product',
    current: 6,
    target: 7,
    evidence: [
      'Guided startups from MVP to MLP; product/growth metrics and growth roadmaps',
      'Figma and dashboard UIs in pet projects (SaaS Admin Dashboard, eGrocery Dashboard)',
    ],
    close: [
      'Ship weekly and run a 5-user usability test on every meaningful release',
      'Adopt a component kit (shadcn/ui) so design never blocks shipping',
    ],
  },
  {
    id: 'engineering',
    label: 'Full-stack engineering',
    short: 'Engineering',
    current: 5,
    target: 7,
    evidence: [
      'TypeScript, SQL, Python, VBA; Next.js 15 dashboards and e-shop',
      'Training apps on Node / Express / MongoDB / Nginx, tests with Jest and Cypress',
    ],
    close: [
      'Production basics: Postgres, auth, billing webhooks, background jobs, backups',
      'Use AI coding agents for speed, but review every diff. You own whatever ships',
    ],
  },
  {
    id: 'dataai',
    label: 'Data pipelines & applied AI',
    short: 'Data & AI',
    current: 4,
    target: 7,
    evidence: [
      'AI/automation for research, content, analytics and campaign ops',
      'Marketing Mix Model Builder and AI Product Landing prototypes',
    ],
    close: [
      'Scheduled ingestion from ad and marketplace APIs (Google Ads, Meta, marketplaces)',
      'LLM features with evals, cost tracking and grounded answers, not just demos',
    ],
  },
  {
    id: 'audience',
    label: 'Audience & personal brand',
    short: 'Audience',
    current: 3,
    target: 8,
    evidence: [
      'The CV shows no public audience yet. For a solo founder this is the main distribution gap',
      'Asset to use: 4 languages (RU / EN / FR / ES) and 20+ years of stories',
    ],
    close: [
      'Post 3 times a week on one platform for 6 months, plus a newsletter you own',
      'Turn accelerator lessons into teardowns and benchmarks people bookmark',
    ],
  },
  {
    id: 'ops',
    label: 'Solo ops, finance & legal',
    short: 'Ops',
    current: 5,
    target: 6,
    evidence: [
      'P&L ownership, KPI systems and operating rhythm for teams',
    ],
    close: [
      'Legal entity, merchant of record, contracts, GDPR/DPA, automated bookkeeping',
      'Turn the team operating rhythm into a weekly routine for one person',
    ],
  },
];

export const stages: Stage[] = [
  {
    id: 's0',
    title: 'Founder thesis',
    tagline: 'Decide what game you play',
    startWeek: 0,
    endWeek: 2,
    window: 'Weeks 0–2',
    goal: 'Define what kind of one-person business you are building, and why you specifically win it.',
    advantage: [
      'You have watched 20+ martech startups up close. You know the failure patterns most first-time founders still have to learn.',
      'A cross-industry view (AdTech, FinTech, FMCG, B2B IT) helps you spot gaps that specialists miss',
      'With four languages, you can sell into several markets without a team',
    ],
    skills: ['discovery', 'gtm', 'ops'],
    tasks: [
      { id: 's0t1', text: 'Write a one-page founder thesis: who you serve, what outcome you sell, why you (cite 3 CV proof points)' },
      { id: 's0t2', text: 'Set constraints: runway in months, weekly hours, minimum monthly revenue needed by month 6' },
      { id: 's0t3', text: 'Pick a model: productized service → micro-SaaS (recommended), pure SaaS, or tools + advisory' },
      { id: 's0t4', text: 'List 20 failure patterns from the accelerator years as your personal “don’t” list' },
      { id: 's0t5', text: 'Shortlist 3–5 niches and score them in the bet scorer below' },
    ],
    exit: ['Thesis shared with 3 people you trust', 'Ranked shortlist of niches'],
    tools: ['Notion / Obsidian', 'Bet scorer (below)'],
    cvHook: 'Publish the thesis as a “Now” block on the CV, so the page presents you as a founder rather than a job seeker.',
  },
  {
    id: 's1',
    title: 'Problem discovery',
    tagline: 'Find a painful problem with a budget',
    startWeek: 2,
    endWeek: 6,
    window: 'Weeks 2–6',
    goal: 'Confirm one painful problem that has a budget, for an ICP you can actually reach.',
    advantage: [
      'You have run customer discovery many times as an accelerator lead. This time the decision is yours.',
      'Your ADV network of B2B/FMCG clients and agencies gives you warm leads for interviews',
    ],
    skills: ['discovery', 'sales', 'audience'],
    tasks: [
      { id: 's1t1', text: 'Run 20+ problem interviews (Mom Test style) with one ICP: pain, workaround, budget owner' },
      { id: 's1t2', text: 'Score each pain by frequency × cost × urgency; drop niches below your threshold' },
      { id: 's1t3', text: 'Look for urgent demand: someone is already paying for a manual fix (agency, analyst, spreadsheet)' },
      { id: 's1t4', text: 'Collect 5 real artifacts from prospects: the reports and spreadsheets they hate' },
      { id: 's1t5', text: 'Write the ICP and JTBD statement plus a list of who you will not serve' },
    ],
    exit: ['3+ prospects say “I would pay for this now” and name who owns the budget', 'One niche chosen'],
    tools: ['Calendly', 'Meeting notes AI', 'Airtable / Notion CRM'],
    cvHook: 'Add a “Book a 20-min interview” CTA to the contact card and tag leads by intent.',
  },
  {
    id: 's2',
    title: 'Productized service',
    tagline: 'Get paid before you build',
    startWeek: 4,
    endWeek: 12,
    window: 'Weeks 4–12',
    goal: 'Sell the outcome as a service with a fixed scope and price. Deliver it by hand at first and write down every step you repeat.',
    advantage: [
      'Running agencies (2010–2018) taught you to price, scope and deliver performance and analytics work',
      'Your CVM audits and 300–400% ROI email programmes can be packaged as offers right away',
    ],
    skills: ['sales', 'analytics', 'growth'],
    tasks: [
      { id: 's2t1', text: 'Package one offer with a fixed scope, fixed price and 2-week delivery (e.g. Marketing Mix Health Check)' },
      { id: 's2t2', text: 'Write a one-page sales page and a sample deliverable' },
      { id: 's2t3', text: 'Close 3 paid pilots; deliver with spreadsheets, SQL and Python' },
      { id: 's2t4', text: 'Log every repetitive delivery step. This becomes your MVP backlog' },
      { id: 's2t5', text: 'Ask each pilot for a testimonial and one referral' },
    ],
    exit: ['3 paid pilots delivered', 'At least one client asks for it monthly'],
    tools: ['Stripe Payment Links / Lemon Squeezy', 'Sheets + SQL + Python', 'Loom'],
    cvHook: 'Add a “Services” card with the productized offer and a starting price as an anchor.',
  },
  {
    id: 's3',
    title: 'Solo MVP',
    tagline: 'Automate the repeated work',
    startWeek: 8,
    endWeek: 20,
    window: 'Weeks 8–20',
    goal: 'Turn the most repeated part of the service into a thin SaaS slice that one person can run.',
    advantage: [
      'TypeScript, SQL and Python are already in your toolkit, and you have shipped Next.js 15 apps',
      'Working demos already exist: Marketing Mix Model Builder, SaaS OSA Tool, SaaS Admin Dashboard',
    ],
    skills: ['engineering', 'dataai', 'product'],
    tasks: [
      { id: 's3t1', text: 'Pick a boring, AI-friendly stack: Next.js + TypeScript + Postgres + auth + Stripe/Paddle' },
      { id: 's3t2', text: 'Build scheduled ingestion for 1–2 data sources (ads or marketplace APIs)' },
      { id: 's3t3', text: 'Ship one report that clearly shows value and replaces the manual Stage 2 deliverable' },
      { id: 's3t4', text: 'Add LLM features only where they save user time, with evals and cost tracking' },
      { id: 's3t5', text: 'Production basics: error tracking, backups, privacy policy, DPA template' },
      { id: 's3t6', text: 'Move pilot clients onto the product with hands-on onboarding' },
    ],
    exit: ['Pilots use it weekly without you in the loop', 'First self-serve signup'],
    tools: ['Next.js', 'Supabase / Neon', 'Stripe / Paddle', 'Vercel', 'Sentry', 'Claude Code / Cursor'],
    cvHook: 'Move the winning demo from “Projects” into a “Ventures” section with a live status badge.',
  },
  {
    id: 's4',
    title: 'Founder-led distribution',
    tagline: 'Build a repeatable channel',
    startWeek: 12,
    endWeek: 30,
    window: 'Weeks 12–30',
    goal: 'Build one repeatable channel that brings qualified users without depending on paid ads.',
    advantage: [
      '20+ years across performance, programmatic, search and email/SMS',
      'An agency network can become a partner and white-label channel',
    ],
    skills: ['audience', 'growth', 'sales', 'gtm'],
    tasks: [
      { id: 's4t1', text: 'Pick one owned channel (LinkedIn / Telegram / newsletter) and post 3×/week' },
      { id: 's4t2', text: 'Ship a free tool as a lead magnet (ROMI or MMM calculator) with email capture' },
      { id: 's4t3', text: 'Programmatic SEO: templated “benchmark for industry X” pages' },
      { id: 's4t4', text: 'Partner programme for 3–5 agencies: rev-share or white-label' },
      { id: 's4t5', text: 'Founder outbound: 20 personalised touches a week to the ICP' },
      { id: 's4t6', text: 'Start paid tests only once organic conversion is proven, with a CAC cap set in advance' },
    ],
    exit: ['One channel delivers a predictable number of qualified signups each month', 'CAC known per channel'],
    tools: ['PostHog / Plausible', 'Resend / Loops', 'Beehiiv / Substack', 'Apollo'],
    cvHook: 'Add a writing section and a /tools page to the CV; tag CV traffic with UTMs.',
  },
  {
    id: 's5',
    title: 'Monetization & unit economics',
    tagline: 'Price for value, run on 5 numbers',
    startWeek: 16,
    endWeek: 78,
    window: 'Week 16 → ongoing',
    goal: 'Price on the value you deliver and run the business on a handful of metrics.',
    advantage: [
      'Unit economics, pricing and marketing P&L are core skills on your CV',
      'You have already improved LTV/ARPU by 15% with RFM and lifecycle work. Do the same for your own product',
    ],
    skills: ['analytics', 'gtm', 'ops'],
    tasks: [
      { id: 's5t1', text: 'Value-based pricing: 3 tiers anchored on outcome (ROMI uplift, hours saved), annual discount' },
      { id: 's5t2', text: 'Founder dashboard: MRR, NRR, logo churn, CAC payback, activation rate' },
      { id: 's5t3', text: 'Lifecycle emails for onboarding, activation, failed payments and win-back' },
      { id: 's5t4', text: 'One pricing experiment per quarter' },
      { id: 's5t5', text: 'Merchant of record or tax setup for international sales' },
    ],
    exit: ['CAC payback < 12 months', 'Logo churn < 3% / month', 'MRR covers your personal minimum'],
    tools: ['Stripe / Paddle', 'ChartMogul / Baremetrics', 'Loops / Customer.io'],
    cvHook: 'Reuse the SaaS Admin Dashboard repo as your internal metrics cockpit and show an MRR-band badge on the CV.',
  },
  {
    id: 's6',
    title: 'Leverage: AI & automation',
    tagline: 'Run the company in ≤10 h/week',
    startWeek: 24,
    endWeek: 78,
    window: 'Week 24 → ongoing',
    goal: 'Keep ops small so most of your time goes to product and distribution.',
    advantage: [
      'You already bring AI and automation into research, content, analytics and campaign ops for teams',
      'Designing KPIs and an operating rhythm is on your CV; now do it for a team of one',
    ],
    skills: ['dataai', 'ops', 'engineering'],
    tasks: [
      { id: 's6t1', text: 'Weekly rhythm: Monday metrics review, Friday ship log' },
      { id: 's6t2', text: 'Support: docs site plus an AI assistant grounded in the docs, escalating to email' },
      { id: 's6t3', text: 'Content repurposing: one long post becomes 5 formats (AI draft + human edit)' },
      { id: 's6t4', text: 'Automate bookkeeping and invoicing; close each month in under 1 hour' },
      { id: 's6t5', text: 'Write SOPs so a freelancer could take over any recurring task' },
    ],
    exit: ['Ops ≤ 10 h/week', 'No recurring task needs you more than weekly'],
    tools: ['n8n / Make', 'Claude API', 'Crisp / Intercom', 'Notion SOPs'],
    cvHook: 'Deploy the CV through GitHub Actions and add a scheduled weekly “ship log” rebuild.',
  },
  {
    id: 's7',
    title: 'Scale, portfolio or leverage',
    tagline: 'Choose the next game deliberately',
    startWeek: 39,
    endWeek: 78,
    window: 'Months 9–18',
    goal: 'Choose the next step on purpose: double down, add products for the same ICP, or use the business as a base for advisory and angel work.',
    advantage: [
      'Your README already mentions supporting martech SaaS startups as an investor or co-founder',
      'From the accelerator side you know what due diligence looks for',
    ],
    skills: ['gtm', 'analytics', 'sales'],
    tasks: [
      { id: 's7t1', text: 'Quarterly review: is growth ≥ 5–10% MoM? If not, fix or pivot' },
      { id: 's7t2', text: 'Option A: hire a first contractor once MRR is more than 3× their cost' },
      { id: 's7t3', text: 'Option B: launch product #2 for the same ICP, since cross-selling is cheaper than finding a new audience' },
      { id: 's7t4', text: 'Option C: an advisor or angel track that uses your product and audience as a source of deals' },
      { id: 's7t5', text: 'Keep a data room ready: metrics, contracts, code and IP ownership' },
    ],
    exit: ['Decision written down with the criteria for revisiting it'],
    tools: ['Notion / Drive data room', 'Acquire.com benchmarks'],
    cvHook: 'Turn the CV into a founder hub with Ventures, Writing, Tools and Advisory, keeping the CMO pitch as a second track.',
  },
];

export const criteria: Criterion[] = [
  { id: 'pain', label: 'Pain & budget', hint: 'Is someone already paying to solve it?' },
  { id: 'reach', label: 'Reach', hint: 'Can you get 100 ICP conversations from your network?' },
  { id: 'fit', label: 'CV fit', hint: 'How much does your background give you an edge?' },
  { id: 'ease', label: 'Build ease', hint: 'Can one person ship v1 in 12 weeks?' },
];

export const bets: Bet[] = [
  {
    id: 'digital-shelf',
    title: 'Digital shelf & availability monitoring',
    projectUrls: [
      'https://kirillchistov.github.io/stindex-demo/',
      'https://github.com/kirillchistov/growcery-admin',
    ],
    thesis: 'FMCG brands lose sales on e-grocery and marketplaces because items go out of stock or listings break, and they find out weeks later.',
    firstOffer: 'Monthly digital-shelf audit for 3 SKUs × 3 retailers',
    scores: { pain: 5, reach: 4, fit: 4, ease: 3 },
  },
  {
    id: 'mmm-lite',
    title: 'MMM-lite for SMB & DTC',
    projectUrls: ['https://kirillchistov.github.io/marketingmixer/'],
    thesis: 'Small advertisers cannot afford MMM consultants but still need to know which channel to cut.',
    firstOffer: 'Marketing Mix Health Check, fixed price, 2 weeks',
    scores: { pain: 3, reach: 3, fit: 5, ease: 3 },
  },
  {
    id: 'retention',
    title: 'Retention / CVM autopilot',
    projectUrls: [],
    thesis: 'Many SaaS and e-commerce teams have the data but no lifecycle programme. You have delivered email ROI of 300–400% before.',
    firstOffer: 'RFM segmentation + 3 lifecycle journeys, done-for-you',
    scores: { pain: 4, reach: 3, fit: 5, ease: 3 },
  },
  {
    id: 'ai-strategist',
    title: 'AI marketing strategist',
    projectUrls: ['https://kirillchistov.github.io/ai-strategyst/'],
    thesis: 'Turn 20 years of GTM playbooks into an AI copilot that drafts channel plans and budgets for small businesses.',
    firstOffer: 'Done-with-you GTM sprint powered by the copilot',
    scores: { pain: 3, reach: 3, fit: 4, ease: 4 },
  },
  {
    id: 'marketplace-romi',
    title: 'ROMI analytics for marketplace sellers',
    projectUrls: [
      'https://kirillchistov.github.io/next-admin-dash/prismb/',
      'https://kirillchistov.github.io/points-track-landing/',
    ],
    thesis: 'Marketplace sellers spend heavily on ads but cannot see profit by SKU.',
    firstOffer: 'Profit-by-SKU teardown of the last 90 days',
    scores: { pain: 4, reach: 2, fit: 4, ease: 3 },
  },
];

export const integrations: Integration[] = [
  {
    id: 'roadmap-page',
    title: 'Roadmap page (this one)',
    why: 'Second Vite entry that shares the CV’s theme, tokens and project data',
    files: ['roadmap.html', 'src/roadmap/*', 'vite.config.ts'],
    effort: 'S',
    stageId: 's0',
    done: true,
  },
  {
    id: 'now-block',
    title: '“Now” / founder thesis block',
    why: 'Shows a founder narrative above the CMO pitch and updates every month',
    files: ['index.html', 'src/i18n.ts'],
    effort: 'S',
    stageId: 's0',
  },
  {
    id: 'lead-capture',
    title: 'Real lead capture with intent',
    why: 'Replace the mailto in form.ts with a POST to Formspree / Cloudflare Worker / Supabase and add an intent select (interview · pilot · hiring) plus UTM capture',
    files: ['src/form.ts', 'index.html', 'src/i18n.ts'],
    effort: 'M',
    stageId: 's1',
  },
  {
    id: 'services',
    title: 'Services card with price anchor',
    why: 'Sell the productized offer from the same page that proves your background',
    files: ['index.html', 'src/i18n.ts', 'styles.css'],
    effort: 'S',
    stageId: 's2',
  },
  {
    id: 'ventures',
    title: 'Ventures vs. learning projects',
    why: 'Add optional <code>kind</code> and <code>status</code> to the Project type so render.ts can group live bets apart from course work',
    files: ['src/types.ts', 'src/projects.ts', 'src/render.ts'],
    effort: 'S',
    stageId: 's3',
  },
  {
    id: 'tailor',
    title: 'Resume tailor (free tool)',
    why: 'Paste a job post and a resume and get ATS keywords, a 5-second check and a tailored .txt/.md/.docx. Rules only, nothing leaves the browser; hands off to Career Evidence OS for AI',
    files: ['tailor.html', 'src/tailor/*'],
    effort: 'M',
    stageId: 's4',
    done: true,
  },
  {
    id: 'tools',
    title: 'Free tools page (lead magnet)',
    why: 'ROMI / CAC payback calculator as another Vite entry with email capture, reusing the MMM builder logic',
    files: ['tools.html', 'src/tools/*', 'vite.config.ts'],
    effort: 'M',
    stageId: 's4',
  },
  {
    id: 'writing',
    title: 'Writing / build-in-public notes',
    why: 'Markdown posts loaded with import.meta.glob, one template, RSS feed. Your owned channel',
    files: ['content/*.md', 'src/notes.ts', 'notes.html'],
    effort: 'M',
    stageId: 's4',
  },
  {
    id: 'seo',
    title: 'SEO, OG and analytics',
    why: 'JSON-LD Person, OG image, hreflang for RU/EN/FR/ES, Plausible or Umami with outbound-click events',
    files: ['index.html', 'public/og.png'],
    effort: 'S',
    stageId: 's4',
  },
  {
    id: 'metrics-badge',
    title: 'Live MRR-band badge',
    why: 'A GitHub Action writes public/metrics.json from Stripe, and the CV shows the MRR band without exact figures',
    files: ['.github/workflows/metrics.yml', 'public/metrics.json', 'src/render.ts'],
    effort: 'M',
    stageId: 's5',
  },
  {
    id: 'ci',
    title: 'CI deploy + weekly rebuild',
    why: 'Replace the local gh-pages script with Actions; a scheduled run refreshes the ship log',
    files: ['.github/workflows/deploy.yml', 'package.json'],
    effort: 'S',
    stageId: 's6',
  },
  {
    id: 'astro',
    title: 'Migrate to Astro when content grows',
    why: 'Keep the TS modules as islands and get content collections, i18n routing and RSS built in',
    files: ['whole repo'],
    effort: 'L',
    stageId: 's7',
  },
];
