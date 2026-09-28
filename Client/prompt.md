# Master Prompt — React Todo App Design System & UI Architecture

## Project Goal

I am rebuilding the UI/styling of my existing React Todo application from the beginning.

The previous styling was generated/modified with AI, and I ended up with a UI that I could use but did not fully understand or control.

I want to rebuild the visual system myself with AI assistance, but with a clear, reusable, maintainable architecture.

The goal is not simply to make the application look good. The goal is to build a small, professional **Design System + reusable component architecture**.

## What I Want

### 1. Reusable components

Avoid repeating the same UI and CSS everywhere.

For example, I do NOT want:

```text
TodoButton
TaskButton
ProjectButton
ModalButton
CalendarButton
```

I want a generic component:

```jsx
<Button />
```

with controlled variants:

```jsx
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="ghost" />
```

The same principle applies to Buttons, Inputs, Selects, Textareas, Cards, Badges, Modals, Form fields, Navigation elements, Task cards, Todo cards, and similar UI.

### 2. Centralized design decisions

If I change the primary blue, I should change it once.

If I change card radius, I should change one design token or component rule.

Core principle:

> **Change the rule, not every instance of the rule.**

### 3. Light and dark themes

The application already has a theme system supporting:

```text
light
dark
```

and applies:

```html
<html data-theme="light">
```

or:

```html
<html data-theme="dark">
```

Do not create a second theme system.

Use semantic CSS variables so dark mode can redefine variables rather than requiring separate component CSS.

### 4. Responsive design

The application must work on:

- desktop
- laptop
- tablet
- mobile

Use Bootstrap responsive utilities/grid where appropriate. Avoid unnecessary custom media queries when Bootstrap can handle the requirement.

### 5. Flexibility

Adding a page, component, theme change, spacing change, color change, button change, or modal change should not require manually editing many unrelated files.

---

# Visual Target

The light theme should mimic the supplied screenshot:

- clean
- simple
- light
- mostly white
- subtle borders
- Bootstrap-like blue
- restrained shadows
- moderate border radius
- clear hierarchy
- minimal visual noise

Approximate palette:

```text
Background:       #ffffff
Surface:          #ffffff
Subtle surface:   #f8f9fa

Main text:        #212529
Secondary text:   #6c757d
Muted text:       #899097

Border:           #dee2e6
Subtle border:    #ededed

Primary blue:     #0d6efd
Light primary:    #cfe2ff
Primary border:   #9ec5fe

Warning:          #ffc107
Info:             #0dcaf0
```

The palette is intentionally close to Bootstrap 5.

Do not introduce random colors without a real design requirement.

---

# Technology

The project uses:

```text
React
Vite
React Router
Bootstrap 5.3.8
lucide-react
TanStack React Query
FullCalendar
```

Bootstrap is the low-level UI foundation, not the complete design system.

Architecture:

```text
Bootstrap primitives/utilities
        +
Our design tokens
        +
Our reusable components
        =
Our application UI system
```

Do not replace everything with Tailwind.

Do not introduce a large UI library or dashboard template unless there is a specific reason.

Templates may be used as visual inspiration only.

---

# Current Application Architecture

Existing pages/features:

```text
Pages/
├── Home
├── TodoList
├── PrayerTimes
├── Projects
├── MyEveryday
└── Calendar
```

Existing reusable areas/components include:

```text
Cards
├── IslamicDateCard
├── NextPrayerCard
├── PhotoCard
├── PrayerTimesCard
├── TaskStatusCard
├── TimeCard
├── TodayEventsCard
└── TodoPreviewCard

Navigation
└── Navlist

Other components
├── Arrow
├── Error
├── PhotoGallery
├── StaticTimeBars
├── TimeBar
├── TimeInputClock
└── DuelClockInput
```

There is also:

```text
hooks/
└── useModal.jsx
```

The universal modal logic is already intended to support different objects/forms such as Todo and Daily Task.

Do not throw away existing application logic. The current task is primarily UI architecture and styling while preserving behavior.

---

# Current CSS Architecture

`src/index.css` is the single global styling entry point.

Intended flow:

```text
main.jsx
    ↓
index.css
    ↓
Bootstrap
    ↓
our design tokens
    ↓
our component styles
    ↓
application pages
```

Bootstrap is imported from `index.css`:

```css
@import "bootstrap/dist/css/bootstrap.min.css";
```

The old `App.css` is no longer intended to be the main styling system and should eventually be removed once nothing depends on it.

---

# Current Design Tokens

The foundation already exists in `index.css`:

