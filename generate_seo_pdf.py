"""Generate a professional PDF from the bandbeat.com SEO audit."""
from fpdf import FPDF

class AuditPDF(FPDF):
    DARK = (30, 30, 40)
    WHITE = (255, 255, 255)
    ACCENT = (120, 80, 220)
    ACCENT_LIGHT = (140, 100, 240)
    RED = (220, 60, 60)
    ORANGE = (230, 150, 40)
    GREEN = (60, 180, 100)
    GRAY = (160, 160, 170)
    LIGHT_BG = (245, 245, 250)
    ROW_ALT = (235, 235, 245)

    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(*self.GRAY)
            self.cell(0, 8, "bandbeat.com SEO Audit - March 2026", align="R")
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*self.GRAY)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def section_title(self, title, num=None):
        self.ln(6)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(*self.ACCENT)
        prefix = f"{num}. " if num else ""
        self.cell(0, 10, f"{prefix}{title}", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*self.ACCENT)
        self.set_line_width(0.6)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)

    def sub_title(self, title):
        self.ln(3)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*self.DARK)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def body_text(self, text, bold=False):
        self.set_font("Helvetica", "B" if bold else "", 10)
        self.set_text_color(*self.DARK)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def status_badge(self, status):
        colors = {
            "FAIL": self.RED, "CRITICAL": self.RED, "POOR": self.RED,
            "WARN": self.ORANGE, "MISSING": self.ORANGE, "UNKNOWN": self.ORANGE,
            "PASS": self.GREEN, "OK": self.GREEN,
            "N/A": self.GRAY,
        }
        return colors.get(status, self.GRAY)

    def table(self, headers, rows, col_widths=None):
        if not col_widths:
            avail = self.w - self.l_margin - self.r_margin
            col_widths = [avail / len(headers)] * len(headers)

        # Header
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(*self.ACCENT)
        self.set_text_color(*self.WHITE)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=0, fill=True, align="C")
        self.ln()

        # Rows
        self.set_font("Helvetica", "", 9)
        for ri, row in enumerate(rows):
            if self.get_y() > 265:
                self.add_page()
                self.set_font("Helvetica", "B", 9)
                self.set_fill_color(*self.ACCENT)
                self.set_text_color(*self.WHITE)
                for i, h in enumerate(headers):
                    self.cell(col_widths[i], 7, h, border=0, fill=True, align="C")
                self.ln()
                self.set_font("Helvetica", "", 9)

            bg = self.ROW_ALT if ri % 2 else self.LIGHT_BG
            self.set_fill_color(*bg)
            self.set_text_color(*self.DARK)

            max_lines = 1
            cell_texts = []
            for i, cell in enumerate(row):
                txt = str(cell)
                # Check if text needs wrapping
                tw = self.get_string_width(txt)
                if tw > col_widths[i] - 4:
                    lines = self._wrap_text(txt, col_widths[i] - 4)
                    max_lines = max(max_lines, len(lines))
                    cell_texts.append(lines)
                else:
                    cell_texts.append([txt])

            row_h = max_lines * 5.5
            y_start = self.get_y()

            for i, lines in enumerate(cell_texts):
                x = self.l_margin + sum(col_widths[:i])
                self.set_xy(x, y_start)

                # Draw background
                self.rect(x, y_start, col_widths[i], row_h, "F")

                # Check for status badges in first few cols
                txt_full = "\n".join(lines)
                badge_color = self.status_badge(txt_full.strip())
                if txt_full.strip() in ("FAIL", "CRITICAL", "POOR", "WARN", "MISSING", "UNKNOWN", "PASS", "OK", "N/A"):
                    self.set_text_color(*badge_color)
                    self.set_font("Helvetica", "B", 9)
                else:
                    self.set_text_color(*self.DARK)
                    self.set_font("Helvetica", "", 9)

                for li, line in enumerate(lines):
                    self.set_xy(x + 2, y_start + li * 5.5)
                    self.cell(col_widths[i] - 4, 5.5, line)

            self.set_xy(self.l_margin, y_start + row_h)

        self.ln(3)

    def _wrap_text(self, text, max_w):
        words = text.split(" ")
        lines = []
        current = ""
        for w in words:
            test = f"{current} {w}".strip()
            if self.get_string_width(test) <= max_w:
                current = test
            else:
                if current:
                    lines.append(current)
                current = w
        if current:
            lines.append(current)
        return lines if lines else [text]

    def score_bar(self, label, score, max_score, weight=""):
        pct = score / max_score if max_score else 0
        bar_w = 90
        bar_h = 8

        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        self.cell(55, bar_h, label)

        x = self.get_x()
        y = self.get_y()

        # Background
        self.set_fill_color(*self.LIGHT_BG)
        self.rect(x, y, bar_w, bar_h, "F")

        # Fill
        color = self.GREEN if pct >= 0.6 else (self.ORANGE if pct >= 0.3 else self.RED)
        self.set_fill_color(*color)
        self.rect(x, y, bar_w * pct, bar_h, "F")

        # Score text
        self.set_xy(x + bar_w + 3, y)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*color)
        self.cell(20, bar_h, f"{score}/{max_score}")

        if weight:
            self.set_font("Helvetica", "", 8)
            self.set_text_color(*self.GRAY)
            self.cell(15, bar_h, weight)

        self.ln(bar_h + 2)


