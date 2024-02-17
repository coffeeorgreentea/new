import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { dbString } from './config';

const sql = postgres(dbString);
export const db = drizzle(sql);