```css
:root {
    /* Colors */
    --color-bg: #ffffff;
    --color-surface: #ffffff;
    --color-surface-subtle: #f8f9fa;

    --color-text: #212529;
    --color-text-secondary: #6c757d;
    --color-text-muted: #899097;

    --color-border: #dee2e6;
    --color-border-subtle: #ededed;

    --color-primary: #0d6efd;
    --color-primary-light: #cfe2ff;
    --color-primary-border: #9ec5fe;

    --color-warning: #ffc107;
    --color-info: #0dcaf0;

    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --space-6: 2rem;
    --space-7: 3rem;

    /* Typography */
    --font-family: system-ui, -apple-system, "Segoe UI", sans-serif;

    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 2rem;

    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* Radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.12);

    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.25s ease;
}
```

Global rules:

```css
html,
body {
    margin: 0;
    padding: 0;
    font-family: var(--font-family);
    color: var(--color-text);
    background-color: var(--color-bg);
}

* {
    box-sizing: border-box;
}
```

Do not randomly expand the token system. Add a new token only when there is a real repeated design value that deserves centralization.

---

# Component Architecture

Use two conceptual levels.

## Primitive components

```text
components/
├── Button
├── IconButton
├── Input
├── Select
├── Textarea
├── Card
├── Badge
└── Modal
```

These should be generic and reusable.

Example:

```jsx
<Button variant="primary">
    Add Task
</Button>
```

rather than:

```jsx
<AddTaskButton />
```

## Composite components

```text
components/
├── PageHeader
├── FormField
├── EmptyState
├── TaskCard
└── TodoCard
```

These combine primitives into meaningful application UI.

Example:

```text
TaskCard
    ├── Badge
    ├── Button
    └── IconButton
```

---

# Important Abstraction Rule

Do not over-abstract.

Do not create components such as:

```text
BlueText
RoundedBox
SmallText
LeftContainer
TodoButton
SpecialButton
```

just because something appears twice.

Create a component when it represents a meaningful reusable UI concept or has repeated structure, behavior, styling, semantics, configuration, or enough complexity to deserve isolation.

Use Bootstrap utilities for simple layout whenever appropriate.

---

# Current Button Component

Already created:

```text
src/components/Button.jsx
```

Current API:

```jsx
<Button>
    Add Task
</Button>

<Button variant="secondary">
    Cancel
</Button>

<Button variant="ghost">
    More
</Button>
```

It supports:

```text
variant
size
type
icon
fullWidth
className
```

and forwards additional props with:

```jsx
...props
```

Variants:

```text
primary
secondary
ghost
```

Sizes:

```text
small
medium
large
```

Current architectural pattern:

```text
<Button />
      ↓
Button.jsx
      ↓
app-button CSS
      ↓
design tokens
      ↓
colors / spacing / radius / transitions
```

Current implementation:

```jsx
function Button({
    children,
    variant = "primary",
    size = "medium",
    type = "button",
    icon,
    fullWidth = false,
    className = "",
    ...props
}) {
    const classes = [
        "app-button",
        `app-button-${variant}`,
        `app-button-${size}`,
        fullWidth && "app-button-full",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classes}
            {...props}
        >
            {icon && (
                <span className="app-button-icon">
                    {icon}
                </span>
            )}

            {children}
        </button>
    );
}

export default Button;
```

Do not unnecessarily complicate the API.

---

# Overall Architecture

```text
                         DESIGN TOKENS
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
        Colors             Spacing            Typography
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                       Bootstrap foundation
                              │
                              ↓
                    PRIMITIVE COMPONENTS
                              │
          ┌────────────┬──────┼──────┬────────────┐
          │            │      │      │            │
       Button        Input   Card   Modal       Badge
          │            │      │      │            │
          └────────────┴──────┼──────┴────────────┘
                              ↓
                    COMPOSITE COMPONENTS
                              │
       ┌──────────────┬───────┼──────────┬────────────┐
       │              │       │          │            │
   PageHeader    FormField  TaskCard  TodoCard   EmptyState
       │              │       │          │            │
       └──────────────┴───────┼──────────┴────────────┘
                              ↓
                            PAGES
                              │
       ┌────────┬─────────────┼─────────────┬─────────┐
       │        │             │             │         │
     Home   TodoList       Projects     Calendar   MyEveryday
                              │
                              ↓
                         Application
```

---

# Exact Implementation Roadmap

Follow these steps in order. Do not jump ahead.

## STEP 1 — Clean the styling foundation

Already done.

Requirements:

