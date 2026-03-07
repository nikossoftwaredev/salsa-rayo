# SEO Action Plan: bandbeat.com

**Generated:** March 7, 2026
**Current Score:** 14/100
**Target Score:** 70+ within 3 months

---

## CRITICAL Priority (Fix Immediately — Blocks Indexing)

### 1. Implement Server-Side Rendering (SSR)
**Impact:** This single change would fix 80% of all issues found in this audit.

**Options (ranked by recommendation):**

| Option | Effort | SEO Benefit | Notes |
|--------|--------|-------------|-------|
| **A) Angular Universal (SSR)** | Medium | Excellent | Add `@angular/ssr` to existing project. Renders pages on server before sending to client. |
| **B) Prerendering (SSG)** | Low-Medium | Good | Use `@angular/prerender` to generate static HTML at build time for key public pages (landing, search, studio pages). Best for pages that don't change frequently. |
| **C) Hybrid (SSG + SSR)** | Medium-High | Excellent | Prerender static pages (landing, terms, privacy), SSR for dynamic pages (studio listings, search results). **Recommended approach.** |

**Minimum pages that MUST be server-rendered:**
- Homepage / Landing page
- Studio listing pages (`/studio/:studioSlug`)
- Studio search page (`/search/studio`)
- Contact page
- Terms & Conditions
- Privacy Policy

**Pages that can remain client-only (behind auth):**
- `/bookings`, `/newbooking`, `/payment`, `/summary`
- `/profile`, `/settings`, `/notifications`
- `/login`, `/signup`

### 2. Create a Proper robots.txt
**Impact:** Allows search engines to discover the sitemap and understand crawl rules.

```
User-agent: *
Allow: /
Disallow: /login
Disallow: /signup
Disallow: /bookings
Disallow: /newbooking
Disallow: /payment
Disallow: /profile
Disallow: /settings
Disallow: /notifications
Disallow: /forgotpassword
Disallow: /resetpassword
Disallow: /changepassword
Disallow: /socialcallback
Disallow: /redirect

Sitemap: https://bandbeat.com/sitemap.xml
```

**Implementation:** Serve this as a static file from the web server (not through Angular). In most Angular deployments (nginx/Apache), place it in the `src/assets/` folder or configure the server to serve it from root.

### 3. Create an XML Sitemap
**Impact:** Enables search engines to discover all indexable pages.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bandbeat.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bandbeat.com/landing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bandbeat.com/search/studio</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://bandbeat.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <!-- Dynamic: Add all studio listing URLs -->
  <!-- <url><loc>https://bandbeat.com/studio/{slug}</loc></url> -->
</urlset>
```

**For dynamic content:** Generate the sitemap programmatically from the database, including all active studio listing URLs. Update daily via cron job.

### 4. Fix Title Tags (Per Page)
**Impact:** Immediately improves SERP click-through rates.

| Page | Current Title | Recommended Title |
|------|--------------|-------------------|
| Homepage | "Bandbeat" | "Bandbeat - Book Music Studios Online \| Rehearsal & Recording Rooms" |
| Studio page | "Bandbeat" | "{Studio Name} - Book Now \| Bandbeat" |
| Search | "Bandbeat" | "Find Music Studios Near You \| Bandbeat" |
| Contact | "Bandbeat" | "Contact Us \| Bandbeat - Music Studio Bookings" |
| Terms | "Bandbeat" | "Terms & Conditions \| Bandbeat" |
| Privacy | "Bandbeat" | "Privacy Policy \| Bandbeat" |

**Implementation:** With SSR, use Angular's `Title` service to set dynamic titles per route. Without SSR, titles set via JS are unreliable for SEO.

---

## HIGH Priority (Fix Within 1 Week)

### 5. Add Canonical URLs
Add `<link rel="canonical" href="https://bandbeat.com/{path}">` to every page. With SSR, this should be set server-side.

### 6. Add Open Graph & Twitter Card Tags
```html
<meta property="og:title" content="Bandbeat - Book Music Studios Online">
<meta property="og:description" content="Discover, book, and manage music studio spaces smoothly with Bandbeat.">
<meta property="og:image" content="https://bandbeat.com/assets/og-image.jpg">
<meta property="og:url" content="https://bandbeat.com/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Bandbeat">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Bandbeat - Book Music Studios Online">
<meta name="twitter:description" content="Discover, book, and manage music studio spaces smoothly with Bandbeat.">
<meta name="twitter:image" content="https://bandbeat.com/assets/og-image.jpg">
```

### 7. Add Structured Data (JSON-LD)
**Homepage — Organization + WebApplication:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Bandbeat",
  "url": "https://bandbeat.com",
  "description": "Discover, book, and manage music studio spaces smoothly with Bandbeat.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://bandbeat.com/search/studio?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Studio pages — LocalBusiness/MusicVenue:**
```json
{
  "@context": "https://schema.org",
  "@type": "MusicVenue",
  "name": "{Studio Name}",
  "address": { "@type": "PostalAddress", ... },
  "image": "{studio_image_url}",
  "url": "https://bandbeat.com/studio/{slug}",
  "aggregateRating": { "@type": "AggregateRating", ... }
}
```

### 8. Fix URL Patterns
- `/privacy&policy` → `/privacy-policy` (use hyphens, not `&`)
- `/terms&conditions` → `/terms-and-conditions` or `/terms`
- Set up 301 redirects from old URLs to new

### 9. Remove `user-scalable=0` from Viewport
```html
<!-- BEFORE -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>

