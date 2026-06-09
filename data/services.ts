import { Users, HeartHandshake, UserRound, Music, Gem } from "lucide-react";

// Single source of truth for the /services page: drives the rendered cards
// (ServicesContent) and the Service/OfferCatalog schema (services/page.tsx).
// schemaName is the canonical English name used in structured data.
export const SERVICE_ITEMS = [
  { titleKey: "groupSalsaTitle", textKey: "groupSalsaText", Icon: Users, accent: "primary", href: "/#schedule", linkKey: "linkSchedule", schemaName: "Group Salsa Classes" },
  { titleKey: "groupBachataTitle", textKey: "groupBachataText", Icon: Users, accent: "pink", href: "/bachata", linkKey: "linkBachata", schemaName: "Group Bachata Classes" },
  { titleKey: "privateSalsaTitle", textKey: "privateSalsaText", Icon: UserRound, accent: "primary", href: "/#contact-form", linkKey: "linkAsk", schemaName: "Private Salsa Lessons" },
  { titleKey: "privateBachataTitle", textKey: "privateBachataText", Icon: UserRound, accent: "pink", href: "/#contact-form", linkKey: "linkAsk", schemaName: "Private Bachata Lessons" },
  { titleKey: "songChoreoTitle", textKey: "songChoreoText", Icon: Music, accent: "primary", href: "/#contact-form", linkKey: "linkAsk", schemaName: "Song Choreographies" },
  { titleKey: "coupleChoreoTitle", textKey: "coupleChoreoText", Icon: HeartHandshake, accent: "pink", href: "/#contact-form", linkKey: "linkAsk", schemaName: "Couple Choreographies" },
  { titleKey: "weddingTitle", textKey: "weddingText", Icon: Gem, accent: "primary", href: "/xorografia-gamou", linkKey: "linkWedding", schemaName: "Wedding First Dance" },
] as const;

export const SERVICE_FAQ_KEYS = [
  ["faqQ1", "faqA1"],
  ["faqQ2", "faqA2"],
  ["faqQ3", "faqA3"],
  ["faqQ4", "faqA4"],
] as const;

// Districts we teach/serve, mirrored from the About section, for areaServed.
export const SERVICE_AREAS = [
  "Athens",
  "Agios Dimitrios",
  "Dafni",
  "Nea Smyrni",
  "Alimos",
  "Glyfada",
  "Kallithea",
] as const;
