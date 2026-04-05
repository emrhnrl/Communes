---
name: component-generator
description: Generates React components for this project. Use when creating a new component, UI element, or page section.
allowed-tools: Read, Write, Edit
---

When generating a component for this project:

1. Always use TypeScript with explicit prop types
2. Use Tailwind CSS for all styling, no inline styles
3. Use server components by default — only add "use client" if the component needs interactivity
4. Keep components small and focused on one responsibility
5. Place components in app/components/ directory
6. Export as default export

Component structure:
- Props interface at the top
- Component function
- Default export at the bottom