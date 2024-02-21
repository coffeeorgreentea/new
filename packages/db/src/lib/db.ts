import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { dbString } from './config';
import { postsTable } from './schema';

const sql = postgres(dbString);
export const db = drizzle(sql, {
  schema: {
    posts: postsTable,
  },
});
