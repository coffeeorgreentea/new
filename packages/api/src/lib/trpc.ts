import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { ZodError } from 'zod';
import { db } from 'db';
import { getAuth } from '@clerk/fastify';
import superjson from 'superjson';
import { parse } from 'cookie';

export const createTRPCContext = async (opts: CreateFastifyContextOptions) => {
  const { req } = opts;
  // // get __session cookie from headers
  // const cookies = parse(req.headers.cookie || '');
  // const session = cookies['__session'];
  // console.log('session', session);
  // // put the session in the Authorization header
  // req.headers.authorization = `Bearer ${session}`;

  const auth = getAuth(req);

  console.log('auth', auth);

  return {
    req,
    db,
    auth,
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
