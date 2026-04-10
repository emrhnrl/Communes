---
name: styling
description: Updates visual styling and design tokens for the app. Use when changing colors, spacing, typography, or any design system values across components.
allowed-tools: Read, Edit, Glob, Grep
---

When updating styles for this project:

1. Use Tailwind CSS utility classes only — no custom CSS files
2. Reference the design system below for all color decisions
3. Apply changes consistently across all affected components
4. Prefer semantic color roles over raw values (e.g. "primary button" → teal-600)

## Design System

### Primary color: Teal
| Role | Class |
|------|-------|
| Primary button / interactive | `bg-teal-600` |
| Primary hover | `bg-teal-700` |
| Light accent background | `bg-teal-50` |
| Text on light bg | `text-teal-600` |
| Text on dark bg | `text-teal-300` |
| Dark accent background | `bg-teal-950` |
| Focus ring | `focus:ring-teal-500/20` `focus:border-teal-500` |
| Border accent | `border-teal-100` |

### Neutral colors: Zinc
Use zinc for all non-primary UI: backgrounds, borders, text, muted states.

### Rules
- Never use indigo, purple, or blue for primary actions — always use teal
- Keep zinc for all neutral/secondary UI
- Destructive actions use red
