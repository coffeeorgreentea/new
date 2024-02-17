import {  text, timestamp, pgTable, uuid } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const postsTable = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export type PostSelect = InferSelectModel<typeof postsTable>;
export type PostInsert = InferInsertModel<typeof postsTable>;
export const insertPostSchema = createInsertSchema(postsTable);
export const selectPostSchema = createSelectSchema(postsTable);