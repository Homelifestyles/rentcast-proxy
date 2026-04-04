# Homelifestyles REI — Master Project Memory (Claude Code)

## Owner
**Stan** — Real estate investor, flipper, wholesaler
**Brand**: Homelifestyles REI
**Website**: homelifestylesrei.com (currently WordPress — should move to GHL)

---

## Markets
1. **Pensacola, FL metro**
2. **Mobile, AL metro**
3. **Birmingham, AL metro** (including surrounding areas)

---

## Business Strategies
- Fix & flip
- Buy & hold rentals
- Wholesaling / co-wholesaling
- **Failed wholesale deal pipeline** (underused competitive advantage — see below)

## Private Lender
**Chuck** — existing relationship, leverage for deals

---

## Technology Stack

| Tool | Purpose | Status |
|------|---------|--------|
| **GoHighLevel (GHL)** | CRM, pipeline, SMS/email automation, website builder | Active — A2P SMS approved |
| **Xleads (X Plan)** | Lead generation, skip tracing, property data, AI agents | Active — highest tier |
| **Rentcast** | Property data API (proxy hosted on Vercel) | Active — key in Vercel env var |
| **Vercel** | Hosts Rentcast proxy + underwriter tool | Live |
| **GitHub** | Source code (Homelifestyles/rentcast-proxy) | Active |

---

## Xleads X Plan Features (Full Access)
- 60,000 skiptraced record downloads/month
- **SkyDrive AI**: 4K satellite imagery → 0-100 Distress Index per property (exclusive to Xleads)
- **AI Agents**: Answer inbound calls, qualify sellers, route hot leads to CRM automatically
- AI-ranked buyers + automatic list stacker
- All 17+ list types (tax delinquent, pre-foreclosure, probate, etc.)
- D4D app, power dialer, SMS blaster, email blaster
- Landlord & hedge fund buyer lists
- Full disposition filtering
- AI deal analysis built in
- E-signing, website builder
- Mastermind access
- **IMPORTANT**: Xleads is built on GoHighLevel under the hood ("Ninja Mode" CRM is white-labeled GHL)
- **No public API exists for Xleads** — integrations require Zapier or webhook workarounds

---

## GHL Setup
- **A2P SMS**: APPROVED (biggest bottleneck already cleared)
- **9-Stage Pipeline** (needs to be rebuilt from scratch — replace old VA-built stages):

| Stage | What Happens |
|-------|-------------|
| 1. New Lead In | Immediate auto-SMS fires |
| 2. Initial Contact Sent | 3-day wait, then follow-up if no reply |
| 3. Responded — Qualifying | Lead surfaces to Stan only when they reply |
| 4. Appointment Set | Auto-reminder SMS 24h and 1h before |
| 5. Offer Made | Wait for response |
| 6. Negotiating | Stan handles personally |
| 7. Under Contract | Transaction coordination |
| 8. Dead (for now) | 90-day nurture drip |
| 9. Closed / Won | Won deal |

### Automation Philosophy
- **Zero manual lead movement** — everything is behavior/trigger-based
- Stan only sees leads that have responded and shown interest
- All cold leads stay in automated drip without touching Stan's attention

---

## Lead Sources (All Active)
1. Cold outreach — SMS & calls (via Xleads power dialer + SMS blaster)
2. Inbound website form (homelifestylesrei.com)
3. Zillow / MLS / expired listings (via Zapier monitoring)
4. **Failed wholesale deals** (underused — highest motivation sellers)
5. Social media / DMs (automated via GHL)

---

## Failed Wholesale Deal Pipeline (Key Competitive Advantage)
**Strategy**: Find deals wholesalers are marketing → track closing date → reach out to owner 3-7 days AFTER scheduled close if deal didn't close

**Why it works**: Seller is now MORE motivated — embarrassed, still needs to sell, psychologically primed to accept less

**Process**:
1. Get on every local wholesaler's buyer email list (they blast you deals)
2. Run each address through Xleads to see if their numbers make sense
3. Track expected closing date in GHL custom field
4. 3-7 days after closing date → auto-check if sold (MLS/public records)
5. If unsold → skip trace actual owner (not wholesaler), pull fresh comps, calculate MAO
6. Send underwritten deal to Stan as a hot lead

---

## Seller Situations & NEPQ Drip Sequences
All 6 types have 7-touch drip sequences written in NEPQ style:
- Pre-foreclosure / behind on payments
- Inherited / probate property
- Tired landlord
- Divorce / life change
- Needs to sell fast
- Tax delinquent

---

## Sales Methodology: NEPQ (Jon Lallande)
- YouTube: https://youtube.com/@jonlallande
- 7-phase framework for seller calls
- NEPQ master system HTML file already built (saved separately as artifact)
- Real-time AI call coach built — situation-specific per seller type
- GHL CRM drip sequences written in NEPQ style for all 6 seller types

### 7 NEPQ Phases
1. Introduction / permission
2. Situation questions
3. Problem awareness
4. Consequence questions
5. Solution presentation
6. Objection handling
7. Close (two-option close)

