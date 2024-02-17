import type { Config } from 'drizzle-kit';

export default {
  schema: './packages/db/src/lib/schema.ts',
  out: './packages/db/src/lib/drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env['DATABASE_URL']!,
  },
} satisfies Config;
