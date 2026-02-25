# Lessons Learned

Rules and patterns captured from user corrections. Review at session start.

---

## shadcn/ui Sizing

**Mistake**: Used custom Tailwind classes (`h-12 text-base`) to size shadcn components.
**Rule**: ALWAYS use the built-in `size` variant (`size="lg"`). Never override with custom height/text classes.
**Rule**: Before adding classNames to a shadcn component, check its CVA variants first to avoid duplicating existing styles.

## Icon Sizing (react-icons)

**Mistake**: Tried sizing icons with Tailwind classes (`w-5 h-5`, `text-xl`, `[&>svg]:size-5`).
**Rule**: Use the `size` prop on react-icons: `<MdIcon size={22} />`. This is the reliable way.

## Icon Alignment in Inputs

**Mistake**: Tried absolute positioning (`top-1/2 -translate-y-1/2`), built-in icon props, shadcn InputGroup with complex `has` selectors — all failed.
**Rule**: Use plain `<div className="flex items-center gap-3">` with `<span>` for icon and native `<input>` for text. Simple flexbox always works. Don't fight complex CSS selector chains in Tailwind v4.

## Tailwind v4 Limitations

**Mistake**: Used complex arbitrary variants like `[&>svg]:size-5` and `has-[>[data-align=inline-start]]:[&>input]:pl-2`.
**Rule**: Tailwind v4's JIT scanner does NOT reliably generate complex arbitrary variant selectors. Keep selectors simple. If a selector doesn't work, use a simpler approach rather than debugging the scanner.

## Button Components

**Mistake**: Used raw inline-styled `<Link>` with gradient classes instead of the existing `Button` component.
**Rule**: Always use the `Button` component with `variant="gradient"` and `asChild` + `<Link>` when a link needs to look like a button. Don't reinvent styles that already exist in the design system.

## Don't Over-Engineer

**Mistake**: Added question mark icons to every FAQ item, numbered items, etc.
**Rule**: Less is more. Small decorative dots > heavy icons when items are repeated many times. Avoid visual clutter.