---

## Website
- Current: homelifestylesrei.com (WordPress)
- New design built: Option 3 — Warm Charcoal + Sage Green + Orange submit button
  - Research-backed: green = calm/trust/decisiveness for older, stressed sellers
  - Orange button = highest-converting CTA color in direct response
  - Single CTA everywhere: "Get My Free Cash Offer"
  - Form above the fold (current site buries it)
  - Title tag fixed to include all 3 markets (was "Florida" only)
- Recommendation: Rebuild inside GHL (already paying for it, connects to CRM automatically)

---

## Rentcast Proxy (Vercel)
- **Vercel URL**: `rentcast-proxy-n0m6adt6b-stans-projects-5d3df259.vercel.app`
- **GitHub**: https://github.com/Homelifestyles/rentcast-proxy
- **Dev branch**: `claude/xleads-ghl-integration-oKgt5`
- **API key**: Stored as Vercel env var `RENTCAST_API_KEY`
  - ⚠️ NEVER hardcode in source code — goes in Vercel Dashboard → Project → Settings → Env Vars
- **Endpoints used**:
  - `/api/rentcast?endpoint=properties&address=...` — property details
  - `/api/rentcast?endpoint=avm/rent/long-term&address=...` — rent estimate
  - `/api/rentcast?endpoint=avm/value&address=...` — home value AVM

---

## Underwriter Tool (public/index.html)
Accessible at Vercel URL above. Type address → auto-pulls Rentcast data → AI underwrites both strategies.

### Neighborhood Class Rent Targets
| Class | Rent Rule | Notes |
|-------|-----------|-------|
| A | 1.0% | Lowest risk, lowest yield |
| B | 1.5% | Balanced |
| C | 2.0% | Higher yield, more mgmt |
| D | 2.5% | Highest risk/reward |

### Deal Scoring
- Score 0-100
- 80+: Strong deal
- 60-79: Decent deal
- 40-59: Marginal
- <40: Pass

### Flip Analysis
- 70% rule check
- Maximum Allowable Offer (MAO)
- Net profit estimate (after 6% closing costs, 2% carrying, 6% selling)
- Deal score
- Recommended max price if deal doesn't score

### Rental Analysis
- Rent-to-cost ratio vs. class target
- Cap rate (50% expense ratio assumption)
- Monthly cash flow (7% financing assumption)
- Recommended max price to hit target yield

---

## Competitive Advantages (Stan's Edge Over Other Flippers/Wholesalers)
1. **Failed wholesale deal pipeline** — targets sellers at peak motivation, most ignore this
2. **Xleads SkyDrive AI** — satellite distress imaging finds properties before owners even list
3. **Xleads AI Agents** — never miss an inbound call, instant qualification
4. **Full AI pipeline** — no VA needed, faster response than competitors
5. **Probate attorney referral network** — one relationship per market = years of exclusive leads
6. **Tax delinquent + code violation list scraping** — uncontested source via Zapier
7. **JV deal structure** — scale without hiring when volume exceeds capacity
8. **NEPQ sales methodology** — superior seller conversation framework vs. typical scripts
9. **Hyper-local SEO** — city/neighborhood + "sell my house fast" content = free organic leads
10. **Dual-strategy underwriting** — instantly knows if flip or hold is better use for each deal

---

## What Still Needs To Be Built

### Immediate (High Impact)
- [ ] Set `RENTCAST_API_KEY` env var in Vercel dashboard
- [ ] Test underwriter tool end-to-end with real address
- [ ] GHL pipeline — rebuild 9 stages with automation triggers
- [ ] Enter NEPQ drip sequences into GHL workflows (copy is written)

### Near Term
- [ ] Website rebuild inside GHL (design + copy ready)
- [ ] GHL → Underwriter integration (auto-underwrite deals from pipeline)
- [ ] Social media content calendar + DM autoresponder in GHL
- [ ] Zillow/MLS Zapier monitoring for expired listings

### Integration (Needs API Keys/Details From Stan)
- [ ] **GHL API key + Location ID** → needed to build any GHL automation via code
- [ ] **Xleads → GHL bridge** (no public API — may need Zapier webhooks)
- [ ] Push scored deals from underwriter back into GHL as opportunities

---

## Important Notes for All Future Claude Sessions
- Stan's Rentcast API key must NEVER be pasted in chat — Vercel env var only
- Stan's GHL cannot be accessed directly — need GHL API key + Location ID for any code-based automation
- Xleads has no public API — integrations require Zapier or webhook workarounds
- Xleads IS GoHighLevel under the hood (white-labeled) — GHL API may work for Xleads CRM features
- Stan wants ZERO manual intervention — all lead movement must be trigger/behavior-based
- All communication copy must follow Jon Lallande's NEPQ framework
- Stan's A2P SMS is already approved in GHL — SMS automations can be built now
- The NEPQ master system and GHL build guide exist as HTML artifacts from previous Claude.ai sessions