def build_pdf():
    pdf = AuditPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)

    # ── Cover Page ──
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font("Helvetica", "B", 36)
    pdf.set_text_color(*AuditPDF.ACCENT)
    pdf.cell(0, 16, "SEO Audit Report", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 22)
    pdf.set_text_color(*AuditPDF.DARK)
    pdf.cell(0, 12, "bandbeat.com", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(10)
    pdf.set_draw_color(*AuditPDF.ACCENT)
    pdf.set_line_width(1)
    mid = pdf.w / 2
    pdf.line(mid - 40, pdf.get_y(), mid + 40, pdf.get_y())
    pdf.ln(10)

    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(*AuditPDF.GRAY)
    pdf.cell(0, 8, "Music Studio Booking Platform", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, "March 7, 2026", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(20)

    # Score circle
    pdf.set_font("Helvetica", "B", 60)
    pdf.set_text_color(*AuditPDF.RED)
    pdf.cell(0, 30, "14/100", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 14)
    pdf.set_text_color(*AuditPDF.GRAY)
    pdf.cell(0, 10, "Overall SEO Health Score", align="C", new_x="LMARGIN", new_y="NEXT")

    # ── Executive Summary ──
    pdf.add_page()
    pdf.section_title("Executive Summary")

    pdf.body_text(
        "Bandbeat.com is a music studio booking marketplace built as a pure Angular Single Page Application (SPA) "
        "with absolutely zero server-side rendering (SSR). This is the most severe SEO architecture problem possible: "
        "every page serves the same 10,459-byte HTML shell containing only a loading spinner, font declarations, "
        "and JavaScript bundles. Search engines cannot see any content on the site."
    )

    pdf.ln(2)
    pdf.sub_title("Score Breakdown")
    pdf.score_bar("Technical SEO", 8, 25, "25%")
    pdf.score_bar("Content Quality", 2, 25, "25%")
    pdf.score_bar("On-Page SEO", 2, 20, "20%")
    pdf.score_bar("Schema / Structured Data", 0, 10, "10%")
    pdf.score_bar("Performance (CWV)", 1, 10, "10%")
    pdf.score_bar("Images", 0, 5, "5%")
    pdf.score_bar("AI Search Readiness", 1, 5, "5%")

    pdf.ln(4)
    pdf.sub_title("Top 5 Critical Issues")
    critical = [
        "No server-side rendering - all content invisible to crawlers (0 indexable text)",
        "No robots.txt - returns the SPA shell instead of a proper robots file",
        "No sitemap.xml - returns the SPA shell instead of XML",
        "No structured data - zero JSON-LD, microdata, or RDFa",
        "No crawlable links - zero internal links in HTML source for bots to discover pages",
    ]
    for i, item in enumerate(critical, 1):
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(*AuditPDF.RED)
        pdf.cell(8, 6, f"{i}.")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(*AuditPDF.DARK)
        pdf.multi_cell(0, 6, item)
        pdf.ln(1)

    pdf.ln(2)
    pdf.sub_title("Top 5 Quick Wins")
    wins = [
        "Add a proper robots.txt file (served statically, not through Angular)",
        "Add a proper sitemap.xml with all studio listing URLs",
        "Add Open Graph and Twitter Card meta tags",
        'Fix the <title> tag (currently just "Bandbeat")',
        "Remove user-scalable=0 from viewport meta (accessibility violation)",
    ]
    for i, item in enumerate(wins, 1):
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(*AuditPDF.GREEN)
        pdf.cell(8, 6, f"{i}.")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(*AuditPDF.DARK)
        pdf.multi_cell(0, 6, item)
        pdf.ln(1)

    # ── 1. Technical SEO ──
    pdf.add_page()
    pdf.section_title("Technical SEO", 1)

    pdf.sub_title("1.1 Crawlability - CRITICAL FAILURE")
    pdf.table(
        ["Check", "Status", "Details"],
        [
            ["Server-Side Rendering", "FAIL", "Pure client-side SPA. Body contains only <app-root> with a loading spinner"],
            ["robots.txt", "FAIL", "Returns index.html (200 + 10,459 bytes of HTML, not a robots file)"],
            ["sitemap.xml", "FAIL", "Returns index.html (200 + 10,459 bytes of HTML, not XML)"],
            ["Crawlable content", "FAIL", "0 bytes of text content in HTML source"],
            ["Internal links in HTML", "FAIL", "0 <a> tags in the server-rendered HTML"],
            ["Response code handling", "WARN", "All routes return 200 with identical HTML (no true 404 pages)"],
        ],
        [45, 20, 125],
    )

    pdf.body_text(
        "Impact: Google and other search engines see an empty page with a loading animation. While Googlebot can "
        "render JavaScript, it deprioritizes JS-only pages, delays indexing significantly (days to weeks), and may "
        "not render all dynamic content. For a marketplace with potentially hundreds of studio listings, this means "
        "near-zero organic discoverability."
    )

    pdf.sub_title("1.2 Indexability")
    pdf.table(
        ["Check", "Status", "Details"],
        [
            ["Canonical URL", "FAIL", "No <link rel='canonical'> tag"],
            ["Meta robots", "MISSING", "No meta robots tag (defaults to index,follow - but nothing to index)"],
            ["Hreflang", "MISSING", "No internationalization tags"],
            ["Duplicate content", "CRITICAL", "Every URL returns identical HTML, creating massive duplicate content signals"],
        ],
        [45, 20, 125],
    )

    pdf.sub_title("1.3 URL Structure")
    pdf.table(
        ["Check", "Status", "Details"],
        [
            ["Clean URLs", "FAIL", "Uses & in paths: /privacy&policy, /terms&conditions"],
            ["URL consistency", "WARN", "Mix of nested (/search/studio/name) and flat (/landing) patterns"],
            ["Trailing slashes", "OK", "Consistent (no trailing slashes)"],
        ],
        [45, 20, 125],
    )

    pdf.sub_title("1.4 Security Headers")
    pdf.table(
        ["Header", "Status", "Value"],
        [
            ["HTTPS", "PASS", "Enforced"],
            ["HSTS", "PASS", "max-age=10886400; includeSubDomains; preload"],
            ["X-Content-Type-Options", "PASS", "nosniff"],
            ["X-XSS-Protection", "PASS", "1; mode=block"],
            ["Referrer-Policy", "PASS", "same-origin"],
            ["Content-Security-Policy", "FAIL", "Missing entirely"],
            ["Permissions-Policy", "FAIL", "Missing entirely"],
            ["security.txt", "FAIL", "Returns 404"],
        ],
        [50, 20, 120],
    )

    pdf.sub_title("1.5 Security Concern")
    pdf.body_text(
        "Google Maps API key is exposed in HTML source: AIzaSyDMSFZTw-ckMDIAHncu-chfssqvDgGHnEc. "
        "This key should be restricted by HTTP referrer in the Google Cloud Console. If unrestricted, "
        "it can be abused, leading to unexpected billing."
    )

    pdf.sub_title("1.6 Mobile Optimization")
    pdf.table(
        ["Check", "Status", "Details"],
        [
            ["Viewport meta", "WARN", "Has user-scalable=0 - blocks pinch-to-zoom (WCAG 2.1 failure)"],
            ["Responsive design", "UNKNOWN", "Cannot assess (content is JS-rendered)"],
        ],
        [45, 20, 125],
    )

    # ── 2. Content Quality ──
    pdf.add_page()
    pdf.section_title("Content Quality", 2)

    pdf.sub_title("2.1 E-E-A-T Assessment")
    pdf.table(
        ["Signal", "Status", "Details"],
        [
            ["Expertise", "FAIL", "No crawlable content demonstrates expertise"],
            ["Experience", "FAIL", "No reviews, testimonials, or case studies visible to crawlers"],
            ["Authoritativeness", "FAIL", "No about page content, team info, or credentials crawlable"],
            ["Trustworthiness", "WARN", "HTTPS present, but no visible trust signals"],
        ],
        [40, 20, 130],
    )

    pdf.sub_title("2.2 Content Analysis")
    pdf.table(
        ["Check", "Status", "Details"],
        [
            ["H1 tag", "FAIL", "No H1 in HTML source"],
            ["Heading hierarchy", "FAIL", "No headings at all in HTML source"],
            ["Body text", "FAIL", "0 words of crawlable text content"],
            ["Thin content", "CRITICAL", "Every page has 0 words of content for crawlers"],
            ["Duplicate content", "CRITICAL", "All URLs serve identical empty HTML"],
        ],
        [45, 20, 125],
    )

    pdf.sub_title("2.3 Meta Tags")
    pdf.table(
        ["Tag", "Status", "Content"],
        [
            ["<title>", "POOR", '"Bandbeat" - too short, not descriptive, missing keywords'],
            ["<meta name='title'>", "WARN", "Good content but non-standard; search engines use <title>"],
            ["<meta name='description'>", "OK", "Decent but only 126 chars (target 150-160)"],
            ["Open Graph", "FAIL", "No OG tags at all"],
            ["Twitter Card", "FAIL", "No Twitter Card tags"],
        ],
        [45, 20, 125],
    )

    # ── 3. On-Page SEO ──
    pdf.add_page()
    pdf.section_title("On-Page SEO", 3)

    pdf.sub_title("3.1 Title Tags")
    pdf.body_text(
        'Homepage: "Bandbeat" (7 characters) - Far too short. Should be 50-60 characters.\n'
        'All other pages: "Bandbeat" - Same title for every page (no dynamic titles via SSR).\n'
        "Recommended format: {Page Name} | Bandbeat - Music Studio Booking Platform"
    )

    pdf.sub_title("3.2 Heading Structure")
    pdf.body_text(
        "No headings exist in the server-rendered HTML. After JS execution, Angular likely renders headings, but:\n"
        "- Googlebot's JS rendering is delayed and unreliable\n"
        "- Other search engines (Bing, Yandex, DuckDuckGo) have limited JS rendering\n"
        "- AI crawlers (GPTBot, ClaudeBot, PerplexityBot) typically don't execute JS"
    )

    pdf.sub_title("3.3 Internal Linking")
    pdf.body_text(
        "0 internal links in HTML source. All navigation is Angular router (client-side). "
        "Search engines cannot discover any pages from the homepage. PageRank cannot flow between pages."
    )

    pdf.sub_title("3.4 Discovered Routes (from JS bundle analysis)")
    routes = [
        "/landing", "/login", "/signup", "/contact",
        "/studio/:studioSlug", "/band/:bandSlug", "/user/:userSlug",
        "/search/studio", "/search/studio/name",
        "/bookings", "/newbooking", "/payment", "/summary",
        "/privacy&policy", "/terms&conditions",
        "/profile", "/settings", "/notifications",
        "/wizard", "/error", "/notfound",
    ]
    route_text = ", ".join(routes)
    pdf.body_text(f"~45 routes found: {route_text}")

    # ── 4. Schema ──
    pdf.section_title("Schema / Structured Data", 4)
    pdf.body_text("No structured data of any kind was found (JSON-LD, Microdata, or RDFa).")
    pdf.ln(2)
    pdf.sub_title("Recommended Schema Types for Bandbeat")
    schemas = [
        ["Organization", "For Bandbeat itself"],
        ["WebApplication", "For the booking platform"],
        ["MusicVenue / LocalBusiness", "For each studio listing"],
        ["Offer", "For studio room pricing"],
        ["SearchAction", "For the studio search functionality"],
        ["BreadcrumbList", "For navigation structure"],
        ["AggregateRating / Review", "For studio reviews"],
    ]
    pdf.table(["Schema Type", "Use Case"], schemas, [60, 130])

    # ── 5. Performance ──
    pdf.add_page()
    pdf.section_title("Performance", 5)

    pdf.sub_title("5.1 Resource Analysis")
    pdf.table(
        ["Resource", "Size", "Issue"],
        [
            ["HTML shell", "10,459 bytes", "~9,500 bytes are inline font-face CSS (91% bloat)"],
            ["main.js", "Unknown (hashed)", "Single large bundle (no code splitting visible)"],
            ["Google Maps JS", "~300KB+", "Loaded on EVERY page, even non-map pages"],
            ["Cookie Script", "External", "Loaded on all pages"],
        ],
        [45, 40, 105],
    )

    pdf.sub_title("5.2 Core Web Vitals Concerns")
    pdf.table(
        ["Metric", "Expected", "Reason"],
        [
            ["LCP", "POOR", "Content requires JS execution; LCP element blocked until Angular bootstraps"],
            ["INP", "UNKNOWN", "Cannot measure without rendering"],
            ["CLS", "POOR", "Content popping in after JS load causes layout shifts"],
            ["FCP", "POOR", "First meaningful paint blocked by JS bundle download + parse + execute"],
            ["TTFB", "OK", "200ms range (acceptable)"],
        ],
        [30, 25, 135],
    )

    # ── 6. Images ──
    pdf.section_title("Images", 6)
    pdf.body_text(
        "Cannot assess - zero images in server-rendered HTML. All images are loaded dynamically via Angular.\n\n"
        "Recommendations once SSR is implemented:\n"
        "- Use srcset and sizes for responsive images\n"
        "- Use WebP/AVIF formats with fallbacks\n"
        "- Add descriptive alt text to all images\n"
        "- Implement lazy loading for below-fold images\n"
        "- Add width and height attributes to prevent CLS"
    )

    # ── 7. AI Search Readiness ──
    pdf.section_title("AI Search Readiness / GEO", 7)
    pdf.table(
        ["Check", "Status", "Details"],
        [
            ["llms.txt", "FAIL", "Returns SPA shell (200 but HTML, not text)"],
            ["AI crawler accessibility", "FAIL", "GPTBot, ClaudeBot, PerplexityBot see empty page"],
            ["Citability", "FAIL", "No crawlable content to cite"],
            ["Passage-level optimization", "FAIL", "No passages exist in HTML source"],
        ],
        [50, 20, 120],
    )

    # ═══════════════════════════════════════════
    # ACTION PLAN
    # ═══════════════════════════════════════════
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("Helvetica", "B", 28)
    pdf.set_text_color(*AuditPDF.ACCENT)
    pdf.cell(0, 14, "Action Plan", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 14)
    pdf.set_text_color(*AuditPDF.GRAY)
    pdf.cell(0, 10, "Prioritized Recommendations", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    pdf.set_draw_color(*AuditPDF.ACCENT)
    pdf.set_line_width(0.8)
    mid = pdf.w / 2
    pdf.line(mid - 30, pdf.get_y(), mid + 30, pdf.get_y())
    pdf.ln(10)

    # ── CRITICAL ──
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(*AuditPDF.RED)
    pdf.cell(0, 10, "CRITICAL - Fix Immediately", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    actions_critical = [
        (
            "1. Implement Server-Side Rendering (SSR)",
            "This single change would fix 80% of all issues. Options:\n"
            "A) Angular Universal SSR - Add @angular/ssr to existing project (Medium effort, Excellent SEO benefit)\n"
            "B) Prerendering SSG - Generate static HTML at build time for key pages (Low-Medium effort, Good benefit)\n"
            "C) Hybrid SSG + SSR - Prerender static pages, SSR for dynamic pages (Recommended approach)\n\n"
            "Minimum SSR pages: Homepage, Studio listings, Studio search, Contact, Terms, Privacy\n"
            "Client-only OK: Bookings, Payment, Profile, Settings, Login/Signup"
        ),
        (
            "2. Create a Proper robots.txt",
            "Serve as a static file from the web server (not through Angular). Must include:\n"
            "- Allow: / for all user-agents\n"
            "- Disallow: /login, /signup, /bookings, /payment, /profile, /settings\n"
            "- Sitemap: https://bandbeat.com/sitemap.xml"
        ),
        (
            "3. Create an XML Sitemap",
            "Generate programmatically from the database. Include all active studio listing URLs. "
            "Update daily via cron job. Submit to Google Search Console."
        ),
        (
            "4. Fix Title Tags (Per Page)",
            'Homepage: "Bandbeat - Book Music Studios Online | Rehearsal & Recording Rooms"\n'
            'Studio page: "{Studio Name} - Book Now | Bandbeat"\n'
            'Search: "Find Music Studios Near You | Bandbeat"\n'
            "Use Angular's Title service with SSR for dynamic titles."
        ),
    ]

    for title, desc in actions_critical:
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(*AuditPDF.DARK)
        pdf.cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9.5)
        pdf.set_text_color(80, 80, 90)
        pdf.multi_cell(0, 5, desc)
        pdf.ln(3)

    # ── HIGH ──
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(*AuditPDF.ORANGE)
    pdf.cell(0, 10, "HIGH - Fix Within 1 Week", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    actions_high = [
        ("5. Add Canonical URLs", "Add <link rel='canonical'> to every page. Set server-side with SSR."),
        (
            "6. Add Open Graph & Twitter Card Tags",
            "og:title, og:description, og:image, og:url, og:type, og:site_name + twitter:card, twitter:title, twitter:description, twitter:image"
        ),
        (
            "7. Add Structured Data (JSON-LD)",
            "Homepage: Organization + WebApplication + SearchAction schema.\n"
            "Studio pages: MusicVenue/LocalBusiness with address, image, aggregateRating.\n"
            "All pages: BreadcrumbList for navigation."
        ),
        (
            "8. Fix URL Patterns",
            "/privacy&policy -> /privacy-policy (use hyphens, not &)\n"
            "/terms&conditions -> /terms-and-conditions or /terms\n"
            "Set up 301 redirects from old URLs to new."
        ),
        (
            "9. Remove user-scalable=0 from Viewport",
            "Change to: <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n"
            "This is a WCAG 2.1 Level AA failure and hurts mobile usability score."
        ),
        ("10. Add Content-Security-Policy Header", "Define allowed sources for scripts, styles, fonts, images, and connections."),
    ]

    for title, desc in actions_high:
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(*AuditPDF.DARK)
        pdf.cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9.5)
        pdf.set_text_color(80, 80, 90)
        pdf.multi_cell(0, 5, desc)
        pdf.ln(3)

    # ── MEDIUM ──
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(60, 130, 200)
    pdf.cell(0, 10, "MEDIUM - Fix Within 1 Month", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    actions_medium = [
        ("11. Restrict Google Maps API Key", "Add HTTP referrer restriction in Google Cloud Console: bandbeat.com/*"),
        ("12. Add a Proper llms.txt", "Create a text file (not HTML) describing the business, key pages, and purpose for AI crawlers."),
        ("13. Create a security.txt", "Serve at /.well-known/security.txt with contact and preferred language info."),
        ("14. Optimize Font Loading", "Move 9,500+ bytes of inline font-face CSS to external file. Consider self-hosting fonts."),
        ("15. Lazy Load Google Maps", "Only load Maps JS (~300KB) on pages that use maps, not globally."),
        ("16. Add Proper 404 Handling", "Return 404 status for unknown routes. Currently all return 200 with the SPA shell."),
        ("17. Image Optimization", "Once SSR is implemented: WebP/AVIF, srcset, alt text, lazy loading, width/height attributes."),
        ("18. Create Content Pages", "Blog (studio tips, musician guides), City pages, FAQ page, About page for E-E-A-T signals."),
    ]

    for title, desc in actions_medium:
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(*AuditPDF.DARK)
        pdf.cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9.5)
        pdf.set_text_color(80, 80, 90)
        pdf.multi_cell(0, 5, desc)
        pdf.ln(2)

    # ── LOW ──
    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(*AuditPDF.GREEN)
    pdf.cell(0, 10, "LOW - Backlog", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    actions_low = [
        "19. Add Hreflang Tags (if multi-language/region)",
        "20. Implement Breadcrumb Navigation with BreadcrumbList schema",
        "21. Add Review/Rating Schema for studio pages",
        "22. Add favicon.ico fallback",
        "23. Increase HTML Cache Duration (max-age=300)",
        "24. Code Splitting for Angular bundle",
    ]
    for item in actions_low:
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(*AuditPDF.DARK)
        pdf.cell(6, 6, "-")
        pdf.cell(0, 6, item, new_x="LMARGIN", new_y="NEXT")

    # ── Implementation Roadmap ──
    pdf.add_page()
    pdf.section_title("Implementation Roadmap")

    pdf.table(
        ["Timeline", "Actions", "Expected Score Impact"],
        [
            ["Week 1", "SSR setup, robots.txt, sitemap.xml, fix titles", "14 -> 45"],
            ["Week 2", "Canonical, OG tags, structured data, fix URLs, viewport, CSP", "45 -> 66"],
            ["Week 3-4", "API key, llms.txt, fonts, lazy Maps, 404s, images, content pages", "66 -> 78"],
            ["Ongoing", "Monitor Search Console, build content, track CWV, iterate", "78 -> 88+"],
        ],
        [30, 100, 60],
    )

    pdf.ln(6)
    pdf.sub_title("Expected Score Progression")
    pdf.ln(2)

    progression = [
        ("Technical SEO", 8, 23, 25),
        ("Content Quality", 2, 22, 25),
        ("On-Page SEO", 2, 18, 20),
        ("Schema", 0, 9, 10),
        ("Performance", 1, 8, 10),
        ("Images", 0, 4, 5),
        ("AI Readiness", 1, 4, 5),
    ]

    pdf.table(
        ["Category", "Current", "After All Fixes", "Max"],
        [[name, str(curr), str(after), str(mx)] for name, curr, after, mx in progression],
        [60, 35, 50, 45],
    )

    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(*AuditPDF.ACCENT)
    pdf.cell(60, 10, "Current Total:")
    pdf.set_text_color(*AuditPDF.RED)
    pdf.cell(30, 10, "14/100")
    pdf.ln(8)
    pdf.set_text_color(*AuditPDF.ACCENT)
    pdf.cell(60, 10, "Projected Total:")
    pdf.set_text_color(*AuditPDF.GREEN)
    pdf.cell(30, 10, "88/100")

    # ── What's Good ──
    pdf.ln(14)
    pdf.sub_title("What's Already Good")
    good_items = [
        "Security headers are solid (HSTS, X-Content-Type-Options, X-XSS-Protection)",
        "HTTPS enforced across all pages",
        "Meta description exists (will be effective once SSR is added)",
        "Font-display: swap used correctly for Roboto",
        "Content-hashed JS bundles (good for caching)",
        "Cookie consent (cookie-script.com) properly loaded on production",
    ]
    for item in good_items:
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(*AuditPDF.GREEN)
        pdf.cell(6, 6, "+")
        pdf.set_text_color(*AuditPDF.DARK)
        pdf.cell(0, 6, item, new_x="LMARGIN", new_y="NEXT")

    # Save
    path = r"c:\Users\nikos\Desktop\repos\salsa-rayo\bandbeat-seo-audit.pdf"
    pdf.output(path)
    print(f"PDF generated: {path}")


if __name__ == "__main__":
    build_pdf()
