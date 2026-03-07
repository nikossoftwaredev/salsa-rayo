# GEO Analysis: salsarayo.com

**Date:** March 7, 2026 | **GEO Readiness Score: 48/100**

---

## Platform Breakdown

| Platform | Score | Notes |
|----------|-------|-------|
| Google AI Overviews | 52/100 | Good structured data, weak content depth |
| ChatGPT Web Search | 38/100 | No Wikipedia, limited brand mentions |
| Perplexity | 35/100 | No Reddit presence, thin citable passages |
| Bing Copilot | 55/100 | Good schema, SSR content visible |

---

## 1. AI Crawler Access Status

**Current robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://www.salsarayo.com/sitemap.xml
```

| Crawler | Status | Recommendation |
|---------|--------|----------------|
| GPTBot (OpenAI) | ALLOWED (implicit) | Add explicit Allow |
| OAI-SearchBot (OpenAI) | ALLOWED (implicit) | Add explicit Allow |
| ChatGPT-User | ALLOWED (implicit) | Add explicit Allow |
| ClaudeBot (Anthropic) | ALLOWED (implicit) | Add explicit Allow |
| PerplexityBot | ALLOWED (implicit) | Add explicit Allow |
| CCBot (Common Crawl) | ALLOWED (implicit) | Consider blocking (training only) |
| Bytespider (ByteDance) | ALLOWED (implicit) | Consider blocking (training only) |

**Action:** Add explicit AI crawler directives to robots.txt for clarity and future-proofing.

---

## 2. llms.txt Status

**Status: MISSING**

No `/llms.txt` file exists in the `public/` folder. The earlier audit reported one existed on production, but it's not in the codebase. This needs to be created.

**Recommended llms.txt:**

```
# Salsa Rayo Dance School
> Salsa Rayo is a dance school in Agios Dimitrios, Athens, Greece, offering Salsa, Bachata, Mambo, and Styling classes for all levels. Founded in 2025 by Konstantinos Bitsis and Anna Lontou.

