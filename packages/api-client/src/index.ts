import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import { type AppRouter } from 'api';
import { auth } from '@clerk/nextjs';
import Clerk from '@clerk/clerk-js';

export async function getAuthToken() {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    const { getToken } = auth();
    return await getToken();
  }

  const clerk = new Clerk(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!);
  await clerk.load();
  return await clerk.session?.getToken();
}

export const api = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}/trpc`,
          async fetch(url, options) {
            const clerk = new Clerk(
              process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string
            );

            const token = await getAuthToken()
            return fetch(url, {
              ...options,
              credentials: 'include',
              headers: {
                ...options?.headers,
                Authorization: `Bearer ${token}`,
              },
            });
          },
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
