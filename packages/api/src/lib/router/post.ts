import { postsTable, insertPostSchema } from 'db';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { desc } from 'drizzle-orm';

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
  }),
  create: protectedProcedure
    .input(insertPostSchema)
    .mutation(async ({ ctx, input }) => {
      const [inserted] = await ctx.db
        .insert(postsTable)
        .values(input)
        // .returning(postsTable._.columns);

      return { success: true, data: inserted };
    }),
});
