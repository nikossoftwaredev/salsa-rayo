# Claude AI Development Guidelines

This document contains important development guidelines and best practices to follow when working on this codebase.

## General Development Guidelines

- **NEVER RUN THE DEV SERVER YOURSELF I RUN IT**

## shadcn/ui Component Sizing

- **Always use the component's built-in `size` variant** (e.g., `size="lg"`) for sizing shadcn/ui components. NEVER use custom Tailwind classes like `h-12 text-base` to override sizes.
- **Before adding extra classNames to a shadcn component**, check its existing base styles first to avoid duplicating or conflicting with styles already defined in the component (e.g., don't add `text-base` if it's already in the component's CVA variants).

## Icon Library Preference

**Always use `react-icons` for icons in this project. Do NOT use `lucide-react` or other icon libraries.**

Common icon imports:

- `import { IoClose } from "react-icons/io5"` for close/X icons
- `import { MdOutlineHive } from "react-icons/md"` for hive icons
- Check existing components for other icon usage patterns

## React useEffect Best Practices

### Core Principles

1. **Minimal Dependencies**: Only include variables in the dependency array that are actually used inside the effect AND whose changes should trigger the effect to re-run.

2. **Avoid Circular Dependencies**: Never include state in dependencies if the useEffect updates that same state. This causes infinite loops.

3. **Prefer Derived State**: If you can compute a value from props/state, do it directly in the render rather than using useEffect.

### Common Anti-patterns to Avoid

#### ❌ BAD: Infinite Loop Pattern

```javascript
// This causes infinite re-renders!
useEffect(() => {
  if (someCondition) {
    setStatus("ready");
  } else {
    setStatus("loading");
  }
}, [status, someCondition]); // status is both read and written!
```

#### ✅ GOOD: Derived State Pattern

```javascript
// Compute status directly from state
const status = someCondition ? "ready" : "loading";
```

#### ❌ BAD: Unnecessary useEffect for State Sync

```javascript
useEffect(() => {
  setInternalValue(propValue);
}, [propValue]);
```

#### ✅ GOOD: Direct Initialization

```javascript
const [internalValue, setInternalValue] = useState(propValue);
// Only use useEffect if you need to handle prop changes differently
```

### Memory Leak Prevention

Always use the isMountedRef pattern for async operations:

```javascript
const isMountedRef = useRef(true);

useEffect(() => {
  isMountedRef.current = true;

  const fetchData = async () => {
    const data = await someAsyncCall();
    if (isMountedRef.current) {
      setData(data); // Only update if still mounted
    }
  };

  fetchData();

  return () => {
    isMountedRef.current = false;
  };
}, []);
```

### Cleanup Best Practices

Always clean up resources in the return function:

```javascript
useEffect(() => {
  const stream = navigator.mediaDevices.getUserMedia({ audio: true });
  const interval = setInterval(() => {}, 1000);
  const listener = () => {};
  window.addEventListener("resize", listener);

  return () => {
    // Clean up everything
    stream?.getTracks().forEach((track) => track.stop());
    clearInterval(interval);
    window.removeEventListener("resize", listener);
  };
}, []);
```

## Performance Optimization

### useCallback and useMemo Guidelines

1. **ALWAYS use useCallback/useMemo when passing to child components**: Any function or object passed as a prop to another component MUST be wrapped in useCallback or useMemo to prevent unnecessary re-renders.

```javascript
// ❌ BAD: Creates new object/function on every render
const config = {
  voices: data,
  isLoading: false,
};

const handleClick = () => doSomething();

return <ChildComponent config={config} onClick={handleClick} />;

// ✅ GOOD: Memoized references
const config = useMemo(
  () => ({
    voices: data,
    isLoading: false,
  }),
  [data]
);

const handleClick = useCallback(() => doSomething(), []);

return <ChildComponent config={config} onClick={handleClick} />;
```

2. **Don't Over-Optimize Internal Functions**: Only use useCallback/useMemo when:

   - The function/value is passed to a child component
   - The computation is expensive
   - The function is a dependency of another hook

3. **Simple Internal Functions Don't Need Memoization**:

```javascript
// ❌ Unnecessary for internal use
const handleClick = useCallback(() => setOpen(true), []);

// ✅ Better for internal use only
const handleClick = () => setOpen(true);
```

## State Management Patterns

### Derived State Over useEffect

Always prefer computing values during render:

```javascript
// ❌ BAD
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ GOOD: Simple derived state
const fullName = `${firstName} ${lastName}`;

// ✅ GOOD: Complex derived state with useMemo
const processedData = useMemo(() => {
  // Complex calculation or transformation
  return data
    .filter((item) => item.active)
    .map((item) => ({ ...item, fullName: `${item.first} ${item.last}` }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}, [data]);
```

**Rule of thumb**: If a useEffect only sets state and that state is used in only one place, replace it with either:

- Direct computation for simple logic
- useMemo for complex/expensive logic

### Complex State Logic

For complex state with multiple transitions, consider using useReducer or a state machine instead of multiple useState + useEffect combinations.

## Testing Considerations

When using useEffect:

1. Always test cleanup functions
2. Test edge cases like rapid mounting/unmounting
3. Verify no state updates happen after unmount

Remember: The best useEffect is often no useEffect at all. Always ask yourself if you really need it!

## General Development Guidelines

### Package Manager

- **Always use pnpm** - Never use npm or yarn

### Styling

- **Always use Tailwind CSS** for styling
- **Always use shadcn/ui components** when available
- **Use semantic color naming** from global.css (e.g., `text-foreground`, `bg-background`, not `text-gray-900`)

### Code Style

- **Always use arrow functions** - No function declarations

```typescript
// ❌ BAD
function doSomething() {}

// ✅ GOOD
const doSomething = () => {};
```

- **Single-line if statements** - Remove braces for single-line conditions

```typescript
// ❌ BAD
if (condition) {
  return true;
}

// ✅ GOOD
if (condition) return true;
```

### Component Architecture

1. **Server/Client Component Separation**:
   - Keep `page.tsx` and `layout.tsx` as server components
   - Create separate client components when needed
   - Never add "use client" to server components

```typescript
// ❌ BAD: page.tsx
"use client";
export default function Page() { ... }

// ✅ GOOD: page.tsx (server component)
import { ClientComponent } from "./ClientComponent";
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}
```

2. **Use proper type imports**:
   - Use `PageProps` types for page.tsx
   - Use `LayoutProps` types for layout.tsx
   - Import from `pageprops.ts`

### Code Organization

1. **Interface Location**:
   - Place component interface immediately before component definition
   - Shared interfaces go in `/types` folder

```typescript
// ✅ Component with local interface
interface MyComponentProps {
  title: string;
}

const MyComponent = ({ title }: MyComponentProps) => { ... }

// ✅ Shared interface in /types/common.ts
export interface SharedData {
  id: string;
  name: string;
}
```

2. **Static Objects**:
   - Define static objects outside components to prevent recreation

```typescript
// ❌ BAD
const Component = () => {
  const OPTIONS = { foo: 'bar' };
  ...
}

// ✅ GOOD
const OPTIONS = { foo: 'bar' };
const Component = () => { ... }
```

3. **Component Structure**:
   - **CRITICAL: Place ALL useEffects immediately before the return statement** - Not at the top of the component, but right before the first return
   - Group related hooks together
   - Order: state declarations → callbacks → useEffects → return statement

```typescript
// ✅ CORRECT: useEffect placement
const Component = () => {
  const [state, setState] = useState();

  const handleClick = useCallback(() => {
    // handler logic
  }, []);

  // ALL useEffects go here - right before return
  useEffect(() => {
    // effect logic
  }, []);

  return <div>...</div>;
};
```

### Function Parameters

For functions with more than 2 parameters, use object parameters:

```typescript
// ❌ BAD
const processData = (
  id: string,
  name: string,
  age: number,
  active: boolean
) => {};

// ✅ GOOD
const processData = ({ id, name, age, active }: ProcessDataParams) => {};
```

### Project Configuration

- Project uses `next.config.ts` (TypeScript config)

### Code Review Mindset

- **Always question yourself**: Is this implementation correct?
- **Question requests**: Push back on requirements that seem incorrect
- **Be critical**: Don't always agree - provide constructive feedback when something could be improved
- **Search the web for updates**: Current year is 2025 - check for latest best practices and patterns
- **Take a step back**: Review the whole implementation as a whole and suggest more robust and cleaner approaches when applicable

### Error Checking Protocol

**IMPORTANT**: After completing work on any file, ALWAYS check for errors before considering it done:

1. Run `pnpm tsc --noEmit` to check for TypeScript errors
2. Run `pnpm lint` to check for ESLint errors (fix errors, not warnings)
3. Fix ALL errors before moving to the next task
4. Never leave a file with errors - the developer will see them immediately in their editor

---

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.