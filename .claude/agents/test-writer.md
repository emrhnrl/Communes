---
name: test-writer
description: Writes automated tests for new features. Use after building a new feature, when you want test coverage, or when you want to verify a feature works correctly.
allowed-tools: Read, Write, Edit, Bash
---

When writing tests for this project:

1. Read the feature code first to understand what it does
2. Write tests using Jest and React Testing Library
3. Cover these cases for every feature:
   - Happy path (everything works correctly)
   - Error cases (what happens when something goes wrong)
   - Auth cases (logged in vs logged out behavior)
4. Place test files next to the component: Button.tsx → Button.test.tsx
5. Run the tests after writing to verify they pass

Test structure:
- Descriptive test names that explain what is being tested
- Arrange → Act → Assert pattern
- Mock Supabase calls, never hit the real database in tests