- `index.css` is the global CSS entry point.
- Bootstrap is imported there.
- Old `App.css` should eventually be removed.
- Avoid importing Bootstrap CSS individually from `App.jsx`.
- Avoid multiple competing global CSS systems.

## STEP 2 — Design tokens

Already done.

Establish:

```text
Colors
Spacing
Typography
Border radius
Shadows
Transitions
```

Use semantic variables.

Do not repeatedly hardcode design values throughout components.

## STEP 3 — Define component architecture

Already decided.

Primitives:

```text
Button
IconButton
Input
Select
Textarea
Card
Badge
Modal
```

Composites:

```text
PageHeader
FormField
EmptyState
TaskCard
TodoCard
```

Build and test them one by one.

## STEP 4 — Button

Already created.

Verify:

```text
primary
secondary
ghost
small
medium
large
disabled
icon
fullWidth
custom class
normal button props
```

Do not over-engineer it.

## STEP 5 — Card

Create a reusable Card component.

Example:

```jsx
<Card>
    ...
</Card>
```

It should control:

- background
- border
- radius
- shadow
- padding
- theme behavior

Use design tokens.

Only add variants if the application actually needs them.

## STEP 6 — IconButton

Create:

```jsx
<IconButton>
    <Trash2 />
</IconButton>
```

Use `lucide-react`.

Support things such as:

```text
size
variant
disabled
aria-label
onClick
```

Icon-only buttons must have meaningful accessible labels.

## STEP 7 — Badge

Create a reusable Badge.

Examples:

```jsx
<Badge>
    High
</Badge>

<Badge variant="warning">
    Pending
</Badge>
```

Use it for priorities, statuses, categories, task states, and similar small labels.

Do not create a separate component for every badge type.

## STEP 8 — Form components

Create:

```text
Input
Select
Textarea
FormField
```

The goal is to remove repeated form styling from Todo, Daily Task, Project, and Modal forms.

Example:

```jsx
<FormField label="Title">
    <Input />
</FormField>
```

or another clean API such as:

```jsx
<Input
    label="Title"
    value={title}
    onChange={...}
/>
```

Choose the approach that minimizes duplication without hiding important behavior.

## STEP 9 — Modal

The existing universal `useModal` hook must be preserved.

Separate:

```text
Modal behavior/state
```

from:

```text
Modal visual presentation
```

Create:

```jsx
<Modal>
    ...
</Modal>
```

Eventually:

```text
useModal
   ↓
Modal
   ↓
Form components
   ↓
Button
```

Preserve existing Todo and Daily Task functionality.

## STEP 10 — FormField

Centralize:

```text
label
input
validation message
required indicator
help text
```

Example:

```jsx
<FormField
    label="Title"
    error={errors.title}
>
    <Input />
</FormField>
```

## STEP 11 — PageHeader

Create a reusable page header:

```jsx
<PageHeader
    title="Todo List"
    description="Manage your tasks"
>
    <Button>Add Task</Button>
</PageHeader>
```

Use across TodoList, Projects, MyEveryday, Calendar, PrayerTimes, etc.

## STEP 12 — EmptyState

Create reusable empty states such as:

```text
No tasks yet
No projects yet
No events today
```

Avoid implementing separate empty-state UI on every page.

## STEP 13 — TaskCard / TodoCard

Once primitives are stable, create meaningful application components.

Example:

```text
TodoCard
    ├── Badge
    ├── IconButton
    └── Button
```

and:

```text
TaskCard
    ├── time
    ├── title
    ├── days
    └── actions
```

These represent real application concepts, not generic containers.

## STEP 14 — Navigation

Refactor existing navigation after foundational components are stable.

It should support:

- light theme
- dark theme
- responsive behavior
- active route
- icons
- theme toggle

Avoid duplicated navigation styling.

## STEP 15 — Existing Cards

Gradually migrate:

```text
IslamicDateCard
NextPrayerCard
PhotoCard
PrayerTimesCard
TaskStatusCard
TimeCard
TodayEventsCard
TodoPreviewCard
```

Do not rewrite all at once.

Instead:

```text
existing card
     ↓
use Card
     ↓
use Badge/Button/etc.
     ↓
remove duplicated styling
```

Preserve functionality.

## STEP 16 — Remove inline styling

Search for:

```jsx
style={{ ... }}
```

Evaluate each case as:

1. Bootstrap utility
2. design token
3. component CSS
4. CSS class
5. genuinely dynamic inline style

Do not blindly eliminate every inline style. Dynamic positioning/calculations may legitimately remain inline.

## STEP 17 — Replace repeated Bootstrap combinations

