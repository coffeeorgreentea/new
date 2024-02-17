import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { ZodError } from 'zod';
import { db } from 'db';
import { getAuth } from '@clerk/fastify';
import superjson from 'superjson';

export const createTRPCContext = async (opts: CreateFastifyContextOptions) => {
  const { req } = opts;
  return {
    req,
    db,
    auth: getAuth(req),
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const enforceClerk = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(enforceClerk);
