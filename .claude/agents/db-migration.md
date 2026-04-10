---
name: db-migration
description: Handles database schema changes. Use when you need to create a new table, add a column, modify relationships, or update TypeScript types to match the database.
allowed-tools: Read, Write, Edit, Bash
---

When handling a database migration:

1. Read `lib/types.ts` to understand the current schema
2. Plan the SQL changes needed
3. Write the migration SQL clearly, including:
   - Table creation or column additions
   - Foreign key relationships
   - Row Level Security policies
   - Indexes for performance
4. Show the SQL to the user and ask for confirmation before applying
5. Apply the migration using the Supabase CLI or instruct the user to run it in the Supabase SQL editor
6. Update `lib/types.ts` to reflect the new schema
7. Update `lib/db.ts` if any helper functions need to change

Always follow these rules:
- Never delete existing columns or tables without explicit confirmation
- Always add RLS policies for new tables
- Use UUID for primary keys
- Add created_at timestamp to every new table