Bootstrap remains useful.

Do not let every page become a huge collection of repeated utility classes.

If the same meaningful UI structure appears repeatedly, create a component.

The goal is not to remove Bootstrap. The goal is:

> **Use Bootstrap for primitives/layout and our components for application-level UI.**

## STEP 18 — Dark theme

Only after the light theme is stable.

Create:

```css
[data-theme="dark"] {
    ...
}
```

Override semantic variables instead of rewriting every component.

The same components should work in both themes.

## STEP 19 — Responsive design

After the component system exists, test:

```text
Desktop
Tablet
Mobile
```

Check:

- navigation
- page layout
- cards
- forms
- modal
- buttons
- calendar
- task schedule
- tables/lists

Use Bootstrap breakpoints where possible.

## STEP 20 — Accessibility

Review reusable components.

Ensure:

- buttons have correct types
- icon-only buttons have `aria-label`
- form fields have labels
- disabled states are meaningful
- focus states are visible
- keyboard interaction works
- modal focus behavior is reasonable
- semantic HTML is used where possible

## STEP 21 — Design-system documentation

Create:

```text
DESIGN_SYSTEM.md
```

Document:

```text
Colors
Spacing
Typography
Radius
Shadows
Buttons
Cards
Forms
Modals
Responsive rules
Dark theme
Component naming
When to create a component
When to use Bootstrap
```

This prevents future AI-generated code from inventing random styling.

## STEP 22 — AI development rules

When helping modify this project:

1. Do not invent a new architecture for every feature.
2. Reuse existing components whenever possible.
3. Use design tokens instead of arbitrary values.
4. Use Bootstrap utilities when sufficient.
5. Do not introduce another CSS framework.
6. Do not create unnecessary components.
7. Do not duplicate component styles.
8. Do not change application logic when the task is only styling.
9. Do not rewrite working components just because another implementation looks cleaner.
10. When introducing a new pattern, explain why it exists, where it belongs, how it should be reused, and why it is preferable to duplication.
11. Preserve existing behavior.
12. Prefer simple solutions that I can understand over clever abstractions.

---

# How Each Future Step Should Be Handled

I want to work **one step at a time**.

For each step:

1. Explain what we are building.
2. Explain why it belongs in the architecture.
3. Show exactly which files to create/change.
4. Give complete code when a file needs significant changes.
5. Let me implement it.
6. I will test it.
7. Only then move to the next step.

Do not dump the entire project implementation at once.

---

# Development Philosophy

The goal is NOT to create the most sophisticated design system possible.

The goal is to create the **smallest design system that gives the application consistency, reusability, maintainability, responsiveness, and theme support.**

Avoid premature abstraction.

The architecture should grow from actual repeated patterns.

General hierarchy:

```text
Design Token
     ↓
Primitive
     ↓
Composite
     ↓
Page
```

Avoid:

```text
Page
 ↓
random CSS
 ↓
another random CSS
 ↓
special component
 ↓
another special component
```

---

# Target Architecture

The project should evolve approximately toward:

```text
src/
│
├── components/
│   │
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.css
│   │
│   ├── IconButton/
│   ├── Input/
│   ├── Select/
│   ├── Textarea/
│   ├── Card/
│   ├── Badge/
│   ├── Modal/
│   │
│   ├── PageHeader/
│   ├── FormField/
│   ├── EmptyState/
│   ├── TaskCard/
│   └── TodoCard/
│
├── Pages/
│   ├── Home/
│   ├── TodoList/
│   ├── Projects/
│   ├── MyEveryday/
│   ├── Calendar/
│   └── PrayerTimes/
│
├── hooks/
│   └── useModal.jsx
│
├── Navigation/
│   └── Navlist.jsx
│
├── Context.jsx
├── App.jsx
├── main.jsx
└── index.css
```

The exact folder structure can evolve if there is a good reason, but do not reorganize the project just for aesthetics.

---

# Current Progress

```text
✅ Step 1 — CSS foundation
✅ Step 2 — Design tokens
✅ Step 3 — Component architecture
✅ Step 4 — Button component

➡️ Next: Step 5 — Card component
```

The Button component has already been created and tested.

Continue from **Step 5** rather than starting over.

---

# Most Important Instruction

I am learning while building this application.

Do not just give me code that "works."

I want to understand **why the architecture is designed this way**.

When there are multiple reasonable approaches, explain the trade-off briefly and choose the simplest approach that fits this project.

The final result should be a UI system that I can personally understand and maintain—not an AI-generated collection of CSS that I am afraid to touch.
