import { z } from 'zod';
import { postsTable } from 'db';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { desc } from 'drizzle-orm';

export const postRouter = createTRPCRouter({
  all: publicProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
  }),
});