<!-- AFTER -->
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
```
This is a WCAG 2.1 Level AA failure and negatively affects mobile usability score.

### 10. Add Content-Security-Policy Header
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://maps.googleapis.com https://cdn.cookie-script.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://maps.googleapis.com https://bandbeat.com;
```

---

## MEDIUM Priority (Fix Within 1 Month)

### 11. Restrict Google Maps API Key
- Go to Google Cloud Console → APIs & Services → Credentials
- Add HTTP referrer restriction: `bandbeat.com/*`
- This prevents abuse and unexpected billing

### 12. Add a Proper llms.txt
Create a text file (not HTML) at `/llms.txt`:
```
# Bandbeat

> Bandbeat is a music studio booking platform that helps musicians discover, book, and manage rehearsal and recording studio spaces.

## Key Pages
- [Home](https://bandbeat.com/)
- [Find Studios](https://bandbeat.com/search/studio)
- [Contact](https://bandbeat.com/contact)

## About
Bandbeat makes it easy for musicians and bands to find and book the perfect studio for rehearsals, recordings, and jam sessions.
```

### 13. Create a security.txt
Serve at `/.well-known/security.txt`:
```
Contact: mailto:security@bandbeat.com
Preferred-Languages: en
Canonical: https://bandbeat.com/.well-known/security.txt
```

### 14. Optimize Font Loading
- The inline font-face CSS is 9,500+ bytes (91% of the HTML)
- Move font declarations to an external CSS file
- Consider self-hosting fonts instead of Google Fonts (privacy + performance)
- Only load the font weights/subsets actually used

### 15. Lazy Load Google Maps
- Google Maps JS (~300KB) is loaded on EVERY page via a `<script>` in `<head>`
- Only load it on pages that actually use maps (studio pages, search with map view)
- Use dynamic `import()` or lazy loading

### 16. Add Proper 404 Handling
- Currently all unknown URLs return 200 with the SPA shell
- Configure the server to return 404 status for unknown routes
- Or use SSR to detect invalid routes and return proper 404s

### 17. Image Optimization
Once SSR is implemented:
- Use WebP/AVIF formats with fallbacks
- Add `width`/`height` attributes to all images
- Implement responsive images with `srcset`
- Add descriptive alt text to all studio/room images
- Lazy load below-fold images

### 18. Create Content Pages
Build SEO-friendly content pages (server-rendered):
- **Blog** — Studio tips, musician guides, industry news
- **City pages** — "Music Studios in {City}" for each market
- **FAQ page** — Common questions about booking, pricing, cancellation
- **About page** — Team, mission, story (E-E-A-T signals)

---

## LOW Priority (Backlog)

### 19. Add Hreflang Tags
If the platform operates in multiple countries/languages, add proper hreflang tags.

### 20. Implement Breadcrumb Navigation
With BreadcrumbList schema markup for proper SERP display.

### 21. Add Review/Rating Schema
For studio pages with user reviews — enables star ratings in search results.

### 22. Add favicon.ico Fallback
Some browsers/crawlers still look for `favicon.ico` at root.

### 23. Increase HTML Cache Duration
`max-age=30` is very aggressive. Consider `max-age=300` (5 min) with `stale-while-revalidate`.

### 24. Code Splitting
Ensure Angular bundle is properly code-split with lazy-loaded route modules to reduce initial bundle size.

---

## Implementation Roadmap

```
Week 1: Critical fixes (#1-#4)
  - Set up Angular Universal SSR or prerendering
  - Create robots.txt and sitemap.xml
  - Fix title tags with SSR

Week 2: High priority (#5-#10)
  - Add canonical URLs, OG tags, structured data
  - Fix URL patterns with redirects
  - Fix viewport, add CSP header

Week 3-4: Medium priority (#11-#18)
  - API key restriction, llms.txt, security.txt
  - Font optimization, lazy-load Maps
  - Create content pages, image optimization

Ongoing: Monitor and iterate
  - Submit sitemap to Google Search Console
  - Monitor Core Web Vitals in CrUX
  - Track indexing status and rankings
  - Build content strategy
```

---

## Expected Score After Implementation

| Category | Current | After Critical | After All |
|----------|---------|---------------|-----------|
| Technical SEO | 8 | 20 | 23 |
| Content Quality | 2 | 15 | 22 |
| On-Page SEO | 2 | 14 | 18 |
| Schema | 0 | 7 | 9 |
| Performance | 1 | 5 | 8 |
| Images | 0 | 2 | 4 |
| AI Readiness | 1 | 3 | 4 |
| **Total** | **14** | **66** | **88** |