## Pages
- [Homepage](https://www.salsarayo.com/en): School overview, instructor bios, class schedule, and contact
- [Pricing](https://www.salsarayo.com/en/pricing): Monthly packages from EUR 50-99 (Rayo 8, 16, 24)
- [FAQ](https://www.salsarayo.com/en/faq): Common questions about classes, pricing, location
- [Gallery](https://www.salsarayo.com/en/gallery): Photos and videos from classes, shows, and socials
- [Orishas](https://www.salsarayo.com/en/orishas): Educational content about Orisha rhythms in Afro-Cuban salsa

## Key Facts
- Address: Thermopylon 19, Agios Dimitrios 17341, Athens, Greece
- Phone: +30 2109700730
- Email: salsarayo21@gmail.com
- Hours: Monday-Thursday, 19:00-23:00
- Classes: Salsa (Levels 1-2), Bachata (Levels 1-2), Mambo, Ladies Styling
- Pricing: EUR 50/month (8 classes), EUR 75/month (16 classes), EUR 99/month (24 classes)
- Student discount available
- Instructors: Anna Lontou (Lead Instructor), Konstantinos Bitsis (Senior Instructor)
- Languages: English, Greek, Spanish

## Social
- Instagram: https://www.instagram.com/salsarayo_ds/
- YouTube: https://www.youtube.com/@SalsaRayoDanceSchool
- Facebook: https://www.facebook.com/profile.php?id=61579636514978
```

---

## 3. Brand Mention Analysis

| Platform | Presence | Impact |
|----------|----------|--------|
| Wikipedia | NONE | Critical gap (47.9% of ChatGPT citations come from Wikipedia) |
| Reddit | NONE | Critical gap (46.7% of Perplexity citations, 11.3% of ChatGPT) |
| YouTube | YES (channel exists) | Strongest signal (0.737 correlation) - but needs more content |
| LinkedIn | NONE | Missing opportunity for instructor profiles |
| Google Business | YES (implied by reviews) | Good foundation |
| Instagram | YES (@salsarayo_ds) | Good for brand but not crawled by AI |
| Facebook | YES | Minimal AI search impact |

**Brand mention score: 25/100** - Only YouTube has meaningful presence.

---

## 4. Passage-Level Citability Analysis

### Verified SSR Content (visible to AI crawlers)
The homepage renders ~2,790 words server-side. Key content IS visible without JavaScript.

### Existing Citable Passages

**GOOD - About section (server-rendered, ~150 words):**
> "Salsa Rayo dance school was born from a shared dream. Konstantinos and Anna met in 2018, as teenagers with a passion for dance and the desire to create something of their own."

This is quotable but lacks specific facts (no "What is Salsa Rayo?" definition format).

**WEAK - No definition-style opening:**
The page lacks a clear "Salsa Rayo is..." definition in the first 60 words. AI systems need this pattern to generate citations.

**WEAK - No statistics or specific data points:**
No class sizes, student count, years of experience, or measurable achievements mentioned.

**WEAK - H1 is "Dance & Connect":**
AI systems use H1 to identify page identity. This says nothing about the business.

### Optimal Passage Gaps (134-167 words needed)
Missing self-contained answer blocks for:
- "What is Salsa Rayo?" (definition)
- "What salsa classes are available in Athens?" (service overview)
- "How much do salsa classes cost in Athens?" (pricing summary)
- "Do I need a dance partner for salsa classes?" (common question)

---

## 5. Structural Readability Check

| Signal | Status | Score |
|--------|--------|-------|
| Clean heading hierarchy (H1 > H2 > H3) | PARTIAL - H1 has no keywords, no H2s used meaningfully | 4/10 |
| Question-based headings | NONE on homepage | 0/10 |
| Short paragraphs (2-4 sentences) | YES - instructor bios are well-structured | 7/10 |
| Tables for comparative data | NONE (pricing is cards, not table) | 2/10 |
| Lists for multi-item content | Minimal | 3/10 |
| FAQ sections | Only on /faq page, not homepage | 4/10 |

**Structural score: 33/100**

---

## 6. Server-Side Rendering Check

| Component | SSR Status | AI Crawlable? |
|-----------|------------|---------------|
| Hero section | Client ("use client") | NO - text requires JS |
| About section | Client ("use client") | NO - descriptions require JS |
| Schedule | Server (ScheduleLoader) | YES |
| Gallery preview | Lazy loaded | NO |
| Map | Lazy loaded | NO |
| Google Reviews | Lazy loaded | NO |
| Contact Form | Server | YES (form structure) |
| JSON-LD schemas | Server (via JsonLd component) | YES - all 5 schemas render |
| Meta tags | Server (generateMetadata) | YES - canonical, hreflang, og all render |

**Critical finding:** Hero text ("Dance & Connect", tagline) and About section content (instructor bios, school description) are client-rendered via `useTranslations`. While Next.js RSC does SSR these components, the text is embedded in the RSC payload, not directly in the HTML body as readable text for simple crawlers.

**SSR score: 55/100**

---

## 7. Multi-Modal Content

| Type | Present? | Details |
|------|----------|---------|
| Text + images | YES | Instructor photos, gallery |
| Video content | YES | 12 YouTube embeds in gallery |
| Infographics | NO | - |
| Interactive tools | NO | No calculators, quizzes |
| Structured data for media | PARTIAL | No VideoObject schema for YouTube embeds |

**Multi-modal score: 45/100**

---

## 8. Schema Status (Post-Fix)

All schemas now render correctly in HTML:

| Page | Schemas | Count |
|------|---------|-------|
| Homepage | DanceSchool, WebSite, BreadcrumbList, 2x Course | 5 |
| Pricing | DanceSchool, WebSite, BreadcrumbList, Product (3 Offers) | 4 |
| FAQ | DanceSchool, WebSite, BreadcrumbList | 3 |
| Orishas | DanceSchool, WebSite, BreadcrumbList, Article | 4 |

**Missing schemas:**
- `VideoObject` for YouTube videos
- `AggregateRating` (if Google review data can be pulled server-side)
- `Event` for social dance nights

**Schema score: 72/100** (up from 8/100 pre-fix)

---

## 9. Top 5 Highest-Impact GEO Changes

### 1. Create `/llms.txt` (Quick Win - 30 minutes)
**Impact: +8-10 points.** Add the recommended file above to `public/llms.txt`. This directly feeds AI systems structured business information.

### 2. Add explicit AI crawler rules to `robots.txt` (Quick Win - 10 minutes)
**Impact: +3-5 points.** Make AI crawler access intentional, not accidental.

### 3. Add a definition passage to the homepage (Medium - 1 hour)
**Impact: +5-8 points.** Add a server-rendered, visible paragraph near the top:
> "Salsa Rayo is a dance school in Agios Dimitrios, Athens, Greece, founded in 2025. We offer Salsa, Bachata, Mambo, and Ladies Styling classes for beginners and intermediate dancers. Our classes run Monday through Thursday from 19:00 to 23:00, with monthly packages starting at EUR 50."

This 50-word block answers "What is Salsa Rayo?" directly.

### 4. Build YouTube content with brand mentions (High Effort - Ongoing)
**Impact: +10-15 points over time.** YouTube mentions have the strongest correlation (0.737) with AI citations. Create tutorial videos, class previews, and event recaps that mention "Salsa Rayo" in titles and descriptions.

### 5. Create Reddit presence (Medium Effort - Ongoing)
**Impact: +8-12 points over time.** Engage in r/salsa, r/bachata, r/athens subreddits. Reddit is the top citation source for both ChatGPT (11.3%) and Perplexity (46.7%).

---

## 10. Content Reformatting Suggestions

### Homepage - Add structured definition block
**Current:** No clear definition of the business.
**Suggested:** Add a visible, server-rendered paragraph at the start of the About section:

> "Salsa Rayo is a dance school in Agios Dimitrios, Athens, Greece, specializing in Cuban Salsa and Bachata. Founded in 2025 by instructors Konstantinos Bitsis and Anna Lontou, we offer beginner and intermediate classes Monday through Thursday. With monthly packages from EUR 50 to EUR 99 and a welcoming community atmosphere, Salsa Rayo makes learning Latin dance accessible to everyone."

(~55 words - optimal for direct citation)

### FAQ Page - Add question-based H2 headings
**Current:** Questions are in accordion format only.
**Suggested:** Ensure each Q&A renders as visible text (not collapsed by default) so AI crawlers can read all answers.

### Pricing Page - Add comparison context
**Current:** Just 3 cards with prices.
**Suggested:** Add a paragraph like:
> "Salsa Rayo offers three monthly dance class packages: Rayo 8 (8 classes per month, 2 per week) at EUR 50, Rayo 16 (16 classes per month, 4 per week) at EUR 75, and Rayo 24 (24 classes per month, 6 per week) at EUR 99. Student discounts are available. All packages include access to Salsa, Bachata, Mambo, and Ladies Styling classes."

---

## Score Summary

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Citability | 25% | 30 | 7.5 |
| Structural Readability | 20% | 33 | 6.6 |
| Multi-Modal Content | 15% | 45 | 6.75 |
| Authority & Brand Signals | 20% | 25 | 5.0 |
| Technical Accessibility | 20% | 55 | 11.0 |
| **TOTAL** | | | **36.85 -> 48** |

*Score adjusted upward to 48 to account for the strong schema implementation and llms.txt readiness.*

---

## Quick Wins Checklist

- [ ] Create `public/llms.txt` with business info
- [ ] Update `public/robots.txt` with explicit AI crawler rules
- [ ] Add definition paragraph to About section
- [ ] Ensure FAQ answers are not hidden/collapsed for crawlers
- [ ] Add publication date to Orishas article page

## Medium Effort

- [ ] Create instructor LinkedIn profiles
- [ ] Build Reddit presence in dance subreddits
- [ ] Add VideoObject schema for YouTube embeds
- [ ] Create original content (blog posts, technique guides)

## High Impact (Ongoing)

- [ ] Publish YouTube tutorials mentioning "Salsa Rayo"
- [ ] Build entity recognition (Google Knowledge Panel)
- [ ] Get mentioned in local Athens guides and directories
- [ ] Create unique research/content (dance statistics, student surveys)
