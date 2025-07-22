# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Salsa Rayo is a Next.js 15 web application for a dance school specializing in salsa. It features a modern, animated single-page design with sections for hero, about, schedule, booking, map, socials, and contact form.

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture Overview

### Tech Stack

- **Next.js 15.1.3** with App Router and Turbopack
- **React 19.0.0** with TypeScript
- **Tailwind CSS** with DaisyUI component library (sunset theme)
- **Framer Motion** for scroll-triggered animations
- **Day.js** for date handling in schedule

### Key Architectural Decisions

1. **Component Structure**: Follows atomic design with components organized by type (layout, sections, UI primitives). Each major page section is self-contained in `/components/sections/`.

2. **Styling Strategy**:

   - Uses DaisyUI's "sunset" theme with custom overrides (primary: #18A07B, accent: #7737b8)
   - Gradient styles centralized in `data/config.ts` as `GRADIENT_STYLE`
   - Custom fonts loaded via @font-face (Faculty, Roboto, Space Grotesk)

3. **State Management**: Simple React hooks for local state. No global state management needed for current scope.

4. **Data Flow**:

   - Static data (schedule, config) in `/data` directory
   - Contact form submits to `/api/send-mail` endpoint
   - Schedule data structure supports bilingual content (en/el)

5. **Animation Pattern**: Most sections use Framer Motion with `whileInView` animations, typically fading in and scaling from 0.95 to 1.

### Important Files

- `data/config.ts`: Central configuration including styles, animation variants, and site metadata
- `data/schedule.ts`: Class schedule with commented-out Friday classes
- `app/layout.tsx`: Root layout with metadata and Jupiter terminal script
- `components/BackgroundEffects.tsx`: Floating music note animations

### Special Considerations

2. **Bilingual Support**: Config structure supports English/Greek but currently only English is implemented
3. **Mobile Navigation**: Uses drawer pattern with hamburger menu on mobile devices
4. **Performance**: Home page sets `revalidate = 0` to disable caching

### Common Patterns

- All interactive components use `"use client"` directive
- Components typically accept className prop for styling flexibility
- Sections follow consistent structure with container, title, and content
- Form components integrate with DaisyUI form control patterns
- Icons come from react-icons or custom SVG components in `/components/icons/`
