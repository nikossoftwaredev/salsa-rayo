# Lessons Learned

Rules and patterns captured from user corrections. Review at session start.

---

## shadcn/ui Sizing

**Mistake**: Used custom Tailwind classes (`h-12 text-base`) to size shadcn components.
**Rule**: ALWAYS use the built-in `size` variant (`size="lg"`). Never override with custom height/text classes.
**Rule**: Before adding classNames to a shadcn component, check its CVA variants first to avoid duplicating existing styles.

## Icon Sizing (react-icons)

**Mistake**: Used `size` prop inside shadcn Button — it sets HTML attributes but Button's CSS `[&_svg:not([class*='size-'])]:size-4` overrides them (CSS properties always beat HTML attributes).
**Rule**: Inside shadcn Button, use a Tailwind `!size-*` class: `<MdIcon className="!size-7" />`. The `size-*` class opts out of Button's forced sizing AND sets dimensions via CSS.
**Rule**: Outside shadcn Button (or components without SVG CSS overrides), the `size` prop works fine: `<MdIcon size={22} />`.

## Icon Alignment in Inputs

**Mistake**: Tried absolute positioning (`top-1/2 -translate-y-1/2`), built-in icon props, shadcn InputGroup with complex `has` selectors — all failed.
**Rule**: Use plain `<div className="flex items-center gap-3">` with `<span>` for icon and native `<input>` for text. Simple flexbox always works. Don't fight complex CSS selector chains in Tailwind v4.

## Tailwind v4 Limitations

**Mistake**: Used complex arbitrary variants like `[&>svg]:size-5` and `has-[>[data-align=inline-start]]:[&>input]:pl-2`.
**Rule**: Tailwind v4's JIT scanner does NOT reliably generate complex arbitrary variant selectors. Keep selectors simple. If a selector doesn't work, use a simpler approach rather than debugging the scanner.

## Button Components

**Mistake**: Used raw inline-styled `<Link>` with gradient classes instead of the existing `Button` component.
**Rule**: Always use the `Button` component with `variant="gradient"` and `asChild` + `<Link>` when a link needs to look like a button. Don't reinvent styles that already exist in the design system.

## Prefer shadcn/ui Over Native Elements

**Rule**: Always use shadcn/ui components (`Button`, `Input`, `Badge`, `Table`, etc.) instead of native HTML elements (`<button>`, `<input>`, `<table>`) when a shadcn component exists for that purpose.
**Rule**: Before adding custom Tailwind classes to a shadcn component, check its default styles and CVA variants first. Don't add classes that duplicate what the component already provides.

## Use Prisma Generated Types

**Rule**: If a Prisma model exists for data coming from the DB, ALWAYS use the Prisma generated type (e.g., `Student`, `Subscription` from `@prisma/client`). NEVER create redundant interfaces like `StudentRow` that duplicate the Prisma schema — it's unsafe and causes drift when the schema changes.

## Don't Over-Engineer

**Mistake**: Added question mark icons to every FAQ item, numbered items, etc.
**Rule**: Less is more. Small decorative dots > heavy icons when items are repeated many times. Avoid visual clutter.

## Never Use Native alert/confirm

**Mistake**: Used `window.confirm()` and `alert()` for delete confirmations and error messages.
**Rule**: ALWAYS use the zustand `useConfirmStore` + shadcn `AlertDialog` based `ConfirmDialog`. Never use native browser dialogs — they're ugly and inconsistent.
**Usage**: `confirm({ title, description, actionLabel?, onConfirm })`

## Image Upload/Preview Shape Must Match

**Mistake**: Made the upload dropzone square but the preview circular (different `rounded` values).
**Rule**: The image preview shape should always match the dropzone shape. Use the same `rounded` prop for both states.

## Server-Side Image Compression

**Rule**: Use `sharp` server-side for image compression (in `lib/files/upload.ts`), NOT client-side Canvas API. All images go through `uploadFile` → compressed to WebP at quality 85, max 1200px.

## Delete Actions Should Clean Up Storage

**Rule**: When deleting a record that has an uploaded image (e.g., Instructor), also delete the image from Supabase storage. Use `.catch(console.error)` so storage failures don't block the DB delete.
